import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useState, useEffect, useMemo } from 'react';
import { Vector4, Vector2 } from 'three';

// -----------------------------------------------------------------------------
// SHADER DEFINITIONS
// -----------------------------------------------------------------------------

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
#ifdef GL_ES
precision highp float;
#endif

#define PI 3.14159265359
#define MAX_ELEMENTS 20

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uMouseVelocity;
uniform float uScroll;
uniform int uElementCount;
uniform vec4 uElements[MAX_ELEMENTS];
uniform vec2 uResolution;

varying vec2 vUv;

// --- UTILS ---

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

// --- PHYSICS & FIELD CALCS ---

vec2 getElementRepulsion(vec2 p) {
    vec2 totalForce = vec2(0.0);
    
    for (int i = 0; i < MAX_ELEMENTS; i++) {
        if (i >= uElementCount) break;
        
        vec4 el = uElements[i];
        float elY = 1.0 - (el.y - uScroll);
        
        vec2 center = vec2(el.x, elY);
        float aspect = uResolution.x / uResolution.y;
        center.x *= aspect;
        
        vec2 pCorrected = p;
        pCorrected.x *= aspect;
        
        vec2 size = vec2(el.z, el.w);
        
        vec2 delta = pCorrected - center;
        vec2 scaledDelta = delta / (size * 0.5 + 0.05);
        float dist = length(scaledDelta);
        
        float strength = smoothstep(1.2, 0.0, dist);
        
        if (dist > 0.001) {
            totalForce += (delta / dist) * strength * 0.12; 
        }
    }
    return totalForce;
}

float calculateField(vec2 p, float t) {
    float aspect = uResolution.x / uResolution.y;
    vec2 pAR = vec2(p.x * aspect, p.y);

    // 1. Repulsion
    vec2 repulsion = getElementRepulsion(p);
    vec2 distortedP = pAR - repulsion;
    
    // 2. Mouse Interaction
    vec2 mouseUv = uMouse * 0.5 + 0.5; 
    vec2 mouseAR = vec2(mouseUv.x * aspect, mouseUv.y);
    
    vec2 toMouse = distortedP - mouseAR;
    float mouseDist = length(toMouse);
    
    // Velocity Wake
    float velMag = length(uMouseVelocity);
    float wake = dot(normalize(toMouse), normalize(uMouseVelocity + vec2(0.001))) * velMag;
    
    // Stronger Mouse Force
    float mouseForce = 1.0 / (1.0 + mouseDist * 8.0);
    
    // Ripple (Dynamic "Alive" Feel) - INCREASED SPEED AND AMP
    float rippleBase = sin(mouseDist * 12.0 - t * 5.0) * 0.1; 
    
    float rippleActive = sin(mouseDist * 20.0 - t * 12.0) * mouseForce * velMag * 5.0;
    
    // 3. Plasma Flow (Domain Warping) - FASTER AND LARGER
    float n = noise(distortedP * 1.0 + t * 0.4); 
    distortedP += vec2(n * 0.15); 

    // 4. Wave/Field Calculation
    float z1 = t * 0.8 + uScroll * 3.0; // Much Faster flow
    
    float kx1 = 2.0 * PI; 
    float ky1 = 2.0 * PI;
    float w1 = cos(kx1 * distortedP.x + z1) * cos(ky1 * distortedP.y);
    
    float kx2 = 1.0 * PI;
    float ky2 = 3.0 * PI;
    
    float w2 = cos(kx2 * distortedP.x - z1 * 0.7) * cos(ky2 * distortedP.y + t * 0.9);
    
    float field = (w1 + w2) * 0.5;
    
    field += rippleBase + rippleActive;
    
    return field;
}

