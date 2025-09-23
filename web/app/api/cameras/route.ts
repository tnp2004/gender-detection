import { NextRequest, NextResponse } from "next/server"
import { getCameras, countCameras } from "@/database/camera"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        
        const [cameras, count] = await Promise.all([
            getCameras(page),
            countCameras()
        ])
        
        return NextResponse.json({
            cameras,
            totalCount: count.count,
            page,
            totalPages: Math.ceil(count.count / 10)
        })
    } catch (error) {
        console.error('Error fetching cameras:', error)
        return NextResponse.json(
            { error: 'Failed to fetch cameras' },
            { status: 500 }
        )
    }
}
