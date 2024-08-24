import React, { useState } from 'react';
import * as Tone from 'tone';

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const minorPentatonicFormula = ['R', 'm3', 'P4', 'P5', 'm7'];
const minorPentatonicIntervals = ['TS', 'T', 'T', 'TS', 'T'];

export const ScaleFormulaDemo = () => {
    const [rootNote, setRootNote] = useState('A');
    const [synth] = useState(new Tone.Synth().toDestination());

    const getScaleNotes = (root) => {
        const rootIndex = notes.indexOf(root);
        const scaleNotes = [root];
        let currentIndex = rootIndex;

        minorPentatonicIntervals.forEach(interval => {
            if (interval === 'T') {
                currentIndex = (currentIndex + 2) % 12;
            } else if (interval === 'TS') {
                currentIndex = (currentIndex + 3) % 12;
            }
            scaleNotes.push(notes[currentIndex]);
        });

        return scaleNotes;
    };

    const scaleNotes = getScaleNotes(rootNote);

    const playNote = (note) => {
        synth.triggerAttackRelease(`${note}4`, '8n');
    };

    return (
        <div className="scale-formula-demo">
            <h3>Minor Pentatonic Scale Formula Demonstration</h3>
            <div>
                <label>Root Note: </label>
                <select value={rootNote} onChange={(e) => setRootNote(e.target.value)}>
                    {notes.map(note => (
                        <option key={note} value={note}>{note}</option>
                    ))}
                </select>
            </div>
            <div className="scale-visualization">
                {scaleNotes.map((note, index) => (
                    <div key={index} className="note-block" onClick={() => playNote(note)}>
                        <div className="note">{note}</div>
                        <div className="interval">{minorPentatonicFormula[index]}</div>
                        <div className="formula">{index < 5 ? minorPentatonicIntervals[index] : ''}</div>
                    </div>
                ))}
            </div>
            <div className="scale-explanation">
                <p>R = Root, m3 = minor 3rd, P4 = Perfect 4th, P5 = Perfect 5th, m7 = minor 7th</p>
                <p>T = Tone (whole step), S = Semitone (half step), TS = Tone and a Semitone (3 half steps)</p>
            </div>
        </div>
    );
};
