"use client"

import { GenderCouting } from "@/types/db"

interface Props {
    title: string;
    genderCounting: GenderCouting;
}

export default function GenderRatioCard({ title, genderCounting }: Props) {
    const { man, woman } = genderCounting;
    const total = man + woman;
    
    const manRatio = total > 0 ? ((man / total) * 100).toFixed(1) : '0.0';
    const womanRatio = total > 0 ? ((woman / total) * 100).toFixed(1) : '0.0';
    
    return (
        <div className="card w-full h-fit shadow-sm px-3">
            <div className="card-body text-center">
                <h2 className="text-slate-600">{title}</h2>
                <div>
                    <div className="text-sm text-slate-600 font-bold">
                        ผู้ชาย: <span className="font-bold text-blue-600">{manRatio}%</span>
                    </div>
                    <div className="text-sm text-slate-600 font-bold">
                        ผู้หญิง: <span className="font-bold text-pink-600">{womanRatio}%</span>
                    </div>
                   
                </div>
            </div>
        </div>
    )
}
