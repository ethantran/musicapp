import React, { useState, useEffect } from 'react';
import { Scale } from '@tonaljs/tonal';
import styled from 'styled-components';

const ChallengeContainer = styled.div`
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
`;

const Title = styled.h3`
  margin-top: 0;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
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

const Feedback = styled.p<{ $isCorrect: boolean }>`
  color: ${props => props.$isCorrect ? 'green' : 'red'};
  font-weight: bold;
`;

const allRootNotes = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'];

export function ScaleChallenge() {
    const [currentRoot, setCurrentRoot] = useState('');
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);

    const generateNewChallenge = () => {
        const newRoot = allRootNotes[Math.floor(Math.random() * allRootNotes.length)];
        setCurrentRoot(newRoot);
        setUserAnswer('');
        setFeedback('');
        setIsCorrect(false);
    };

    useEffect(() => {
        generateNewChallenge();
    }, []);

    const checkAnswer = () => {
        const correctScale = Scale.get(`${currentRoot} major`).notes;
        const userScale = userAnswer.split(' ').map(note => note.trim());

        if (userScale.length !== correctScale.length) {
            setFeedback('Incorrect. Make sure you enter all 7 notes of the scale.');
            setIsCorrect(false);
            return;
        }

        const isCorrect = userScale.every((note, index) => note === correctScale[index]);
        setIsCorrect(isCorrect);
        setFeedback(isCorrect
            ? 'Correct! Well done.'
            : `Incorrect. The correct scale is: ${correctScale.join(' ')}`
        );
    };

    return (
        <ChallengeContainer>
            <Title>Scale Challenge</Title>
            <p>Enter the notes of the {currentRoot} major scale, separated by spaces:</p>
            <Input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="e.g. C D E F G A B"
            />
            <Button onClick={checkAnswer}>Check Answer</Button>
            <Button onClick={generateNewChallenge}>New Challenge</Button>
            {feedback && <Feedback $isCorrect={isCorrect}>{feedback}</Feedback>}
        </ChallengeContainer>
    );
}