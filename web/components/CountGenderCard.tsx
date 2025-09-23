"use client"

interface Props {
    title: string,
    amount: number,
    suffix?: string,
    isLoading?: boolean
}

export default function CountGenderCard({ title, amount, suffix = "", isLoading = false }: Props) {
    return (
        <div className="card w-full h-fit shadow-sm px-3">
            <div className="card-body text-center">
                <h2 className="text-slate-600">{title}</h2>
                {isLoading ? (
                    <div className="flex justify-center">
                        <span className="loading loading-spinner loading-md"></span>
                    </div>
                ) : (
                    <span className="font-bold text-3xl">{amount}{suffix}</span>
                )}
            </div>
        </div>
    )
}