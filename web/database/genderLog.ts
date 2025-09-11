"use server"

import * as z from "zod"
import { genderLogSchema, tableSchema, countingSchema } from "@/schemas/db"
import { sql } from "./db"

const table = tableSchema.enum.genderLog
const limit = 10

export const getGenderLogs = async (page: number) => {
    const offset = (page - 1) * limit
    const result = await sql`SELECT * FROM ${sql(table)} ORDER BY "detectedAt" DESC LIMIT ${limit} OFFSET ${offset}`
    const genderLogs = z.array(genderLogSchema)
    return genderLogs.parseAsync(result)
}

export const countGenderLogs = async () => {
    let [result] = await sql`SELECT COUNT(*) FROM ${sql(table)}`
    result.count = Number(result.count)
    const counting = z.promise(countingSchema)
    return counting.parseAsync(result)
}