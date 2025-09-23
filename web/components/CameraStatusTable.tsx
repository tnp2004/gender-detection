"use client"

import { useEffect, useState } from "react"
import { Camera } from "@/types/db"

interface CameraData {
    cameras: Camera[]
    totalCount: number
    page: number
    totalPages: number
}

export default function CameraStatusTable() {
    const [cameraData, setCameraData] = useState<CameraData>({
        cameras: [],
        totalCount: 0,
        page: 1,
        totalPages: 0
    })
    const [loading, setLoading] = useState(true)

    const fetchCameras = async (page: number = 1) => {
        try {
            setLoading(true)
            const response = await fetch(`/api/cameras?page=${page}`)
            const data = await response.json()
            setCameraData(data)
        } catch (error) {
            console.error('Error fetching cameras:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCameras()
    }, [])

    const handlePageChange = (newPage: number) => {
        fetchCameras(newPage)
    }

    const getStatusBadge = (status: string) => {
        const baseClasses = "badge"
        if (status === "active") {
            return `${baseClasses} badge-success`
        }
        return `${baseClasses} badge-error`
    }

    const getStatusText = (status: string) => {
        return status === "active" ? "ใช้งาน" : "ไม่ใช้งาน"
    }

    if (loading) {
        return (
            <div className="card w-full shadow-sm">
                <div className="card-body">
                    <h2 className="card-title">สถานะกล้อง</h2>
                    <div className="flex justify-center items-center h-32">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="card-title">สถานะกล้อง</h2>
                    <div className="text-sm text-gray-500">
                        จำนวน {cameraData.totalCount} กล้อง
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>รหัสกล้อง</th>
                                <th>สถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cameraData.cameras.map((camera) => (
                                <tr key={camera.cameraId}>
                                    <td className="font-mono">{camera.cameraId}</td>
                                    <td>
                                        <span className={getStatusBadge(camera.status)}>
                                            {getStatusText(camera.status)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {cameraData.totalPages > 1 && (
                    <div className="flex justify-center mt-4">
                        <div className="join">
                            <button
                                className="join-item btn btn-sm"
                                disabled={cameraData.page === 1}
                                onClick={() => handlePageChange(cameraData.page - 1)}
                            >
                                ⇽
                            </button>
                            <button className="join-item btn btn-sm">
                                หน้า {cameraData.page} จาก {cameraData.totalPages}
                            </button>
                            <button
                                className="join-item btn btn-sm"
                                disabled={cameraData.page === cameraData.totalPages}
                                onClick={() => handlePageChange(cameraData.page + 1)}
                            >
                                ⇾
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
