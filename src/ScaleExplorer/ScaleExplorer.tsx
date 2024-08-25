import React, { useState, useMemo } from 'react';
import { Keyboard } from './Keyboard';
import { Controls } from './Controls';
import { ModeVisualizer } from './ModeVisualizer';
import { getParallelMode, getRelativeMode } from './music';
import { useAudio } from './useAudio';

export const ScaleExplorer: React.FC = () => {
    const [rootNote, setRootNote] = useState('C');
    const [modeType, setModeType] = useState<'relative' | 'parallel'>('relative');
    const [modeIndex, setModeIndex] = useState(0);
    const [playingNote, setPlayingNote] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const { start, playNote, stopNote, isStarted } = useAudio();

    const modeNotes = useMemo(() => {
        if (modeType === 'parallel') {
            return getParallelMode(rootNote, modeIndex);
        } else {
            return getRelativeMode(rootNote, modeIndex);
        }
    }, [rootNote, modeType, modeIndex]);

    const handlePlayNote = async (midiNumber: number) => {
        if (!isStarted) {
            await start();
        }
        playNote(midiNumber);
        setPlayingNote(midiNumberToNote(midiNumber));
    };

    const handleStopNote = (midiNumber: number) => {
        stopNote(midiNumber);
        setPlayingNote(null);
    };

    const handlePlayScale = async () => {
        if (!isStarted) {
            await start();
        }
        setIsPlaying(true);
        for (const note of modeNotes) {
            const midiNumber = noteToMidiNumber[note];
            playNote(midiNumber);
            await new Promise(resolve => setTimeout(resolve, 500));
            stopNote(midiNumber);
        }
        setIsPlaying(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Interactive Scale Explorer</h1>
            <Controls
                rootNote={rootNote}
                setRootNote={setRootNote}
                modeType={modeType}
                setModeType={setModeType}
                modeIndex={modeIndex}
                setModeIndex={setModeIndex}
                onPlay={handlePlayScale}
                isPlaying={isPlaying}
            />
            <ModeVisualizer
                rootNote={rootNote}
                modeType={modeType}
                modeIndex={modeIndex}
                modeNotes={modeNotes}
                playingNote={playingNote}
                onNoteClick={(note) => handlePlayNote(noteToMidiNumber[note])}
            />
            <Keyboard
                highlightedNotes={modeNotes}
                onPlayNote={handlePlayNote}
                onStopNote={handleStopNote}
            />
            {!isStarted && (
                <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 rounded">
                    Click on a key or note to start audio
                </div>
            )}
        </div>
    );
};


const noteToMidiNumber: { [key: string]: number } = {
    'C': 60, 'C#': 61, 'D': 62, 'D#': 63, 'E': 64, 'F': 65,
    'F#': 66, 'G': 67, 'G#': 68, 'A': 69, 'A#': 70, 'B': 71
};

const midiNumberToNote = (midiNumber: number): string => {
    return Object.keys(noteToMidiNumber).find(key => noteToMidiNumber[key] === midiNumber) || '';
};