import * as z from "zod"
import { cameraSchema, countingSchema, tableSchema } from "@/schemas/db"
import { sql } from "./db"

const table = tableSchema.enum.camera
const limit = 10

export const getCameras = async (page: number) => {
    const offset = (page - 1) * limit
    const result = await sql`SELECT * FROM ${sql(table)} ORDER BY "cameraId" DESC LIMIT ${limit} OFFSET ${offset}`
    const cameras = z.array(cameraSchema)
    return cameras.parseAsync(result)
}

export const countCameras = async () => {
    let [result] = await sql`SELECT COUNT(*) FROM ${sql(table)}`
    const couting = z.promise(countingSchema)
    return couting.parseAsync(result)
}