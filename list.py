from rich.console import Console
from rich.table import Table
from utils.time import utcToThai
from utils.log import manBgColor, womanBgColor
from db import listGenderLog
import sys

DEFAULT_LOG_VOLUME = 10
LIMIT_LOG_VOLUME = 30

idTextColor = "light_green"
dateTextColor = "yellow"

console = Console()
n = len(sys.argv)
args = sys.argv

if n < 2:
    print("Require list table (gender)")
    sys.exit(0)

if n > 3:
    print("Require only 2 argument")
    sys.exit(0)

def printList():
    listTable = args[1]
    match listTable.lower():
        case "gender":
            printGenderList()

def getListVolume():
    listVolume = DEFAULT_LOG_VOLUME
    if n >= 3:
        listVolume = int(args[2])
        if listVolume > LIMIT_LOG_VOLUME:
            print("Maximum log volume is 30")
            sys.exit(0)
    return listVolume

def printGenderList():
    listVolume = getListVolume()
    
    table = Table(title="Gender log list")
    genderLog = listGenderLog(listVolume)

    table.add_column("Log id", justify="center", style=idTextColor, no_wrap=True)
    table.add_column("Gender", justify="center")
    table.add_column("Detected at", justify="center", style=dateTextColor)

    for entry in genderLog:
        genderLogStyle = f"[bold {manBgColor}]Man[/]" if entry.gender == "Man" else f"[bold {womanBgColor}]Woman[/]"
        time = utcToThai(str(entry.detectedAt))
        table.add_row(entry.logId, genderLogStyle, time)

    console.print(table)

printList()