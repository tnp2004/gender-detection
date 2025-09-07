import { sql, Table } from "@/database/db"
import { NextResponse } from "next/server"

const table = Table.Location

export const GET = async () => {
    try {
        const result = await sql`SELECT * FROM ${sql(table)}`
        return NextResponse.json(result)
    } catch (err) {
        console.error("[ERROR] Locations:", (err instanceof Error ? err.message : String(err)))
        return NextResponse.json({ message: "cannot get location"})
    }
}