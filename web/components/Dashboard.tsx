"use client"

import { Suspense } from "react"
import CountingCard from "./CountingCard"
import GenderLogsTable from "./GenderLogsTable"
import PieChart from "./PieChart"

export default function Dashboard() {

    return (
        <div className="grid grid-cols-4 container mx-auto align-center">
            <Suspense fallback={<p>loading . . .</p>}>
                <CountingCard title="จำนวน" />
                <GenderLogsTable />
                <PieChart />
            </Suspense>
        </div>
    )
}