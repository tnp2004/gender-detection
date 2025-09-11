import * as z from "zod"
import { cameraSchema, countingSchema, genderLogSchema, genderSchema, tableSchema } from "@/schemas/db"

export type Table = z.infer<typeof tableSchema>
export type Gender = z.infer<typeof genderSchema>
export type Counting = z.infer<typeof countingSchema>

// Table
export type GenderLog = z.infer<typeof genderLogSchema>
export type Camera = z.infer<typeof cameraSchema>
export type location = z.infer<typeof location>