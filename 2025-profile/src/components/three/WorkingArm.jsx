import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export function WorkingArm({ currentLabel, onLabelDeposited }) {
  const { camera, gl } = useThree();
  const baseRef = useRef();
  const armRef = useRef();
  const forearmRef = useRef();
  const gripperRef = useRef();

  const [phase, setPhase] = useState('idle');
  const [displayedLabel, setDisplayedLabel] = useState('Full-Stack Developer');
  const time = useRef(0);
  const dropTarget = useRef(new THREE.Vector3(0, 0, 0));
  const hasCalledDeposit = useRef(false);

  // Get DOM text position and convert to 3D
  const updateDropTarget = () => {
    const el = document.getElementById('role-anchor');
    if (!el || !camera || !gl) return;

    const rect = el.getBoundingClientRect();
    const canvasRect = gl.domElement.getBoundingClientRect();

    // Center of the text element
    const x = rect.left + rect.width / 2 - canvasRect.left;
    const y = rect.top + rect.height / 2 - canvasRect.top;

    // Convert to NDC
    const ndcX = (x / canvasRect.width) * 2 - 1;
    const ndcY = -(y / canvasRect.height) * 2 + 1;

    // Raycast to z=0 plane
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const hit = new THREE.Vector3();

    if (raycaster.ray.intersectPlane(plane, hit)) {
      dropTarget.current.copy(hit);
    }
  };

  useEffect(() => {
    if (currentLabel !== displayedLabel && phase === 'idle') {
      setDisplayedLabel(currentLabel);
      setPhase('pickup');
      time.current = 0;
      hasCalledDeposit.current = false; // Reset for new cycle
      updateDropTarget(); // Get target position when animation starts
    }
  }, [currentLabel, displayedLabel, phase]);

  useEffect(() => {
    updateDropTarget();
    window.addEventListener('resize', updateDropTarget);
    return () => window.removeEventListener('resize', updateDropTarget);
  }, []);

  useFrame((_, delta) => {
    if (phase === 'idle') return;

    time.current += delta;
    const t = Math.min(time.current / 1, 1);
    const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    if (baseRef.current) {
      if (phase === 'pickup') {
        baseRef.current.rotation.y = ease * -0.8;
      } else if (phase === 'move') {
        baseRef.current.rotation.y = -0.8 + ease * 0.8;
      } else if (phase === 'return') {
        baseRef.current.rotation.y = ease * 0;
      }
    }

    if (armRef.current) {
      if (phase === 'pickup') {
        armRef.current.rotation.z = ease * 0.5;
      } else if (phase === 'move') {
        armRef.current.rotation.z = 0.5 - ease * 0.2;
      } else if (phase === 'return') {
        armRef.current.rotation.z = 0.3 - ease * 0.3;
      }
    }

    if (forearmRef.current) {
      if (phase === 'pickup') {
        forearmRef.current.rotation.z = ease * -0.7;
      } else if (phase === 'move') {
        forearmRef.current.rotation.z = -0.7 + ease * 0.4;
      } else if (phase === 'return') {
        forearmRef.current.rotation.z = -0.3 + ease * 0.3;
      }
    }

    if (t >= 1) {
      if (phase === 'pickup') {
        setPhase('move');
        time.current = 0;
      } else if (phase === 'move') {
        setPhase('deposit');
        time.current = 0;
      } else if (phase === 'deposit') {
        // Start DOM fade-in slightly before 3D fade completes for smooth crossfade
        if (time.current > 0.2 && !hasCalledDeposit.current && onLabelDeposited) {
          onLabelDeposited(displayedLabel);
          hasCalledDeposit.current = true; // Only call once
        }
        if (time.current > 0.8) {
          setPhase('return');
          time.current = 0;
        }
      } else if (phase === 'return') {
        setPhase('idle');
        time.current = 0;
      }
    }
  });

  const carrying = phase === 'pickup' || phase === 'move' || phase === 'deposit';
  // Slow fade out during deposit to create smooth crossfade with DOM text
  const labelOpacity = phase === 'deposit' ? 1 - Math.min(time.current * 1.2, 1) : 1;

  // Source platform text - fades in at idle, fades out during pickup
  const sourceTextOpacity = phase === 'idle' ? 1 : phase === 'pickup' ? 1 - Math.min(time.current * 2, 1) : 0;

  return (
    <group position={[-5, -1, 0]}>
      {/* Text source platform - glowing tray on the left */}
      <group position={[-2.5, 1.5, 0]}>
        {/* Platform base */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[1.5, 0.05, 0.6]} />
          <meshStandardMaterial
            color="#ffeb3b"
            metalness={0.8}
            roughness={0.2}
            emissive="#ffeb3b"
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* Holographic projection lines */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[1.5, 0.5, 0.02]} />
          <meshStandardMaterial
            color="#00ffff"
            transparent
            opacity={0.3}
            emissive="#00ffff"
            emissiveIntensity={1}
          />
        </mesh>
        {/* Source text that gets pulled */}
        {sourceTextOpacity > 0 && (
          <Text
            position={[0, 0.2, 0.1]}
            fontSize={0.35}
            color="#ffeb3b"
            anchorX="left"
            anchorY="middle"
            material-transparent
            material-opacity={sourceTextOpacity}
          >
            {displayedLabel}
          </Text>
        )}
      </group>

      {/* Base */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.6, 0.3, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Rotating base */}
      <group ref={baseRef} position={[0, 0.15, 0]}>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.3, 0.4, 0.4, 24]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Main arm */}
        <group ref={armRef} position={[0, 0.4, 0]}>
          {/* Shoulder */}
          <mesh>
            <sphereGeometry args={[0.2, 24, 24]} />
            <meshStandardMaterial color="#00ffff" metalness={0.8} roughness={0.2} emissive="#00ffff" emissiveIntensity={0.3} />
          </mesh>

          {/* Upper arm */}
          <mesh position={[0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.12, 0.1, 1.6, 16]} />
            <meshStandardMaterial color="#ffeb3b" metalness={0.6} roughness={0.3} emissive="#ffeb3b" emissiveIntensity={0.2} />
          </mesh>

          {/* Forearm */}
          <group ref={forearmRef} position={[1.6, 0, 0]}>
            {/* Elbow */}
            <mesh>
              <sphereGeometry args={[0.15, 24, 24]} />
              <meshStandardMaterial color="#00ffff" metalness={0.8} roughness={0.2} emissive="#00ffff" emissiveIntensity={0.3} />
            </mesh>

            {/* Forearm segment */}
            <mesh position={[0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.1, 0.08, 1.2, 16]} />
              <meshStandardMaterial color="#ffeb3b" metalness={0.6} roughness={0.3} emissive="#ffeb3b" emissiveIntensity={0.2} />
            </mesh>

            {/* Gripper */}
            <group ref={gripperRef} position={[1.2, 0, 0]}>
              <mesh>
                <cylinderGeometry args={[0.1, 0.1, 0.2, 16]} />
                <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
              </mesh>

              {/* Jaws */}
              <mesh position={[0, 0.15, 0]}>
                <boxGeometry args={[0.08, 0.2, 0.05]} />
                <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
              </mesh>
              <mesh position={[0, -0.15, 0]}>
                <boxGeometry args={[0.08, 0.2, 0.05]} />
                <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
              </mesh>

              {/* Carried label - grabbed by left edge for natural rotation */}
              {carrying && (
                <Text
                  position={[0.15, 0, 0.2]}
                  fontSize={0.35}
                  color="#ffeb3b"
                  anchorX="left"
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
      </group>
    </group>
  );
}
