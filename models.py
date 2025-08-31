from sqlalchemy import Column, String, TIMESTAMP, Float, ForeignKey, func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
metadata = Base.metadata

class Camera(Base):
    __tablename__ = "camera"

    cameraId = Column(String(36), primary_key=True)
    status = Column(String(10), nullable=False)

    def __repr__(self):
        return f"id: {self.cameraId}, status: {self.status}"
    
class Location(Base):
    __tablename__ = "location"

    locationId = Column(String(36), primary_key=True)
    cameraId = Column(ForeignKey("camera.cameraId"), nullable=False)
    location = Column(String(50), nullable=False)
    lat = Column(Float(), nullable=False)
    long = Column(Float(), nullable=False)
    createdAt = Column(TIMESTAMP, default=func.now())

    def __repr__(self):
        return f"id: {self.locationId}, cameraId: {self.cameraId}, location: {self.location}, lat: {self.lat}, long: {self.long}, createdAt: {self.createdAt}"
    
class GenderLog(Base):
    __tablename__ = "genderLog"

    logId = Column(String(36), primary_key=True)
    locationId = Column(ForeignKey("location.locationId"), nullable=False)
    gender = Column(String(10), nullable=False)
    detectedAt = Column(TIMESTAMP, default=func.now())

    def __repr__(self):
        return f"id: {self.logId}, locationId: {self.locationId}, gender: {self.gender}, detectedAt: {self.detectedAt}"