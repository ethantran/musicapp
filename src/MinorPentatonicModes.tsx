import React, { useState, useEffect, useMemo } from 'react';
import * as Tone from 'tone';

interface ModeCell {
    note: string;
    isCorrect: boolean | null;
}

const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

const modeExplanations = [
    "1st mode (minor pentatonic scale): Root, minor 3rd, Perfect 4th, Perfect 5th, minor 7th",
    "2nd mode (Major pentatonic scale): Root, Major 2nd, Major 3rd, Perfect 5th, Major 6th",
    "3rd mode: Root, minor 2nd, Perfect 4th, Perfect 5th, minor 6th",
    "4th mode: Root, Major 2nd, Major 3rd, augmented 4th, minor 7th",
    "5th mode: Root, Major 2nd, Perfect 4th, Perfect 5th, Major 6th"
];

const MinorPentatonicModes: React.FC = () => {
    const [rootNote, setRootNote] = useState<string>('A');
    const [modes, setModes] = useState<ModeCell[][]>([]);
    const [synth, setSynth] = useState<Tone.PolySynth | null>(null);
    const [hintCount, setHintCount] = useState<number>(0);

    const correctModes = useMemo(() => {
        const rootIndex = notes.indexOf(rootNote);
        const scale = [
            notes[rootIndex],
            notes[(rootIndex + 3) % 12],
            notes[(rootIndex + 5) % 12],
            notes[(rootIndex + 7) % 12],
            notes[(rootIndex + 10) % 12],
        ];

        return [
            [...scale, scale[0]],
            [scale[1], scale[2], scale[3], scale[4], scale[0], scale[1]],
            [scale[2], scale[3], scale[4], scale[0], scale[1], scale[2]],
            [scale[3], scale[4], scale[0], scale[1], scale[2], scale[3]],
            [scale[4], scale[0], scale[1], scale[2], scale[3], scale[4]],
        ].map(mode => {
            const fullMode = [...mode];
            while (fullMode.length < 12) {
                fullMode.push('');
            }
            return fullMode;
        });
    }, [rootNote]);

    useEffect(() => {
        const initialModes: ModeCell[][] = correctModes.map((row, rowIndex) =>
            row.map((note, colIndex) => ({
                note: rowIndex === 0 && colIndex === 0 ? note : '',
                isCorrect: rowIndex === 0 && colIndex === 0 ? true : null
            }))
        );
        setModes(initialModes);
        setHintCount(0);
    }, [correctModes]);

    useEffect(() => {
        const newSynth = new Tone.PolySynth(Tone.Synth).toDestination();
        setSynth(newSynth);
        return () => {
            newSynth.dispose();
        };
    }, []);

    const handleRootChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRootNote(event.target.value);
    };

    const handleInputChange = (rowIndex: number, colIndex: number, value: string) => {
        const newModes = [...modes];
        newModes[rowIndex][colIndex] = { note: value.toUpperCase(), isCorrect: null };
        setModes(newModes);
    };

    const checkAnswers = () => {
        const newModes = modes.map((row, rowIndex) =>
            row.map((cell, colIndex) => ({
                ...cell,
                isCorrect: cell.note === correctModes[rowIndex][colIndex],
            }))
        );
        setModes(newModes);
    };

    const playNote = (note: string) => {
        if (synth && note) {
            synth.triggerAttackRelease(`${note}4`, '8n');
        }
    };

    const playMode = (rowIndex: number) => {
        if (!synth) return;

        const modeNotes = modes[rowIndex].filter(cell => cell.note !== '').map(cell => cell.note);
        const uniqueNotes = Array.from(new Set(modeNotes)); // Remove duplicates

        Tone.Transport.cancel(); // Clear any existing scheduled events

        uniqueNotes.forEach((note, index) => {
            Tone.Transport.schedule((time) => {
                synth.triggerAttackRelease(`${note}4`, '4n', time);
            }, index * 0.5); // Schedule each note 0.5 seconds apart
        });

        Tone.Transport.start();
    };

    const giveHint = () => {
        const flatModes = modes.flat();
        const flatCorrectModes = correctModes.flat();

        let nextHintIndex = hintCount;
        while (nextHintIndex < flatModes.length) {
            if (flatModes[nextHintIndex].note === '' && flatCorrectModes[nextHintIndex] !== '') {
                const rowIndex = Math.floor(nextHintIndex / 12);
                const colIndex = nextHintIndex % 12;
                const newModes = [...modes];
                newModes[rowIndex][colIndex] = {
                    note: flatCorrectModes[nextHintIndex],
                    isCorrect: true
                };
                setModes(newModes);
                setHintCount(nextHintIndex + 1);
                playNote(flatCorrectModes[nextHintIndex]);
                break;
            }
            nextHintIndex++;
        }

        if (nextHintIndex >= flatModes.length) {
            alert("All hints have been revealed!");
        }
    };

    const getModeIntervals = (modeIndex: number): string => {
        const intervals = ['R', 'm2', 'M2', 'm3', 'M3', 'P4', 'A4', 'P5', 'm6', 'M6', 'm7', 'O'];
        return correctModes[modeIndex]
            .map((note, index) => note ? intervals[index] : '')
            .filter(Boolean)
            .join(', ');
    };

    return (
        <div className="minor-pentatonic-modes">
            <h2>Minor Pentatonic Modes</h2>
            <div className="root-select">
                <label htmlFor="root-note">Root Note: </label>
                <select id="root-note" value={rootNote} onChange={handleRootChange}>
                    {notes.map(note => (
                        <option key={note} value={note}>{note}</option>
                    ))}
                </select>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Mode</th>
                        {Array(12).fill(0).map((_, i) => (
                            <th key={i}>{i + 1}</th>
                        ))}
                        <th>Play</th>
                    </tr>
                </thead>
                <tbody>
                    {modes.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <td
                                title={`${modeExplanations[rowIndex]}\n\nIntervals: ${getModeIntervals(rowIndex)}`}
                                className="mode-name"
                            >
                                {`${rowIndex + 1}${getOrdinalSuffix(rowIndex + 1)} mode`}
                            </td>
                            {row.map((cell, colIndex) => (
                                <td key={colIndex}>
                                    <input
                                        type="text"
                                        value={cell.note}
                                        onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                                        className={cell.isCorrect === false ? 'incorrect' : cell.isCorrect === true ? 'correct' : ''}
                                        maxLength={2}
                                        onFocus={() => playNote(cell.note)}
                                        readOnly={cell.isCorrect === true}
                                    />
                                </td>
                            ))}
                            <td>
                                <button onClick={() => playMode(rowIndex)}>Play Mode</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="button-group">
                <button onClick={checkAnswers}>Check Answers</button>
                <button onClick={giveHint}>Hint</button>
            </div>
        </div>
    );
};

function getOrdinalSuffix(i: number): string {
    const j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return "st";
    }
    if (j == 2 && k != 12) {
        return "nd";
    }
    if (j == 3 && k != 13) {
        return "rd";
    }
    return "th";
}

export default MinorPentatonicModes;