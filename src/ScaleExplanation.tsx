import React from 'react';
import styled from 'styled-components';
import { Scale, Note } from '@tonaljs/tonal';

interface ScaleExplanationProps {
    rootNote: string;
    scale: string[];
}

const ExplanationContainer = styled.div`
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
`;

const Title = styled.h3`
  margin-top: 0;
`;

const Text = styled.p`
  line-height: 1.6;
`;

const NoteSpan = styled.span`
  font-weight: bold;
  color: #3498db;
`;

export function ScaleExplanation({ rootNote, scale }: ScaleExplanationProps) {
    const getStepName = (index: number) => {
        const steps = ['Tonic', 'Supertonic', 'Mediant', 'Subdominant', 'Dominant', 'Submediant', 'Leading Tone'];
        return steps[index];
    };

    const getIntervalFromRoot = (note: string) => {
        return Scale.get(`${rootNote} major`).intervals[scale.indexOf(note)];
    };

    const explainAccidentals = () => {
        const naturalScale = Scale.get(`C major`).notes;
        const accidentals = scale.filter((note, index) => Note.enharmonic(note) !== naturalScale[index]);

        if (accidentals.length === 0) return "This scale uses all natural notes.";

        return `This scale uses the following accidentals: ${accidentals.join(', ')}. 
    These are necessary to maintain the whole-whole-half-whole-whole-whole-half step pattern of the major scale.`;
    };

    return (
        <ExplanationContainer>
            <Title>{rootNote} Major Scale Explanation</Title>
            <Text>
                The {rootNote} Major scale consists of the following notes:
                {scale.map((note, index) => (
                    <React.Fragment key={note}>
                        {' '}
                        <NoteSpan>{note}</NoteSpan> ({getStepName(index)}, {getIntervalFromRoot(note)} from root)
                        {index < scale.length - 1 ? ',' : '.'}
                    </React.Fragment>
                ))}
            </Text>
            <Text>
                The major scale follows the whole-whole-half-whole-whole-whole-half step pattern.
                This pattern is what gives the major scale its characteristic sound.
            </Text>
            <Text>{explainAccidentals()}</Text>
        </ExplanationContainer>
    );
}