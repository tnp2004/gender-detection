"use client"

import { getGenderLogs, countGenderLogs } from "@/database/genderLog"
import { GenderLog } from "@/types/db"
import { useEffect, useState } from "react"

interface Props {
    selectedDate?: Date;
}

interface GenderLogWithLocation extends GenderLog {
    locationName?: string;
}

export default function GenderLogsTable({ selectedDate }: Props) {
    const [page, setPage] = useState(1)
    const [genderLogs, setGenderLogs] = useState<GenderLogWithLocation[]>([])
    const [maxPage, setMaxPage] = useState(1)

    const fetchGenderLogsByPage = async (pageNumber: number) => {
        const genderLogsData = await getGenderLogs(pageNumber, selectedDate)
        
        const logsWithLocationNames = genderLogsData.map((log: any) => ({
            logId: log.logId,
            gender: log.gender,
            locationId: log.locationId,
            detectedAt: new Date(log.detectedAt),
            locationName: log.locationName || log.locationId
        }))
        
        setGenderLogs(logsWithLocationNames)
    }

    const fetchTotalCount = async () => {
        const countData = await countGenderLogs(selectedDate)
        setMaxPage(Math.ceil(countData.count / 10))
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    useEffect(() => { 
        setPage(1)
        fetchTotalCount()
        fetchGenderLogsByPage(1) 
    }, [selectedDate])
    
    useEffect(() => { fetchGenderLogsByPage(page) }, [page])

    return (
        <div className="col-span-4">
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 w-full shadow-sm">
                <table className="table">
                    <thead>
                        <tr className="text-center">
                            <th>ไอดี</th>
                            <th>เพศ</th>
                            <th>สถานที่</th>
                            <th>วันที่ตรวจจับ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {genderLogs.length > 0 ? (
                            genderLogs.map(log => (
                                <tr className="text-center" key={log.logId}>
                                    <th>{log.logId}</th>
                                    <td>{log.gender === 'Man' ? 'ผู้ชาย' : 'ผู้หญิง'}</td>
                                    <td>{log.locationName == "Location not specified" ? "ไม่ได้ระบุชื่อสถานที่" : log.locationName}</td>
                                    <td>{formatDate(log.detectedAt)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-gray-500">
                                    ไม่มีข้อมูล
                                </td>
                            </tr>
                        )}
                        {Array.from({ length: Math.max(0, 10 - genderLogs.length) }).map((_, index) => (
                            <tr key={`empty-${index}`} className="h-12">
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={4} className="text-center py-3">
                                <div className="join">
                                    <button 
                                        className="join-item btn btn-sm" 
                                        onClick={() => { if (page > 1) setPage(page - 1) }}
                                        disabled={page <= 1}
                                    >
                                        ⇽
                                    </button>
                                    <button className="join-item btn btn-sm">
                                        Page {page} / {maxPage}
                                    </button>
                                    <button 
                                        className="join-item btn btn-sm" 
                                        onClick={() => setPage(page + 1)}
                                        disabled={page >= maxPage}
                                    >
                                        ⇾
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}