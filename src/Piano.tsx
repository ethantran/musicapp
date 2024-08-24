import React from 'react';
import { Piano as ReactPiano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';

const firstNote = MidiNumbers.fromNote('c3');
const lastNote = MidiNumbers.fromNote('b4');

const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: firstNote,
    lastNote: lastNote,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
});

export const Piano = ({ scale, playNote, currentScale }) => {
    const noteRange = {
        first: firstNote,
        last: lastNote,
    };

    const isNoteInScale = (midiNumber) => {
        const noteName = MidiNumbers.getAttributes(midiNumber).note.slice(0, -1);
        return scale.includes(noteName);
    };

    return (
        <div className="piano-wrapper">
            <ReactPiano
                noteRange={noteRange}
                playNote={(midiNumber) => {
                    const noteName = MidiNumbers.getAttributes(midiNumber).note.slice(0, -1);
                    playNote(noteName);
                }}
                stopNote={() => { }}
                width={1000}
                keyboardShortcuts={keyboardShortcuts}
                className="react-piano"
                renderNoteLabel={({ midiNumber, isAccidental }) => {
                    const noteName = MidiNumbers.getAttributes(midiNumber).note.slice(0, -1);
                    return (
                        <div className={`note-label ${isNoteInScale(midiNumber) ? 'in-scale' : ''}`}>
                            {noteName}
                        </div>
                    );
                }}
                activeNotes={scale.map(note => MidiNumbers.fromNote(`${note}3`))}
            />
            <div className="scale-name">{currentScale}</div>
        </div>
    );
};