import { Counting, Table } from "@/types/db"
import { sql } from "./db"

const table = Table.GenderLog

export const getGenderLogs = async () => {
    const result = await sql`SELECT * FROM ${sql(table)}`
    return result ?? []
}

export const countGenderLogs = async () => {
    let [result] = await sql`SELECT COUNT(*) FROM ${sql(table)}`
    result.count = Number(result.count)
    return result as Promise<Counting>
}