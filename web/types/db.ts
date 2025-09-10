export enum Table {
    Location = "location",
    Camera = "camera",
    GenderLog = "genderLog"
}

export enum Gender {
    Man = "Man",
    Woman = "Woman"
}

export interface Counting {
    count: number
}

export interface GenderLog {
    logId: string,
    gender: Gender,
    locationId: string,
    detectedAt: Date
}