import React from 'react';
import { motion } from 'framer-motion';

interface ModeVisualizerProps {
    rootNote: string;
    modeType: 'relative' | 'parallel';
    modeIndex: number;
    modeNotes: string[];
    playingNote: string | null;
}

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const ModeVisualizer: React.FC<ModeVisualizerProps> = ({
    rootNote,
    modeType,
    modeIndex,
    modeNotes,
    playingNote,
}) => {
    const width = 600;
    const height = 200;
    const circleRadius = 20;

    const getNotePosition = (note: string) => {
        const rootIndex = notes.indexOf(rootNote);
        const noteIndex = notes.indexOf(note);
        const relativeIndex = (noteIndex - rootIndex + 12) % 12;

        const x = (width / 13) * (relativeIndex + 1);
        const y = modeNotes.includes(note) ? height / 3 : (2 * height) / 3;

        return { x, y };
    };

    return (
        <svg width={width} height={height} style={{ background: '#f0f0f0' }}>
            {notes.map((note) => {
                const { x, y } = getNotePosition(note);
                const isInMode = modeNotes.includes(note);
                const isRoot = note === rootNote;
                const isPlaying = note === playingNote;

                return (
                    <motion.g key={note} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <motion.circle
                            cx={x}
                            cy={y}
                            r={circleRadius}
                            fill={isPlaying ? '#FCD34D' : (isInMode ? '#3B82F6' : '#D1D5DB')}
                            stroke={isRoot ? '#EF4444' : 'none'}
                            strokeWidth={2}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        />
                        <motion.text
                            x={x}
                            y={y}
                            dy=".3em"
                            textAnchor="middle"
                            fill={isInMode ? 'white' : 'black'}
                            fontSize={12}
                            fontWeight="bold"
                        >
                            {note}
                        </motion.text>
                    </motion.g>
                );
            })}
        </svg>
    );
};