import React, { useState } from 'react';
import * as Tone from 'tone';
import './IntervalExplorer.css';

interface Interval {
    name: string;
    semitones: number;
    ratio: number;
    category: 'Perfect' | 'Major' | 'Minor' | 'Augmented' | 'Diminished';
    isDiatonic: boolean;
    metaphor: string;
    visualRepresentation: string;
}

const intervals: Interval[] = [
    { name: "Perfect Unison", semitones: 0, ratio: 1, category: 'Perfect', isDiatonic: true, metaphor: "Two voices in perfect harmony", visualRepresentation: "🎵" },
    { name: "Minor 2nd", semitones: 1, ratio: 16 / 15, category: 'Minor', isDiatonic: false, metaphor: "A slight discomfort, like a pebble in your shoe", visualRepresentation: "🎵↗️" },
    { name: "Major 2nd", semitones: 2, ratio: 9 / 8, category: 'Major', isDiatonic: true, metaphor: "A step up a staircase", visualRepresentation: "🎵↗️↗️" },
    { name: "Minor 3rd", semitones: 3, ratio: 6 / 5, category: 'Minor', isDiatonic: false, metaphor: "A gentle sadness, like a rainy day", visualRepresentation: "🎵↗️↗️↗️" },
    { name: "Major 3rd", semitones: 4, ratio: 5 / 4, category: 'Major', isDiatonic: true, metaphor: "A bright smile, like sunshine", visualRepresentation: "🎵↗️↗️↗️↗️" },
    { name: "Perfect 4th", semitones: 5, ratio: 4 / 3, category: 'Perfect', isDiatonic: true, metaphor: "A question seeking an answer", visualRepresentation: "🎵↗️↗️↗️↗️↗️" },
    { name: "Augmented 4th / Diminished 5th", semitones: 6, ratio: Math.sqrt(2), category: 'Augmented', isDiatonic: false, metaphor: "The edge of a cliff, tension and uncertainty", visualRepresentation: "🎵↗️↗️↗️↗️↗️↗️" },
    { name: "Perfect 5th", semitones: 7, ratio: 3 / 2, category: 'Perfect', isDiatonic: true, metaphor: "A strong foundation, like pillars of a building", visualRepresentation: "🎵↗️↗️↗️↗️↗️↗️↗️" },
    { name: "Minor 6th", semitones: 8, ratio: 8 / 5, category: 'Minor', isDiatonic: false, metaphor: "A bittersweet memory", visualRepresentation: "🎵↗️↗️↗️↗️↗️↗️↗️↗️" },
    { name: "Major 6th", semitones: 9, ratio: 5 / 3, category: 'Major', isDiatonic: true, metaphor: "A joyful leap", visualRepresentation: "🎵↗️↗️↗️↗️↗️↗️↗️↗️↗️" },
    { name: "Minor 7th", semitones: 10, ratio: 16 / 9, category: 'Minor', isDiatonic: false, metaphor: "A longing for resolution", visualRepresentation: "🎵↗️↗️↗️↗️↗️↗️↗️↗️↗️↗️" },
    { name: "Major 7th", semitones: 11, ratio: 15 / 8, category: 'Major', isDiatonic: true, metaphor: "Anticipation, almost home", visualRepresentation: "🎵↗️↗️↗️↗️↗️↗️↗️↗️↗️↗️↗️" },
    { name: "Perfect Octave", semitones: 12, ratio: 2, category: 'Perfect', isDiatonic: true, metaphor: "A full circle, back where we started but higher", visualRepresentation: "🎵↗️↗️↗️↗️↗️↗️↗️↗️↗️↗️↗️↗️" },
    // Adding Augmented and Diminished intervals
    { name: "Diminished 2nd", semitones: 0, ratio: 1, category: 'Diminished', isDiatonic: false, metaphor: "A whisper so close it's almost inaudible", visualRepresentation: "🎵⤵️" },
    { name: "Augmented Unison", semitones: 1, ratio: 16 / 15, category: 'Augmented', isDiatonic: false, metaphor: "A single step that feels like a leap", visualRepresentation: "🎵⤴️" },
    { name: "Diminished 3rd", semitones: 2, ratio: 9 / 8, category: 'Diminished', isDiatonic: false, metaphor: "A shadow of sadness", visualRepresentation: "🎵↗️⤵️" },
    { name: "Augmented 2nd", semitones: 3, ratio: 6 / 5, category: 'Augmented', isDiatonic: false, metaphor: "An unexpected stretch", visualRepresentation: "🎵↗️⤴️" },
    { name: "Diminished 4th", semitones: 4, ratio: 5 / 4, category: 'Diminished', isDiatonic: false, metaphor: "A question left hanging", visualRepresentation: "🎵↗️↗️⤵️" },
    { name: "Augmented 3rd", semitones: 5, ratio: 4 / 3, category: 'Augmented', isDiatonic: false, metaphor: "A smile that's a bit too wide", visualRepresentation: "🎵↗️↗️⤴️" },
    { name: "Diminished 6th", semitones: 7, ratio: 3 / 2, category: 'Diminished', isDiatonic: false, metaphor: "A bridge that's just a bit too short", visualRepresentation: "🎵↗️↗️↗️↗️⤵️" },
    { name: "Augmented 5th", semitones: 8, ratio: 8 / 5, category: 'Augmented', isDiatonic: false, metaphor: "A pillar stretching beyond its limits", visualRepresentation: "🎵↗️↗️↗️↗️⤴️" },
    { name: "Diminished 7th", semitones: 9, ratio: 5 / 3, category: 'Diminished', isDiatonic: false, metaphor: "A spiral staircase that doesn't quite reach the top", visualRepresentation: "🎵↗️↗️↗️↗️↗️⤵️" },
    { name: "Augmented 6th", semitones: 10, ratio: 16 / 9, category: 'Augmented', isDiatonic: false, metaphor: "A leap that overshoots its mark", visualRepresentation: "🎵↗️↗️↗️↗️↗️⤴️" },
];

