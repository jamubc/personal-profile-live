import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';

const fragmentShader = `
#define PI 3.14159265359
precision highp float;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uMouseVelocity;
uniform float uScroll;
varying vec2 vUv;

float wave(vec2 p, float freq, float phase, float amp) {
  float k = freq * 2.0 * PI;
  float omega = 0.5; // Slow propagation speed
  float dirX = cos(phase);
  float dirY = sin(phase);
  vec2 dir = vec2(dirX, dirY);
  float proj = dot(p, dir);
  return amp * sin(k * proj - omega * uTime);
}

float emField(vec2 p) {
  // Multiple propagating plane waves for interference pattern
  float w1 = wave(p, 1.0, 0.0, 0.3);
  float w2 = wave(p, 1.2, PI / 3.0, 0.25);
  float w3 = wave(p, 0.8, 2.0 * PI / 3.0, 0.35);
  float w4 = wave(p, 1.1, PI, 0.2);

  // Combine for realistic interference
  float field = w1 + w2 + w3 + w4;
  field = (field + 2.0) / 4.0; // Normalize to [0,1]

  // Subtle scroll modulation
  float scrollMod = sin(uScroll * PI * 2.0 + uTime * 0.2) * 0.1;
  field += scrollMod;

  return field;
}

void main() {
  vec2 p = vUv * 2.0 - 1.0; // Centered coordinates

  // Subtle mouse influence as a point source perturbation
  vec2 mousePos = vec2(uMouse.x * 0.5 + 0.5, -uMouse.y * 0.5 + 0.5);
  vec2 centeredMouse = mousePos * 2.0 - 1.0;
  float dist = distance(p, centeredMouse);
  float falloff = 1.0 / (1.0 + dist * dist * 4.0); // Inverse square
  float vel = length(uMouseVelocity) * 0.1; // Dampened velocity

  // Add radial wave from mouse, subtle and fluid
  float radialWave = sin(dist * 10.0 - uTime * 2.0 + vel * 5.0) * falloff * 0.2;
  float field = emField(p) + radialWave * falloff;

  // Smooth field with slight distortion for fluidity
  vec2 distortion = normalize(p - centeredMouse) * falloff * vel * 0.02;
  vec2 distortedP = p + distortion;
  field = mix(field, emField(distortedP), 0.3);

  // Enhanced color mapping: deep space blues to subtle electric accents
  vec3 low = vec3(0.02, 0.01, 0.08);
  vec3 mid = vec3(0.1, 0.05, 0.3);
  vec3 high = vec3(0.4, 0.2, 0.8);
  vec3 accent = vec3(0.3, 0.7, 1.0);

  vec3 color = mix(low, mid, smoothstep(0.0, 0.5, field));
  color = mix(color, high, smoothstep(0.5, 1.0, field));

  // Subtle glow from mouse source
  color += accent * falloff * vel * 0.3;

  // Thin, elegant contour lines for wave crests
  float contour = smoothstep(0.48, 0.52, abs(fract(field * 4.0) - 0.5)) * 0.5;
  color += vec3(0.6, 0.8, 1.0) * (1.0 - contour);

  gl_FragColor = vec4(color, 0.15); // Low opacity for legibility
}
`;

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

function ElectromagneticWaves() {
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

    // Gentle velocity decay for smooth trails
    const decay = 0.98;
    mouseVelocityRef.current.x *= decay;
    mouseVelocityRef.current.y *= decay;
  });

  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[25, 25]} />
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
        depthWrite={false}
      />
    </mesh>
  );
}

export function BackgroundField() {
  return (
    <Canvas
      className="fixed inset-0 pointer-events-none -z-10"
      camera={{ position: [0, 0, 1], fov: 90, near: 0.1, far: 100 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        background: 'transparent',
        willChange: 'transform'
      }}
      dpr={[1, 1.5]}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      }}
    >
      <color attach="background" args={['#000']} />
      <ElectromagneticWaves />
    </Canvas>
  );
}
