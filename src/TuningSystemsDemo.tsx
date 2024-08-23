import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { CircleVisualization } from './CircleVisualization';
import { InteractiveKeyboard } from './InteractiveKeyboard';
import { HistoricalContext } from './HistoricalContext';
import { TuningComparison } from './TuningComparison';
import { TuningSystem, tuningSystems } from './TuningSystems';

function TuningSystemsDemo() {
    const [activeSystem, setActiveSystem] = useState<TuningSystem>(tuningSystems[0]);
    const [comparisonSystem, setComparisonSystem] = useState<TuningSystem | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentNote, setCurrentNote] = useState<number | null>(null);
    const synthRef = useRef<Tone.Synth | null>(null);
    const [audioInitialized, setAudioInitialized] = useState(false);

    useEffect(() => {
        synthRef.current = new Tone.Synth().toDestination();
        return () => {
            if (synthRef.current) {
                synthRef.current.dispose();
            }
        };
    }, []);

    const initializeAudio = async () => {
        await Tone.start();
        setAudioInitialized(true);
    };

    const playNote = async (frequency: number) => {
        if (!audioInitialized) {
            await initializeAudio();
        }
        if (synthRef.current) {
            synthRef.current.triggerAttackRelease(frequency, "8n");
            setCurrentNote(frequency);
            if (window.navigator.vibrate) {
                window.navigator.vibrate(50);
            }
        }
    };

    const playScale = async () => {
        if (!audioInitialized) {
            await initializeAudio();
        }
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

            <button onClick={() => audioInitialized ? setIsPlaying(!isPlaying) : initializeAudio()}>
                {audioInitialized ? (isPlaying ? 'Stop' : 'Play Scale') : 'Initialize Audio'}
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