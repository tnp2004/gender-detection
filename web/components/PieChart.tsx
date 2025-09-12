"use client"

import { countAllGender } from "@/database/genderLog";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function PieChart() {
  const [series, setSeries] = useState([0, 0]);

  const fetchGenderCouting = async () => {
    const data = await countAllGender()
    setSeries([data.man, data.woman])
  }

  const [options] = useState<ApexOptions>({
    labels: ["Man", "Woman"],
    legend: {
      position: "right",
    },
  });

  useEffect(() => { fetchGenderCouting() }, [])

  return (
    <div className="card shadow-sm w-fit h-fit max-w-lg">
      <ApexChart
        options={options}
        series={series}
        type="pie"
        width={300}
      />
    </div>
  );
}
