import React from 'react';

const scaleInfo = {
    chromatic: {
        description: "The chromatic scale is the master scale, containing all 12 notes. It's the basis for all other scales.",
        mood: "Neutral",
        usage: "Used in atonal music and as a basis for other scales."
    },
    minorPentatonic: {
        description: "A five-note scale commonly used in blues and rock music.",
        mood: "Moody, soulful",
        usage: "Blues, rock, and some forms of jazz."
    },
    majorPentatonic: {
        description: "A five-note scale with a brighter sound compared to its minor counterpart.",
        mood: "Bright, uplifting",
        usage: "Folk music, some pop and rock."
    },
    chinesePentatonic: {
        description: "A five-note scale used in traditional Chinese folk music.",
        mood: "Exotic, ethereal",
        usage: "Traditional Chinese music, some contemporary fusion."
    },
    majorDiatonic: {
        description: "A seven-note scale, also known as the major scale (do-re-mi...).",
        mood: "Happy, bright, and lively",
        usage: "Most pop music, classical music, and many other genres."
    },
    minorDiatonic: {
        description: "A seven-note scale, also known as the natural minor scale.",
        mood: "Sad, dark, and thoughtful",
        usage: "Blues, many forms of rock, and emotional ballads."
    },
    harmonicMinor: {
        description: "A seven-note scale that raises the 7th note of the natural minor scale.",
        mood: "Exotic, mysterious",
        usage: "Classical music, neo-classical, advanced rock, and jazz."
    },
    melodicMinor: {
        description: "A seven-note scale that raises both the 6th and 7th notes of the natural minor scale when ascending.",
        mood: "Smooth, jazzy",
        usage: "Jazz, fusion, and some classical music."
    },
    bebop: {
        description: "An eight-note scale that adds a chromatic passing tone to a major scale.",
        mood: "Complex, jazzy",
        usage: "Jazz, especially bebop style."
    },
    syntheticExample: {
        description: "An example of a synthetic scale created by altering a major scale.",
        mood: "Unique, experimental",
        usage: "Contemporary classical, jazz, and experimental music."
    }
};

export const InfoPanel = ({ currentScale }) => {
    const info = scaleInfo[currentScale];

    return (
        <div className="info-panel">
            <h2>{currentScale.charAt(0).toUpperCase() + currentScale.slice(1)} Scale</h2>
            <p>{info.description}</p>
            <p><strong>Mood:</strong> {info.mood}</p>
            <p><strong>Common Usage:</strong> {info.usage}</p>
            {(currentScale === 'majorDiatonic' || currentScale === 'minorDiatonic') && (
                <p><strong>Note:</strong> This is a diatonic scale, which means it follows a specific pattern of whole and half steps.</p>
            )}
        </div>
    );
};