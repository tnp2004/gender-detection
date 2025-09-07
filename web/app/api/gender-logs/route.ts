import { sql, Table } from "@/database/db"
import { NextResponse } from "next/server"

const table = Table.GenderLog

export const GET = async () => {
    try {
        const result = await sql`SELECT * FROM ${sql(table)}`
        return Response.json(result)
    } catch (err) {
        console.error("[ERROR] Gender logs:", (err instanceof Error ? err.message : String(err)))
        return NextResponse.json({ message: "cannot get gender logs"})
    }
}