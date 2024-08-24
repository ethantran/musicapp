import React from 'react';

const scaleInfo = {
    chromatic: "The chromatic scale is the master scale, containing all 12 notes. It's the basis for all other scales.",
    minorPentatonic: "The minor pentatonic scale is a five-note scale commonly used in blues and rock music. It creates a moody, soulful sound.",
    majorPentatonic: "The major pentatonic scale is also a five-note scale, but with a brighter, more uplifting sound compared to its minor counterpart.",
    chinesePentatonic: "The Chinese pentatonic scale is used in traditional Chinese folk music, creating a distinctive Eastern sound.",
};

export const InfoPanel = ({ currentScale }) => {
    return (
        <div className="info-panel">
            <h2>{currentScale.charAt(0).toUpperCase() + currentScale.slice(1)} Scale</h2>
            <p>{scaleInfo[currentScale]}</p>
        </div>
    );
};
