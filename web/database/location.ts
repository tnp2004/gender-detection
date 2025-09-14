import * as z from "zod"
import { tableSchema, locationSchema, countingSchema } from "@/schemas/db"
import { sql } from "./db"

const table = tableSchema.enum.location
const limit = 10

export const getLocations = async (page: number) => {
    const offset = (page - 1) * limit
    const result = await sql`SELECT * FROM ${sql(table)} ORDER BY "createdAt" DESC LIMIT ${limit} OFFSET ${offset}`
    const location = z.array(locationSchema)
    return location.parseAsync(result)
}

export const countLocations = async () => {
    let [result] = await sql`SELECT COUNT(*) FROM ${sql(table)}`
    result.count = Number(result.count)
    const couting = z.promise(countingSchema)
    return couting.parseAsync(result)
}

export const getLocationById = async (locationId: string) => {
    const result = await sql`SELECT * FROM ${sql(table)} WHERE "locationId" = ${locationId}`
    if (result.length > 0) {
        return locationSchema.parseAsync(result[0])
    }
    return null
}