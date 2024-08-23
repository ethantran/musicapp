import React, { useState, useEffect, useRef } from 'react';

interface PitchStandard {
    name: string;
    frequency: number;
    description: string;
}

const pitchStandards: PitchStandard[] = [
    { name: "Baroque Pitch", frequency: 415, description: "Used in the Baroque era (1600-1750), about a semitone lower than modern pitch." },
    { name: "Classical Pitch", frequency: 430, description: "Common in the Classical period (1750-1820), used by Mozart and Beethoven." },
    { name: "Scientific Pitch", frequency: 430.54, description: "Proposed in 1713, where C4 = 256 Hz, favored for its mathematical simplicity." },
    { name: "Verdi Pitch", frequency: 432, description: "Promoted by Giuseppe Verdi in the 19th century, claimed to have a warmer sound." },
    { name: "Modern Standard Pitch", frequency: 440, description: "Adopted as the international standard in 1939, widely used today." },
    { name: "Boston Symphony Pitch", frequency: 441, description: "Used by some American orchestras for a brighter sound." },
    { name: "Berlin Philharmonic Pitch", frequency: 443, description: "Higher pitch used by some European orchestras for brilliance." },
    { name: "New Philharmonic Pitch", frequency: 452, description: "Used in the late 19th century, led to 'pitch inflation'." },
];

const PitchStandardDemo: React.FC = () => {
    const [frequency, setFrequency] = useState<number>(440);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const oscillatorRef = useRef<OscillatorNode | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);

    useEffect(() => {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.connect(audioContextRef.current.destination);
        gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime);

        return () => {
            audioContextRef.current?.close();
        };
    }, []);

    useEffect(() => {
        if (isPlaying && oscillatorRef.current) {
            oscillatorRef.current.frequency.setValueAtTime(frequency, audioContextRef.current!.currentTime);
        }
    }, [frequency, isPlaying]);

    const toggleTone = () => {
        if (!audioContextRef.current) return;

        if (!isPlaying) {
            oscillatorRef.current = audioContextRef.current.createOscillator();
            oscillatorRef.current.type = 'sine';
            oscillatorRef.current.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
            oscillatorRef.current.connect(gainNodeRef.current!);
            oscillatorRef.current.start();
            gainNodeRef.current!.gain.setTargetAtTime(1, audioContextRef.current.currentTime, 0.01);
        } else {
            gainNodeRef.current!.gain.setTargetAtTime(0, audioContextRef.current.currentTime, 0.01);
            setTimeout(() => {
                oscillatorRef.current?.stop();
                oscillatorRef.current?.disconnect();
                oscillatorRef.current = null;
            }, 50);
        }
        setIsPlaying(!isPlaying);
    };

    const handleFrequencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFrequency(Number(event.target.value));
    };

    const selectPitchStandard = (freq: number) => {
        setFrequency(freq);
    };

    return (
        <div className="pitch-standard-demo">
            <h2>Pitch Standard Interactive Demo</h2>
            <div className="frequency-control">
                <label htmlFor="frequency-slider">Frequency: {frequency.toFixed(2)} Hz</label>
                <input
                    type="range"
                    id="frequency-slider"
                    min="415"
                    max="452"
                    step="0.1"
                    value={frequency}
                    onChange={handleFrequencyChange}
                />
            </div>
            <div className="piano-keyboard">
                {/* Add piano keyboard visualization here */}
            </div>
            <button onClick={toggleTone}>
                {isPlaying ? 'Stop' : 'Play'} Tone
            </button>
            <div className="pitch-standards">
                <h3>Historical Pitch Standards:</h3>
                <ul>
                    {pitchStandards.map((standard) => (
                        <li key={standard.name}>
                            <button onClick={() => selectPitchStandard(standard.frequency)}>
                                {standard.name} (A4 = {standard.frequency} Hz)
                            </button>
                            <p>{standard.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PitchStandardDemo;