void main() {
    vec2 uv = vUv;
    
    // CHROMATIC ABERRATION
    float distortionStr = 0.008; // Stronger split
    
    float fieldR = calculateField(uv + vec2(distortionStr, 0.0), uTime);
    float fieldG = calculateField(uv, uTime);
    float fieldB = calculateField(uv - vec2(distortionStr, 0.0), uTime);
    
    // Isolines - FASTER MOVING
    float lineSpeed = uTime * 0.3;
    float linesR = abs(fract(fieldR * 4.0 + lineSpeed) - 0.5);
    float linesG = abs(fract(fieldG * 4.0 + lineSpeed) - 0.5);
    float linesB = abs(fract(fieldB * 4.0 + lineSpeed) - 0.5);
    
    float lineWidth = 0.15; 
    float sharp = 0.06;
    
    vec3 lineCol;
    lineCol.r = 1.0 - smoothstep(lineWidth - sharp, lineWidth + sharp, linesR);
    lineCol.g = 1.0 - smoothstep(lineWidth - sharp, lineWidth + sharp, linesG);
    lineCol.b = 1.0 - smoothstep(lineWidth - sharp, lineWidth + sharp, linesB);
    
    // COLORS
    vec3 bg = vec3(0.03, 0.03, 0.05); 
    vec3 accent = vec3(0.4, 0.5, 1.0);    // Bright Indigo
    vec3 hot = vec3(0.0, 1.0, 1.0);       // Cyan
    
    float intensity = (fieldG * 0.5 + 0.5);
    
    // Breathing effect - FASTER
    float pulse = 1.0 + sin(uTime * 2.5) * 0.2;
    
    vec3 finalColor = bg;
    
    // Ambient Plasma Glow
    finalColor += accent * intensity * 0.4 * pulse;
    
    // Lines
    finalColor += vec3(lineCol.r * 0.8, lineCol.g * 0.8, lineCol.b * 1.0) * accent * 0.9;
    
    // Mouse Hotspot
    float aspect = uResolution.x / uResolution.y;
    vec2 mouseUv = uMouse * 0.5 + 0.5;
    float mouseDist = distance(vec2(uv.x * aspect, uv.y), vec2(mouseUv.x * aspect, mouseUv.y));
    float mouseGlow = 1.0 / (1.0 + mouseDist * 2.0);
    
    finalColor += hot * mouseGlow * 0.25; 
    finalColor += hot * mouseGlow * length(uMouseVelocity) * 4.0 * lineCol; 

    gl_FragColor = vec4(finalColor, 1.0);
}
`;

// -----------------------------------------------------------------------------
// REACT COMPONENT
// -----------------------------------------------------------------------------

function ElectromagneticField({ elements }) {
  const mat = useRef(null);
  const { viewport } = useThree();
  const mouseRef = useRef(new Vector2(0, 0));
  const mouseVelocityRef = useRef(new Vector2(0, 0));
  const prevMouse = useRef(new Vector2(0, 0));
  
  const targets = useMemo(() => Array.from({ length: 20 }, () => new Vector4(0, 0, 0, 0)), []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      const newMouse = new Vector2(x, y);
      
      const velocity = new Vector2().subVectors(newMouse, prevMouse.current);
      
      mouseVelocityRef.current.copy(velocity);
      prevMouse.current.copy(newMouse);
      mouseRef.current.copy(newMouse);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const count = Math.min(elements.length, 20);
    if (mat.current) mat.current.uniforms.uElementCount.value = count;

    for (let i = 0; i < 20; i++) {
      if (i < count) {
        const el = elements[i];
        targets[i].set(el.x, el.y, el.width, el.height);
      } else {
        targets[i].set(0, 0, 0, 0);
      }
    }
  }, [elements, targets]);

  useFrame((state) => {
    if (!mat.current) return;

    const uniforms = mat.current.uniforms;

    uniforms.uTime.value = state.clock.getElapsedTime();
    uniforms.uScroll.value = window.scrollY / window.innerHeight;
    uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);

    uniforms.uMouse.value.lerp(mouseRef.current, 0.2);
    uniforms.uMouseVelocity.value.lerp(mouseVelocityRef.current, 0.1);
    mouseVelocityRef.current.multiplyScalar(0.92);

    const elementUniforms = uniforms.uElements.value;
    for (let i = 0; i < 20; i++) {
      elementUniforms[i].lerp(targets[i], 0.1);
    }
  });

  return (
    <mesh position={[0, 0, -1]}>
      <planeGeometry args={[viewport.width, viewport.height]} /> 
      <shaderMaterial
        ref={mat}
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: new Vector2(0, 0) },
          uMouseVelocity: { value: new Vector2(0, 0) },
          uScroll: { value: 0 },
          uElementCount: { value: 0 },
          uResolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
          uElements: { value: Array.from({ length: 20 }, () => new Vector4(0, 0, 0, 0)) }
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  );
}

export function BackgroundField() {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const calculateElements = () => {
      const tracked = document.querySelectorAll('button, .card, input, h1, section'); 
      const newElements = [];
      const invW = 1.0 / window.innerWidth;
      const invH = 1.0 / window.innerHeight;
      const scrollY = window.scrollY;

      tracked.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const centerX = (rect.left + rect.width * 0.5) * invW;
          const docTop = rect.top + scrollY;
          const docCenterY = docTop + rect.height * 0.5;
          const normalizedY = docCenterY * invH;

          newElements.push({
            x: centerX,
            y: normalizedY, 
            width: rect.width * invW,
            height: rect.height * invH
          });
        }
      });
      setElements(newElements);
    };

    let timeout;
    const onLayoutChange = () => {
        clearTimeout(timeout);
        timeout = setTimeout(calculateElements, 100);
    };

    const resizeObserver = new ResizeObserver(onLayoutChange);
    resizeObserver.observe(document.body);
    window.addEventListener('resize', onLayoutChange);
    calculateElements();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', onLayoutChange);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <Canvas
      className="fixed inset-0 -z-10"
      orthographic
      camera={{ zoom: 1, position: [0, 0, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        background: '#050508'
      }}
      dpr={[1, 2]}
      gl={{ alpha: false, antialias: false }}
    >
      <ElectromagneticField elements={elements} />
    </Canvas>
  );
}
