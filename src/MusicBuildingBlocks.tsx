import React, { useState } from 'react';
import * as Tone from 'tone';
import './MusicBuildingBlocks.css';

interface Block {
    id: string;
    type: 'harmony' | 'melody' | 'rhythm';
    name: string;
    description: string;
    content: any; // This could be chord progressions, melody patterns, or rhythm patterns
}

const availableBlocks: Block[] = [
    { id: 'h1', type: 'harmony', name: 'I-IV-V', description: 'Basic chord progression', content: ['C', 'F', 'G'] },
    { id: 'h2', type: 'harmony', name: 'ii-V-I', description: 'Jazz chord progression', content: ['Dm', 'G', 'C'] },
    { id: 'm1', type: 'melody', name: 'Ascending Scale', description: 'Simple ascending melody', content: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'] },
    { id: 'm2', type: 'melody', name: 'Arpeggio', description: 'Broken chord melody', content: ['C4', 'E4', 'G4', 'C5'] },
    { id: 'r1', type: 'rhythm', name: '4/4 Basic', description: 'Simple 4/4 rhythm', content: [1, 0, 1, 0] },
    { id: 'r2', type: 'rhythm', name: 'Syncopated', description: 'Syncopated rhythm', content: [1, 0, 0.5, 0.5, 1, 0] },
];

const chordToNotes: { [key: string]: string[] } = {
    'C': ['C4', 'E4', 'G4'],
    'F': ['F4', 'A4', 'C5'],
    'G': ['G4', 'B4', 'D5'],
    'Dm': ['D4', 'F4', 'A4'],
};

export const MusicBuildingBlocks: React.FC = () => {
    const [buildingBlocks, setBuildingBlocks] = useState<Block[]>([]);

    const addBlock = (block: Block) => {
        setBuildingBlocks([...buildingBlocks, block]);
    };

    const removeBlock = (index: number) => {
        const newBlocks = [...buildingBlocks];
        newBlocks.splice(index, 1);
        setBuildingBlocks(newBlocks);
    };

    const playComposition = async () => {
        await Tone.start();
        const synth = new Tone.PolySynth().toDestination();
        const now = Tone.now();

        let time = 0;
        buildingBlocks.forEach((block) => {
            if (block.type === 'harmony') {
                block.content.forEach((chord: string) => {
                    const notes = chordToNotes[chord] || [];
                    synth.triggerAttackRelease(notes, '4n', now + time);
                    time += 0.5;
                });
            } else if (block.type === 'melody') {
                block.content.forEach((note: string) => {
                    synth.triggerAttackRelease(note, '8n', now + time);
                    time += 0.25;
                });
            } else if (block.type === 'rhythm') {
                block.content.forEach((beat: number) => {
                    if (beat > 0) {
                        synth.triggerAttackRelease('C4', '8n', now + time);
                    }
                    time += 0.25;
                });
            }
        });
    };

    return (
        <div className="music-building-blocks">
            <h2>Music Building Blocks</h2>
            <div className="block-palette">
                {availableBlocks.map((block) => (
                    <div key={block.id} className={`block ${block.type}`} onClick={() => addBlock(block)}>
                        <h3>{block.name}</h3>
                        <p>{block.description}</p>
                    </div>
                ))}
            </div>
            <div className="composition-area">
                <h3>Your Composition</h3>
                {buildingBlocks.map((block, index) => (
                    <div key={index} className={`block ${block.type}`}>
                        <h4>{block.name}</h4>
                        <button onClick={() => removeBlock(index)}>Remove</button>
                    </div>
                ))}
            </div>
            <button onClick={playComposition}>Play Composition</button>
        </div>
    );
};