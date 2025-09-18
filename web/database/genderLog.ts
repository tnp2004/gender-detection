"use server"

import * as z from "zod"
import { tableSchema, countingSchema, genderCountingSchema } from "@/schemas/db"
import { sql } from "./db"
import { GenderCouting } from "@/types/db"

const table = tableSchema.enum.genderLog
const limit = 10

export const getGenderLogs = async (page: number, selectedDate?: Date) => {
    const offset = (page - 1) * limit
    let query = sql`
        SELECT 
            gl."logId",
            gl."gender",
            gl."locationId",
            gl."detectedAt",
            l."location" as "locationName"
        FROM ${sql(table)} gl
        LEFT JOIN location l ON gl."locationId" = l."locationId"
    `
    
    if (selectedDate) {
        const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
        const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1)
        query = sql`
            SELECT 
                gl."logId",
                gl."gender",
                gl."locationId",
                gl."detectedAt",
                l."location" as "locationName"
            FROM ${sql(table)} gl
            LEFT JOIN location l ON gl."locationId" = l."locationId"
            WHERE gl."detectedAt" >= ${startOfDay.toISOString()} 
            AND gl."detectedAt" < ${endOfDay.toISOString()}
        `
    }
    
    query = sql`${query} ORDER BY gl."detectedAt" DESC LIMIT ${limit} OFFSET ${offset}`
    const result = await query
    return result
}

export const countGenderLogs = async (selectedDate?: Date) => {
    let query = sql`SELECT COUNT(*) FROM ${sql(table)}`
    
    if (selectedDate) {
        const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
        const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1)
        query = sql`SELECT COUNT(*) FROM ${sql(table)} WHERE "detectedAt" >= ${startOfDay.toISOString()} AND "detectedAt" < ${endOfDay.toISOString()}`
    }
    
    let [result] = await query
    result.count = Number(result.count)
    const counting = z.promise(countingSchema)
    return counting.parseAsync(result)
}

export const countAllGender = async (selectedDate?: Date) => {
    let query = sql`SELECT gender, COUNT(*) as count FROM ${sql(table)}`
    
    if (selectedDate) {
        const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
        const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1)
        query = sql`SELECT gender, COUNT(*) as count FROM ${sql(table)} WHERE "detectedAt" >= ${startOfDay.toISOString()} AND "detectedAt" < ${endOfDay.toISOString()}`
    }
    
    query = sql`${query} GROUP BY gender`
    const result = await query
    
    const resultFormatted = { man: 0, woman: 0 } as GenderCouting
    result.map((v) => {
        if (v.gender == "Man") resultFormatted.man = Number(v.count)
        if (v.gender == "Woman") resultFormatted.woman = Number(v.count)
    })
    const couting = genderCountingSchema
    return couting.parseAsync(resultFormatted)
}

export const getHourlyGenderStats = async (selectedDate?: Date) => {
    const targetDate = selectedDate || new Date()
    const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate())
    const endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1)
    
    const result = await sql`
        SELECT 
            EXTRACT(hour FROM "detectedAt" + INTERVAL '7 hours') as hour,
            gender,
            COUNT(*) as count
        FROM ${sql(table)}
        WHERE "detectedAt" >= ${startOfDay.toISOString()} 
        AND "detectedAt" < ${endOfDay.toISOString()}
        GROUP BY EXTRACT(hour FROM "detectedAt" + INTERVAL '7 hours'), gender
        ORDER BY hour, gender
    `
    return result
}

export const getDailyGenderStats = async () => {
    const result = await sql`
        SELECT 
            DATE("detectedAt" + INTERVAL '7 hours') as date,
            COUNT(*) as count
        FROM ${sql(table)}
        GROUP BY DATE("detectedAt" + INTERVAL '7 hours')
        ORDER BY date DESC
        LIMIT 30
    `
    return result
}