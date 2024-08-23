import { useState, useEffect } from 'react';
import * as Tone from 'tone';

const NoteCircleWithOctaveControl = () => {
    const notes = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'];
    const [synth, setSynth] = useState(null);
    const [octave, setOctave] = useState(4);

    useEffect(() => {
        const newSynth = new Tone.Synth().toDestination();
        setSynth(newSynth);
    }, []);

    const playNote = (note) => {
        if (synth) {
            synth.triggerAttackRelease(note + octave, '8n');
        }
    };

    const changeOctave = (delta) => {
        setOctave((prev) => prev + delta);
    };

    return (
        <section>
            <h2>Note Circle With Octave Control</h2>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div style={{ position: 'relative', width: '300px', height: '300px' }}>
                    {notes.map((note, index) => {
                        const angle = (index * 30 - 90) * (Math.PI / 180);
                        const x = 150 + 120 * Math.cos(angle);
                        const y = 150 + 120 * Math.sin(angle);
                        return (
                            <button
                                key={note}
                                onClick={() => playNote(note)}
                                style={{
                                    position: 'absolute',
                                    left: `${x}px`,
                                    top: `${y}px`,
                                    transform: 'translate(-50%, -50%)',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                {note}
                            </button>
                        );
                    })}
                </div>
                <div style={{ marginTop: '20px' }}>
                    <button onClick={() => changeOctave(-1)}>Octave Down</button>
                    <span style={{ margin: '0 10px' }}>Current Octave: {octave}</span>
                    <button onClick={() => changeOctave(1)}>Octave Up</button>
                </div>
            </div>
        </section>
    );
};

export default NoteCircleWithOctaveControl