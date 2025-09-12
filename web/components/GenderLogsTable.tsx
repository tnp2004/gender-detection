"use client"

import { getGenderLogs } from "@/database/genderLog"
import { GenderLog } from "@/types/db"
import { useEffect, useState } from "react"

export default function GenderLogsTable() {
    const [page, setPage] = useState(1)
    const [genderLogs, setGenderLogs] = useState<GenderLog[]>([])

    const fetchGenderLogsByPage = async (pageNumber: number) => {
        const genderLogsData = await getGenderLogs(pageNumber)
        setGenderLogs(genderLogsData)
    }

    useEffect(() => { fetchGenderLogsByPage(page) }, [page])

    return (
        <div className="col-span-2">
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 w-fit px-5 shadow-sm">
                <table className="table">
                    <thead>
                        <tr className="text-center">
                            <th>ID</th>
                            <th>Gender</th>
                            <th>Detected At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {genderLogs.map(log => (
                            <tr className="text-center" key={log.logId}>
                                <th>{log.logId}</th>
                                <td>{log.gender}</td>
                                <td>{log.detectedAt.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="join mt-1">
                <button className="join-item btn" onClick={() => { if (page > 1) setPage(page - 1) }}>⇽</button>
                <button className="join-item btn">Page {page}</button>
                <button className="join-item btn" onClick={() => setPage(page + 1)}>⇾</button>
            </div>
        </div>
    )
}