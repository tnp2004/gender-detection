from rich.console import Console 
from datetime import datetime

fontColor = "grey19"
womanTextColor = "hot_pink3"
manTextColor = "steel_blue1"

console = Console()

def getCurrentTime():
    now = datetime.now()
    year = now.year + 543
    return now.strftime(f"%H.%M %d/%m/{year}")

def printGenderLog(gender: str):
    genderStyle = ""
    match gender:
        case "Man": genderStyle = manLogStyle()
        case "Woman": genderStyle = womanLogStyle()
    
    timeStyle = timeLogStyle(getCurrentTime())
    console.print(f"[{timeStyle}] found {genderStyle}")

def manLogStyle():
    return f"[bold {fontColor} on {manTextColor}] Man [/]"

def womanLogStyle():
    return f"[bold {fontColor} on {womanTextColor}] Woman [/]"

def timeLogStyle(time: str):
    return f"[white]{time}[/]"