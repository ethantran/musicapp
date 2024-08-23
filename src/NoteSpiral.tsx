import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const NoteSpiral = () => {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const [synth, setSynth] = useState<Tone.Synth | null>(null);
    const [volume, setVolume] = useState<number>(0);

    useEffect(() => {
        const newSynth = new Tone.Synth().toDestination();
        setSynth(newSynth);
    }, []);

    const playNote = (note: string, octave: number) => {
        if (synth) {
            synth.triggerAttackRelease(`${note}${octave}`, '8n');
            setVolume(1);
            setTimeout(() => setVolume(0), 500);
        }
    };

    const handleClick = (event: THREE.Event, intersections: THREE.Intersection[]) => {
        if (intersections.length > 0) {
            const { note, octave } = intersections[0].object.userData;
            playNote(note, octave);
        }
    };

    return (
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
            <Canvas camera={{ position: [0, 5, 15], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <OrbitControls enableDamping dampingFactor={0.25} enableZoom />
                <Scene notes={notes} handleClick={handleClick} />
            </Canvas>
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '200px',
                height: '20px',
                backgroundColor: '#ddd',
                borderRadius: '10px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${volume * 100}%`,
                    height: '100%',
                    backgroundColor: '#4CAF50',
                    transition: 'width 0.1s'
                }}></div>
            </div>
        </div>
    );
};

interface SceneProps {
    notes: string[];
    handleClick: (event: THREE.Event, intersections: THREE.Intersection[]) => void;
}

const Scene: React.FC<SceneProps> = ({ notes, handleClick }) => {
    const { scene } = useThree();
    const spheresRef = useRef<THREE.Mesh[]>([]);

    useEffect(() => {
        const minOctave = 0;
        const maxOctave = 8;
        const spiralRadius = 5;
        const spiralHeight = 10;

        for (let octave = minOctave; octave <= maxOctave; octave++) {
            notes.forEach((note, index) => {
                const angle = (index / notes.length) * Math.PI * 2;
                const height = (octave / maxOctave) * spiralHeight;
                const radius = spiralRadius - (octave / maxOctave) * (spiralRadius * 0.5);

                const x = Math.cos(angle) * radius;
                const y = height - spiralHeight / 2;
                const z = Math.sin(angle) * radius;

                const geometry = new THREE.SphereGeometry(0.2, 32, 32);
                const material = new THREE.MeshStandardMaterial({ color: 0x4CAF50 });
                const sphere = new THREE.Mesh(geometry, material);
                sphere.position.set(x, y, z);
                sphere.userData = { note, octave };
                scene.add(sphere);
                spheresRef.current.push(sphere);
            });
        }

        // Clean up function
        return () => {
            spheresRef.current.forEach(sphere => {
                sphere.geometry.dispose();
                (sphere.material as THREE.Material).dispose();
                scene.remove(sphere);
            });
            spheresRef.current = [];
        };
    }, [notes, scene]);

    useFrame((state) => {
        state.camera.updateProjectionMatrix();
    });

    const handleSphereClick = (event: THREE.Event) => {
        event.stopPropagation();
        const sphere = event.object as THREE.Mesh;
        const originalColor = sphere.material.color.getHex();
        (sphere.material as THREE.MeshStandardMaterial).color.setHex(0xff0000);
        setTimeout(() => {
            (sphere.material as THREE.MeshStandardMaterial).color.setHex(originalColor);
        }, 200);
        handleClick(event, [{ object: sphere } as THREE.Intersection]);
    };

    return (
        <>
            {spheresRef.current.map((sphere, index) => (
                <primitive key={index} object={sphere} onClick={handleSphereClick} />
            ))}
        </>
    );
};

export default NoteSpiral;