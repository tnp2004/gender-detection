"use client"

import { useEffect, useState } from "react"
import { Location } from "@/types/db"

interface LocationData {
    locations: Location[]
    totalCount: number
    page: number
    totalPages: number
}

export default function LocationTable() {
    const [locationData, setLocationData] = useState<LocationData>({
        locations: [],
        totalCount: 0,
        page: 1,
        totalPages: 0
    })
    const [loading, setLoading] = useState(true)

    const fetchLocations = async (page: number = 1) => {
        try {
            setLoading(true)
            const response = await fetch(`/api/locations?page=${page}`)
            const data = await response.json()
            setLocationData(data)
        } catch (error) {
            console.error('Error fetching locations:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLocations()
    }, [])

    const handlePageChange = (newPage: number) => {
        fetchLocations(newPage)
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

    if (loading) {
        return (
            <div className="card w-full shadow-sm">
                <div className="card-body">
                    <h2 className="card-title">ตำแหน่ง</h2>
                    <div className="flex justify-center items-center h-32">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="card w-full shadow-sm">
            <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="card-title">ตำแหน่ง</h2>
                    <div className="text-sm text-gray-500">
                        ทั้งหมด {locationData.totalCount} ตำแหน่ง
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>รหัสตำแหน่ง</th>
                                <th>รหัสกล้อง</th>
                                <th>ตำแหน่ง</th>
                                <th>ละติจูด</th>
                                <th>ลองจิจูด</th>
                                <th>วันที่สร้าง</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locationData.locations.map((location) => (
                                <tr key={location.locationId}>
                                    <td className="font-mono">{location.locationId}</td>
                                    <td className="font-mono">{location.cameraId}</td>
                                    <td>{location.location == "Location not specified" ? "ไม่ได้ระบุชื่อสถานที่" : location.location}</td>
                                    <td className="font-mono">{location.lat.toFixed(6)}</td>
                                    <td className="font-mono">{location.long.toFixed(6)}</td>
                                    <td>{formatDate(location.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {locationData.totalPages > 1 && (
                    <div className="flex justify-center mt-4">
                        <div className="join">
                            <button
                                className="join-item btn btn-sm"
                                disabled={locationData.page === 1}
                                onClick={() => handlePageChange(locationData.page - 1)}
                            >
                                ⇽
                            </button>
                            <button className="join-item btn btn-sm">
                                หน้า {locationData.page} จาก {locationData.totalPages}
                            </button>
                            <button
                                className="join-item btn btn-sm"
                                disabled={locationData.page === locationData.totalPages}
                                onClick={() => handlePageChange(locationData.page + 1)}
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
