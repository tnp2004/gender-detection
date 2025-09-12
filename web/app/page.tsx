import Dashboard from "@/components/Dashboard";
import DatePicker from "@/components/DatePicker";
import GenderPicker from "@/components/GenderPicker";

export default function Home() {
  return (
    <>
      <div className="flex gap-x-1 m-1">
        <DatePicker />
        <GenderPicker />
      </div>
      <Dashboard />
    </>
  );
}
