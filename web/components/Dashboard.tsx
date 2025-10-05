"use client"

import { useEffect, useState } from "react"
import CountingCard from "./CountingCard"
import { countAllGender, countGenderLogs } from "@/database/genderLog"
import CountGenderCard from "./CountGenderCard"
import GenderRatioCard from "./GenderRatioCard"
import { GenderCouting } from "@/types/db"
import GenderLogsTable from "./GenderLogsTable"
import PieChart from "./PieChart"
import DailyGenderChart from "./DailyGenderChart"
import DatePicker from "./DatePicker"
import CameraStatusTable from "./CameraStatusTable"
import LocationTable from "./LocationTable"

type TabType = "dashboard" | "cameras" | "locations"

export default function Dashboard() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [genderCounting, setGenderCounting] = useState<GenderCouting>({ man: 0, woman: 0 })
    const [totalCount, setTotalCount] = useState<number>(0)
    const [activeTab, setActiveTab] = useState<TabType>("dashboard")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

    const fetchAllData = async () => {
        try {
            setIsLoading(true)
            const [countData, totalData] = await Promise.all([
                countAllGender(selectedDate),
                countGenderLogs(selectedDate)
            ])
            setGenderCounting(countData)
            setTotalCount(totalData.count)
            setLastUpdated(new Date())
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => { 
        fetchAllData() 
    }, [selectedDate])

    useEffect(() => {
        if (activeTab !== "dashboard") return

        const interval = setInterval(() => {
            fetchAllData()
        }, 60 * 1000)

        return () => clearInterval(interval)
    }, [selectedDate, activeTab])

    const renderTabContent = () => {
        switch (activeTab) {
            case "dashboard":
                return (
                    <>
                        <div className="col-span-4 grid grid-cols-4 gap-2">
                            <CountingCard title="จำนวนทั้งหมด" amount={totalCount} isLoading={isLoading} />
                            <CountGenderCard title="จำนวนผู้ชาย" amount={genderCounting.man} isLoading={isLoading} />
                            <CountGenderCard title="จำนวนผู้หญิง" amount={genderCounting.woman} isLoading={isLoading} />
                            <GenderRatioCard title="สัดส่วน" genderCounting={genderCounting} isLoading={isLoading} />
                        </div>
                        <div className="col-span-4 grid grid-cols-4 gap-2">
                            <DailyGenderChart selectedDate={selectedDate} />
                            <PieChart selectedDate={selectedDate} />
                        </div>
                        <GenderLogsTable selectedDate={selectedDate} />
                    </>
                )
            case "cameras":
                return <CameraStatusTable />
            case "locations":
                return <LocationTable />
            default:
                return null
        }
    }

    return (
        <div className="container mx-auto px-10 py-2">
            <div className="flex justify-between gap-2 my-10">
                <div className="flex flex-col">
                    <h1 className="text-5xl font-bold">แดชบอร์ด</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                        <span className="text-sm text-slate-600">
                            {isLoading ? 'กำลังอัพเดท...' : `อัพเดทล่าสุด: ${lastUpdated.toLocaleTimeString('th-TH')}`}
                        </span>
                    </div>
                </div>
                <DatePicker onDateChange={setSelectedDate} />
            </div>
            
            <div className="tabs tabs-boxed mb-4 gap-5">
                <button 
                    className={`tab ${activeTab === "dashboard" ? "tab-active font-bold" : ""}`}
                    onClick={() => setActiveTab("dashboard")}
                >
                    แดชบอร์ด
                </button>
                <button 
                    className={`tab ${activeTab === "cameras" ? "tab-active font-bold" : ""}`}
                    onClick={() => setActiveTab("cameras")}
                >
                    สถานะกล้อง
                </button>
                <button 
                    className={`tab ${activeTab === "locations" ? "tab-active font-bold" : ""}`}
                    onClick={() => setActiveTab("locations")}
                >
                    ตำแหน่งกล้อง
                </button>
            </div>

            <div className="grid grid-cols-1 gap-y-2">
                {renderTabContent()}
            </div>
        </div>
    )
}