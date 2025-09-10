"use client"

import { useState } from "react";
import { DayPicker } from "react-day-picker";

export default function DatePicker() {
  const [date, setDate] = useState<Date | undefined>();
  
  return (
    <>
      <button popoverTarget="rdp-popover" className="input input-border w-fit" style={{ anchorName: "--rdp" } as React.CSSProperties}>
        {date ? date.toLocaleDateString() : "เลือกวันที่"}
      </button>
      <div popover="auto" id="rdp-popover" className="dropdown" style={{ positionAnchor: "--rdp" } as React.CSSProperties}>
        <DayPicker className="react-day-picker" mode="single" selected={date} onSelect={setDate} />
      </div>
    </>
  );
}
