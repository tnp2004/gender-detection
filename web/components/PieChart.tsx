"use client"

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useState } from "react";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function PieChart() {
  const [options] = useState<ApexOptions>({
    chart: {
      id: "basic-pie",
    },
    labels: ["Man", "Woman"],
    legend: {
      position: "right",
    },
  });

  const [series] = useState([30, 70]);

  return (
    <div className="w-full max-w-lg mx-auto">
      <ApexChart 
      options={options} 
      series={series} 
      type="pie" 
      width={300}
      />
    </div>
  );
}
