from rich.console import Console 
from utils.time import utcToThai
from sqlalchemy import Column
from datetime import datetime

textColor = "grey19"

womanBgColor = "hot_pink3"
manBgColor = "steel_blue1"

quitBgColor = "deep_pink2"
quitTextColor = "grey100"

console = Console()

def printGenderLog(gender: str, utcTimestamp: Column[datetime]):
    genderStyle = ""
    match gender:
        case "Man": genderStyle = manLogStyle()
        case "Woman": genderStyle = womanLogStyle()
    
    timeStyle = timeLogStyle(str(utcTimestamp))
    console.print(f"[{timeStyle}] found {genderStyle}")

def printQuitLog():
    console.print(f"\n[bold {quitTextColor} on {quitBgColor}] Quit! [/]")

def manLogStyle():
    return f"[bold {textColor} on {manBgColor}] Man [/]"

def womanLogStyle():
    return f"[bold {textColor} on {womanBgColor}] Woman [/]"

def timeLogStyle(time: str):
    thaiTimeFormatted = utcToThai(time)
    return f"[white not bold]{thaiTimeFormatted}[/]"