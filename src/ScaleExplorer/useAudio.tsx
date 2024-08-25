import { useCallback, useState, useRef } from 'react';
import * as Tone from 'tone';

export const useAudio = () => {
    const [isStarted, setIsStarted] = useState(false);
    const synthRef = useRef<{ [key: number]: Tone.Synth }>({});

    const start = useCallback(async () => {
        await Tone.start();
        setIsStarted(true);
    }, []);

    const playNote = useCallback((midiNumber: number) => {
        if (!isStarted) return;
        const freq = Tone.Frequency(midiNumber, "midi").toFrequency();
        if (!synthRef.current[midiNumber]) {
            synthRef.current[midiNumber] = new Tone.Synth().toDestination();
        }
        synthRef.current[midiNumber].triggerAttack(freq);
    }, [isStarted]);

    const stopNote = useCallback((midiNumber: number) => {
        if (!isStarted || !synthRef.current[midiNumber]) return;
        synthRef.current[midiNumber].triggerRelease();
        delete synthRef.current[midiNumber];
    }, [isStarted]);

    return { start, playNote, stopNote, isStarted };
};