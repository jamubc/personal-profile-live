import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect, createContext, useContext } from 'react';
import { Vector4 } from 'three';

// Context for field repulsion elements
const FieldRepulsionContext = createContext(null);

export function useFieldRepulsion(elementRef) {
  const context = useContext(FieldRepulsionContext);

  useEffect(() => {
    if (!context || !elementRef.current) return;

    const updatePosition = () => {
      const rect = elementRef.current.getBoundingClientRect();
      const normalizedRect = {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
        width: rect.width / window.innerWidth,
        height: rect.height / window.innerHeight
      };
      context.registerElement(elementRef.current, normalizedRect);
    };

    updatePosition();

    const observer = new ResizeObserver(updatePosition);
    observer.observe(elementRef.current);

    window.addEventListener('scroll', updatePosition, { passive: true });
    window.addEventListener('resize', updatePosition, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
      context.unregisterElement(elementRef.current);
    };
  }, [context, elementRef]);
}

const fragmentShader = `
#ifdef GL_ES
precision highp float;
#endif
#define PI 3.14159265359
#define MAX_ELEMENTS 10

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uMouseVelocity;
uniform float uScroll;
uniform int uElementCount;
uniform vec4 uElements[MAX_ELEMENTS]; // x, y, width, height
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

// Calculate repulsion field from DOM elements
vec2 calculateElementRepulsion(vec2 p) {
  vec2 totalRepulsion = vec2(0.0);

  for (int i = 0; i < MAX_ELEMENTS; i++) {
    if (i >= uElementCount) break;

    vec4 element = uElements[i];
    vec2 elementCenter = vec2(element.x, 1.0 - element.y); // Flip Y for screen coords
    vec2 elementSize = vec2(element.z, element.w);

    // Distance from point to element center
    vec2 toElement = p - elementCenter;
    float dist = length(toElement);

    // Create elliptical repulsion zone based on element size
    vec2 normalizedDist = toElement / (elementSize * 0.6 + 0.15);
    float ellipseDist = length(normalizedDist);

    // Smooth repulsion falloff (gentler)
    float repulsionStrength = smoothstep(2.5, 0.8, ellipseDist);

    // Push field lines away from element - clamped for stability
    if (ellipseDist > 0.01) {
      vec2 push = (toElement / ellipseDist) * repulsionStrength * 0.25;
      // Clamp vector components to avoid extreme warping
      push = clamp(push, vec2(-0.2), vec2(0.2));
      totalRepulsion += push;
    }
  }

  return totalRepulsion;
}

void main() {
  vec2 p = vUv;

  // Mouse acts as a charge source - creates field disturbance
  vec2 mousePos = vec2(uMouse.x * 0.5 + 0.5, -uMouse.y * 0.5 + 0.5);
  float distToMouse = distance(p, mousePos);

  // Field strength from charge (inverse square law)
  float chargeField = 1.0 / (1.0 + distToMouse * 3.0);

  // Mouse acceleration creates field ripples - moderated
  float velocityMag = length(uMouseVelocity);
  float ripple = sin(distToMouse * 20.0 - uTime * 3.0) * chargeField * velocityMag * 5.0;

  // Apply field distortion from mouse charge - moderated and clamped
  vec2 fieldDistortion = (p - mousePos) * chargeField * 0.35 * velocityMag;
  fieldDistortion = clamp(fieldDistortion, vec2(-0.15), vec2(0.15));

  // Add repulsion from DOM elements
  vec2 elementRepulsion = calculateElementRepulsion(p);

  vec2 distortedP = p + fieldDistortion + elementRepulsion;

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

// Color gradient (Desaturated from your original)
vec3 c1 = vec3(0.044); // (Original was vec3(0.05, 0.02, 0.15))
vec3 c2 = vec3(0.143); // (Original was vec3(0.15, 0.08, 0.45))
vec3 c3 = vec3(0.347); // (Original was vec3(0.6, 0.15, 0.7))
vec3 c4 = vec3(0.520); // (Original was vec3(0.2, 0.6, 0.95))

  vec3 color;
  if (t < 0.33) {
    color = mix(c1, c2, t / 0.33);
  } else if (t < 0.66) {
    color = mix(c2, c3, (t - 0.33) / 0.33);
  } else {
    color = mix(c3, c4, (t - 0.66) / 0.34);
  }

  // Contour lines with anti-aliasing to reduce flicker
  float lines = 7.0;
  float f = fract(field * lines);
  #if defined(GL_OES_standard_derivatives) || (__VERSION__ >= 300)
    float w = fwidth(field * lines) * 1.5;
    float contour = 1.0 - smoothstep(0.0, w, min(f, 1.0 - f));
  #else
    float contour = 1.0 - smoothstep(0.0, 0.02, min(f, 1.0 - f));
  #endif
  color += vec3(0.6, 0.8, 1.0) * 0.7 * contour;

  // Highlight charge source when moving
  color += vec3(1.0, 0.5, 0.2) * chargeField * velocityMag * 0.6;

  color = clamp(color, 0.0, 1.0);

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

function ElectromagneticField({ elements }) {
  const mat = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const mouseVelocityRef = useRef({ x: 0, y: 0 });
  const prevMouse = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const targetsRef = useRef(Array.from({ length: 10 }, () => [0, 0, 0, 0]));

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

  // Update element target positions only when they change
  useEffect(() => {
    if (mat.current) {
      const count = Math.min(elements.length, 10);
      mat.current.uniforms.uElementCount.value = count;
      // Save targets for smoothing
      for (let i = 0; i < 10; i++) {
        if (i < count) {
          const el = elements[i];
          targetsRef.current[i][0] = el.x;
          targetsRef.current[i][1] = el.y;
          targetsRef.current[i][2] = el.width;
          targetsRef.current[i][3] = el.height;
        } else {
          targetsRef.current[i][0] = 0;
          targetsRef.current[i][1] = 0;
          targetsRef.current[i][2] = 0;
          targetsRef.current[i][3] = 0;
        }
      }
    }
  }, [elements]);

  useFrame((state) => {
    if (mat.current) {
      mat.current.uniforms.uTime.value = state.clock.getElapsedTime();
      mat.current.uniforms.uMouse.value = [mouseRef.current.x, mouseRef.current.y];
      mat.current.uniforms.uMouseVelocity.value = [mouseVelocityRef.current.x, mouseVelocityRef.current.y];
      mat.current.uniforms.uScroll.value = scrollRef.current;

      // Smoothly approach target element positions to avoid jitter/flicker
      const elementArray = mat.current.uniforms.uElements.value;
      const count = mat.current.uniforms.uElementCount.value;
      const alpha = 0.2; // smoothing factor per frame
      for (let i = 0; i < 10; i++) {
        const target = targetsRef.current[i];
        const v = elementArray[i];
        // v is a Vector4
        v.set(
          v.x + (target[0] - v.x) * alpha,
          v.y + (target[1] - v.y) * alpha,
          v.z + (target[2] - v.z) * alpha,
          v.w + (target[3] - v.w) * alpha
        );
      }
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
          uScroll: { value: 0 },
          uElementCount: { value: 0 },
          // Use Vector4 array to match vec4[] uniform and avoid shared references
          uElements: { value: Array.from({ length: 10 }, () => new Vector4(0, 0, 0, 0)) }
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        extensions={{ derivatives: true }}
        transparent
      />
    </mesh>
  );
}

export function BackgroundField() {
  const [elements, setElements] = useState([]);
  const elementsMapRef = useRef(new Map());

  // Auto-detect and track interactive elements
  useEffect(() => {
    let rafId = null;

    const updateElements = () => {
      // Query all buttons, headings, and major containers
      const tracked = document.querySelectorAll('button, h1, h2, .card, [data-field-interact]');
      const newElements = [];

      tracked.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          newElements.push({
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight,
            width: rect.width / window.innerWidth,
            height: rect.height / window.innerHeight
          });
        }
      });

      setElements(newElements);
    };

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateElements);
    };

    updateElements();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateElements, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateElements);
    };
  }, []);

  const contextValue = {
    registerElement: (element, rect) => {
      elementsMapRef.current.set(element, rect);
      setElements(Array.from(elementsMapRef.current.values()));
    },
    unregisterElement: (element) => {
      elementsMapRef.current.delete(element);
      setElements(Array.from(elementsMapRef.current.values()));
    }
  };

  return (
    <FieldRepulsionContext.Provider value={contextValue}>
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
        <ElectromagneticField elements={elements} />
      </Canvas>
    </FieldRepulsionContext.Provider>
  );
}
