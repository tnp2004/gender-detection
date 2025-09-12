import { GenderLog } from "@/types/db"

interface Props {
    genderLogs: GenderLog[]
}

export default function GenderLogsTable({ genderLogs }: Props) {
    return (
        <>
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 w-fit shadow-sm">
                <table className="table">
                    <thead>
                        <tr className="text-center">
                            <th>ID</th>
                            <th>Gender</th>
                            <th>Location ID</th>
                            <th>Detected At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {genderLogs.map(log => (
                            <tr className="text-center" key={log.logId}>
                                <th>{log.logId}</th>
                                <td>{log.gender}</td>
                                <td>{log.locationId}</td>
                                <td>{log.detectedAt.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}