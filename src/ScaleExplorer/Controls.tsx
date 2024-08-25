import React from 'react';
import { Tooltip } from './Tooltip';

interface ControlsProps {
    rootNote: string;
    setRootNote: (note: string) => void;
    modeType: 'relative' | 'parallel';
    setModeType: (type: 'relative' | 'parallel') => void;
    modeIndex: number;
    setModeIndex: (index: number) => void;
    onPlay: () => void;
    isPlaying: boolean;
}

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const modes = ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'];

export const Controls: React.FC<ControlsProps> = ({
    rootNote,
    setRootNote,
    modeType,
    setModeType,
    modeIndex,
    setModeIndex,
    onPlay,
    isPlaying,
}) => {
    return (
        <div className="mb-4">
            <select value={rootNote} onChange={(e) => setRootNote(e.target.value)} className="mr-2">
                {notes.map((note) => (
                    <option key={note} value={note}>
                        {note}
                    </option>
                ))}
            </select>
            <Tooltip content="Relative modes share the same notes but start from different degrees. Parallel modes start from the same root note but have different note collections.">
                <select value={modeType} onChange={(e) => setModeType(e.target.value as 'relative' | 'parallel')} className="mr-2">
                    <option value="relative">Relative</option>
                    <option value="parallel">Parallel</option>
                </select>
            </Tooltip>
            <select value={modeIndex} onChange={(e) => setModeIndex(parseInt(e.target.value))} className="mr-2">
                {modes.map((mode, index) => (
                    <option key={mode} value={index}>
                        {mode}
                    </option>
                ))}
            </select>
            <button
                onClick={onPlay}
                className={`px-4 py-2 rounded ${isPlaying
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                    } text-white`}
                disabled={isPlaying}
            >
                {isPlaying ? 'Playing...' : 'Play Scale'}
            </button>
        </div>
    );
}