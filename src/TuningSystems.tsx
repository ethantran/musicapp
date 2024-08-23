export interface TuningSystem {
    name: string;
    description: string;
    metaphor: string;
    frequencies: number[];
    historicalContext: string;
    musicExample: string;
}

export const tuningSystems: TuningSystem[] = [
    {
        name: "Pythagorean",
        description: "Based on perfect fifths, creating pure intervals but with a 'wolf tone'.",
        metaphor: "A spiral staircase, always climbing but never quite reaching the top",
        frequencies: [
            261.63, 294.33, 330.75, 349.23, 392.44, 441.00, 495.00,
            521.48, 588.67, 661.50, 698.46, 784.88
        ],
        historicalContext: "Ancient Greek tuning system, used in medieval music.",
        musicExample: "Gregorian chants",
    },
    {
        name: "Just Intonation",
        description: "Based on simple ratios, creating pure intervals but limited versatility.",
        metaphor: "A family portrait where everyone fits perfectly",
        frequencies: [
            261.63, 294.33, 327.03, 348.84, 392.44, 436.05, 490.55,
            523.25, 588.67, 654.06, 697.68, 784.88
        ],
        historicalContext: "Used in ancient Greek and Indian classical music.",
        musicExample: "Indian ragas",
    },
    {
        name: "Meantone",
        description: "A compromise between Pythagorean and Just Intonation, balancing purity and versatility.",
        metaphor: "A compromise at a dinner party",
        frequencies: [
            261.63, 294.33, 327.03, 355.21, 392.44, 435.45, 490.55,
            523.25, 588.67, 654.06, 710.42, 784.88
        ],
        historicalContext: "Used in Western classical music from 16th to 18th centuries.",
        musicExample: "Bach's fugues",
    },
    {
        name: "Well Temperament",
        description: "A diverse and expressive temperament, with unique characters for each key.",
        metaphor: "A diverse community",
        frequencies: [
            261.63, 293.33, 328.89, 349.23, 392.44, 440.00, 493.33,
            523.25, 586.67, 657.79, 698.46, 784.88
        ],
        historicalContext: "Used in Western classical music from 18th to 19th centuries.",
        musicExample: "Mozart's piano sonatas",
    },
    {
        name: "Equal Temperament",
        description: "Equal divisions, but some natural resonance is lost, allowing for versatility across keys.",
        metaphor: "A standardized measuring tape",
        frequencies: [
            261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99,
            392.00, 415.30, 440.00, 466.16, 493.88
        ],
        historicalContext: "Used in Western classical music from 19th century onwards.",
        musicExample: "Most modern Western music",
    },
];