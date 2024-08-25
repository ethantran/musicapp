import React from 'react';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';

interface KeyboardProps {
    highlightedNotes: string[];
    onPlayNote: (midiNumber: number) => void;
    onStopNote: (midiNumber: number) => void;
}

const noteToMidiNumber: { [key: string]: number } = {
    'C': 60, 'C#': 61, 'D': 62, 'D#': 63, 'E': 64, 'F': 65,
    'F#': 66, 'G': 67, 'G#': 68, 'A': 69, 'A#': 70, 'B': 71
};

export const Keyboard: React.FC<KeyboardProps> = ({ highlightedNotes, onPlayNote, onStopNote }) => {
    const firstNote = MidiNumbers.fromNote('c4');
    const lastNote = MidiNumbers.fromNote('b5');

    const keyboardShortcuts = KeyboardShortcuts.create({
        firstNote: firstNote,
        lastNote: lastNote,
        keyboardConfig: KeyboardShortcuts.HOME_ROW,
    });

    const highlightedMidiNumbers = highlightedNotes.map(note => noteToMidiNumber[note]);

    return (
        <div className="mt-4">
            <Piano
                noteRange={{ first: firstNote, last: lastNote }}
                playNote={onPlayNote}
                stopNote={onStopNote}
                width={1000}
                keyboardShortcuts={keyboardShortcuts}
                renderNoteLabel={({ midiNumber }) => {
                    const noteName = MidiNumbers.getAttributes(midiNumber).note.slice(0, -1);
                    return highlightedNotes.includes(noteName) ? '●' : null;
                }}
                className="react-piano"
            />
        </div>
    );
};