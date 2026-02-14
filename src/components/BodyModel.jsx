import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Environment, ContactShadows, Float, useGLTF, Html } from '@react-three/drei';
import { storage } from '../services/storage';
import * as THREE from 'three';
import { Activity, RotateCcw, Box, User, Eye } from 'lucide-react';

// --- SHARED COMPONENTS ---
const SceneLighting = () => (
    <>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#eeeeee" />
        <spotLight position={[0, 8, 5]} angle={0.5} penumbra={1} intensity={1.5} castShadow />
    </>
);

// --- CAMERA CONTROLLER ---
const CameraController = ({ view }) => {
    const { camera } = useThree();
    const vec = new THREE.Vector3();

    useFrame(() => {
        if (view === 'front') {
            vec.set(0, 1, 6); // Front view
            camera.position.lerp(vec, 0.05);
            camera.lookAt(0, 0, 0);
        } else if (view === 'side') {
            vec.set(5, 1, 0); // Side view
            camera.position.lerp(vec, 0.05);
            camera.lookAt(0, 0, 0);
        }
    });
    return null;
};

// --- GEOMETRIC ROBOTIC MODEL (Boxes) ---
const BodyPart = ({ position, args, color, opacity = 1, rotation = [0, 0, 0] }) => {
    const mesh = useRef();

    useFrame((state) => {
        if (color === "#3b82f6" || color === "#ef4444") { // Blue or Red
            const t = state.clock.getElapsedTime();
            mesh.current.material.emissive.setHex(color === "#ef4444" ? 0xef4444 : 0x3b82f6);
            mesh.current.material.emissiveIntensity = (Math.sin(t * 3) + 1) * 0.3 + 0.1;
        } else {
            mesh.current.material.emissive.setHex(0x000000);
            mesh.current.material.emissiveIntensity = 0;
        }
    });

    return (
        <mesh position={position} rotation={rotation} ref={mesh}>
            <boxGeometry args={args} />
            <meshStandardMaterial
                color={color === "#3b82f6" || color === "#ef4444" ? color : "#9ca3af"} // Grey-400 default
                roughness={0.2}
                metalness={0.8}
                transparent={opacity < 1}
                opacity={opacity}
            />
        </mesh>
    );
};

const Joint = ({ position, scale = [1, 1, 1], color }) => (
    <mesh position={position} scale={scale}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
            color={color === "#3b82f6" || color === "#ef4444" ? color : "#6b7280"}
            roughness={0.2}
            metalness={0.8}
        />
    </mesh>
);

const GeometricMannequin = ({ highlightedMuscles, injuries }) => {
    const isHighlighted = (muscles) => {
        if (!highlightedMuscles) return false;
        return muscles.some(m => highlightedMuscles.includes(m));
    };

    const c = (muscleName) => {
        // Check for injury
        const isInjured = injuries.some(inj => inj.toLowerCase().includes(muscleName.toLowerCase()));
        if (isInjured) return "#ef4444"; // Red

        // Check for highlight
        const m = muscleName;
        if (isHighlighted(['full_body'])) return "#3b82f6";

        let active = false;
        if (['quads', 'calves', 'hamstrings', 'glutes'].includes(m) && isHighlighted(['legs'])) active = true;
        if (['biceps', 'triceps', 'forearms', 'shoulders'].includes(m) && isHighlighted(['arms'])) active = true;
        if (['abs', 'obliques'].includes(m) && isHighlighted(['core'])) active = true;
        if (['lats', 'traps', 'lower_back', 'back'].includes(m) && isHighlighted(['back'])) active = true;
        if (isHighlighted([m])) active = true;

        return active ? "#3b82f6" : "#9ca3af"; // Blue or Grey
    };

    return (
        <group position={[0, -2.5, 0]}>
            {/* --- HEAD & HAIR --- */}
            <group position={[0, 4.8, 0]}>
                {/* Face/Head */}
                <BodyPart position={[0, 0, 0]} args={[0.7, 0.85, 0.8]} color="#9ca3af" />
                {/* Hair - Geometric Style */}
                <BodyPart position={[0, 0.5, 0]} args={[0.75, 0.2, 0.85]} color="#1f2937" /> {/* Top */}
                <BodyPart position={[0, 0.45, 0.45]} args={[0.75, 0.4, 0.1]} color="#1f2937" /> {/* Front bangs */}
                <BodyPart position={[0, 0.2, -0.45]} args={[0.75, 0.6, 0.1]} color="#1f2937" /> {/* Back */}
            </group>

            {/* Neck/Traps */}
            <BodyPart position={[0, 4.25, 0]} args={[0.45, 0.4, 0.4]} color={c('traps')} />

            {/* --- TORSO (V-Taper) --- */}
            <group position={[0, 3.0, 0]}>
                {/* Chest - Broader */}
                <BodyPart position={[0, 0.6, 0.2]} args={[2.0, 1.1, 0.7]} color={c('chest')} />

                {/* Abs/Core - Tapered */}
                <BodyPart position={[0, -0.5, 0.1]} args={[1.3, 1.2, 0.5]} color={c('abs')} />

                {/* Back (Lats) - Wide */}
                <BodyPart position={[0, 0.3, -0.3]} args={[2.2, 1.6, 0.4]} color={c('lats')} />
            </group>

            {/* --- ARMS (Athletic) --- */}
            <group position={[0, 3.8, 0]}>
                {/* Shoulders (Delts) - Larger */}
                <Joint position={[-1.4, 0.3, 0]} scale={[1.3, 1.3, 1.3]} color={c('shoulders')} />
                <Joint position={[1.4, 0.3, 0]} scale={[1.3, 1.3, 1.3]} color={c('shoulders')} />

                {/* Left Arm */}
                <group position={[-1.5, -0.8, 0]}>
                    {/* Bicep/Tricep - Thicker */}
                    <BodyPart position={[0, 0.1, 0]} args={[0.65, 1.3, 0.65]} color={c('biceps')} />
                    <Joint position={[0, -0.8, 0]} scale={[0.9, 0.9, 0.9]} color="#6b7280" />
                    {/* Forearm - Tapered but strong */}
                    <BodyPart position={[0, -1.7, 0]} args={[0.5, 1.3, 0.5]} color={c('forearms')} />
                </group>

                {/* Right Arm */}
                <group position={[1.5, -0.8, 0]}>
                    <BodyPart position={[0, 0.1, 0]} args={[0.65, 1.3, 0.65]} color={c('biceps')} />
                    <Joint position={[0, -0.8, 0]} scale={[0.9, 0.9, 0.9]} color="#6b7280" />
                    <BodyPart position={[0, -1.7, 0]} args={[0.5, 1.3, 0.5]} color={c('forearms')} />
                </group>
            </group>

            {/* --- LEGS (Athletic) --- */}
            <group position={[0, 1.2, 0]}>
                {/* Hips/Glutes */}
                <BodyPart position={[0, 0.5, 0]} args={[1.6, 0.8, 0.8]} color={c('glutes')} />

                {/* Left Leg */}
                <group position={[-0.5, -0.8, 0]}>
                    <BodyPart position={[0, 0, 0]} args={[0.75, 1.8, 0.75]} color={c('quads')} />
                    <Joint position={[0, -1.1, 0]} scale={[1.0, 1.0, 1.0]} color="#6b7280" />
                    <BodyPart position={[0, -2.2, 0]} args={[0.65, 1.6, 0.65]} color={c('calves')} />
                </group>

                {/* Right Leg */}
                <group position={[0.5, -0.8, 0]}>
                    <BodyPart position={[0, 0, 0]} args={[0.75, 1.8, 0.75]} color={c('quads')} />
                    <Joint position={[0, -1.1, 0]} scale={[1.0, 1.0, 1.0]} color="#6b7280" />
                    <BodyPart position={[0, -2.2, 0]} args={[0.65, 1.6, 0.65]} color={c('calves')} />
                </group>
            </group>
        </group>
    );
};

