import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import { Piano } from './Piano';
import { ScaleVisualizer } from './ScaleVisualizer';
import { ScaleSelector } from './ScaleSelector';
import { InfoPanel } from './InfoPanel';
import './ScaleDemo.css';

const scales = {
    chromatic: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
    minorPentatonic: ['C', 'Eb', 'F', 'G', 'Bb'],
    majorPentatonic: ['C', 'D', 'E', 'G', 'A'],
    chinesePentatonic: ['F', 'G', 'A', 'C', 'D'],
};

const noteToFreq = (note) => {
    const noteMap = {
        'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13, 'Eb': 311.13,
        'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00, 'G#': 415.30,
        'A': 440.00, 'A#': 466.16, 'Bb': 466.16, 'B': 493.88
    };
    return noteMap[note] || 440;
};

function ScaleDemo() {
    const [currentScale, setCurrentScale] = useState('chromatic');
    const [synth, setSynth] = useState(null);

    useEffect(() => {
        const newSynth = new Tone.PolySynth(Tone.Synth).toDestination();
        setSynth(newSynth);
        return () => {
            newSynth.dispose();
        };
    }, []);

    const playNote = (note) => {
        if (synth) {
            const now = Tone.now();
            synth.triggerAttackRelease(noteToFreq(note), '8n', now);
        }
    };

    return (
        <div className="scale-demo">
            <h1 className="title">Interactive Scale Explorer</h1>
            <div className="main-content">
                <div className="left-panel">
                    <ScaleSelector currentScale={currentScale} setCurrentScale={setCurrentScale} />
                    <InfoPanel currentScale={currentScale} />
                </div>
                <div className="right-panel">
                    <ScaleVisualizer scale={scales[currentScale]} playNote={playNote} currentScale={currentScale} />
                    <Piano scale={scales[currentScale]} playNote={playNote} currentScale={currentScale} />
                </div>
            </div>
        </div>
    );
}

export default ScaleDemo;