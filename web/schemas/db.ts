import * as z from "zod"

export const tableSchema = z.enum(["location", "camera", "genderLog"])
export const genderSchema = z.enum(["Man", "Woman"])
export const countingSchema = z.object({ count: z.number() })

// Table
export const genderLogSchema = z.object({
    logId: z.string(),
    gender: genderSchema,
    locationId: z.string(),
    detectedAt: z.date()
})
export const cameraSchema = z.object({
    cameraId: z.string(),
    status: z.enum(["active", "inactive"])
})
export const locationSchema = z.object({
    locationId: z.string(),
    cameraId: z.string(),
    location: z.string(),
    lat: z.float32(),
    long: z.float32(),
    createdAt: z.date()
})