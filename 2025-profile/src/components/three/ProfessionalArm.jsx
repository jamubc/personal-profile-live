import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function ProfessionalArm({ currentLabel, onLabelDeposited }) {
  const baseRef = useRef();
  const armRef = useRef();
  const forearmRef = useRef();
  const gripperRef = useRef();
  const leftJawRef = useRef();
  const rightJawRef = useRef();

  const [phase, setPhase] = useState('idle');
  const [displayedLabel, setDisplayedLabel] = useState('');
  const animTime = useRef(0);

  useEffect(() => {
    if (currentLabel !== displayedLabel && phase === 'idle') {
      setDisplayedLabel(currentLabel);
      setPhase('reach');
      animTime.current = 0;
    }
  }, [currentLabel, displayedLabel, phase]);

  useFrame((_, delta) => {
    if (phase === 'idle') return;

    animTime.current += delta;
    const t = Math.min(animTime.current / 1.2, 1);
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    // Base rotation
    if (baseRef.current) {
      if (phase === 'reach') {
        baseRef.current.rotation.y = ease * -Math.PI / 3;
      } else if (phase === 'carry') {
        baseRef.current.rotation.y = -Math.PI / 3 + ease * Math.PI / 3;
      } else if (phase === 'return') {
        baseRef.current.rotation.y = ease * 0;
      }
    }

    // Arm lift
    if (armRef.current) {
      if (phase === 'reach') {
        armRef.current.rotation.z = ease * 0.4;
      } else if (phase === 'carry') {
        armRef.current.rotation.z = 0.4 - ease * 0.1;
      } else if (phase === 'return') {
        armRef.current.rotation.z = 0.3 - ease * 0.3;
      }
    }

    // Forearm extend
    if (forearmRef.current) {
      if (phase === 'reach') {
        forearmRef.current.rotation.z = ease * -0.6;
      } else if (phase === 'carry') {
        forearmRef.current.rotation.z = -0.6 + ease * 0.3;
      } else if (phase === 'return') {
        forearmRef.current.rotation.z = -0.3 + ease * 0.3;
      }
    }

    // Gripper
    if (leftJawRef.current && rightJawRef.current) {
      const jawOpen = phase === 'reach' ? 1 - ease * 0.7 :
                      phase === 'deposit' ? 0.3 + ease * 0.7 : 0.3;
      leftJawRef.current.position.x = 0.08 * jawOpen;
      rightJawRef.current.position.x = -0.08 * jawOpen;
    }

    // Phase transitions
    if (t >= 1) {
      if (phase === 'reach') {
        setPhase('grab');
        animTime.current = 0;
      } else if (phase === 'grab' && animTime.current > 0.3) {
        setPhase('carry');
        animTime.current = 0;
      } else if (phase === 'carry') {
        setPhase('deposit');
        animTime.current = 0;
      } else if (phase === 'deposit') {
        if (animTime.current > 0.3 && onLabelDeposited) {
          onLabelDeposited(displayedLabel);
        }
        if (animTime.current > 0.5) {
          setPhase('return');
          animTime.current = 0;
        }
      } else if (phase === 'return') {
        setPhase('idle');
        animTime.current = 0;
      }
    }
  });

  const isCarrying = phase === 'grab' || phase === 'carry' || phase === 'deposit';
  const labelOpacity = phase === 'deposit' ? 1 - Math.min(animTime.current * 2, 1) : 1;

  return (
    <group position={[-3, -1, 0]}>
      {/* Pickup zone */}
      {phase === 'idle' && (
        <Text
          position={[-3, 2, 0]}
          fontSize={0.4}
          color="#00ffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/space-mono.woff"
        >
          {displayedLabel}
        </Text>
      )}

      {/* Base platform */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.6, 0.2, 32]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Rotating base */}
      <group ref={baseRef} position={[0, 0.1, 0]}>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.25, 0.35, 0.3, 24]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Main arm */}
        <group ref={armRef} position={[0, 0.3, 0]}>
          {/* Shoulder joint */}
          <mesh>
            <sphereGeometry args={[0.15, 24, 24]} />
            <MeshTransmissionMaterial
              color="#00ffff"
              thickness={0.1}
              roughness={0.1}
              transmission={0.95}
              ior={1.5}
              chromaticAberration={0.05}
            />
          </mesh>

          {/* Upper arm segment */}
          <mesh position={[0, 0.8, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.08, 1.6, 16]} />
            <meshStandardMaterial
              color="#ffeb3b"
              metalness={0.6}
              roughness={0.3}
              emissive="#ffeb3b"
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* Forearm */}
          <group ref={forearmRef} position={[1.6, 0, 0]}>
            {/* Elbow joint */}
            <mesh>
              <sphereGeometry args={[0.12, 24, 24]} />
              <MeshTransmissionMaterial
                color="#00ffff"
                thickness={0.08}
                roughness={0.1}
                transmission={0.95}
                ior={1.5}
                chromaticAberration={0.05}
              />
            </mesh>

            {/* Forearm segment */}
            <mesh position={[0, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.08, 0.06, 1.2, 16]} />
              <meshStandardMaterial
                color="#ffeb3b"
                metalness={0.6}
                roughness={0.3}
                emissive="#ffeb3b"
                emissiveIntensity={0.2}
              />
            </mesh>

            {/* Gripper assembly */}
            <group ref={gripperRef} position={[1.2, 0, 0]}>
              {/* Gripper base */}
              <mesh>
                <cylinderGeometry args={[0.08, 0.08, 0.15, 16]} />
                <meshStandardMaterial
                  color="#0a0a0a"
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>

              {/* Jaws with glass material */}
              <mesh ref={leftJawRef} position={[0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <boxGeometry args={[0.08, 0.15, 0.03]} />
                <MeshTransmissionMaterial
                  color="#666666"
                  thickness={0.05}
                  roughness={0.2}
                  transmission={0.8}
                  ior={1.5}
                />
              </mesh>
              <mesh ref={rightJawRef} position={[-0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <boxGeometry args={[0.08, 0.15, 0.03]} />
                <MeshTransmissionMaterial
                  color="#666666"
                  thickness={0.05}
                  roughness={0.2}
                  transmission={0.8}
                  ior={1.5}
                />
              </mesh>

              {/* Carried label */}
              {isCarrying && (
                <Text
                  position={[0, 0, 0]}
                  fontSize={0.3}
                  color="#00ffff"
                  anchorX="center"
                  anchorY="middle"
                  material-transparent
                  material-opacity={labelOpacity}
                  font="/fonts/space-mono.woff"
                >
                  {displayedLabel}
                </Text>
              )}
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
