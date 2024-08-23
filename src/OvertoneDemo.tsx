import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';

const OvertoneDemo = () => {
    const [fundamentalFreq, setFundamentalFreq] = useState(440); // A4
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const analyserRef = useRef<Tone.Analyser | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const draw = () => {
                    if (analyserRef.current) {
                        const dataArray = analyserRef.current.getValue();
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.beginPath();
                        ctx.moveTo(0, canvas.height / 2);
                        dataArray.forEach((value, index) => {
                            const x = (index / dataArray.length) * canvas.width;
                            const y = (1 - (value as number) / 255) * canvas.height;
                            ctx.lineTo(x, y);
                        });
                        ctx.stroke();
                    }
                    requestAnimationFrame(draw);
                };
                draw();
            }
        }
    }, []);

    const playOvertone = (ratio: number) => {
        const freq = fundamentalFreq * ratio;
        const synth = new Tone.Synth().toDestination();
        if (!analyserRef.current) {
            analyserRef.current = new Tone.Analyser('waveform', 256);
            synth.connect(analyserRef.current);
        }
        synth.triggerAttackRelease(freq, "8n");
    };

    const overtones = [
        { name: "Fundamental (Unison)", ratio: 1 },
        { name: "1st Overtone (Octave)", ratio: 2 },
        { name: "2nd Overtone (Perfect Fifth)", ratio: 3 },
        { name: "3rd Overtone (Perfect Fourth)", ratio: 4 },
        { name: "4th Overtone (Major Third)", ratio: 5 }
    ];

    return (
        <div>
            <h1>Overtone Series Demo</h1>
            <div>
                <label>Fundamental Frequency: </label>
                <input
                    type="number"
                    value={fundamentalFreq}
                    onChange={(e) => setFundamentalFreq(Number(e.target.value))}
                />
            </div>
            <div>
                {overtones.map((overtone, index) => (
                    <button key={index} onClick={() => playOvertone(overtone.ratio)}>
                        {overtone.name}
                    </button>
                ))}
            </div>
            <canvas ref={canvasRef} width="600" height="200"></canvas>
        </div>
    );
};

export default OvertoneDemo;
