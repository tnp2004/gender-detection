interface Props {
    title: string
    amount: number
}

export default function CountingCard({ title, amount }: Props) {
    return (
        <div className="card w-fit shadow-sm px-3">
            <div className="card-body text-center">
                <h2 className="text-slate-600">{title}</h2>
                <span className="font-bold text-3xl">{amount}</span>
            </div>
        </div>
    )
}