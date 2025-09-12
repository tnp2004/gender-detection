"use client"

import { countGenderLogs } from "@/database/genderLog"
import { useEffect, useState } from "react"

interface Props {
    title: string
}

export default function CountingCard({ title }: Props) {
    const [count, setCount] = useState<number>(0)
    
    const fetchCouting = async () => {
        const countData = await countGenderLogs()
        setCount(countData.count)
    }

    useEffect(() => { fetchCouting() }, [])

    return (
        <div className="card w-fit h-fit shadow-sm px-3">
            <div className="card-body text-center">
                <h2 className="text-slate-600">{title}</h2>
                <span className="font-bold text-3xl">{count}</span>
            </div>
        </div>
    )
}