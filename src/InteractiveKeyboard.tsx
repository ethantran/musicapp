import React from 'react';

interface Props {
    frequencies: number[];
    onNotePlay: (frequency: number) => void;
    currentNote: number | null;
}

export const InteractiveKeyboard: React.FC<Props> = ({ frequencies, onNotePlay, currentNote }) => {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    return (
        <div className="interactive-keyboard">
            {frequencies.map((freq, index) => (
                <button
                    key={index}
                    onClick={() => onNotePlay(freq)}
                    className={`key ${freq === currentNote ? 'active' : ''} ${noteNames[index % 12].includes('#') ? 'black' : 'white'}`}
                >
                    {noteNames[index % 12]}
                </button>
            ))}
        </div>
    );
};