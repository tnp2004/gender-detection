from datetime import datetime
import pytz

timezone = "Asia/Bangkok"

def utcToThai(utc_timestamp_str: str) -> str:
    utc_dt = datetime.fromisoformat(utc_timestamp_str)

    bangkokTz = pytz.timezone(timezone)
    bangkokDt = utc_dt.astimezone(bangkokTz)
    buddhistYear = bangkokDt.year + 543
    formattedString = bangkokDt.strftime(f"%H.%M %d/%m/") + str(buddhistYear)
    
    return formattedString