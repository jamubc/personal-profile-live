import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

export function SimpleRoboticArm({ currentLabel, onLabelDeposited }) {
  const armRef = useRef();
  const gripperRef = useRef();
  const labelRef = useRef();

  const [phase, setPhase] = useState('idle');
  const [displayedLabel, setDisplayedLabel] = useState('');
  const progress = useRef(0);

  // Trigger animation when label changes
  useEffect(() => {
    if (currentLabel !== displayedLabel && phase === 'idle') {
      setDisplayedLabel(currentLabel);
      setPhase('pickup');
      progress.current = 0;
    }
  }, [currentLabel, displayedLabel, phase]);

  useFrame((_, delta) => {
    if (phase === 'idle') return;

    progress.current += delta * 0.8;

    if (phase === 'pickup' && progress.current >= 1) {
      setPhase('move');
      progress.current = 0;
      return;
    }

    if (phase === 'move' && progress.current >= 1) {
      setPhase('deposit');
      progress.current = 0;
      if (onLabelDeposited) onLabelDeposited(displayedLabel);
      return;
    }

    if (phase === 'deposit' && progress.current >= 1) {
      setPhase('return');
      progress.current = 0;
      return;
    }

    if (phase === 'return' && progress.current >= 1) {
      setPhase('idle');
      progress.current = 0;
      return;
    }

    // Animate arm rotation
    if (armRef.current) {
      const t = Math.min(progress.current, 1);
      const easeT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

      if (phase === 'pickup') {
        armRef.current.rotation.z = easeT * -0.5; // Reach to pickup
      } else if (phase === 'move') {
        armRef.current.rotation.z = -0.5 + easeT * 0.8; // Move to center
      } else if (phase === 'deposit') {
        // Hold position
      } else if (phase === 'return') {
        armRef.current.rotation.z = 0.3 - easeT * 0.3; // Return home
      }
    }

    // Animate gripper
    if (gripperRef.current) {
      const t = Math.min(progress.current, 1);
      if (phase === 'pickup') {
        gripperRef.current.scale.x = 1 - t * 0.5; // Close
      } else if (phase === 'deposit') {
        gripperRef.current.scale.x = 0.5 + t * 0.5; // Open
      }
    }
  });

  const isCarrying = phase === 'move' || phase === 'deposit';
  const labelOpacity = phase === 'deposit' ? 1 - Math.min(progress.current, 1) : 1;

  return (
    <group position={[-4, 0, 0]}>
      {/* Pickup label */}
      {phase === 'idle' && (
        <Text
          position={[-2, 1, 0]}
          fontSize={0.3}
          color="#ffeb3b"
          anchorX="center"
          anchorY="middle"
        >
          {displayedLabel}
        </Text>
      )}

      {/* Base */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.3, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Arm */}
      <group ref={armRef} position={[0, 0.15, 0]}>
        <mesh position={[1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.12, 2, 16]} />
          <meshStandardMaterial color="#ffeb3b" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Gripper */}
        <group ref={gripperRef} position={[2, 0, 0]}>
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[0.05, 0.2, 0.05]} />
            <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[0.05, 0.2, 0.05]} />
            <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Carried label */}
          {isCarrying && (
            <Text
              ref={labelRef}
              position={[0, 0, 0]}
              fontSize={0.25}
              color="#ffeb3b"
              anchorX="center"
              anchorY="middle"
              material-transparent
              material-opacity={labelOpacity}
            >
              {displayedLabel}
            </Text>
          )}
        </group>
      </group>
    </group>
  );
}
