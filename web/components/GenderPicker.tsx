import { Dispatch, SetStateAction } from "react"

enum Gender {
    Man = "man",
    Woman = "woman"
}

interface Props {
    gender: string | undefined,
    setGender: Dispatch<SetStateAction<string | undefined>>
}

export default function GenderPicker({ gender, setGender }: Props) {
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