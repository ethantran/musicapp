import React, { useEffect, useRef } from 'react';
import * as Tone from 'tone';
import styled from 'styled-components';

interface PianoKeyboardProps {
    scale: string[];
}

const KeyboardContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

interface KeyProps {
    $isBlack: boolean;
    $isInScale: boolean;
}

const Key = styled.div<KeyProps>`
  width: ${props => props.$isBlack ? '30px' : '50px'};
  height: ${props => props.$isBlack ? '120px' : '200px'};
  background-color: ${props => props.$isBlack ? 'black' : 'white'};
  border: 1px solid #333;
  margin: ${props => props.$isBlack ? '0 -15px' : '0'};
  z-index: ${props => props.$isBlack ? 1 : 0};
  cursor: pointer;
  ${props => props.$isInScale && `
    background-color: ${props.$isBlack ? '#4a69bd' : '#82ccdd'};
  `}
`;

const allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function PianoKeyboard({ scale }: PianoKeyboardProps) {
    const synthRef = useRef<Tone.Synth | null>(null);

    useEffect(() => {
        synthRef.current = new Tone.Synth().toDestination();
        return () => {
            if (synthRef.current) {
                synthRef.current.dispose();
            }
        };
    }, []);

    const playNote = (note: string) => {
        if (synthRef.current) {
            synthRef.current.triggerAttackRelease(`${note}4`, '8n');
        }
    };

    const isNoteInScale = (note: string) => scale.includes(note);

    return (
        <KeyboardContainer>
            {allNotes.map((note, index) => (
                <Key
                    key={note}
                    $isBlack={note.includes('#')}
                    $isInScale={isNoteInScale(note)}
                    onClick={() => playNote(note)}
                />
            ))}
        </KeyboardContainer>
    );
}