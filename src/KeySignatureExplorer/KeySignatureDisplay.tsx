import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const KEY_SIGNATURES = {
    'C': { sharps: 0, flats: 0 },
    'G': { sharps: 1, flats: 0 },
    'D': { sharps: 2, flats: 0 },
    'A': { sharps: 3, flats: 0 },
    'E': { sharps: 4, flats: 0 },
    'B': { sharps: 5, flats: 0 },
    'F#': { sharps: 6, flats: 0 },
    'C#': { sharps: 7, flats: 0 },
    'F': { sharps: 0, flats: 1 },
    'Bb': { sharps: 0, flats: 2 },
    'Eb': { sharps: 0, flats: 3 },
    'Ab': { sharps: 0, flats: 4 },
    'Db': { sharps: 0, flats: 5 },
    'Gb': { sharps: 0, flats: 6 },
    'Cb': { sharps: 0, flats: 7 },
}

const STAFF_LINES = 5
const SHARP_POSITIONS = [5, 2, 6, 3, 0, 4, 1]
const FLAT_POSITIONS = [1, 4, 0, 3, 6, 2, 5]

interface KeySignatureDisplayProps {
    keySignature: string
}

export function KeySignatureDisplay({ keySignature }: KeySignatureDisplayProps) {
    const { sharps, flats } = KEY_SIGNATURES[keySignature as keyof typeof KEY_SIGNATURES] || { sharps: 0, flats: 0 }
    const accidentalPositions = sharps > 0 ? SHARP_POSITIONS.slice(0, sharps) : FLAT_POSITIONS.slice(0, flats)
    const accidentalSymbol = sharps > 0 ? '♯' : '♭'

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Key Signature: {keySignature} Major</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative w-full h-32">
                    {[...Array(STAFF_LINES)].map((_, i) => (
                        <div key={i} className="absolute w-full h-0.5 bg-black" style={{ top: `${i * 8}px` }} />
                    ))}
                    {accidentalPositions.map((position, index) => (
                        <div
                            key={index}
                            className="absolute text-2xl"
                            style={{
                                left: `${index * 20 + 10}px`,
                                top: `${position * 4}px`,
                            }}
                        >
                            {accidentalSymbol}
                        </div>
                    ))}
                </div>
                <p className="mt-4 text-center">
                    This key signature has {sharps > 0 ? `${sharps} sharp${sharps > 1 ? 's' : ''}` : `${flats} flat${flats > 1 ? 's' : ''}`}.
                </p>
            </CardContent>
        </Card>
    )
}