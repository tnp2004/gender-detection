import { DATABASE_URL } from "@/constants"
import postgres from "postgres"

export const sql = postgres(DATABASE_URL)