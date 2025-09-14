"use client"

import { countGenderLogs } from "@/database/genderLog"
import { useEffect, useState } from "react"

interface Props {
    title: string
    selectedDate?: Date
}

export default function CountingCard({ title, selectedDate }: Props) {
    const [count, setCount] = useState<number>(0)
    
    const fetchCouting = async () => {
        const countData = await countGenderLogs(selectedDate)
        setCount(countData.count)
    }

    useEffect(() => { fetchCouting() }, [selectedDate])

    return (
        <div className="card w-full h-fit shadow-sm px-3">
            <div className="card-body text-center">
                <h2 className="text-slate-600">{title}</h2>
                <span className="font-bold text-3xl">{count}</span>
            </div>
        </div>
    )
}