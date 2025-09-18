"use client"

import { useState } from "react";
import { DayPicker } from "react-day-picker";

interface Props {
    onDateChange?: (date: Date | undefined) => void;
}

export default function DatePicker({ onDateChange }: Props) {
  const [date, setDate] = useState<Date | undefined>();
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    onDateChange?.(selectedDate);
  };
  
  return (
    <>
      <button popoverTarget="rdp-popover" className="input input-border w-fit cursor-pointer" style={{ anchorName: "--rdp" } as React.CSSProperties}>
        {date ? date.toLocaleDateString() : "เลือกวันที่"}
      </button>
      <div popover="auto" id="rdp-popover" className="dropdown" style={{ positionAnchor: "--rdp" } as React.CSSProperties}>
        <DayPicker className="react-day-picker" mode="single" selected={date} onSelect={handleDateSelect} />
      </div>
    </>
  );
}
