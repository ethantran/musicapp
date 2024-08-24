import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import './ChordScaleVisualizer.css';

const chordProgressions = {
    basic: ['C', 'F', 'G', 'C'],
    blues: ['C7', 'F7', 'C7', 'G7', 'F7', 'C7'],
    jazz: ['Cmaj7', 'Dm7', 'G7', 'Cmaj7'],
};

const scales = {
    C: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    F: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
    G: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
    C7: ['C', 'D', 'E', 'F', 'G', 'A', 'Bb'],
    F7: ['F', 'G', 'A', 'Bb', 'C', 'D', 'Eb'],
    G7: ['G', 'A', 'B', 'C', 'D', 'E', 'F'],
    Cmaj7: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    Dm7: ['D', 'E', 'F', 'G', 'A', 'B', 'C'],
};

const ChordScaleVisualizer = () => {
    const [progression, setProgression] = useState('basic');
    const [currentChordIndex, setCurrentChordIndex] = useState(0);
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
        let index = 0;
        const repeat = (time) => {
            const chord = chordProgressions[progression][index];
            playChord(chord, time);
            setCurrentChordIndex(index);
            index = (index + 1) % chordProgressions[progression].length;
        };

        Tone.Transport.bpm.value = 60;
        Tone.Transport.scheduleRepeat(repeat, '1n');
        Tone.Transport.start();
    };

    const stopChordProgression = () => {
        setIsPlaying(false);
        Tone.Transport.stop();
        Tone.Transport.cancel();
        setCurrentChordIndex(0);
    };

    const playChord = (chordName, time) => {
        const root = chordName.charAt(0);
        const chordType = chordName.slice(1);
        let chordNotes;

        switch (chordType) {
            case 'maj7':
                chordNotes = [root, getNote(root, 4), getNote(root, 7), getNote(root, 11)];
                break;
            case '7':
                chordNotes = [root, getNote(root, 4), getNote(root, 7), getNote(root, 10)];
                break;
            case 'm7':
                chordNotes = [root, getNote(root, 3), getNote(root, 7), getNote(root, 10)];
                break;
            default:
                chordNotes = [root, getNote(root, 4), getNote(root, 7)];
        }

        synth.triggerAttackRelease(chordNotes.map(note => `${note}4`), '1n', time);
    };

    const getNote = (root, semitones) => {
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const rootIndex = notes.indexOf(root);
        return notes[(rootIndex + semitones) % 12];
    };

    const renderPiano = () => {
        const currentChord = chordProgressions[progression][currentChordIndex];
        const chordRoot = currentChord.charAt(0);
        const currentScale = scales[chordRoot] || scales[currentChord];

        return (
            <div className="piano">
                {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((note, index) => (
                    <div key={index} className={`piano-key ${currentScale && currentScale.includes(note) ? 'highlighted' : ''}`}>
                        {note}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="chord-scale-visualizer">
            <h3>Chord-Scale Relationship Visualizer</h3>
            <div>
                <label>Chord Progression: </label>
                <select value={progression} onChange={(e) => setProgression(e.target.value)}>
                    <option value="basic">Basic (I-IV-V-I)</option>
                    <option value="blues">12-Bar Blues</option>
                    <option value="jazz">Simple Jazz (ii-V-I)</option>
                </select>
            </div>
            <div>
                <button onClick={isPlaying ? stopChordProgression : playChordProgression}>
                    {isPlaying ? 'Stop' : 'Play'} Progression
                </button>
            </div>
            <div className="visualization">
                <div className="chord-display">
                    Current Chord: {chordProgressions[progression][currentChordIndex]}
                </div>
                {renderPiano()}
            </div>
            <div className="explanation">
                <p>The highlighted keys show the scale that fits best with the current chord.</p>
                <p>Notice how the scale changes as the chords progress, demonstrating the relationship between chords and scales.</p>
            </div>
        </div>
    );
};

export default ChordScaleVisualizer;
