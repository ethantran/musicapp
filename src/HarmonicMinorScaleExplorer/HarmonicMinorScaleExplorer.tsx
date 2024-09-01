import React, { useState } from 'react'
import { Piano, MidiNumbers } from 'react-piano'
import 'react-piano/dist/styles.css'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const HARMONIC_MINOR_INTERVALS = [2, 1, 2, 2, 1, 3, 1]
const MODES = [
    'Harmonic Minor',
    'Locrian ♮6',
    'Ionian #5',
    'Dorian #4',
    'Phrygian Dominant',
    'Lydian #2',
    'Ultralocrian'
]

const generateScale = (startNote: number, intervals: number[]): number[] => {
    let scale = [startNote]
    let currentNote = startNote
    for (let interval of intervals) {
        currentNote += interval
        scale.push(currentNote)
    }
    return scale
}

const rotateArray = (arr: number[], n: number): number[] => {
    return [...arr.slice(n), ...arr.slice(0, n)]
}

export default function HarmonicMinorScaleExplorer() {
    const [selectedMode, setSelectedMode] = useState(0)

    const firstNote = MidiNumbers.fromNote('C3')
    const lastNote = MidiNumbers.fromNote('B5')

    const baseScale = generateScale(firstNote, HARMONIC_MINOR_INTERVALS)
    const currentScale = generateScale(firstNote, rotateArray(HARMONIC_MINOR_INTERVALS, selectedMode))

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>Harmonic Minor Scale Mode Explorer</CardTitle>
                <CardDescription>Select a mode and play it on the piano</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <Select onValueChange={(value) => setSelectedMode(parseInt(value))}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a mode" />
                        </SelectTrigger>
                        <SelectContent>
                            {MODES.map((mode, index) => (
                                <SelectItem key={index} value={index.toString()}>{mode}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="piano-container" style={{ height: '200px' }}>
                    <Piano
                        noteRange={{ first: firstNote, last: lastNote }}
                        playNote={(midiNumber) => {
                            // Play audio
                        }}
                        stopNote={(midiNumber) => {
                            // Stop audio
                        }}
                        width={1000}
                        keyWidthToHeight={0.33}
                        activeNotes={currentScale}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
