import React from 'react';
import { TuningSystem, tuningSystems } from './TuningSystems';

interface Props {
    activeSystem: TuningSystem;
    comparisonSystem: TuningSystem | null;
    setComparisonSystem: (system: TuningSystem | null) => void;
    playNote: (frequency: number) => void;
}

export const TuningComparison: React.FC<Props> = ({
    activeSystem,
    comparisonSystem,
    setComparisonSystem,
    playNote
}) => {
    return (
        <div className="tuning-comparison">
            <h2>Compare Tuning Systems</h2>
            <select
                value={comparisonSystem?.name || ''}
                onChange={(e) => {
                    const selected = tuningSystems.find(s => s.name === e.target.value);
                    setComparisonSystem(selected || null);
                }}
            >
                <option value="">Select a system to compare</option>
                {tuningSystems.filter(s => s.name !== activeSystem.name).map(system => (
                    <option key={system.name} value={system.name}>{system.name}</option>
                ))}
            </select>
            {comparisonSystem && (
                <div className="comparison-notes">
                    {activeSystem.frequencies.map((freq, index) => (
                        <div key={index} className="note-comparison">
                            <button onClick={() => playNote(freq)}>
                                {activeSystem.name}: {freq.toFixed(2)} Hz
                            </button>
                            <button onClick={() => playNote(comparisonSystem.frequencies[index])}>
                                {comparisonSystem.name}: {comparisonSystem.frequencies[index].toFixed(2)} Hz
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
