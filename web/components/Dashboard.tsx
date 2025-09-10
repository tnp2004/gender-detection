"use client"

import { Counting } from "@/types/db"
import { Suspense, use } from "react"

interface Props {
    genderLogsPromise: Promise<Counting>
}

export default function Dashboard({ genderLogsPromise }: Props) {
    const genderLogs = use(genderLogsPromise)

    return (
        <>
            <Suspense fallback={<p>loading . . .</p>}>
                {JSON.stringify(genderLogs)}
            </Suspense>
        </>
    )
}