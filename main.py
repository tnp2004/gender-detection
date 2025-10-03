import logging
logging.getLogger('tensorflow').setLevel(logging.ERROR)
from ultralytics import YOLO
from db import createGenderLog, findLocationByCameraId, activeCamera, inactiveCamera
from file import getMetadata
from utils.log import printGenderLog, printQuitLog
from enum import Enum
from insightface.app import FaceAnalysis
import cv2

class Gender(Enum):
    MAN = "Man"
    WOMAN = "Woman"

NAME = "Gender detector"

MAX_WINDOW_WIDTH_SIZE = 1280
MAX_WINDOW_HEIGHT_SIZE = 720

YOLO_MODEL = "yolov8n-person.pt"

model = YOLO(YOLO_MODEL)
classList = model.names

metadata = getMetadata()

def getWindowSize():
    capWidth = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    capHeight = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    w = capWidth if capWidth <= MAX_WINDOW_WIDTH_SIZE else MAX_WINDOW_WIDTH_SIZE
    h = capHeight if capHeight <= MAX_WINDOW_HEIGHT_SIZE else MAX_WINDOW_HEIGHT_SIZE
    return w, h

cap = cv2.VideoCapture(0)
cv2.namedWindow(NAME, cv2.WINDOW_NORMAL)
w, h = getWindowSize()

app = FaceAnalysis(name="buffalo_l", providers=["CUDAExecutionProvider"])
app.prepare(ctx_id=0, det_size = (640, 640))

prevFrameTime = 0
newFrameTime = 0

peopleData = {}

detectMarginRatio = 0.1 if w > 800 else 0
detectMargin = w * detectMarginRatio

genderClassification = [Gender.WOMAN, Gender.MAN]

def addGenderLog(gender: str):
    latestCameraLocation = findLocationByCameraId(metadata["cameraId"])[0]
    return createGenderLog({"locationId": latestCameraLocation.locationId, "gender": gender})

while cap.isOpened():
    ret, frame = cap.read()
    activeCamera(metadata["cameraId"])
    if not ret: break

    _, fw, _ = frame.shape

    try:
        results = model.track(frame, persist=True, classes=[0], device=0, verbose=False, conf=0.7)
        data = results[0].boxes
        if data is not None and data.is_track:
            boxes = data.xyxy.cpu()
            trackIds = data.id.int().cpu().tolist()
            classIndices = data.cls.int().cpu().tolist()

            for box, trackId, classIdx in zip(boxes, trackIds, classIndices):
                x1, y1, x2, y2 = map(int, box)
                if x1 > detectMargin and x2 < (fw - detectMargin):
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    genderLabel = peopleData[trackId] if trackId in peopleData else "analyzing"
                    label = f"{genderLabel}"
                    cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_COMPLEX, 0.6, (0, 255, 0), 2)

                    if trackId not in peopleData:
                        boxMargin = 10
                        x1m = max(0, x1 - boxMargin)
                        y1m = max(0, y1 - boxMargin)
                        x2m = min(frame.shape[1], x2 + boxMargin)
                        y2m = min(frame.shape[0], y2 + boxMargin)

                        croppedFrame = frame[y1m:y2m, x1m:x2m]
                        cv2.imshow("Cropped frame", croppedFrame)
                        faces = app.get(croppedFrame)
                        if not faces: 
                            continue

                        face = faces[0]
                        gender = genderClassification[face.gender].value

                        peopleData[trackId] = gender
                        genderLog = addGenderLog(gender)
                        printGenderLog(gender, genderLog.detectedAt)

    except Exception as e:
        match str(e):
            case "'NoneType' object has no attribute 'int'": pass
            case _: print(f"Error: {e}")

    scaledFrame = cv2.resize(frame, (w, h))
    cv2.imshow(NAME, scaledFrame)

    if cv2.waitKey(1) & 0xFF == ord("q") or cv2.getWindowProperty(NAME, cv2.WND_PROP_VISIBLE) < 1:
        printQuitLog()
        break

inactiveCamera(metadata["cameraId"])
cap.release()
cv2.destroyAllWindows()