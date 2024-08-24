import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import './ChordScaleMatrix.css';

const chords = ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim'];
const modes = ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'];

const compatibilityScores = {
    'C': { 'Ionian': 5, 'Dorian': 2, 'Phrygian': 1, 'Lydian': 4, 'Mixolydian': 3, 'Aeolian': 2, 'Locrian': 1 },
    'Dm': { 'Ionian': 2, 'Dorian': 5, 'Phrygian': 3, 'Lydian': 2, 'Mixolydian': 2, 'Aeolian': 4, 'Locrian': 2 },
    'Em': { 'Ionian': 2, 'Dorian': 3, 'Phrygian': 5, 'Lydian': 2, 'Mixolydian': 2, 'Aeolian': 4, 'Locrian': 3 },
    'F': { 'Ionian': 4, 'Dorian': 2, 'Phrygian': 2, 'Lydian': 5, 'Mixolydian': 3, 'Aeolian': 2, 'Locrian': 1 },
    'G': { 'Ionian': 3, 'Dorian': 2, 'Phrygian': 2, 'Lydian': 3, 'Mixolydian': 5, 'Aeolian': 2, 'Locrian': 1 },
    'Am': { 'Ionian': 2, 'Dorian': 4, 'Phrygian': 3, 'Lydian': 2, 'Mixolydian': 2, 'Aeolian': 5, 'Locrian': 2 },
    'Bdim': { 'Ionian': 1, 'Dorian': 2, 'Phrygian': 3, 'Lydian': 1, 'Mixolydian': 1, 'Aeolian': 2, 'Locrian': 5 },
};

const ChordScaleMatrix = () => {
    const [synth, setSynth] = useState<Tone.PolySynth | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const newSynth = new Tone.PolySynth(Tone.Synth, {
            polyphony: 12,
            voice: Tone.Synth,
        }).toDestination();
        setSynth(newSynth);

        return () => {
            newSynth.dispose();
        };
    }, []);

    const getChordNotes = (chordName: string): string[] => {
        const root = chordName.charAt(0);
        const chordType = chordName.slice(1);
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const rootIndex = notes.indexOf(root);

        switch (chordType) {
            case 'm':
                return [notes[rootIndex], notes[(rootIndex + 3) % 12], notes[(rootIndex + 7) % 12]];
            case 'dim':
                return [notes[rootIndex], notes[(rootIndex + 3) % 12], notes[(rootIndex + 6) % 12]];
            default:
                return [notes[rootIndex], notes[(rootIndex + 4) % 12], notes[(rootIndex + 7) % 12]];
        }
    };

    const getModeNotes = (root: string, mode: string): string[] => {
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const rootIndex = notes.indexOf(root);
        const modeIntervals = {
            'Ionian': [0, 2, 4, 5, 7, 9, 11],
            'Dorian': [0, 2, 3, 5, 7, 9, 10],
            'Phrygian': [0, 1, 3, 5, 7, 8, 10],
            'Lydian': [0, 2, 4, 6, 7, 9, 11],
            'Mixolydian': [0, 2, 4, 5, 7, 9, 10],
            'Aeolian': [0, 2, 3, 5, 7, 8, 10],
            'Locrian': [0, 1, 3, 5, 6, 8, 10],
        };

        return modeIntervals[mode].map(interval => notes[(rootIndex + interval) % 12]);
    };

    const playChordAndScale = (chord: string, mode: string) => {
        if (!synth || isPlaying) return;

        setIsPlaying(true);

        const chordNotes = getChordNotes(chord);
        const scaleNotes = getModeNotes(chord[0], mode);

        const now = Tone.now();

        // Play chord
        synth.triggerAttack(chordNotes.map(note => `${note}4`), now);

        // Play scale
        const scalePromises = scaleNotes.map((note, index) => {
            return new Promise<void>(resolve => {
                setTimeout(() => {
                    synth.triggerAttack(`${note}5`, now + index * 0.2);
                    setTimeout(() => {
                        synth.triggerRelease(`${note}5`);
                        resolve();
                    }, 200);
                }, index * 200);
            });
        });

        Promise.all(scalePromises).then(() => {
            // Release chord after scale finishes
            synth.triggerRelease(chordNotes.map(note => `${note}4`));
            setIsPlaying(false);
        });
    };

    const getBackgroundColor = (score: number) => {
        const hue = (score - 1) * 30; // 0 to 120 (red to green)
        return `hsl(${hue}, 80%, 80%)`;
    };

    return (
        <div className="chord-scale-matrix">
            <h2>Chord-Scale Matrix</h2>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        {modes.map(mode => <th key={mode}>{mode}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {chords.map(chord => (
                        <tr key={chord}>
                            <th>{chord}</th>
                            {modes.map(mode => (
                                <td
                                    key={`${chord}-${mode}`}
                                    style={{
                                        backgroundColor: getBackgroundColor(compatibilityScores[chord][mode]),
                                        opacity: isPlaying ? 0.5 : 1
                                    }}
                                    onClick={() => playChordAndScale(chord, mode)}
                                >
                                    {compatibilityScores[chord][mode]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="legend">
                <p>Compatibility Score: 1 (Least Compatible) to 5 (Most Compatible)</p>
                <p>Click on a cell to hear the chord and scale together</p>
            </div>
        </div>
    );
};

export default ChordScaleMatrix;