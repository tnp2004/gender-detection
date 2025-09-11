import * as z from "zod"
import { cameraSchema, countingSchema, tableSchema } from "@/schemas/db"
import { sql } from "./db"

const table = tableSchema.enum.camera

export const getCameras = async () => {
    const result = await sql`SELECT * FROM ${sql(table)}`
    const cameras = z.array(cameraSchema)
    return cameras.parseAsync(result)
}

export const countCameras = async () => {
    let [result] = await sql`SELECT COUNT(*) FROM ${sql(table)}`
    const couting = z.promise(countingSchema)
    return couting.parseAsync(result)
}