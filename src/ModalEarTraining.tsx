import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

const chords = ['C', 'Dm', 'G', 'Am', 'F'];
const modes = ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'];

const correctModes = {
    'C': 'Ionian',
    'Dm': 'Dorian',
    'G': 'Mixolydian',
    'Am': 'Aeolian',
    'F': 'Lydian'
};

const ModalEarTraining = () => {
    const [currentChordIndex, setCurrentChordIndex] = useState(0);
    const [selectedMode, setSelectedMode] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [synth] = useState(new Tone.PolySynth(Tone.Synth).toDestination());

    useEffect(() => {
        return () => {
            Tone.Transport.stop();
            Tone.Transport.cancel();
        };
    }, []);

    const playChordProgression = () => {
        setIsPlaying(true);
        setCurrentChordIndex(0);
        setFeedback('');

        Tone.Transport.bpm.value = 60;
        let index = 0;

        const repeat = (time) => {
            const chord = chords[index];
            playChord(chord, time);
            setCurrentChordIndex(index);
            index = (index + 1) % chords.length;
            if (index === 0) {
                Tone.Transport.stop();
                setIsPlaying(false);
            }
        };

        Tone.Transport.scheduleRepeat(repeat, '2n');
        Tone.start().then(() => {
            Tone.Transport.start();
        });
    };

    const playChord = (chordName, time) => {
        const chordNotes = getChordNotes(chordName);
        synth.triggerAttackRelease(chordNotes, '2n', time);
    };

    const getChordNotes = (chordName) => {
        const root = chordName.charAt(0);
        const chordType = chordName.slice(1);
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const rootIndex = notes.indexOf(root);

        switch (chordType) {
            case 'm':
                return [notes[rootIndex], notes[(rootIndex + 3) % 12], notes[(rootIndex + 7) % 12]].map(note => `${note}4`);
            default:
                return [notes[rootIndex], notes[(rootIndex + 4) % 12], notes[(rootIndex + 7) % 12]].map(note => `${note}4`);
        }
    };

    const handleModeSelection = (mode) => {
        setSelectedMode(mode);
        const currentChord = chords[currentChordIndex];
        const correctMode = correctModes[currentChord];

        if (mode === correctMode) {
            setFeedback(`Correct! ${mode} is the best mode for ${currentChord}.`);
        } else {
            setFeedback(`Not quite. The best mode for ${currentChord} is ${correctMode}. ${mode} would work, but might not be the best fit.`);
        }
    };

    return (
        <div className="modal-ear-training">
            <h2>Modal Ear Training</h2>
            <button onClick={playChordProgression} disabled={isPlaying}>
                {isPlaying ? 'Playing...' : 'Play Chord Progression'}
            </button>
            <div>
                <h3>Current Chord: {chords[currentChordIndex]}</h3>
                <p>Select the mode that fits best:</p>
                {modes.map((mode) => (
                    <button key={mode} onClick={() => handleModeSelection(mode)}>
                        {mode}
                    </button>
                ))}
            </div>
            {feedback && <div className="feedback">{feedback}</div>}
            <div className="explanation">
                <h3>Explanation:</h3>
                <ul>
                    <li>Ionian (Major) fits well over major chords (e.g., C, F, G)</li>
                    <li>Dorian fits well over minor chords, especially ii chords (e.g., Dm in C major)</li>
                    <li>Phrygian can fit over minor chords for a more exotic sound</li>
                    <li>Lydian fits well over major chords for a brighter sound (e.g., F in C major)</li>
                    <li>Mixolydian fits well over dominant 7th chords (e.g., G7 in C major)</li>
                    <li>Aeolian (Natural Minor) fits well over minor chords (e.g., Am in C major)</li>
                    <li>Locrian fits over diminished chords, but is rarely used</li>
                </ul>
            </div>
        </div>
    );
};

export default ModalEarTraining;