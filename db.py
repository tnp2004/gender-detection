from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv
from models import Base, Camera, Location, GenderLog
import uuid
import os

load_dotenv()

databaseURL = os.getenv("DATABASE_URL")
engine = create_engine(databaseURL)
sessionLocal = sessionmaker(bind=engine)
Base.metadata.create_all(bind=engine)

def genId(): 
    return str(uuid.uuid4())

def getDatabase():
    db = sessionLocal()
    try: yield db
    finally: db.close()

# Camera
def createCamera(db: Session = next(getDatabase())):
    id = genId()
    defaultStatus = "inactive"
    camera = Camera(cameraId=id, status=defaultStatus)
    db.add(camera)
    db.commit()
    db.refresh(camera)
    return camera

def findCamera(id: int, db: Session = next(getDatabase())):
    camera = db.query(Camera).filter(Camera.cameraId == id).first()
    if not camera:
        print(f"Camera id: {id} not found")
        return
    return camera

def activeCamera(id: int, db: Session = next(getDatabase())):
    camera = db.query(Camera).filter(Camera.cameraId == id).first()
    if not camera:
        print(f"Camera id: {id} not found")
        return
    camera.status = "active"
    db.commit()
    db.refresh(camera)
    return camera

def inactiveCamera(id: int, db: Session = next(getDatabase())):
    camera = db.query(Camera).filter(Camera.cameraId == id).first()
    if not camera:
        print(f"Camera id: {id} not found")
        return
    camera.status = "inactive"
    db.commit()
    db.refresh(camera)
    return camera

# Location
def createLocation(location: dict, db: Session = next(getDatabase())):
    if not findCamera(location["cameraId"]): return
    id = genId()
    location = Location(
        locationId=id,
        cameraId=location["cameraId"],
        location=location["location"],
        lat=location["lat"],
        long=location["long"],
    )
    db.add(location)
    db.commit()
    db.refresh(location)
    return location

def findLocation(id: int, db: Session = next(getDatabase())):
    location = db.query(Location).filter(Location.locationId == id).first()
    if not location:
        print(f"Location id: {id} not found")
        return
    return location

# Gender log
def createGenderLog(log: dict, db: Session = next(getDatabase())):
    if not findLocation(log["locationId"]): return
    id = genId()
    genderLog = GenderLog(
        logId=id,
        locationId=log["locationId"],
        gender=log["gender"],
    )
    db.add(genderLog)
    db.commit()
    db.refresh(genderLog)
    return genderLog

def findGenderLog(id: int, db: Session = next(getDatabase())):
    log = db.query(GenderLog).filter(GenderLog.logId == id).first()
    if not log:
        print(f"Gender log id: {id} not found")
        return
    return log