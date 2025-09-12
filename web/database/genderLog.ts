"use server"

import * as z from "zod"
import { genderLogSchema, tableSchema, countingSchema, genderCountingSchema } from "@/schemas/db"
import { sql } from "./db"
import { GenderCouting } from "@/types/db"

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

export const countAllGender = async () => {
    const result = await sql`SELECT gender, COUNT(*) as count FROM ${sql(table)} GROUP BY gender`
    const resultFormatted = {} as GenderCouting
    result.map((v) => {
        if (v.gender == "Man") resultFormatted.man = Number(v.count)
        if (v.gender == "Woman") resultFormatted.woman = Number(v.count)
    })
    const couting = genderCountingSchema
    return couting.parseAsync(resultFormatted)
}