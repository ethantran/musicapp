import React, { useState } from 'react';
import * as Tone from 'tone';

const pentatonicModes = [
    { name: 'Minor Pentatonic', intervals: ['R', 'm3', 'P4', 'P5', 'm7'], formula: ['TS', 'T', 'T', 'TS', 'T'] },
    { name: 'Major Pentatonic', intervals: ['R', 'M2', 'M3', 'P5', 'M6'], formula: ['T', 'T', 'TS', 'T', 'TS'] },
    { name: 'Sus2 Pentatonic', intervals: ['R', 'M2', 'P4', 'P5', 'm7'], formula: ['T', 'TS', 'T', 'TS', 'T'] },
    { name: 'Sus4 Pentatonic', intervals: ['R', 'M2', 'P4', 'P5', 'M6'], formula: ['TS', 'T', 'T', 'T', 'TS'] },
    { name: 'Dominant Pentatonic', intervals: ['R', 'M2', 'M3', 'P5', 'm7'], formula: ['T', 'T', 'T', 'TS', 'T'] },
];

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const ModeShifter = () => {
    const [rootNote, setRootNote] = useState('C');
    const [currentMode, setCurrentMode] = useState(0);
    const [synth] = useState(new Tone.PolySynth(Tone.Synth).toDestination());

    const getScaleNotes = (root, formula) => {
        const scaleNotes = [root];
        let currentIndex = notes.indexOf(root);

        formula.forEach(interval => {
            if (interval === 'T') {
                currentIndex = (currentIndex + 2) % 12;
            } else if (interval === 'TS') {
                currentIndex = (currentIndex + 3) % 12;
            }
            scaleNotes.push(notes[currentIndex]);
        });

        return scaleNotes;
    };

    const scaleNotes = getScaleNotes(rootNote, pentatonicModes[currentMode].formula);

    const playScale = () => {
        const now = Tone.now();
        scaleNotes.forEach((note, index) => {
            synth.triggerAttackRelease(`${note}4`, '8n', now + index * 0.5);
        });
    };

    const playChord = () => {
        const chord = [scaleNotes[0], scaleNotes[2], scaleNotes[4]];
        synth.triggerAttackRelease(chord.map(note => `${note}4`), '2n');
    };

    return (
        <div className="mode-shifter">
            <h3>Pentatonic Mode Shifter</h3>
            <div>
                <label>Root Note: </label>
                <select value={rootNote} onChange={(e) => setRootNote(e.target.value)}>
                    {notes.map(note => (
                        <option key={note} value={note}>{note}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Mode: </label>
                <select value={currentMode} onChange={(e) => setCurrentMode(Number(e.target.value))}>
                    {pentatonicModes.map((mode, index) => (
                        <option key={index} value={index}>{mode.name}</option>
                    ))}
                </select>
            </div>
            <div className="scale-visualization">
                {scaleNotes.map((note, index) => (
                    <div key={index} className="note-block">
                        <div className="note">{note}</div>
                        <div className="interval">{pentatonicModes[currentMode].intervals[index]}</div>
                    </div>
                ))}
            </div>
            <button onClick={playScale}>Play Scale</button>
            <button onClick={playChord}>Play Chord</button>
            <div className="mode-explanation">
                <p>This mode works well over a {scaleNotes[0]} {pentatonicModes[currentMode].name.split(' ')[0]} chord.</p>
                <p>Try improvising using these notes over the chord!</p>
            </div>
        </div>
    );
};
