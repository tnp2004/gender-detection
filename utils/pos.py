import geocoder

def getCurrentLatLng():
    g = geocoder.ip("")
    if g.latlng: 
        return g.latlng