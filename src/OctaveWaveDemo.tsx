import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';

const OctaveWaveDemo: React.FC = () => {
    const [playingNote, setPlayingNote] = useState<'C4' | 'C5' | 'both' | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const analyserRef = useRef<Tone.Analyser | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const synthC4Ref = useRef<Tone.Synth | null>(null);
    const synthC5Ref = useRef<Tone.Synth | null>(null);

    useEffect(() => {
        const synthC4 = new Tone.Synth().toDestination();
        const synthC5 = new Tone.Synth().toDestination();
        const analyser = new Tone.Analyser('waveform', 2048);
        synthC4.connect(analyser);
        synthC5.connect(analyser);
        analyserRef.current = analyser;
        synthC4Ref.current = synthC4;
        synthC5Ref.current = synthC5;

        const drawWaveform = () => {
            if (!canvasRef.current || !analyserRef.current) return;
            const ctx = canvasRef.current.getContext('2d');
            if (!ctx) return;

            const waveform = analyserRef.current.getValue();
            const width = ctx.canvas.width;
            const height = ctx.canvas.height;

            ctx.clearRect(0, 0, width, height);
            ctx.beginPath();
            ctx.strokeStyle = playingNote === 'C4' ? 'blue' : (playingNote === 'C5' ? 'red' : 'purple');
            ctx.lineWidth = 2;

            for (let i = 0; i < waveform.length; i++) {
                const x = (i / waveform.length) * width;
                const y = ((waveform[i] as number + 1) / 2) * height;
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.stroke();

            animationFrameRef.current = requestAnimationFrame(drawWaveform);
        };

        drawWaveform();

        return () => {
            synthC4.dispose();
            synthC5.dispose();
            analyser.dispose();
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [playingNote]);

    const playNote = async (note: 'C4' | 'C5' | 'both') => {
        setPlayingNote(note);

        // Ensure audio context is started
        await Tone.start();

        if (note === 'both') {
            synthC4Ref.current?.triggerAttackRelease("C4", "1n");
            synthC5Ref.current?.triggerAttackRelease("C5", "1n");
        } else if (note === 'C4') {
            synthC4Ref.current?.triggerAttackRelease("C4", "1n");
        } else {
            synthC5Ref.current?.triggerAttackRelease("C5", "1n");
        }

        setTimeout(() => {
            setPlayingNote(null);
        }, 2000);
    };

    return (
        <div>
            <h2>Octave Wave Demo</h2>
            <canvas ref={canvasRef} width={800} height={200} style={{ border: '1px solid black' }} />
            <br />
            <button onClick={() => playNote('C4')} disabled={playingNote !== null}>
                Play C4
            </button>
            <button onClick={() => playNote('C5')} disabled={playingNote !== null}>
                Play C5
            </button>
            <button onClick={() => playNote('both')} disabled={playingNote !== null}>
                Play Both
            </button>
        </div>
    );
};

export default OctaveWaveDemo;
