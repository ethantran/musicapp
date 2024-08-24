import React from 'react';

export const ScaleSelector = ({ currentScale, setCurrentScale }) => {
    return (
        <div className="scale-selector">
            <select value={currentScale} onChange={(e) => setCurrentScale(e.target.value)}>
                <option value="chromatic">Chromatic Scale</option>
                <option value="minorPentatonic">Minor Pentatonic Scale</option>
                <option value="majorPentatonic">Major Pentatonic Scale</option>
                <option value="chinesePentatonic">Chinese Pentatonic Scale</option>
                <option value="majorDiatonic">Major Diatonic Scale</option>
                <option value="minorDiatonic">Minor Diatonic Scale</option>
                <option value="harmonicMinor">Harmonic Minor Scale</option>
                <option value="melodicMinor">Melodic Minor Scale</option>
                <option value="bebop">Bebop Scale</option>
                <option value="syntheticExample">Synthetic Scale Example</option>
            </select>
        </div>
    );
};