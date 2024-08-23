import React, { useState } from 'react';
import * as Tone from 'tone';

const GuitarDemo = () => {
    const [pluckingPosition, setPluckingPosition] = useState('middle'); // 'bridge' or 'middle'

    const playNote = (string: number, fret: number) => {
        const baseFreqs = [82.41, 110, 146.83, 196, 246.94, 329.63]; // E2, A2, D3, G3, B3, E4
        const baseFreq = baseFreqs[string];
        const freq = baseFreq * Math.pow(2, fret / 12);
        const synth = new Tone.Synth().toDestination();

        // Simulate different timbres by adjusting the filter
        const filter = new Tone.Filter({
            type: 'lowpass',
            frequency: pluckingPosition === 'bridge' ? 5000 : 500,
            rolloff: -24,
        }).toDestination();

        synth.connect(filter);
        synth.triggerAttackRelease(freq, "8n");
    };

    const strings = Array.from({ length: 6 }, (_, i) => i); // 6 strings
    const frets = Array.from({ length: 12 }, (_, i) => i); // 12 frets

    return (
        <div>
            <h2>Guitar Fretboard Demo</h2>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <svg width="800" height="200">
                    {strings.map((string) => (
                        <line
                            key={string}
                            x1="0"
                            y1={30 + string * 30}
                            x2="800"
                            y2={30 + string * 30}
                            stroke="black"
                            strokeWidth="2"
                        />
                    ))}
                    {frets.map((fret) => (
                        <line
                            key={fret}
                            x1={50 + fret * 60}
                            y1="20"
                            x2={50 + fret * 60}
                            y2="180"
                            stroke="black"
                            strokeWidth="2"
                        />
                    ))}
                    {strings.map((string) =>
                        frets.map((fret) => (
                            <circle
                                key={`${string}-${fret}`}
                                cx={50 + fret * 60}
                                cy={30 + string * 30}
                                r="10"
                                fill="transparent"
                                stroke="black"
                                strokeWidth="1"
                                onClick={() => playNote(string, fret)}
                                style={{ cursor: 'pointer' }}
                            />
                        ))
                    )}
                </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button
                    onClick={() => setPluckingPosition('middle')}
                    style={{
                        backgroundColor: pluckingPosition === 'middle' ? 'blue' : 'black',
                        marginRight: '10px',
                    }}
                >
                    Pluck Middle
                </button>
                <button
                    onClick={() => setPluckingPosition('bridge')}
                    style={{
                        backgroundColor: pluckingPosition === 'bridge' ? 'blue' : 'black',
                    }}
                >
                    Pluck Near Bridge
                </button>
            </div>
        </div>
    );
};

export default GuitarDemo;