import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';

const fragmentShader = `
#define PI 3.14159265359

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uMouseVelocity;
uniform float uScroll;
varying vec2 vUv;

// TE waveguide mode - Maxwell's equations
float TE_mode(vec2 p, float m, float n, float t, float zPhase) {
  float a = 2.0;
  float b = 2.0;

  vec2 coord = p * vec2(a, b);
  float Hz = cos(m * PI * coord.x / a) * cos(n * PI * coord.y / b);

  float omega = 2.0 * PI * 0.03;  // Very slow ambient animation
  float kx = m * PI / a;
  float ky = n * PI / b;
  float beta = sqrt(max(0.0, omega * omega - kx * kx - ky * ky));

  return Hz * cos(omega * t - beta * zPhase);
}

void main() {
  vec2 p = vUv;

  // Mouse acts as a charge source - creates field disturbance
  vec2 mousePos = vec2(uMouse.x * 0.5 + 0.5, -uMouse.y * 0.5 + 0.5);
  float distToMouse = distance(p, mousePos);

  // Field strength from charge (inverse square law)
  float chargeField = 1.0 / (1.0 + distToMouse * 3.0);

  // Mouse acceleration creates field ripples - STRONG effect
  float velocityMag = length(uMouseVelocity);
  float ripple = sin(distToMouse * 20.0 - uTime * 3.0) * chargeField * velocityMag * 5.0;

  // Apply field distortion from mouse charge - DRAMATIC
  vec2 fieldDistortion = (p - mousePos) * chargeField * 0.6 * velocityMag;
  vec2 distortedP = p + fieldDistortion;

  // Scroll-driven propagation (very subtle)
  float z1 = uTime * 0.05 + uScroll * 1.5;
  float z2 = uTime * 0.04 + uScroll * 1.3 + 1.0;
  float z3 = uTime * 0.03 + uScroll * 1.0 + 2.0;

  // Multiple TE modes on distorted field
  float H_z_10 = TE_mode(distortedP, 1.0, 0.0, uTime, z1);
  float H_z_01 = TE_mode(distortedP, 0.0, 1.0, uTime, z2);
  float H_z_11 = TE_mode(distortedP, 1.0, 1.0, uTime, z3);

  float field = (H_z_10 * 0.5 + H_z_01 * 0.4 + H_z_11 * 0.45) / 1.35;
  field += ripple * 0.3;

  float t = field * 0.5 + 0.5;

  // Color gradient
  vec3 c1 = vec3(0.05, 0.02, 0.15);
  vec3 c2 = vec3(0.15, 0.08, 0.45);
  vec3 c3 = vec3(0.6, 0.15, 0.7);
  vec3 c4 = vec3(0.2, 0.6, 0.95);

  vec3 color;
  if (t < 0.33) {
    color = mix(c1, c2, t / 0.33);
  } else if (t < 0.66) {
    color = mix(c2, c3, (t - 0.33) / 0.33);
  } else {
    color = mix(c3, c4, (t - 0.66) / 0.34);
  }

  // Contour lines showing field intensity
  float contour = step(0.95, fract(field * 6.0));
  color += vec3(0.8, 0.9, 1.0) * contour;

  // Highlight charge source when moving
  color += vec3(1.0, 0.5, 0.2) * chargeField * velocityMag * 0.8;

  gl_FragColor = vec4(color, 0.9);
}
`;

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

function ElectromagneticField() {
  const mat = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const mouseVelocityRef = useRef({ x: 0, y: 0 });
  const prevMouse = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  useEffect(() => {
    let rafId = null;

    const handleMouseMove = (e) => {
      const newMouse = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      };

      // Calculate velocity (change in position)
      mouseVelocityRef.current = {
        x: newMouse.x - prevMouse.current.x,
        y: newMouse.y - prevMouse.current.y
      };

      prevMouse.current = newMouse;
      mouseRef.current = newMouse;
    };

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const progress = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
        scrollRef.current = progress;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useFrame((state) => {
    if (mat.current) {
      mat.current.uniforms.uTime.value = state.clock.getElapsedTime();
      mat.current.uniforms.uMouse.value = [mouseRef.current.x, mouseRef.current.y];
      mat.current.uniforms.uMouseVelocity.value = [mouseVelocityRef.current.x, mouseVelocityRef.current.y];
      mat.current.uniforms.uScroll.value = scrollRef.current;
    }

    // Decay velocity over time
    mouseVelocityRef.current.x *= 0.95;
    mouseVelocityRef.current.y *= 0.95;
  });

  return (
    <mesh position={[0, 0, -2]}>
      <planeGeometry args={[20, 20]} />
      <shaderMaterial
        ref={mat}
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: [0, 0] },
          uMouseVelocity: { value: [0, 0] },
          uScroll: { value: 0 }
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
      />
    </mesh>
  );
}

export function BackgroundField() {
  return (
    <Canvas
      className="fixed inset-0 -z-10"
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        background: '#000000'
      }}
      dpr={[1, 2]}
    >
      <ElectromagneticField />
    </Canvas>
  );
}