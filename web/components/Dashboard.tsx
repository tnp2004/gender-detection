"use client"

import { useEffect, useState } from "react"
import CountingCard from "./CountingCard"
import { countAllGender } from "@/database/genderLog"
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
    const [activeTab, setActiveTab] = useState<TabType>("dashboard")

    const fetchCountAllGender = async () => {
        const countData = await countAllGender(selectedDate)
        setGenderCounting(countData)
    }

    useEffect(() => { fetchCountAllGender() }, [selectedDate])

    const renderTabContent = () => {
        switch (activeTab) {
            case "dashboard":
                return (
                    <>
                        <div className="col-span-4 grid grid-cols-4 gap-2">
                            <CountingCard title="จำนวนทั้งหมด" selectedDate={selectedDate} />
                            <CountGenderCard title="จำนวนผู้ชาย" amount={genderCounting.man} />
                            <CountGenderCard title="จำนวนผู้หญิง" amount={genderCounting.woman} />
                            <GenderRatioCard title="สัดส่วน" genderCounting={genderCounting} />
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
                <h1 className="text-5xl font-bold">Gender Dashboard</h1>
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