const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const modeIntervals = [
    [0, 2, 4, 5, 7, 9, 11], // Ionian (Major)
    [0, 2, 3, 5, 7, 9, 10], // Dorian
    [0, 1, 3, 5, 7, 8, 10], // Phrygian
    [0, 2, 4, 6, 7, 9, 11], // Lydian
    [0, 2, 4, 5, 7, 9, 10], // Mixolydian
    [0, 2, 3, 5, 7, 8, 10], // Aeolian (Natural Minor)
    [0, 1, 3, 5, 6, 8, 10], // Locrian
];

export const getNotes = (rootNote: string, intervals: number[]): string[] => {
    const rootIndex = notes.indexOf(rootNote);
    return intervals.map((interval) => notes[(rootIndex + interval) % 12]);
};

export const getModeIntervals = (modeIndex: number): number[] => {
    return modeIntervals[modeIndex];
};

export const getParallelMode = (rootNote: string, modeIndex: number): string[] => {
    return getNotes(rootNote, getModeIntervals(modeIndex));
};

export const getRelativeMode = (rootNote: string, modeIndex: number): string[] => {
    const majorScale = getNotes(rootNote, modeIntervals[0]);
    const relativeRootIndex = modeIndex;
    const relativeRoot = majorScale[relativeRootIndex];
    return getNotes(relativeRoot, getModeIntervals(modeIndex));
};