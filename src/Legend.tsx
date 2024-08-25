import React from 'react';
import styled from 'styled-components';

const LegendContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 8px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 10px;
`;

const ColorBox = styled.div<{ $color: string }>`
  width: 20px;
  height: 20px;
  background-color: ${props => props.$color};
  margin-right: 5px;
  border: 1px solid #333;
`;

const LegendText = styled.span`
  font-size: 14px;
`;

const legendItems = [
    { color: '#FFD700', text: 'Tonic (1) and Octave (8)' },
    { color: '#87CEEB', text: 'Subdominant (4)' },
    { color: '#98FB98', text: 'Dominant (5)' },
    { color: '#FFA07A', text: 'Accidentals (♯ or ♭)' },
    { color: '#FF69B4', text: 'Half-steps' },
    { color: 'white', text: 'Other scale degrees' },
];

export function Legend() {
    return (
        <LegendContainer>
            {legendItems.map((item, index) => (
                <LegendItem key={index}>
                    <ColorBox $color={item.color} />
                    <LegendText>{item.text}</LegendText>
                </LegendItem>
            ))}
        </LegendContainer>
    );
}