import React from 'react'
import { Button } from "@/components/ui/button"

const CIRCLE_OF_FIFTHS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab']

interface CircleOfFifthsProps {
    onKeySelect: (key: string) => void
    selectedKey: string
}

export function CircleOfFifths({ onKeySelect, selectedKey }: CircleOfFifthsProps) {
    return (
        <div className="flex flex-wrap justify-center gap-2">
            {CIRCLE_OF_FIFTHS.map((key) => (
                <Button
                    key={key}
                    onClick={() => onKeySelect(key)}
                    variant={key === selectedKey ? "default" : "outline"}
                >
                    {key}
                </Button>
            ))}
        </div>
    )
}