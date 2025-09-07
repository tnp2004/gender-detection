import { DATABASE_URL } from "@/constants"
import postgres from "postgres"

export enum Table {
    Location = "location",
    Camera = "camera",
    GenderLog = "genderLog"
}

export const sql = postgres(DATABASE_URL)