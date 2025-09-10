"use client"

import DatePicker from "@/components/DatePicker";
import GenderPicker from "@/components/GenderPicker";
import { useState } from "react";

export default function Home() {
  const [date, setDate] = useState<Date | undefined>();
  const [gender, setGender] = useState<string | undefined>();

  return (
    <>
      <div className="flex gap-x-1 m-1">
        <DatePicker date={date} setDate={setDate} />
        <GenderPicker gender={gender} setGender={setGender} />
      </div>
    </>
  );
}
