import React, { useState } from 'react';
import * as Tone from 'tone';

const JustIntonationChoir = () => {
    const fundamentalFreq = 440; // A4
    const [activeSingers, setActiveSingers] = useState<number[]>([]);

    const playNote = (ratio: number, index: number, duration: string = "8n") => {
        const freq = fundamentalFreq * ratio;
        const synth = new Tone.FMSynth({
            harmonicity: 3,
            modulationIndex: 10,
            oscillator: { type: 'sine' },
            envelope: { attack: 0.1, decay: 0.2, sustain: 0.9, release: 0.3 },
            modulation: { type: 'square' },
            modulationEnvelope: { attack: 0.2, decay: 0.2, sustain: 0.9, release: 0.3 }
        }).toDestination();
        synth.triggerAttackRelease(freq, duration);
        setActiveSingers([index]);
        setTimeout(() => setActiveSingers([]), Tone.Time(duration).toMilliseconds());
    };

    const playChord = (ratios: number[], duration: string = "1n") => {
        const synth = new Tone.PolySynth(Tone.FMSynth, {
            harmonicity: 3,
            modulationIndex: 10,
            oscillator: { type: 'sine' },
            envelope: { attack: 0.1, decay: 0.2, sustain: 0.9, release: 0.3 },
            modulation: { type: 'square' },
            modulationEnvelope: { attack: 0.2, decay: 0.2, sustain: 0.9, release: 0.3 }
        }).toDestination();
        const freqs = ratios.map(ratio => fundamentalFreq * ratio);
        synth.triggerAttackRelease(freqs, duration);
        const activeIndices = ratios.map(ratio => singers.findIndex(singer => singer.ratio === ratio));
        setActiveSingers(activeIndices);
        setTimeout(() => setActiveSingers([]), Tone.Time(duration).toMilliseconds());
    };

    const singers = [
        { name: "Fundamental (Unison)", ratio: 1, color: "red", size: 50 },
        { name: "Major Second", ratio: 9 / 8, color: "orange", size: 45 },
        { name: "Major Third", ratio: 5 / 4, color: "yellow", size: 40 },
        { name: "Perfect Fourth", ratio: 4 / 3, color: "green", size: 35 },
        { name: "Perfect Fifth", ratio: 3 / 2, color: "blue", size: 30 },
        { name: "Major Sixth", ratio: 5 / 3, color: "indigo", size: 25 },
        { name: "Major Seventh", ratio: 15 / 8, color: "violet", size: 20 }
    ];

    const tunes = [
        { name: "Major Chord", ratios: [1, 5 / 4, 3 / 2] },
        { name: "Perfect Fifth", ratios: [1, 3 / 2] },
        { name: "Major Scale", ratios: [1, 9 / 8, 5 / 4, 4 / 3, 3 / 2, 5 / 3, 15 / 8, 2] },
        { name: "Minor Chord", ratios: [1, 6 / 5, 3 / 2] },
        { name: "Diminished Chord", ratios: [1, 6 / 5, 4 / 3] },
        { name: "Augmented Chord", ratios: [1, 5 / 4, 8 / 5] },
        { name: "Dominant Seventh", ratios: [1, 5 / 4, 3 / 2, 7 / 4] },
        { name: "Minor Seventh", ratios: [1, 6 / 5, 3 / 2, 9 / 5] },
        { name: "Minor Scale", ratios: [1, 9 / 8, 6 / 5, 4 / 3, 3 / 2, 8 / 5, 9 / 5, 2] },
        { name: "Harmonic Minor Scale", ratios: [1, 9 / 8, 6 / 5, 4 / 3, 3 / 2, 8 / 5, 15 / 8, 2] },
        { name: "Melodic Minor Scale", ratios: [1, 9 / 8, 6 / 5, 4 / 3, 3 / 2, 5 / 3, 15 / 8, 2] },
        { name: "Dorian Mode", ratios: [1, 9 / 8, 6 / 5, 4 / 3, 3 / 2, 5 / 3, 9 / 5, 2] },
        { name: "Phrygian Mode", ratios: [1, 16 / 15, 6 / 5, 4 / 3, 3 / 2, 8 / 5, 9 / 5, 2] },
        { name: "Lydian Mode", ratios: [1, 9 / 8, 5 / 4, 45 / 32, 3 / 2, 5 / 3, 15 / 8, 2] },
        { name: "Mixolydian Mode", ratios: [1, 9 / 8, 5 / 4, 4 / 3, 3 / 2, 5 / 3, 9 / 5, 2] },
        { name: "Aeolian Mode", ratios: [1, 9 / 8, 6 / 5, 4 / 3, 3 / 2, 8 / 5, 9 / 5, 2] },
        { name: "Locrian Mode", ratios: [1, 16 / 15, 6 / 5, 4 / 3, 64 / 45, 8 / 5, 9 / 5, 2] },
        { name: "Major Seventh Chord", ratios: [1, 5 / 4, 3 / 2, 15 / 8] },
        { name: "Minor Seventh Chord", ratios: [1, 6 / 5, 3 / 2, 9 / 5] },
        { name: "Suspended Fourth Chord", ratios: [1, 4 / 3, 3 / 2] },
        { name: "Suspended Second Chord", ratios: [1, 9 / 8, 3 / 2] },
        { name: "Sixth Chord", ratios: [1, 5 / 4, 3 / 2, 5 / 3] },
        { name: "Ninth Chord", ratios: [1, 9 / 8, 5 / 4, 3 / 2, 9 / 4] }
    ];

    return (
        <div>
            <h2>Just Intonation Choir</h2>
            <div style={{ position: 'relative', height: '400px', marginTop: '20px' }}>
                {singers.map((singer, index) => (
                    <div
                        key={index}
                        onClick={() => playNote(singer.ratio, index)}
                        style={{
                            position: 'absolute',
                            left: `${50 + index * 100}px`,
                            bottom: '50px',
                            width: `${singer.size}px`,
                            height: `${singer.size}px`,
                            backgroundColor: singer.color,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'white',
                            fontSize: '12px',
                            textAlign: 'center',
                            border: activeSingers.includes(index) ? '3px solid white' : 'none'
                        }}
                    >
                        {singer.name}
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
                {tunes.map((tune, index) => (
                    <button
                        key={index}
                        onClick={() => playChord(tune.ratios)}
                        style={{ margin: '10px' }}
                    >
                        {tune.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default JustIntonationChoir;