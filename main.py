from ultralytics import YOLO
from deepface import DeepFace
from db import createGenderLog, findLocationByCameraId, activeCamera, inactiveCamera
from file import getMetadata
from utils.log import printGenderLog, printQuitLog
import cv2
from enum import Enum

class Gender(Enum):
    MAN = "Man"
    WOMAN = "Woman"

NAME = "Gender detector"

model = YOLO("yolo12n.pt")
classList = model.names

metadata = getMetadata()

cap = cv2.VideoCapture(0)
cv2.namedWindow(NAME)

peopleData = {}

def addGenderLog(gender: str):
    latestCameraLocation = findLocationByCameraId(metadata["cameraId"])[0]
    createGenderLog({"locationId": latestCameraLocation.locationId, "gender": gender})

while cap.isOpened():
    ret, frame = cap.read()
    activeCamera(metadata["cameraId"])
    if not ret: break

    try:
        results = model.track(frame, persist=True, classes=[0], device=0, verbose=False, conf=0.8)
        data = results[0].boxes
        if data is not None and data.is_track:
            boxes = data.xyxy.cpu()
            trackIds = data.id.int().cpu().tolist()
            classIndices = data.cls.int().cpu().tolist()

            for box, trackId, classIdx in zip(boxes, trackIds, classIndices):
                x1, y1, x2, y2 = map(int, box)
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                genderLabel = peopleData[trackId] if trackId in peopleData else "analyzing"
                label = f"ID: {trackId} {genderLabel}"
                cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_COMPLEX, 0.6, (0, 255, 0), 2)

                if trackId not in peopleData:
                    croppedFrame = frame[y1:y2, x1:x2]
                    result = DeepFace.analyze(croppedFrame, actions=["gender"], enforce_detection=False)
                    gender = Gender.MAN.value if result[0]["gender"]["Man"] > result[0]["gender"]["Woman"] else Gender.WOMAN.value
                    peopleData[trackId] = gender
                    printGenderLog(gender)
                    addGenderLog(gender)
    except Exception as e:
        match str(e):
            case "'NoneType' object has no attribute 'int'": pass
            case _: print(f"Error: {e}")

    cv2.imshow(NAME, frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        printQuitLog()
        break

inactiveCamera(metadata["cameraId"])
cap.release()
cv2.destroyAllWindows()