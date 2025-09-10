"use client"

import { GenderLog } from "@/types/db"
import { Suspense, use } from "react"
import CountingCard from "./CountingCard"
import GenderLogsTable from "./GenderLogsTable"

interface Props {
    genderLogs: Promise<GenderLog[]>
}

export default function Dashboard({ genderLogs }: Props) {
    const genderLogsData = use(genderLogs)

    return (
        <>
            <Suspense fallback={<p>loading . . .</p>}>
                <CountingCard title="จำนวน" amount={genderLogsData.length} />
                <GenderLogsTable genderLogs={genderLogsData} />
            </Suspense>
        </>
    )
}