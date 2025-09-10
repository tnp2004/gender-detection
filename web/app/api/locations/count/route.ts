import { sql, Table } from "@/database/db"
import { NextResponse } from "next/server"

const table = Table.Location

export const GET = async () => {
    try {
        let [result] = await sql`SELECT COUNT(*) FROM ${sql(table)}`
        result.count = Number(result.count)
        return NextResponse.json(result)
    } catch (err) {
        console.error("[ERROR] Cameras:", (err instanceof Error ? err.message : String(err)))
        return NextResponse.json({ message: "cannot count locations"})
    }
}