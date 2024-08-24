import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import './ModePlayground.css';

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const scaleTypes = {
    major: ['R', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'],
    minor: ['R', 'M2', 'm3', 'P4', 'P5', 'm6', 'm7'],
    pentatonic: ['R', 'M2', 'M3', 'P5', 'M6'],
};

const modeNames = {
    major: ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'],
    minor: ['Aeolian', 'Locrian', 'Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian'],
    pentatonic: ['Major Pentatonic', 'Suspended Pentatonic', 'Man Gong', 'Ritusen', 'Minor Pentatonic'],
};

const ModePlayground = () => {
    const [rootNote, setRootNote] = useState('C');
    const [scaleType, setScaleType] = useState('major');
    const [currentMode, setCurrentMode] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [synth] = useState(new Tone.PolySynth(Tone.Synth).toDestination());
    const [chordPad] = useState(new Tone.PolySynth(Tone.Synth).toDestination());

    useEffect(() => {
        return () => {
            Tone.Transport.stop();
            Tone.Transport.cancel();
        };
    }, []);

    const getScaleNotes = (root, type, mode) => {
        const fullScale = notes.concat(notes);
        const startIndex = fullScale.indexOf(root);
        const scaleIntervals = scaleTypes[type];
        let scale = [root];
        let currentIndex = startIndex;

        for (let i = 0; i < scaleIntervals.length - 1; i++) {
            const interval = scaleIntervals[(i + mode) % scaleIntervals.length];
            const semitones = getIntervalSemitones(interval);
            currentIndex = (currentIndex + semitones) % 12;
            scale.push(fullScale[currentIndex]);
        }

        console.log('Generated scale:', scale);
        return scale;
    };

    const getIntervalSemitones = (interval) => {
        const intervalMap = { 'R': 0, 'M2': 2, 'm3': 3, 'M3': 4, 'P4': 5, 'P5': 7, 'm6': 8, 'M6': 9, 'm7': 10, 'M7': 11 };
        return intervalMap[interval];
    };

    const currentScale = getScaleNotes(rootNote, scaleType, currentMode);

    const playScale = () => {
        const now = Tone.now();
        currentScale.forEach((note, index) => {
            synth.triggerAttackRelease(`${note}4`, '8n', now + index * 0.25);
        });
    };

    const playChord = () => {
        const chordNotes = [currentScale[0], currentScale[2], currentScale[4]].filter(note => note);
        console.log('Playing chord:', chordNotes);
        if (chordNotes.length > 0) {
            try {
                // Ensure Tone.js is ready
                Tone.start().then(() => {
                    chordPad.triggerAttackRelease(chordNotes.map(note => `${note}4`), '2n');
                    console.log('Chord played successfully');
                });
            } catch (error) {
                console.error('Error playing chord:', error);
            }
        } else {
            console.warn('No valid chord notes to play');
        }
    };

    const startBackingTrack = () => {
        setIsPlaying(true);
        Tone.Transport.bpm.value = 80;
        Tone.Transport.scheduleRepeat((time) => {
            console.log('Scheduled chord at time:', time);
            playChord();
        }, '2n');
        Tone.start().then(() => {
            Tone.Transport.start();
            console.log('Backing track started');
        });
    };

    const stopBackingTrack = () => {
        setIsPlaying(false);
        Tone.Transport.stop();
        Tone.Transport.cancel();
        console.log('Backing track stopped');
    };

    useEffect(() => {
        const newScale = getScaleNotes(rootNote, scaleType, currentMode);
        console.log('Current scale updated:', newScale);
    }, [rootNote, scaleType, currentMode]);

    const handleKeyPress = (note) => {
        if (note) {
            synth.triggerAttackRelease(`${note}4`, '8n');
        }
    };

    const handleKeyRelease = () => {
        synth.releaseAll();
    };

    return (
        <div className="mode-playground">
            <h3>Mode Playground</h3>
            <div className="controls">
                <div>
                    <label>Root Note: </label>
                    <select value={rootNote} onChange={(e) => setRootNote(e.target.value)}>
                        {notes.map(note => (
                            <option key={note} value={note}>{note}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Scale Type: </label>
                    <select value={scaleType} onChange={(e) => setScaleType(e.target.value)}>
                        {Object.keys(scaleTypes).map(type => (
                            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Mode: </label>
                    <select value={currentMode} onChange={(e) => setCurrentMode(Number(e.target.value))}>
                        {modeNames[scaleType].map((mode, index) => (
                            <option key={index} value={index}>{mode}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="actions">
                <button onClick={playScale}>Play Scale</button>
                <button onClick={() => {
                    console.log('Play Chord button clicked');
                    playChord();
                }}>Play Chord</button>
                <button onClick={isPlaying ? stopBackingTrack : startBackingTrack}>
                    {isPlaying ? 'Stop' : 'Start'} Backing Track
                </button>
            </div>
            <div className="scale-display">
                <h4>Current Scale: {currentScale.join(' - ')}</h4>
            </div>
            <div className="improvisation-keyboard">
                {currentScale.map((note, index) => (
                    <button
                        key={index}
                        onMouseDown={() => handleKeyPress(note)}
                        onMouseUp={handleKeyRelease}
                        onMouseLeave={handleKeyRelease}
                    >
                        {note}
                    </button>
                ))}
            </div>
            <div className="explanation">
                <p>This is the {modeNames[scaleType][currentMode]} mode of the {scaleType} scale.</p>
                <p>Try improvising over the backing track using the highlighted scale notes!</p>
            </div>
        </div>
    );
};

export default ModePlayground;