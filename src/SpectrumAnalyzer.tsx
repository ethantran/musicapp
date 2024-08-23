import React, { useRef, useEffect } from 'react';
import * as Tone from 'tone';

interface Props {
    analyser: Tone.Analyser | null;
}

export const SpectrumAnalyzer: React.FC<Props> = ({ analyser }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!analyser) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const drawSpectrum = () => {
            requestAnimationFrame(drawSpectrum);

            const width = canvas.width;
            const height = canvas.height;
            const frequencyData = analyser.getValue();

            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, width, height);

            const barWidth = (width / frequencyData.length) * 2.5;
            let x = 0;

            for (let i = 0; i < frequencyData.length; i++) {
                const barHeight = (frequencyData[i] as number + 140) * 2;
                ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
                ctx.fillRect(x, height - barHeight / 2, barWidth, barHeight / 2);
                x += barWidth + 1;
            }
        };

        drawSpectrum();
    }, [analyser]);

    return <canvas ref={canvasRef} width="400" height="200" />;
};
