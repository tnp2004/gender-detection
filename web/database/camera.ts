import { Counting, Table } from "@/types/db"
import { sql } from "./db"

const table = Table.Camera

export const getCameras = async () => {
    const result = await sql`SELECT * FROM ${sql(table)}`
    return result ?? []
}

export const countCameras = async () => {
    let [result] = await sql`SELECT COUNT(*) FROM ${sql(table)}`
    result.count = Number(result.count)
    return result as Promise<Counting>
}