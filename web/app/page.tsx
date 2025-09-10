import Dashboard from "@/components/Dashboard";
import DatePicker from "@/components/DatePicker";
import GenderPicker from "@/components/GenderPicker";
import { countGenderLogs } from "@/database/genderLog";

export default function Home() {
  const genderLogsPromise = countGenderLogs()
  
  return (
    <>
      <div className="flex gap-x-1 m-1">
        <DatePicker/>
        <GenderPicker/>
      </div>
      <Dashboard genderLogsPromise={genderLogsPromise} />
    </>
  );
}
