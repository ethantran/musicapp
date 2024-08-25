import React, { useState } from 'react';
import { Scale, Note } from '@tonaljs/tonal';
import styled from 'styled-components';
import * as Tone from 'tone';
import { Legend } from './Legend';

const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 20px;
`;

const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

const TableHeader = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
  background-color: #f2f2f2;
  position: relative;
`;

const TableCell = styled.td<{ $degree: number; $isAccidental: boolean }>`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
  cursor: pointer;
  background-color: ${props => {
        if (props.$degree === 1 || props.$degree === 8) return '#FFD700'; // Gold for tonic and octave
        if (props.$degree === 4) return '#87CEEB'; // Light blue for subdominant
        if (props.$degree === 5) return '#98FB98'; // Pale green for dominant
        if (props.$isAccidental) return '#FFA07A'; // Light salmon for accidentals
        return 'white';
    }};
  color: ${props => props.$isAccidental ? 'white' : 'black'};
  font-weight: ${props => (props.$degree === 1 || props.$degree === 8) ? 'bold' : 'normal'};
`;

const HalfStepIndicator = styled.span`
  display: block;
  height: 2px;
  background-color: #FF69B4; // Hot pink for half-steps
  margin-top: 4px;
`;

const Tooltip = styled.span`
  visibility: hidden;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;

  &:after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #555 transparent transparent transparent;
  }

  ${TableHeader}:hover & {
    visibility: visible;
    opacity: 1;
  }
`;

const ToggleButton = styled.button`
  margin-bottom: 10px;
  padding: 5px 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

interface MajorScaleTableProps {
    currentRoot: string;
    onScaleSelect: (root: string) => void;
}

const rootNotes = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'];

export function MajorScaleTable({ currentRoot, onScaleSelect }: MajorScaleTableProps) {
    const [useFlats, setUseFlats] = useState(false);
    const synth = new Tone.Synth().toDestination();

    const generateScale = (root: string) => {
        const scale = Scale.get(`${root} major`).notes;
        if (useFlats) {
            return scale.map(note => {
                if (note.includes('#')) {
                    const enharmonic = Note.enharmonic(note);
                    return enharmonic.includes('b') ? enharmonic : note;
                }
                return note;
            });
        }
        return scale;
    };

    const playScale = async (scale: string[]) => {
        await Tone.start();
        const now = Tone.now();
        scale.forEach((note, index) => {
            synth.triggerAttackRelease(`${note}4`, '8n', now + index * 0.25);
        });
    };

    const toggleNotation = () => {
        setUseFlats(!useFlats);
    };

    const isAccidental = (note: string) => note.includes('#') || note.includes('b');

    return (
        <TableContainer>
            <ToggleButton onClick={toggleNotation}>
                Toggle {useFlats ? 'Sharp' : 'Flat'} Notation
            </ToggleButton>
            <StyledTable>
                <thead>
                    <tr>
                        <TableHeader>Key
                            <Tooltip>Root note of the scale</Tooltip>
                        </TableHeader>
                        <TableHeader>1 (T)
                            <Tooltip>Whole step (Tone)</Tooltip>
                        </TableHeader>
                        <TableHeader>2 (T)
                            <Tooltip>Whole step (Tone)</Tooltip>
                        </TableHeader>
                        <TableHeader>3 (S)
                            <Tooltip>Half step (Semitone)</Tooltip>
                        </TableHeader>
                        <TableHeader>4 (T)
                            <Tooltip>Whole step (Tone)</Tooltip>
                        </TableHeader>
                        <TableHeader>5 (T)
                            <Tooltip>Whole step (Tone)</Tooltip>
                        </TableHeader>
                        <TableHeader>6 (T)
                            <Tooltip>Whole step (Tone)</Tooltip>
                        </TableHeader>
                        <TableHeader>7 (S)
                            <Tooltip>Half step (Semitone)</Tooltip>
                        </TableHeader>
                        <TableHeader>8</TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {rootNotes.map(root => {
                        const scale = generateScale(root);
                        return (
                            <tr key={root} onClick={() => {
                                onScaleSelect(root);
                                playScale(scale);
                            }}>
                                <TableCell $degree={1} $isAccidental={isAccidental(root)}>{root}</TableCell>
                                {scale.map((note, index) => (
                                    <TableCell
                                        key={index}
                                        $degree={index + 1}
                                        $isAccidental={isAccidental(note)}
                                    >
                                        {note}
                                        {(index === 2 || index === 6) && <HalfStepIndicator />}
                                    </TableCell>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </StyledTable>
            <Legend />
        </TableContainer>
    );
}