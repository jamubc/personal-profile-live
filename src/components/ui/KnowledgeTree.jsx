import { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Line } from '@react-three/drei';
import * as THREE from 'three';

const knowledgeData = {
  name: 'Root',
  position: [0, 2, 0],
  children: [
    {
      name: 'Electrical Engineering',
      position: [-3, 0, 0],
      children: [
        { name: 'PLC', icon: '⚡', position: [-4, -2, 0] },
        { name: 'Electromagnetism', icon: '🧲', position: [-3.5, -3, 0] },
        { name: 'Circuit Design', icon: '🔌', position: [-2.5, -2.5, 0] },
        { name: 'Power Systems', icon: '⚙️', position: [-2, -3.5, 0] },
      ],
    },
    {
      name: 'Programming',
      position: [0, 0, 0],
      children: [
        { name: 'React', icon: '⚛️', position: [-0.5, -2, 0] },
        { name: 'Python', icon: '🐍', position: [0, -3, 0] },
        { name: 'TypeScript', icon: '📘', position: [0.5, -2.5, 0] },
        { name: 'Node.js', icon: '🟢', position: [1, -3.5, 0] },
      ],
    },
    {
      name: 'Hardware',
      position: [3, 0, 0],
      children: [
        { name: 'Arduino', icon: '🤖', position: [2, -2, 0] },
        { name: 'Embedded', icon: '💾', position: [2.5, -3, 0] },
        { name: 'PCB Design', icon: '🔧', position: [3.5, -2.5, 0] },
        { name: 'Prototyping', icon: '🛠️', position: [4, -3.5, 0] },
      ],
    },
  ],
};

const Branch = ({ start, end, isActive }) => {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];

  return (
    <Line
      points={points}
      color={isActive ? '#6366f1' : '#475569'}
      lineWidth={isActive ? 4 : 2}
      transparent
      opacity={isActive ? 1 : 0.4}
    />
  );
};

const Node = ({ node, parent, level = 0, onHover, hoveredNode }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const isLeaf = !node.children || node.children.length === 0;
  const isRoot = level === 0;

  useFrame(() => {
    if (meshRef.current && (hovered || hoveredNode === node.name)) {
      meshRef.current.scale.lerp(new THREE.Vector3(1.15, 1.15, 1.15), 0.1);
    } else if (meshRef.current) {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    onHover(node.name);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover(null);
    document.body.style.cursor = 'default';
  };

  return (
    <>
      {/* Draw branch from parent to this node */}
      {parent && !isRoot && (
        <Branch
          start={parent.position}
          end={node.position}
          isActive={hovered || hoveredNode === node.name}
        />
      )}

      {/* Draw branches to children */}
      {!isLeaf && node.children.map((child, idx) => (
        <Branch
          key={idx}
          start={node.position}
          end={child.position}
          isActive={hoveredNode === child.name}
        />
      ))}

      {/* The node */}
      {!isRoot && (
        <group position={node.position}>
          <mesh
            ref={meshRef}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
          >
            {!isLeaf ? (
              <>
                <boxGeometry args={[1.8, 0.5, 0.2]} />
                <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.8} />
              </>
            ) : (
              <>
                <boxGeometry args={[1.4, 0.35, 0.15]} />
                <meshStandardMaterial color="#f1f5f9" roughness={0.2} metalness={0.1} />
              </>
            )}
          </mesh>

          <Text
            position={[0, 0, 0.12]}
            fontSize={isLeaf ? 0.14 : 0.18}
            color={isLeaf ? '#0f172a' : '#f8fafc'}
            anchorX="center"
            anchorY="middle"
            maxWidth={1.6}
          >
            {isLeaf ? `${node.icon} ${node.name}` : node.name}
          </Text>
        </group>
      )}

      {/* Recursively render children */}
      {!isLeaf && node.children.map((child, idx) => (
        <Node
          key={idx}
          node={child}
          parent={node}
          level={level + 1}
          onHover={onHover}
          hoveredNode={hoveredNode}
        />
      ))}
    </>
  );
};

const Scene = () => {
  const [hoveredNode, setHoveredNode] = useState(null);

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, 5]} intensity={0.4} />
      <Suspense fallback={null}>
        <Node
          node={knowledgeData}
          parent={null}
          level={0}
          onHover={setHoveredNode}
          hoveredNode={hoveredNode}
        />
      </Suspense>
    </>
  );
};

export const KnowledgeTree = () => {
  return (
    <div className="w-full h-[500px] cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, -0.5, 10], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};
