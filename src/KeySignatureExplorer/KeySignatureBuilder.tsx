'use client'

import React, { useState, useEffect } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const STAFF_LINES = 5
const ACCIDENTALS = ['♯', '♭']
const POSITIONS = ['F', 'C', 'G', 'D', 'A', 'E', 'B']

type Accidental = {
    id: string
    type: '♯' | '♭'
    position: number
}

const AccidentalItem: React.FC<{ accidental: string; index: number }> = ({ accidental, index }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'accidental',
        item: { type: accidental, id: `${accidental}-${index}` },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }))

    return (
        <div
            ref={drag}
            className={`w-8 h-12 flex items-center justify-center text-2xl cursor-move ${isDragging ? 'opacity-50' : 'opacity-100'
                }`}
        >
            {accidental}
        </div>
    )
}

const StaffPosition: React.FC<{ position: number; accidentals: Accidental[] }> = ({
    position,
    accidentals,
}) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'accidental',
        drop: (item: { type: '♯' | '♭'; id: string }) => ({
            position,
            ...item,
        }),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }))

    const positionAccidentals = accidentals.filter((a) => a.position === position)

    return (
        <div
            ref={drop}
            className={`w-8 h-6 border-t border-black flex items-center justify-center ${isOver ? 'bg-gray-200' : 'bg-white'
                }`}
        >
            {positionAccidentals.map((a) => (
                <span key={a.id} className="text-xl">
                    {a.type}
                </span>
            ))}
        </div>
    )
}

export function KeySignatureBuilder() {
    const [accidentals, setAccidentals] = useState<Accidental[]>([])

    const handleDrop = (item: Accidental) => {
        setAccidentals((prev) => [...prev, item])
    }

    const clearSignature = () => {
        setAccidentals([])
    }

    useEffect(() => {
        const dropHandler = (event: any) => {
            const item = event.item
            if (item && item.position !== undefined) {
                handleDrop(item as Accidental)
            }
        }

        window.addEventListener('accidentalDropped', dropHandler)

        return () => {
            window.removeEventListener('accidentalDropped', dropHandler)
        }
    }, [])

    return (
        <DndProvider backend={HTML5Backend}>
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Visual Key Signature Builder</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex justify-center space-x-4">
                        {ACCIDENTALS.map((accidental, index) => (
                            <AccidentalItem key={index} accidental={accidental} index={index} />
                        ))}
                    </div>
                    <div className="relative">
                        {[...Array(STAFF_LINES)].map((_, i) => (
                            <div key={i} className="w-full h-6 border-t border-black" />
                        ))}
                        <div className="absolute top-0 left-0 w-full">
                            {POSITIONS.map((_, i) => (
                                <StaffPosition key={i} position={i} accidentals={accidentals} />
                            ))}
                        </div>
                    </div>
                    <Button onClick={clearSignature}>Clear Signature</Button>
                </CardContent>
            </Card>
        </DndProvider>
    )
}