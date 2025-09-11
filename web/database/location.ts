import * as z from "zod"
import { tableSchema, locationSchema, countingSchema } from "@/schemas/db"
import { sql } from "./db"

const table = tableSchema.enum.location

export const getLocations = async () => {
    const result = await sql`SELECT * FROM ${sql(table)}`
    const location = z.array(locationSchema)
    return location.parseAsync(result)
}

export const countLocations = async () => {
    let [result] = await sql`SELECT COUNT(*) FROM ${sql(table)}`
    const couting = z.promise(countingSchema)
    return couting.parseAsync(result)
}