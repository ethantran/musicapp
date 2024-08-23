import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { CircleVisualization } from './CircleVisualization';
import { InteractiveKeyboard } from './InteractiveKeyboard';
import { HistoricalContext } from './HistoricalContext';
import { SpectrumAnalyzer } from './SpectrumAnalyzer';
import { TuningComparison } from './TuningComparison';
import { TuningSystem, tuningSystems } from './TuningSystems';

function TuningSystemsDemo() {
    const [activeSystem, setActiveSystem] = useState<TuningSystem>(tuningSystems[0]);
    const [comparisonSystem, setComparisonSystem] = useState<TuningSystem | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentNote, setCurrentNote] = useState<number | null>(null);
    const synthRef = useRef<Tone.Synth | null>(null);
    const analyserRef = useRef<Tone.Analyser | null>(null);

    useEffect(() => {
        synthRef.current = new Tone.Synth().toDestination();
        analyserRef.current = new Tone.Analyser('fft', 2048);
        synthRef.current.connect(analyserRef.current);

        return () => {
            if (synthRef.current) {
                synthRef.current.dispose();
            }
            if (analyserRef.current) {
                analyserRef.current.dispose();
            }
        };
    }, []);

    const playNote = async (frequency: number) => {
        await Tone.start();
        if (synthRef.current) {
            synthRef.current.triggerAttackRelease(frequency, "8n");
            setCurrentNote(frequency);
            if (window.navigator.vibrate) {
                window.navigator.vibrate(50);
            }
        }
    };

    const playScale = async () => {
        await Tone.start();
        const now = Tone.now();
        activeSystem.frequencies.forEach((freq, index) => {
            synthRef.current?.triggerAttackRelease(freq, "8n", now + index * 0.5);
        });
    };

    useEffect(() => {
        if (isPlaying) {
            playScale();
        } else {
            Tone.Transport.stop();
        }
    }, [isPlaying, activeSystem]);

    return (
        <div className="tuning-systems-demo">
            <h2>Explore Tuning Systems</h2>

            <div className="tuning-selector">
                {tuningSystems.map(system => (
                    <button
                        key={system.name}
                        onClick={() => setActiveSystem(system)}
                        className={activeSystem.name === system.name ? 'active' : ''}
                    >
                        {system.name}
                    </button>
                ))}
            </div>

            <div className="active-system-info">
                <h2>{activeSystem.name}</h2>
                <p>{activeSystem.description}</p>
                <p><em>Metaphor: {activeSystem.metaphor}</em></p>
            </div>

            <CircleVisualization
                frequencies={activeSystem.frequencies}
                onNotePlay={playNote}
                currentNote={currentNote}
            />

            <InteractiveKeyboard
                frequencies={activeSystem.frequencies}
                onNotePlay={playNote}
                currentNote={currentNote}
            />

            <SpectrumAnalyzer analyser={analyserRef.current} />

            <button onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? 'Stop' : 'Play Scale'}
            </button>

            <TuningComparison
                activeSystem={activeSystem}
                comparisonSystem={comparisonSystem}
                setComparisonSystem={setComparisonSystem}
                playNote={playNote}
            />

            <HistoricalContext
                context={activeSystem.historicalContext}
                musicExample={activeSystem.musicExample}
            />
        </div>
    );
}

export default TuningSystemsDemo;