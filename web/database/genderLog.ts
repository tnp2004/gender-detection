import * as z from "zod"
import { genderLogSchema, tableSchema, countingSchema } from "@/schemas/db"
import { sql } from "./db"

const table = tableSchema.enum.genderLog

export const getGenderLogs = async () => {
    const result = await sql`SELECT * FROM ${sql(table)}`
    const genderLogs = z.array(genderLogSchema)
    return genderLogs.parseAsync(result)
}

export const countGenderLogs = async () => {
    let [result] = await sql`SELECT COUNT(*) FROM ${sql(table)}`
    const counting = z.promise(countingSchema)
    return counting.parseAsync(result)
}