"use client"

import { countAllGender } from "@/database/genderLog";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Props {
  selectedDate?: Date;
}

export default function PieChart({ selectedDate }: Props) {
  const [series, setSeries] = useState([0, 0]);

  const fetchGenderCouting = async () => {
    const data = await countAllGender(selectedDate)
    setSeries([data.man, data.woman])
  }

  const options: ApexOptions = {
    labels: ["ผู้ชาย", "ผู้หญิง"],
    legend: {
      position: "bottom",
    },
    colors: ["#3B82F6", "#EC4899"],
  };

  useEffect(() => { fetchGenderCouting() }, [selectedDate])

  return (
    <div className="card shadow-sm w-full h-full max-w-lg col-span-1">
      <ApexChart
      className="my-auto"
        options={options}
        series={series}
        type="pie"
      />
    </div>
  );
}
