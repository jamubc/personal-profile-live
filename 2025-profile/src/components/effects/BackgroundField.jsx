import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useEffect, useMemo } from 'react'

const fragmentShader = `
#define PI 3.14159265359
precision highp float;

uniform float uTime;
uniform vec2  uMouse;
uniform vec2  uMouseVelocity;
uniform float uScroll;
uniform float uIntensity;     // overall effect intensity
uniform float uOpacity;       // final alpha
uniform float uMix;           // blend between interference & TE modes [0..1]
uniform float uSpeed;         // global speed multiplier
uniform float uContour;       // contour density multiplier
uniform float uMouseStrength; // master mouse influence

varying vec2 vUv;

// --- Multi-wave interference (plane waves) ---
float wave(vec2 p, float freq, float phase, float amp) {
  float k = freq * 2.0 * PI;
  float omega = 0.5; // base propagation
  vec2 dir = vec2(cos(phase), sin(phase));
  float proj = dot(p, dir);
  return amp * sin(k * proj - omega * uTime * uSpeed);
}

float emField(vec2 p) {
  float w1 = wave(p, 1.0, 0.0, 0.30);
  float w2 = wave(p, 1.2, PI / 3.0, 0.25);
  float w3 = wave(p, 0.8, 2.0 * PI / 3.0, 0.35);
  float w4 = wave(p, 1.1, PI, 0.20);
  float field = w1 + w2 + w3 + w4;
  field = (field + 2.0) / 4.0; // normalize ~[0,1]
  float scrollMod = sin(uScroll * PI * 2.0 + uTime * 0.2 * uSpeed) * 0.1;
  return clamp(field + scrollMod, 0.0, 1.0);
}

// --- TE waveguide mode helper (stylized) ---
float TE_mode(vec2 p01, float m, float n, float t, float zPhase) {
  // Treat p01 in [0,1], scale to a,b aperture
  float a = 2.0;
  float b = 2.0;
  vec2 coord = p01 * vec2(a, b);
  float Hz = cos(m * PI * coord.x / a) * cos(n * PI * coord.y / b);
  float omega = 2.0 * PI * 0.03;                  // slow ambient
  float kx = m * PI / a;
  float ky = n * PI / b;
  float beta = sqrt(max(0.0, omega * omega - kx * kx - ky * ky));
  return Hz * cos(omega * t - beta * zPhase);
}

void main() {
  // Coordinates
  vec2 p01 = vUv;               // [0,1]
  vec2 p   = vUv * 2.0 - 1.0;   // centered [-1,1]

  // Mouse mapping
  vec2 mouse01 = vec2(uMouse.x * 0.5 + 0.5, -uMouse.y * 0.5 + 0.5);
  vec2 mouseC  = mouse01 * 2.0 - 1.0;
  float dist   = distance(p, mouseC);

  // Mouse velocity with compression and master strength
  float vel = length(uMouseVelocity);
  vel = vel / (1.0 + vel * 8.0);     // compress spikes
  vel *= uMouseStrength;             // global mouse dial

  // Steeper spatial falloff (tighter locality)
  float falloff = 1.0 / (1.0 + pow(dist * 3.0, 4.0));

  // Radial/spherical ripples from motion (significantly reduced)
  float radialWave = sin(dist * 10.0 - uTime * 2.0 * uSpeed) * falloff * 0.05;
  float ripple     = sin(distance(p01, mouse01) * 20.0 - uTime * 3.0 * uSpeed) * falloff * vel * 0.15;

  // Distortion: much softer
  vec2 subtleDist = normalize(p - mouseC) * falloff * vel * 0.005;
  vec2 strongDist = (p01 - mouse01) * falloff * 0.10 * vel;
  vec2 distorted01 = p01 + clamp(strongDist, -0.15, 0.15);
  vec2 distortedP  = p + subtleDist;

  // TE modes with scroll-driven z-phase
  float z1 = uTime * 0.05 * uSpeed + uScroll * 1.5;
  float z2 = uTime * 0.04 * uSpeed + uScroll * 1.3 + 1.0;
  float z3 = uTime * 0.03 * uSpeed + uScroll * 1.0 + 2.0;

  float H10 = TE_mode(distorted01, 1.0, 0.0, uTime, z1);
  float H01 = TE_mode(distorted01, 0.0, 1.0, uTime, z2);
  float H11 = TE_mode(distorted01, 1.0, 1.0, uTime, z3);
  float teField = (H10 * 0.5 + H01 * 0.4 + H11 * 0.45) / 1.35;
  float te01 = clamp(teField * 0.5 + 0.5, 0.0, 1.0);

  // Interference base (with mild distortion for fluidity)
  float base = emField(distortedP);

  // Blend TE and interference, then add softened mouse waves
  float field = mix(base, te01, clamp(uMix, 0.0, 1.0));
  field += radialWave + ripple;
  field = clamp(field * uIntensity, 0.0, 1.0);

  // Palette: deep blues to electric accents
  vec3 low   = vec3(0.02, 0.01, 0.08);
  vec3 mid   = vec3(0.10, 0.05, 0.30);
  vec3 high  = vec3(0.40, 0.20, 0.80);
  vec3 accent= vec3(0.30, 0.70, 1.00);

  vec3 color = mix(low, mid, smoothstep(0.0, 0.5, field));
  color      = mix(color, high, smoothstep(0.5, 1.0, field));

  // Much softer glow near motion source
  color += accent * falloff * vel * 0.08;

  // Elegant contour lines on crests
  float contour = smoothstep(0.48, 0.52, abs(fract(field * (4.0 * uContour)) - 0.5)) * 0.5;
  color += vec3(0.6, 0.8, 1.0) * (1.0 - contour) * 0.25;

  gl_FragColor = vec4(color, clamp(uOpacity, 0.0, 1.0));
}
`;

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

function MasterField({
  intensity = 0.5,
  opacity = 0.18,
  mix = 0.20,
  speed = 0.05,
  contour = 5.0,
  mouseStrength = 0.1, // NEW: dial mouse influence
}) {
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
      mat.current.uniforms.uIntensity.value = intensity;
      mat.current.uniforms.uOpacity.value = opacity;
      mat.current.uniforms.uMix.value = mix;
      mat.current.uniforms.uSpeed.value = speed;
      mat.current.uniforms.uContour.value = contour;
      mat.current.uniforms.uMouseStrength.value = mouseStrength;
    }
    // faster velocity decay to prevent lingering energy
    mouseVelocityRef.current.x *= 0.9;
    mouseVelocityRef.current.y *= 0.9;
  });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: [0, 0] },
    uMouseVelocity: { value: [0, 0] },
    uScroll: { value: 0 },
    uIntensity: { value: intensity },
    uOpacity: { value: opacity },
    uMix: { value: mix },
    uSpeed: { value: speed },
    uContour: { value: contour },
    uMouseStrength: { value: mouseStrength }, // NEW
  }), [intensity, opacity, mix, speed, contour, mouseStrength]);

  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[25, 25]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export function BackgroundField(props) {
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
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#000']} />
      <MasterField {...props} />
    </Canvas>
  );
}
