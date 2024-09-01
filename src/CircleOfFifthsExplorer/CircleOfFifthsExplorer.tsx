import React, { useState, useEffect, useRef } from 'react'
import * as Tone from 'tone'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipProvider } from '@/components/ui/tooltip'
import { Label } from '@/components/ui/label'

const keys = [
    { note: 'C', sharps: 0, flats: 0 },
    { note: 'G', sharps: 1, flats: 0 },
    { note: 'D', sharps: 2, flats: 0 },
    { note: 'A', sharps: 3, flats: 0 },
    { note: 'E', sharps: 4, flats: 0 },
    { note: 'B', sharps: 5, flats: 0 },
    { note: 'F♯/G♭', sharps: 6, flats: 6 },
    { note: 'C♯/D♭', sharps: 7, flats: 5 },
    { note: 'A♭', sharps: 0, flats: 4 },
    { note: 'E♭', sharps: 0, flats: 3 },
    { note: 'B♭', sharps: 0, flats: 2 },
    { note: 'F', sharps: 0, flats: 1 },
]

export default function CircleOfFifthsExplorer() {
    const [selectedKey, setSelectedKey] = useState<string | null>(null)
    const [isAudioReady, setIsAudioReady] = useState(false)
    const synthRef = useRef<Tone.Synth | null>(null)

    useEffect(() => {
        return () => {
            if (synthRef.current) {
                synthRef.current.dispose()
            }
        }
    }, [])

    const initAudio = async () => {
        await Tone.start()
        synthRef.current = new Tone.Synth().toDestination()
        setIsAudioReady(true)
    }

    const playNote = (note: string) => {
        if (isAudioReady && synthRef.current) {
            const cleanedNote = note.replace('♯', '#').replace('♭', 'b').split('/')[0];
            synthRef.current.triggerAttackRelease(`${cleanedNote}4`, '0.5');
        }
    }

    const handleKeyClick = (key: string) => {
        setSelectedKey(key)
        playNote(key)
    }

    return (
        <TooltipProvider>
            <div className="flex flex-col items-center justify-center p-8 bg-background text-foreground">
                <h2 className="text-2xl font-bold mb-4">Interactive Circle of Fifths</h2>
                {!isAudioReady && (
                    <Button onClick={initAudio} className="mb-4">
                        Initialize Audio
                    </Button>
                )}
                <div className="relative w-80 h-80">
                    {keys.map((key, index) => {
                        const angle = (index * 30 * Math.PI) / 180
                        const x = Math.sin(angle) * 120 + 140
                        const y = -Math.cos(angle) * 120 + 140
                        return (
                            <Tooltip key={key.note} content={`${key.note} - ${key.sharps} sharps, ${key.flats} flats`}>
                                <motion.button
                                    className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold ${selectedKey === key.note ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                                        }`}
                                    style={{ left: x, top: y }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleKeyClick(key.note)}
                                >
                                    {key.note}
                                </motion.button>
                            </Tooltip>
                        )
                    })}
                </div>
                {selectedKey && (
                    <div className="mt-8 text-center">
                        <Label className="text-lg font-semibold">Selected Key: {selectedKey}</Label>
                        <p className="mt-2">
                            {keys.find((k) => k.note === selectedKey)?.sharps} sharps,{' '}
                            {keys.find((k) => k.note === selectedKey)?.flats} flats
                        </p>
                    </div>
                )}
            </div>
        </TooltipProvider>
    )
}