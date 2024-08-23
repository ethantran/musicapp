import React, { useState, useEffect } from 'react';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import * as Tone from 'tone';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TwelveTETDemo: React.FC = () => {
    const [currentFrequency, setCurrentFrequency] = useState<number | null>(null);
    const [referencePitch, setReferencePitch] = useState(440);
    const [showCents, setShowCents] = useState(false);
    const [synth, setSynth] = useState<Tone.Synth | null>(null);

    useEffect(() => {
        // Initialize the synth
        const newSynth = new Tone.Synth().toDestination();
        setSynth(newSynth);

        // Clean up function
        return () => {
            newSynth.dispose();
        };
    }, []);

    const calculateFrequency = (midiNumber: number) => {
        const a4 = referencePitch;
        return a4 * Math.pow(2, (midiNumber - 69) / 12);
    };

    const calculateCents = (freq1: number, freq2: number) => {
        return 1200 * Math.log2(freq2 / freq1);
    };

    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const frequencies = noteNames.map((_, index) => calculateFrequency(60 + index));

    const chartData = {
        labels: noteNames,
        datasets: [
            {
                label: 'Frequency (Hz)',
                data: frequencies,
                backgroundColor: frequencies.map((freq) =>
                    freq === currentFrequency ? 'rgba(255, 99, 132, 0.8)' : 'rgba(54, 162, 235, 0.5)'
                ),
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Frequency (Hz)',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Notes',
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: '12-TET Frequency Spectrum',
            },
        },
    };

    const playNote = (midiNumber: number) => {
        const freq = calculateFrequency(midiNumber);
        setCurrentFrequency(freq);
        if (synth) {
            synth.triggerAttack(freq);
        }
    };

    const stopNote = () => {
        setCurrentFrequency(null);
        if (synth) {
            synth.triggerRelease();
        }
    };

    // Piano configuration
    const firstNote = MidiNumbers.fromNote('C4');
    const lastNote = MidiNumbers.fromNote('B5');
    const keyboardShortcuts = KeyboardShortcuts.create({
        firstNote: firstNote,
        lastNote: lastNote,
        keyboardConfig: KeyboardShortcuts.HOME_ROW,
    });

    return (
        <div className="twelve-tet-demo">
            <h2>12-Tone Equal Temperament Demo</h2>
            <div className="frequency-display" style={{ height: '24px', marginBottom: '10px' }}>
                {currentFrequency ? (
                    <>
                        <p>Current Frequency: {currentFrequency.toFixed(2)} Hz</p>
                        {showCents && (
                            <p>
                                Cents from A4: {calculateCents(referencePitch, currentFrequency).toFixed(2)}
                            </p>
                        )}
                    </>
                ) : (
                    <p>&nbsp;</p>
                )}
            </div>
            <div style={{ height: '300px', width: '100%', marginBottom: '20px' }}>
                <Bar data={chartData} options={chartOptions} />
            </div>
            <div style={{ height: '200px', marginBottom: '20px' }}>
                <Piano
                    noteRange={{ first: firstNote, last: lastNote }}
                    playNote={playNote}
                    stopNote={stopNote}
                    width={1000}
                    keyboardShortcuts={keyboardShortcuts}
                />
            </div>
            <div className="controls">
                <label>
                    Reference A4 (Hz):
                    <input
                        type="number"
                        value={referencePitch}
                        onChange={(e) => setReferencePitch(Number(e.target.value))}
                        min="400"
                        max="480"
                        step="1"
                    />
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={showCents}
                        onChange={(e) => setShowCents(e.target.checked)}
                    />
                    Show cents
                </label>
            </div>
            <div className="info">
                <p>One octave consists of 12 half-steps (semitones)</p>
                <p>There are 100 cents in one semitone</p>
                <p>The frequency doubles for notes an octave apart</p>
            </div>
        </div>
    );
};

export default TwelveTETDemo;