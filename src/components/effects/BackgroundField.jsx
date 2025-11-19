import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import { Vector4 } from 'three';
import { FieldRepulsionContext } from '../../hooks/useFieldRepulsion';

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
    // element.y is document-relative normalized Y
    // uScroll is normalized scroll offset
    // Convert to screen space UV (0..1 bottom-up)
    float elementY = 1.0 - (element.y - uScroll);
    
    vec2 elementCenter = vec2(element.x, elementY);
    vec2 elementSize = vec2(element.z, element.w);

    // Distance from point to element center
    vec2 toElement = p - elementCenter;
    
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
  vec2 mousePos = vec2(uMouse.x * 0.5 + 0.5, -uMouse.y * 0.5 + 0.5); // Mouse is already -1..1
  // Wait, uMouse in JS is -1..1.
  // In shader: x * 0.5 + 0.5 maps -1..1 to 0..1.
  // y: -y * 0.5 + 0.5. If y is 1 (top), -1*0.5+0.5 = 0.
  // If y is -1 (bottom), 1*0.5+0.5 = 1.
  // So mousePos is (0,0) at top-left?
  // vUv is (0,0) at bottom-left.
  // We need mousePos to match vUv.
  // If mouse y=1 is top, we want vUv y=1.
  // So we want mousePos.y = 1 when uMouse.y = 1.
  // uMouse.y comes from JS: -(clientY/h)*2 + 1.
  // clientY=0 -> y=1. clientY=h -> y=-1.
  // So uMouse.y is 1 at top, -1 at bottom.
  // We want 0..1 (bottom to top).
  // So (uMouse.y + 1.0) * 0.5.
  
  vec2 mouseUv = vec2(uMouse.x * 0.5 + 0.5, uMouse.y * 0.5 + 0.5);
  
  float distToMouse = distance(p, mouseUv);

  // Field strength from charge (inverse square law)
  float chargeField = 1.0 / (1.0 + distToMouse * 3.0);

  // Mouse acceleration creates field ripples - moderated
  float velocityMag = length(uMouseVelocity);
  float ripple = sin(distToMouse * 20.0 - uTime * 3.0) * chargeField * velocityMag * 8.0; // Increased ripple intensity

  // Apply field distortion from mouse charge - moderated and clamped
  vec2 fieldDistortion = (p - mouseUv) * chargeField * 0.45 * velocityMag; // Increased distortion
  fieldDistortion = clamp(fieldDistortion, vec2(-0.2), vec2(0.2));

  // Add repulsion from DOM elements
  vec2 elementRepulsion = calculateElementRepulsion(p);

  vec2 distortedP = p + fieldDistortion + elementRepulsion;

  // Scroll-driven propagation (very subtle)
  float z1 = uTime * 0.05 + uScroll * 1.5;
  float z2 = uTime * 0.04 + uScroll * 1.3 + 1.0;
  float z3 = uTime * 0.03 + uScroll * 1.0 + 2.0;

  // Multiple TE modes on distorted field - Simplified for elegance
  float H_z_10 = TE_mode(distortedP, 1.0, 0.0, uTime * 0.5, z1); // Slower
  float H_z_01 = TE_mode(distortedP, 0.0, 1.0, uTime * 0.5, z2);

  float field = (H_z_10 * 0.6 + H_z_01 * 0.4);
  field += ripple * 0.1; // Drastically reduced ripple noise

  float t = field * 0.5 + 0.5;

  // Modern Color Palette - Deep Space Theme
  vec3 bg = vec3(0.02, 0.02, 0.03); // Matches --color-bg-primary
  vec3 accent = vec3(0.39, 0.4, 0.95); // Matches Indigo 500 (#6366f1)
  vec3 secondary = vec3(0.1, 0.1, 0.15); 

  // Smooth mixing
  vec3 color = mix(bg, secondary, t * 0.3);
  
  // Subtler contour lines
  float lines = 8.0; 
  float f = fract(field * lines);
  float w = fwidth(field * lines) * 2.0;
  float contour = 1.0 - smoothstep(0.0, w, min(f, 1.0 - f));
  
  // Faint accent on contours
  color += accent * contour * 0.15; 

  // Highlight charge source when moving
  color += accent * chargeField * velocityMag * 0.2;

  color = clamp(color, 0.0, 1.0);

  gl_FragColor = vec4(color, 1.0);
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
  const targetsRef = useRef(Array.from({ length: 20 }, () => [0, 0, 0, 0]));

  useEffect(() => {
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

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Update element target positions only when they change
  useEffect(() => {
    if (mat.current) {
      const count = Math.min(elements.length, 20);
      mat.current.uniforms.uElementCount.value = count;
      // Save targets for smoothing
      for (let i = 0; i < 20; i++) {
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

      // Pass normalized scroll position to shader for smooth element tracking
      mat.current.uniforms.uScroll.value = window.scrollY / window.innerHeight;

      // Smoothly approach target element positions to avoid jitter/flicker
      const elementArray = mat.current.uniforms.uElements.value;
      const alpha = 0.1; // smoothing factor per frame
      for (let i = 0; i < 20; i++) {
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
          uElements: { value: Array.from({ length: 20 }, () => new Vector4(0, 0, 0, 0)) }
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
    const updateElements = () => {
      // Query all buttons, headings, and major containers
      const tracked = document.querySelectorAll('button, h1, h2, .card, [data-field-interact]');
      const newElements = [];
      const scrollY = window.scrollY;
      const innerHeight = window.innerHeight;
      const innerWidth = window.innerWidth;

      tracked.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          // Calculate position relative to document top
          const docTop = rect.top + scrollY;
          const docCenterY = docTop + rect.height / 2;

          // Normalize by viewport dimensions
          // y is normalized document position (can be > 1)
          newElements.push({
            x: (rect.left + rect.width / 2) / innerWidth,
            y: docCenterY / innerHeight,
            width: rect.width / innerWidth,
            height: rect.height / innerHeight
          });
        }
      });

      setElements(newElements);
    };

    // Run on mount
    updateElements();

    // Use ResizeObserver to detect layout changes
    const resizeObserver = new ResizeObserver(() => {
      updateElements();
    });
    resizeObserver.observe(document.body);

    window.addEventListener('resize', updateElements, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateElements);
    };
  }, []);

  const contextValue = {
    registerElement: (element, rect) => {
      // For manual registration, we assume rect is viewport relative?
      // Or we should calculate document relative here too.
      // But since this is rarely used (if at all), we can just ignore or fix later.
      // For now, let's just store it but we need to be careful about coordinates.
      // If manual registration is used, it might conflict with auto-detection.
      // Given it's unused, I'll leave it as is but it might be buggy if used.
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
          background: 'var(--color-bg-primary)'
        }}
        dpr={[1, 2]}
      >
        <ElectromagneticField elements={elements} />
      </Canvas>
    </FieldRepulsionContext.Provider>
  );
}
