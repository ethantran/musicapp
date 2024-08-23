import React, { useState } from 'react';
import * as Tone from 'tone';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import './MusicBuildingBlocks.css';

interface Block {
    id: string;
    type: 'harmony' | 'melody' | 'rhythm';
    name: string;
    description: string;
    detailedExplanation: string;
    content: any; // This could be chord progressions, melody patterns, or rhythm patterns
}

const availableBlocks: Block[] = [
    {
        id: 'h1',
        type: 'harmony',
        name: 'I-IV-V',
        description: 'Basic chord progression',
        detailedExplanation: 'The I-IV-V progression is the foundation of many popular songs. It creates a sense of movement and resolution, using the tonic (I), subdominant (IV), and dominant (V) chords of a key.',
        content: ['C', 'F', 'G']
    },
    {
        id: 'h2',
        type: 'harmony',
        name: 'ii-V-I',
        description: 'Jazz chord progression',
        detailedExplanation: 'The ii-V-I progression is a cornerstone of jazz harmony. It creates a strong pull towards the tonic, often used for modulation or as a turnaround at the end of a section.',
        content: ['Dm', 'G', 'C']
    },
    {
        id: 'm1',
        type: 'melody',
        name: 'Ascending Scale',
        description: 'Simple ascending melody',
        detailedExplanation: `An ascending scale creates a sense of rising tension or energy. It's a fundamental building block for melodies and can be used to connect different chord tones.`,
        content: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']
    },
    {
        id: 'm2',
        type: 'melody',
        name: 'Arpeggio',
        description: 'Broken chord melody',
        detailedExplanation: 'An arpeggio outlines the notes of a chord in sequence. It adds melodic interest while reinforcing the harmony, creating a flowing, harp-like sound.',
        content: ['C4', 'E4', 'G4', 'C5']
    },
    {
        id: 'r1',
        type: 'rhythm',
        name: '4/4 Basic',
        description: 'Simple 4/4 rhythm',
        detailedExplanation: 'The 4/4 time signature is the most common in popular music. This basic pattern emphasizes beats 1 and 3, creating a steady, marchlike feel.',
        content: [1, 0, 1, 0]
    },
    {
        id: 'r2',
        type: 'rhythm',
        name: 'Syncopated',
        description: 'Syncopated rhythm',
        detailedExplanation: `Syncopation places emphasis on the off-beats, creating a sense of groove and forward motion. It's widely used in jazz, funk, and many other genres to add rhythmic interest.`,
        content: [1, 0, 0.5, 0.5, 1, 0]
    },
];

const chordToNotes: { [key: string]: string[] } = {
    'C': ['C4', 'E4', 'G4'],
    'F': ['F4', 'A4', 'C5'],
    'G': ['G4', 'B4', 'D5'],
    'Dm': ['D4', 'F4', 'A4'],
};

export const MusicBuildingBlocks: React.FC = () => {
    const [buildingBlocks, setBuildingBlocks] = useState<Block[]>([]);
    const [tooltipContent, setTooltipContent] = useState<string | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    const addBlock = (block: Block) => {
        const newBlock = { ...block, id: `${block.id}-${Date.now()}` };
        setBuildingBlocks([...buildingBlocks, newBlock]);
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

    const showTooltip = (event: React.MouseEvent, content: string) => {
        setTooltipContent(content);
        setTooltipPosition({ x: event.clientX, y: event.clientY });
    };

    const hideTooltip = () => {
        setTooltipContent(null);
    };

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newBlocks = Array.from(buildingBlocks);
        const [reorderedItem] = newBlocks.splice(source.index, 1);
        newBlocks.splice(destination.index, 0, reorderedItem);

        setBuildingBlocks(newBlocks);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="music-building-blocks">
                <h2>Music Building Blocks</h2>
                <div className="block-palette">
                    {availableBlocks.map((block) => (
                        <div
                            key={block.id}
                            className={`block ${block.type}`}
                            onClick={() => addBlock(block)}
                            onMouseEnter={(e) => showTooltip(e, block.detailedExplanation)}
                            onMouseLeave={hideTooltip}
                        >
                            <h3>{block.name}</h3>
                            <p>{block.description}</p>
                        </div>
                    ))}
                </div>
                <Droppable droppableId="composition">
                    {(provided) => (
                        <div
                            className="composition-area"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            <h3>Your Composition</h3>
                            {buildingBlocks.map((block, index) => (
                                <Draggable key={block.id} draggableId={block.id} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`block ${block.type} ${snapshot.isDragging ? 'dragging' : ''}`}
                                            onMouseEnter={(e) => showTooltip(e, block.detailedExplanation)}
                                            onMouseLeave={hideTooltip}
                                        >
                                            <h4>{block.name}</h4>
                                            <button onClick={() => removeBlock(index)}>Remove</button>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                <button onClick={playComposition}>Play Composition</button>
                {tooltipContent && (
                    <div
                        className="tooltip"
                        style={{
                            position: 'fixed',
                            top: tooltipPosition.y + 10,
                            left: tooltipPosition.x + 10
                        }}
                    >
                        {tooltipContent}
                    </div>
                )}
            </div>
        </DragDropContext>
    );
};