"use client"

import { useEffect, useState } from "react"
import CountingCard from "./CountingCard"
import { countAllGender } from "@/database/genderLog"
import CountGenderCard from "./CountGenderCard"
import { GenderCouting } from "@/types/db"
import GenderLogsTable from "./GenderLogsTable"
import PieChart from "./PieChart"
import DailyGenderChart from "./DailyGenderChart"

interface Props {
    selectedDate?: Date;
}

export default function Dashboard({ selectedDate }: Props) {
    const [genderCounting, setGenderCounting] = useState<GenderCouting>({ man: 0, woman: 0 })
    
    const fetchCountAllGender = async () => {
        const countData = await countAllGender(selectedDate)
        setGenderCounting(countData)
    }

    useEffect(() => { fetchCountAllGender() }, [selectedDate])

    return (
        <div className="container grid grid-cols-1 gap-y-2 mx-auto px-10 py-2">
            <div className="grid grid-cols-4 gap-2">
                <CountingCard title="จำนวนทั้งหมด" selectedDate={selectedDate} />
                <CountGenderCard title="จำนวนผู้ชาย" amount={genderCounting.man} />
                <CountGenderCard title="จำนวนผู้หญิง" amount={genderCounting.woman} />
                <CountGenderCard title="จำนวนผู้หญิง" amount={genderCounting.woman} />
            </div>
            <div className="col-span-4 grid grid-cols-4 gap-2">
                <DailyGenderChart selectedDate={selectedDate} />
                <PieChart selectedDate={selectedDate} />
            </div>
            <GenderLogsTable selectedDate={selectedDate} />
        </div>
    )
}