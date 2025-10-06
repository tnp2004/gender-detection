import logging
logging.getLogger('tensorflow').setLevel(logging.ERROR)
import cv2
from ultralytics import YOLO
from enum import Enum
from insightface.app import FaceAnalysis

from db import createGenderLog, findLocationByCameraId, activeCamera, inactiveCamera
from file import getMetadata
from utils.log import printGenderLog, printQuitLog


class Gender(Enum):
    MAN = "Man"
    WOMAN = "Woman"


NAME = "Gender detector"
YOLO_MODEL = "yolo12m.pt"
MAX_WINDOW_WIDTH_SIZE = 1280
MAX_WINDOW_HEIGHT_SIZE = 720

model = YOLO(YOLO_MODEL)
classList = model.names
model.to("cuda:0")
model.fuse()
model.half()

app = FaceAnalysis(name="buffalo_l", providers=["CPUExecutionProvider"])
app.prepare(ctx_id=0, det_size=(640, 640))

metadata = getMetadata()
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    raise RuntimeError("Error: Cannot open video file.")


def get_window_size(cap):
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    return (
        min(width, MAX_WINDOW_WIDTH_SIZE),
        min(height, MAX_WINDOW_HEIGHT_SIZE)
    )


w, h = get_window_size(cap)
cv2.namedWindow(NAME, cv2.WINDOW_NORMAL)

peopleData = {}
detectMargin = w * (0.1 if w > 800 else 0)
genderLabels = [Gender.WOMAN, Gender.MAN]

cameraId = metadata["cameraId"]
locationInfo = findLocationByCameraId(cameraId)[0]
locationId = locationInfo.locationId


def addGenderLog(gender: str):
    return createGenderLog({
        "locationId": locationId,
        "gender": gender
    })


def drawTrackingBox(frame, trackId, pt1, pt2):
    cv2.rectangle(frame, pt1, pt2, (0, 255, 0), 2)
    label = peopleData.get(trackId, "analyzing")
    cv2.putText(frame, label, (pt1[0], pt1[1] - 10),
                cv2.FONT_HERSHEY_COMPLEX, 0.6, (0, 255, 0), 2)


def main():
    activeCamera(cameraId)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        results = model.track(
            frame,
            persist=True,
            classes=[0],
            device="cuda:0",
            verbose=False,
            conf=0.25
        )

        if results and results[0].boxes and results[0].boxes.is_track:
            boxesData = results[0].boxes
            boxes = boxesData.xyxy.cpu()
            trackIds = boxesData.id.int().cpu().tolist()
            fw = frame.shape[1]

            for box, trackId in zip(boxes, trackIds):
                x1, y1, x2, y2 = map(int, box)

                if trackId not in peopleData and (x1 > detectMargin and x2 < (fw - detectMargin)):
                    cropMargin = 10
                    x1m, y1m = max(0, x1 - cropMargin), max(0, y1 - cropMargin)
                    x2m, y2m = min(fw, x2 + cropMargin), min(frame.shape[0], y2 + cropMargin)
                    cropped = frame[y1m:y2m, x1m:x2m]

                    faces = app.get(cropped)
                    if faces:
                        face = faces[0]
                        gender = genderLabels[face.gender].value
                        peopleData[trackId] = gender

                        genderLog = addGenderLog(gender)
                        printGenderLog(gender, genderLog.detectedAt)

                drawTrackingBox(frame, trackId, (x1, y1), (x2, y2))

        scaled = cv2.resize(frame, (w, h))
        cv2.imshow(NAME, scaled)

        key = cv2.waitKey(1)
        if key == ord("q") or cv2.getWindowProperty(NAME, cv2.WND_PROP_VISIBLE) < 1:
            printQuitLog()
            break

    inactiveCamera(cameraId)
    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
