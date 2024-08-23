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
    const [highlightedKeys, setHighlightedKeys] = useState<number[]>([]);
    const [isPlayingSequence, setIsPlayingSequence] = useState(false);
    const [currentNote, setCurrentNote] = useState<string | null>(null);
    const [frequencyRatio, setFrequencyRatio] = useState<number | null>(null);
    const [microtonalAdjustment, setMicrotonalAdjustment] = useState(0);
    const [baseFrequency, setBaseFrequency] = useState<number | null>(null);
    const [isNoteActive, setIsNoteActive] = useState(false);

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

    const calculateFrequencyRatio = (frequency: number) => {
        return frequency / referencePitch;
    };

    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    const highlightWholeSteps = (midiNumber: number) => {
        const baseNote = midiNumber % 12;
        const wholeSteps = [2, 2, 1, 2, 2, 2, 1]; // Whole and half step pattern
        let highlighted = [midiNumber];
        let currentNote = baseNote;

        for (let i = 0; i < 7; i++) {
            currentNote = (currentNote + wholeSteps[i]) % 12;
            highlighted.push(midiNumber - baseNote + currentNote);
        }

        setHighlightedKeys(highlighted);
    };

    const renderNoteLabel = ({ midiNumber, isActive, isAccidental }: any) => {
        const noteName = noteNames[midiNumber % 12];
        const isHighlighted = highlightedKeys.includes(midiNumber);
        const style: React.CSSProperties = {
            color: isActive ? 'red' : isHighlighted ? 'blue' : isAccidental ? 'white' : 'black',
            fontSize: '12px',
            fontWeight: isHighlighted ? 'bold' : 'normal',
        };
        return <div style={style}>{noteName}</div>;
    };

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

    const calculateAdjustedFrequency = (baseFreq: number, cents: number) => {
        return baseFreq * Math.pow(2, cents / 1200);
    };

    const playNote = (midiNumber: number) => {
        const freq = calculateFrequency(midiNumber);
        setBaseFrequency(freq);
        const adjustedFreq = calculateAdjustedFrequency(freq, microtonalAdjustment);
        setCurrentFrequency(adjustedFreq);
        setCurrentNote(noteNames[midiNumber % 12]);
        setFrequencyRatio(calculateFrequencyRatio(adjustedFreq));
        if (synth) {
            synth.triggerAttack(adjustedFreq);
            setIsNoteActive(true);
        }
        highlightWholeSteps(midiNumber);
    };

    const stopNote = () => {
        setCurrentFrequency(null);
        setCurrentNote(null);
        setFrequencyRatio(null);
        setIsNoteActive(false);
        if (synth) {
            synth.triggerRelease();
        }
    };

    const playAllTones = async () => {
        setIsPlayingSequence(true);
        const baseNote = MidiNumbers.fromNote('C4');
        for (let i = 0; i < 12; i++) {
            playNote(baseNote + i);
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms between notes
        }
        setIsPlayingSequence(false);
    };

    const formatRatio = (ratio: number) => {
        return ratio.toFixed(3);
    };

    const adjustMicrotone = (cents: number) => {
        setMicrotonalAdjustment(cents);
        if (baseFrequency && isNoteActive) {
            const adjustedFreq = calculateAdjustedFrequency(baseFrequency, cents);
            setCurrentFrequency(adjustedFreq);
            setFrequencyRatio(calculateFrequencyRatio(adjustedFreq));
            if (synth) {
                synth.frequency.setValueAtTime(adjustedFreq, Tone.now());
            }
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
                        <p>Current Note: {currentNote}</p>
                        <p>Current Frequency: {currentFrequency.toFixed(2)} Hz</p>
                        {frequencyRatio && (
                            <p>
                                Frequency Ratio to A4: {formatRatio(frequencyRatio)}
                                {frequencyRatio !== 1 && ` (${formatRatio(1 / frequencyRatio)})`}
                            </p>
                        )}
                        {showCents && (
                            <p>
                                Cents from A4: {calculateCents(referencePitch, currentFrequency).toFixed(2)}
                            </p>
                        )}
                        <p>Microtonal Adjustment: {microtonalAdjustment} cents</p>
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
                    renderNoteLabel={renderNoteLabel}
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
                <button
                    onClick={playAllTones}
                    disabled={isPlayingSequence}
                >
                    {isPlayingSequence ? 'Playing...' : 'Play All 12 Tones'}
                </button>
                <div className="microtone-control">
                    <label htmlFor="microtone-slider">Microtone Adjustment (cents):</label>
                    <input
                        id="microtone-slider"
                        type="range"
                        min="-50"
                        max="50"
                        value={microtonalAdjustment}
                        onChange={(e) => adjustMicrotone(Number(e.target.value))}
                    />
                    <span>{microtonalAdjustment}</span>
                </div>
            </div>
            <div className="info">
                <p>One octave consists of 12 half-steps (semitones)</p>
                <p>There are 100 cents in one semitone</p>
                <p>The frequency doubles for notes an octave apart</p>
                <p>Blue notes show whole steps from the played note (highlighted in red)</p>
                <p>Click "Play All 12 Tones" to hear the equal temperament division of the octave</p>
                <p>The frequency ratio shows the mathematical relationship between the current note and A4</p>
                <p>For ratios other than 1, the inverse ratio is shown in parentheses</p>
                <p>Use the microtone slider to adjust the pitch up to 50 cents sharp or flat</p>
                <p>100 cents equal one semitone in 12-TET</p>
            </div>
        </div>
    );
};

export default TwelveTETDemo;