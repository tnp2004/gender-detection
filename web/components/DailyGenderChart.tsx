"use client"

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getHourlyGenderStats } from "@/database/genderLog";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
const REFRESH_INTERVAL = 60 * 2 * 1000;

interface Props {
    selectedDate?: Date;
}

export default function DailyGenderChart({ selectedDate }: Props) {
  const [series, setSeries] = useState([
    {
      name: "ผู้ชาย",
      data: Array(24).fill(0)
    },
    {
      name: "ผู้หญิง", 
      data: Array(24).fill(0)
    }
  ]);
  const [loading, setLoading] = useState(true);

  const fetchDailyData = async () => {
    try {
      setLoading(true);
      
      // Fetch real data from database with selected date
      const hourlyStats = await getHourlyGenderStats(selectedDate);
      
      // Initialize arrays for 24 hours
      const menData = Array(24).fill(0);
      const womenData = Array(24).fill(0);
      
      // Process the database results
      hourlyStats.forEach((stat: any) => {
        const hour = parseInt(stat.hour);
        const count = parseInt(stat.count);
        
        if (stat.gender === 'Man') {
          menData[hour] = count;
        } else if (stat.gender === 'Woman') {
          womenData[hour] = count;
        }
      });
      
      setSeries([
        {
          name: "ผู้ชาย",
          data: menData
        },
        {
          name: "ผู้หญิง",
          data: womenData
        }
      ]);
    } catch (error) {
      console.error('Error fetching daily data:', error);
    } finally {
      setLoading(false);
    }
  };

  const options: ApexOptions = {
    chart: {
      type: 'line',
      height: 300,
      toolbar: {
        show: false
      },
      background: 'transparent'
    },
    colors: ['#3B82F6', '#EC4899'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: Array.from({length: 24}, (_, i) => `${i.toString().padStart(2, '0')}:00`),
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '10px'
        },
        rotate: -45,
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6B7280'
        }
      }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 4
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: {
        colors: '#6B7280'
      }
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '12px'
      },
      y: {
        formatter: function (val: number) {
          return `${val} คน`;
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    title: {
      text: selectedDate
        ? `วันที่ ${selectedDate.toLocaleDateString('th-TH', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}`
        : 'วันนี้',
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#374151'
      }
    }
  };

  useEffect(() => { 
    fetchDailyData();
    const interval = setInterval(fetchDailyData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [selectedDate]);

  if (loading) {
    return (
      <div className="card shadow-sm w-full col-span-3">
        <div className="card-body">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded mb-4 w-1/3"></div>
            <div className="h-64 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm w-full col-span-3">
      <div className="card-body">
        <ApexChart
          options={options}
          series={series}
          type="line"
          height={300}
        />
      </div>
    </div>
  );
}
