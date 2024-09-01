import React, { useState, useEffect } from 'react'
import * as Tone from 'tone'
import { Piano, MidiNumbers } from 'react-piano'
import 'react-piano/dist/styles.css'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { CircleOfFifths } from './CircleOfFifths'
import { KeySignatureDisplay } from './KeySignatureDisplay'
import { KeySignatureBuilder } from './KeySignatureBuilder'

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export default function KeySignatureExplorer() {
    const [selectedKey, setSelectedKey] = useState('C')
    const [synth, setSynth] = useState<Tone.Synth | null>(null)
    const [isAudioInitialized, setIsAudioInitialized] = useState(false)

    useEffect(() => {
        const newSynth = new Tone.Synth().toDestination()
        setSynth(newSynth)

        return () => {
            newSynth.dispose()
        }
    }, [])

    const initAudio = async () => {
        await Tone.start()
        setIsAudioInitialized(true)
    }

    const getScaleNotes = (key: string) => {
        const majorScalePattern = [2, 2, 1, 2, 2, 2, 1]
        const startIndex = NOTES.indexOf(key)
        let scaleNotes = [key]
        let currentIndex = startIndex

        for (let interval of majorScalePattern) {
            currentIndex = (currentIndex + interval) % 12
            scaleNotes.push(NOTES[currentIndex])
        }

        return scaleNotes
    }

    const playNote = (midiNumber: number) => {
        if (synth && isAudioInitialized) {
            const freq = Tone.Frequency(midiNumber, "midi").toFrequency()
            synth.triggerAttackRelease(freq, '8n')
        }
    }

    const playScale = () => {
        if (synth && isAudioInitialized) {
            const scaleNotes = getScaleNotes(selectedKey)
            const now = Tone.now()
            scaleNotes.forEach((note, index) => {
                const midiNumber = MidiNumbers.fromNote(`${note}4`)
                const freq = Tone.Frequency(midiNumber, "midi").toFrequency()
                synth.triggerAttackRelease(freq, '8n', now + index * 0.5)
            })
        }
    }

    const firstNote = MidiNumbers.fromNote('c3')
    const lastNote = MidiNumbers.fromNote('b4')

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Key Signature Explorer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {!isAudioInitialized && (
                    <Button onClick={initAudio}>Initialize Audio</Button>
                )}
                <CircleOfFifths onKeySelect={setSelectedKey} selectedKey={selectedKey} />
                <KeySignatureDisplay keySignature={selectedKey} />
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Scale: {selectedKey} Major</h3>
                    <Piano
                        noteRange={{ first: firstNote, last: lastNote }}
                        playNote={playNote}
                        stopNote={() => { }}
                        width={1000}
                        keyWidthToHeight={0.33}
                        activeNotes={getScaleNotes(selectedKey).map(note => MidiNumbers.fromNote(`${note}4`))}
                    />
                    <Button onClick={playScale} disabled={!isAudioInitialized}>
                        Play Scale
                    </Button>
                </div>
                <KeySignatureBuilder />
            </CardContent>
        </Card>
    )
}