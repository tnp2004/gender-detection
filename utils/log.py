from rich.console import Console 
from datetime import datetime

textColor = "grey19"

womanBgColor = "hot_pink3"
manBgColor = "steel_blue1"

quitBgColor = "deep_pink2"
quitTextColor = "grey100"

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

def printQuitLog():
    console.print(f"\n[bold {quitTextColor} on {quitBgColor}] Quit! [/]")

def manLogStyle():
    return f"[bold {textColor} on {manBgColor}] Man [/]"

def womanLogStyle():
    return f"[bold {textColor} on {womanBgColor}] Woman [/]"

def timeLogStyle(time: str):
    return f"[white not bold]{time}[/]"