import { NextRequest, NextResponse } from "next/server"
import { getLocations, countLocations } from "@/database/location"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        
        const [locations, count] = await Promise.all([
            getLocations(page),
            countLocations()
        ])
        
        return NextResponse.json({
            locations,
            totalCount: count.count,
            page,
            totalPages: Math.ceil(count.count / 10)
        })
    } catch (error) {
        console.error('Error fetching locations:', error)
        return NextResponse.json(
            { error: 'Failed to fetch locations' },
            { status: 500 }
        )
    }
}