// --- MAIN COMPONENT ---
const BodyModel = ({ highlightedMuscles }) => {
    const [injuries, setInjuries] = useState([]);
    const [viewMode, setViewMode] = useState('auto'); // 'front', 'side', 'auto'

    useEffect(() => {
        const updateData = () => {
            const u = storage.getUser();
            setInjuries(u.injuries || []);
        };
        updateData();
        const interval = setInterval(updateData, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full min-h-[500px] relative bg-gradient-to-b from-[#111827] to-[#000000]">
            {/* View Toggle */}
            <div className="absolute top-4 right-4 z-10 flex gap-2 bg-black/40 p-1 rounded-lg backdrop-blur-md border border-white/10">
                <button
                    onClick={() => setViewMode('front')}
                    className={`p-2 rounded-md flex items-center gap-2 text-xs transition ${viewMode === 'front' ? 'bg-prime text-white shadow-lg' : 'text-gray-400 hover:bg-white/10'}`}
                >
                    <User size={14} /> Front
                </button>
                <button
                    onClick={() => setViewMode('side')}
                    className={`p-2 rounded-md flex items-center gap-2 text-xs transition ${viewMode === 'side' ? 'bg-prime text-white shadow-lg' : 'text-gray-400 hover:bg-white/10'}`}
                >
                    <User size={14} className="rotate-90" /> Side
                </button>
                <button
                    onClick={() => setViewMode('auto')}
                    className={`p-2 rounded-md flex items-center gap-2 text-xs transition ${viewMode === 'auto' ? 'bg-prime text-white shadow-lg' : 'text-gray-400 hover:bg-white/10'}`}
                >
                    <RotateCcw size={14} /> Auto
                </button>
            </div>

            <Canvas camera={{ position: [0, 1, 6], fov: 40 }} shadows>
                <SceneLighting />
                <CameraController view={viewMode} />

                <Suspense fallback={null}>
                    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
                        <GeometricMannequin highlightedMuscles={highlightedMuscles} injuries={injuries} />
                    </Float>
                </Suspense>

                <ContactShadows resolution={1024} scale={10} blur={2} opacity={0.5} far={10} color="#000000" />
                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    autoRotate={viewMode === 'auto'}
                    autoRotateSpeed={2}
                />
                <Environment preset="city" />
            </Canvas>

            {/* HUD Info */}
            <div className="absolute bottom-4 left-4 text-white/50 text-xs pointer-events-none flex gap-4">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Active</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Injury</div>
            </div>
        </div>
    );
};

export default BodyModel;
