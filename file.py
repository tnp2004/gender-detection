from db import createCamera, createLocation, findLocationByCameraId, updateLocation
from utils.pos import getCurrentLatLng
import json
import os

metadataFileName = "metadata.json"
defaultLocation = "Location not specified"

def getMetadata():
    if isMetadataExists():
        return readMetadata()
    else:
        print("Creating metadata file...")
        camera = createCamera()
        return createMetadata(cameraId=camera.cameraId)

def isMetadataExists():
    return os.path.exists(f"./{metadataFileName}")

def createMetadata(cameraId: str):
    with open(metadataFileName, "w", encoding="utf-8") as file:
        lat, long = getCurrentLatLng()
        location = createLocation({
            "cameraId": cameraId,
            "location": defaultLocation, 
            "lat": lat, 
            "long": long
            }
        )
        cameraDict = {
            "cameraId": location.cameraId,
            "location": location.location,
            "lat": location.lat,
            "long": location.long
        }
        json.dump(cameraDict, file, indent=4, ensure_ascii=False)
        return cameraDict

def readMetadata():
    with open(metadataFileName, "r") as file:
        jsonData = json.load(file)
        lat, long = getCurrentLatLng()
        if not lat == jsonData["lat"] or not long == jsonData["long"]:
            print("The camera was moved, creating new metadata file...")
            return createMetadata(jsonData["cameraId"])
        latestCameraLocation = findLocationByCameraId(jsonData["cameraId"])[0]
        if not latestCameraLocation.location == jsonData["location"]:
            print("Updating location...")
            updateLocation(latestCameraLocation.locationId, newLocation=jsonData["location"])
        cameraDict = {
            "cameraId": jsonData["cameraId"],
            "location": jsonData["location"],
            "lat": jsonData["lat"],
            "long": jsonData["long"]
        }
        return cameraDict