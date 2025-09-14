"use client"

import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import DatePicker from "@/components/DatePicker";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  return (
    <>
      <DatePicker onDateChange={setSelectedDate} />
      <Dashboard selectedDate={selectedDate} />
    </>
  );
}
