import React from 'react';

export const ScaleSelector = ({ currentScale, setCurrentScale }) => {
    return (
        <div className="scale-selector">
            <select value={currentScale} onChange={(e) => setCurrentScale(e.target.value)}>
                <option value="chromatic">Chromatic Scale</option>
                <option value="minorPentatonic">Minor Pentatonic Scale</option>
                <option value="majorPentatonic">Major Pentatonic Scale</option>
                <option value="chinesePentatonic">Chinese Pentatonic Scale</option>
            </select>
        </div>
    );
};