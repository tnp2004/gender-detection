import cv2
from ultralytics import YOLO

NAME = "Gender detector"

model = YOLO("yolo12n.pt")
classList = model.names

cap = cv2.VideoCapture(0)
cv2.namedWindow(NAME)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret: break

    try:
        results = model.track(frame, persist=True, classes=[0], device=0, verbose=False)
        data = results[0].boxes
        if data is not None:
            boxes = data.xyxy.cpu()
            trackIds = data.id.int().cpu().tolist()
            classIndices = data.cls.int().cpu().tolist()

        for box, trackId, classIdx in zip(boxes, trackIds, classIndices):
            x1, y1, x2, y2 = map(int, box)
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            label = f"ID: {trackId} {classList[classIdx]}"
            cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_COMPLEX, 0.6, (0, 255, 0), 2)
    except Exception as e:
        pass

    cv2.imshow(NAME, frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        print("\nQuit!")
        break

cap.release()
cv2.destroyAllWindows()