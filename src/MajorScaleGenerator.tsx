import React, { useState, useEffect, useCallback } from 'react';
import * as Tone from 'tone';
import { Scale } from '@tonaljs/tonal';
import styled from 'styled-components';
import { ScaleVisualizer } from './ScaleVisualizer2';
import { PianoKeyboard } from './PianoKeyboard';
import { ScaleExplanation } from './ScaleExplanation';
import { ScaleChallenge } from './ScaleChallenge';
import { MajorScaleTable } from './MajorScaleTable';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Select = styled.select`
  padding: 10px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }
`;

const rootNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function MajorScaleGenerator() {
    const [rootNote, setRootNote] = useState('C');
    const [scale, setScale] = useState(Scale.get(`${rootNote} major`).notes);
    const [synth, setSynth] = useState<Tone.Synth | null>(null);

    useEffect(() => {
        const newSynth = new Tone.Synth().toDestination();
        setSynth(newSynth);
        return () => {
            newSynth.dispose();
        };
    }, []);

    const generateScale = useCallback((root: string) => {
        setRootNote(root);
        setScale(Scale.get(`${root} major`).notes);
    }, []);

    const playScale = useCallback(async () => {
        if (!synth) return;

        await Tone.start();
        const now = Tone.now();
        scale.forEach((note, index) => {
            synth.triggerAttackRelease(`${note}4`, '4n', now + index * 0.5);
        });
    }, [scale, synth]);

    return (
        <Container>
            <h2>Major Scale Generator</h2>
            <Controls>
                <Select value={rootNote} onChange={(e) => generateScale(e.target.value)}>
                    {rootNotes.map((note) => (
                        <option key={note} value={note}>
                            {note}
                        </option>
                    ))}
                </Select>
                <Button onClick={playScale}>Play Scale</Button>
            </Controls>
            <ScaleVisualizer scale={scale} />
            <PianoKeyboard scale={scale} />
            <ScaleExplanation rootNote={rootNote} scale={scale} />
            <MajorScaleTable currentRoot={rootNote} onScaleSelect={generateScale} />
            <ScaleChallenge />
        </Container>
    );
}

export default MajorScaleGenerator;