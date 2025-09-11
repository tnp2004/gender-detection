"use client"

import { GenderLog } from "@/types/db"
import { Suspense, useEffect, useState } from "react"
import CountingCard from "./CountingCard"
import GenderLogsTable from "./GenderLogsTable"
import { countGenderLogs, getGenderLogs } from "@/database/genderLog"

export default function Dashboard() {
    const [page, setPage] = useState(1)
    const [genderLogs, setGenderLogs] = useState<GenderLog[]>([])
    const [count, setCount] = useState<number>(0)

    const fetchGenderLogsByPage = async (pageNumber: number) => {
        const genderLogsData = await getGenderLogs(pageNumber)
        const countData = await countGenderLogs()
        setGenderLogs(genderLogsData)
        setCount(countData.count)
    }

    useEffect(() => { fetchGenderLogsByPage(page) }, [page])

    return (
        <>
            <Suspense fallback={<p>loading . . .</p>}>
                <CountingCard title="จำนวน" amount={count} />
                <GenderLogsTable genderLogs={genderLogs} />
                <button onClick={() => setPage(page + 1)}>next page</button>
            </Suspense>
        </>
    )
}