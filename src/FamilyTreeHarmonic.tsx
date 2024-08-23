import React from 'react';
import * as Tone from 'tone';

const FamilyTreeHarmonic = () => {
    const fundamentalFreq = 440; // A4

    const playNote = (ratio: number) => {
        const freq = fundamentalFreq * ratio;
        const synth = new Tone.Synth().toDestination();
        synth.triggerAttackRelease(freq, "8n");
    };

    const overtones = [
        { name: "Fundamental (Unison)", ratio: 1, color: "red", size: 50 },
        { name: "1st Overtone (Octave)", ratio: 2, color: "orange", size: 40 },
        { name: "2nd Overtone (Perfect Fifth)", ratio: 3, color: "yellow", size: 30 },
        { name: "3rd Overtone (Perfect Fourth)", ratio: 4, color: "green", size: 20 },
        { name: "4th Overtone (Major Third)", ratio: 5, color: "blue", size: 10 }
    ];

    return (
        <div>
            <h2>Harmonic Series: Family Tree</h2>
            <div style={{ position: 'relative', height: '400px', marginTop: '20px' }}>
                {overtones.map((overtone, index) => (
                    <div
                        key={index}
                        onClick={() => playNote(overtone.ratio)}
                        style={{
                            position: 'absolute',
                            left: `${50 + index * 100}px`,
                            bottom: `${50 + index * 50}px`,
                            width: `${overtone.size}px`,
                            height: `${overtone.size}px`,
                            backgroundColor: overtone.color,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'white',
                            fontSize: '12px',
                            textAlign: 'center'
                        }}
                    >
                        {overtone.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FamilyTreeHarmonic;