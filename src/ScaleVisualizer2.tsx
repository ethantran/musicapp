import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface ScaleVisualizerProps {
    scale: string[];
}

const VisualizerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  margin: 20px 0;
`;

const NoteCircle = styled(motion.div)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #3498db;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin: 0 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }
`;

export function ScaleVisualizer({ scale }: ScaleVisualizerProps) {
    return (
        <VisualizerContainer>
            {scale.map((note, index) => (
                <NoteCircle
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    {note}
                </NoteCircle>
            ))}
        </VisualizerContainer>
    );
}