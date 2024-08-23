import React from 'react';

interface Props {
    frequencies: number[];
    onNotePlay: (frequency: number) => void;
    currentNote: number | null;
}

export const CircleVisualization: React.FC<Props> = ({ frequencies, onNotePlay, currentNote }) => {
    return (
        <div className="circle-visualization">
            {frequencies.map((freq, index) => (
                <div
                    key={index}
                    className={`note-point ${freq === currentNote ? 'active' : ''}`}
                    style={{
                        transform: `rotate(${index * (360 / frequencies.length)}deg) translate(100px) rotate(-${index * (360 / frequencies.length)}deg)`
                    }}
                    onClick={() => onNotePlay(freq)}
                />
            ))}
        </div>
    );
};