export const IntervalExplorer: React.FC = () => {
    const [selectedInterval, setSelectedInterval] = useState<Interval | null>(null);
    const [baseFrequency] = useState(440); // A4
    const synth = new Tone.Synth().toDestination();

    const playInterval = (interval: Interval) => {
        const now = Tone.now();
        synth.triggerAttackRelease(baseFrequency, "4n", now);
        synth.triggerAttackRelease(baseFrequency * interval.ratio, "4n", now + 0.5);
    };

    return (
        <div className="interval-explorer">
            <h2>Interval Explorer: Perfect, Major, Minor, Augmented, and Diminished</h2>
            <div className="content-wrapper">
                <div className="interval-circle-container">
                    <div className="interval-circle">
                        {intervals.map((interval, index) => (
                            <button
                                key={interval.name}
                                className={`interval-button ${interval.category.toLowerCase()} ${interval.isDiatonic ? 'diatonic' : 'chromatic'}`}
                                style={{
                                    transform: `rotate(${index * (360 / intervals.length)}deg) translate(250px) rotate(-${index * (360 / intervals.length)}deg)`,
                                }}
                                onClick={() => {
                                    setSelectedInterval(interval);
                                    playInterval(interval);
                                }}
                            >
                                {interval.name}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="info-panel">
                    {selectedInterval && (
                        <div className="interval-info">
                            <h3>{selectedInterval.name}</h3>
                            <p>Category: {selectedInterval.category}</p>
                            <p>Semitones: {selectedInterval.semitones}</p>
                            <p>Ratio: {selectedInterval.ratio.toFixed(3)}</p>
                            <p>{selectedInterval.isDiatonic ? 'Diatonic' : 'Chromatic'}</p>
                            <p>Metaphor: {selectedInterval.metaphor}</p>
                            <p>Visual: {selectedInterval.visualRepresentation}</p>
                        </div>
                    )}
                    <div className="explanation">
                        <h3>Understanding Interval Categories</h3>
                        <p>Perfect, Major, and Minor intervals form the foundation of Western music.</p>
                        <p>Augmented intervals expand Major or Perfect intervals by one semitone, creating tension.</p>
                        <p>Diminished intervals narrow Minor or Perfect intervals by one semitone, adding instability.</p>
                        <p>Augmented and Diminished intervals are like the spices in music - used sparingly, they add flavor and intrigue.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};