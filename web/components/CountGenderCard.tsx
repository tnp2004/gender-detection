"use client"

interface Props {
    title: string,
    amount: number,
    suffix?: string
}

export default function CountGenderCard({ title, amount, suffix = "" }: Props) {
    return (
        <div className="card w-full h-fit shadow-sm px-3">
            <div className="card-body text-center">
                <h2 className="text-slate-600">{title}</h2>
                <span className="font-bold text-3xl">{amount}{suffix}</span>
            </div>
        </div>
    )
}