from db import createCamera, createLocation
from pos import getCurrentLatLng
import json
import os

metadataFileName = "metadata.json"

def getMetadata():
    if isMetadataExists():
        return readMetadata()
    else:
        return createMetadata()

def isMetadataExists():
    return os.path.exists(f"./{metadataFileName}")

def readMetadata():
    with open(metadataFileName, "r") as file:
        jsonData = json.load(file)
        cameraDict = {
            "cameraId": jsonData["cameraId"],
            "location": jsonData["location"],
            "lat": jsonData["lat"],
            "long": jsonData["long"]
        }
        return cameraDict

def createMetadata():
    print("Creating metadata file...")
    with open(metadataFileName, "w", encoding="utf-8") as file:
        camera = createCamera()
        lat, long = getCurrentLatLng()
        defaultLocation = "Location not specified"
        location = createLocation({
            "cameraId": camera.cameraId,
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