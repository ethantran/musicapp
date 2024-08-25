import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

const TwelveTetCalc: React.FC = () => {
    const [referenceFrequency, setReferenceFrequency] = useState(440);
    const [selectedSemitones, setSelectedSemitones] = useState(0);
    const [synth, setSynth] = useState<Tone.Synth | null>(null);

    useEffect(() => {
        const initAudio = async () => {
            await Tone.start();
            setSynth(new Tone.Synth().toDestination());
        };

        const handleFirstInteraction = () => {
            initAudio();
            window.removeEventListener('click', handleFirstInteraction);
        };

        window.addEventListener('click', handleFirstInteraction);

        return () => {
            window.removeEventListener('click', handleFirstInteraction);
        };
    }, []);

    const calculateFrequency = (semitones: number) => {
        const a = Math.pow(2, 1 / 12); // 12th root of 2
        return referenceFrequency * Math.pow(a, semitones);
    };

    const playNote = (frequency: number) => {
        if (synth) {
            synth.triggerAttackRelease(frequency, '0.5');
        }
    };

    const semitoneOptions = Array.from({ length: 25 }, (_, i) => i - 12);

    return (
        <div className="twelve-tet-explorer">
            <h2>12-TET Frequency Explorer</h2>

            <div>
                <label>
                    Reference Frequency (A4):
                    <input
                        type="number"
                        value={referenceFrequency}
                        onChange={(e) => setReferenceFrequency(Number(e.target.value))}
                        min="400"
                        max="480"
                    /> Hz
                </label>
            </div>

            <div>
                <label>
                    Semitones from A4:
                    <select
                        value={selectedSemitones}
                        onChange={(e) => setSelectedSemitones(Number(e.target.value))}
                    >
                        {semitoneOptions.map(n => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                </label>
            </div>

            <div>
                <h3>Calculated Frequency:</h3>
                <p>{calculateFrequency(selectedSemitones).toFixed(2)} Hz</p>
                <button onClick={() => playNote(calculateFrequency(selectedSemitones))}>
                    Play Note
                </button>
            </div>

            <div>
                <h3>Frequency Ratio:</h3>
                <p>{Math.pow(2, selectedSemitones / 12).toFixed(4)}</p>
                <p>This is the {Math.abs(selectedSemitones)}th root of {selectedSemitones >= 0 ? '2' : '1/2'}</p>
            </div>

            <div>
                <h3>Explanation:</h3>
                <p>In 12-TET, each semitone is calculated by multiplying the previous frequency by the 12th root of 2 (≈1.0594630943...).</p>
                <p>The formula used is: f = f0 * (a)^n, where:</p>
                <ul>
                    <li>f is the target frequency</li>
                    <li>f0 is the reference frequency (A4, usually 440 Hz)</li>
                    <li>a is the 12th root of 2</li>
                    <li>n is the number of semitones from the reference note (positive for higher notes, negative for lower notes)</li>
                </ul>
            </div>
        </div>
    );
};

export default TwelveTetCalc;