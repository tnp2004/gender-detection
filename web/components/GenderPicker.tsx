"use client"

import { Gender } from "@/types/db";
import { useState } from "react"

export default function GenderPicker() {
  const [gender, setGender] = useState<string | undefined>();
    
    const handleGenderChange = (selectedGender: Gender) => {
        if (gender === selectedGender) return setGender(undefined)
        setGender(selectedGender);
    };

    return (
        <div className="join">
            <input 
                onChange={() => handleGenderChange(Gender.Man)} 
                checked={gender === Gender.Man} 
                className="join-item btn checked:bg-sky-400 border-0" 
                type="checkbox" 
                name="options" 
                aria-label="ชาย"  
            />
            <input 
                onChange={() => handleGenderChange(Gender.Woman)} 
                checked={gender === Gender.Woman} 
                className="join-item btn checked:bg-pink-400 border-0" 
                type="checkbox" 
                name="options" 
                aria-label="หญิง" 
            />
        </div>
    );
}