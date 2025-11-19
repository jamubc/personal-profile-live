import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector2 } from 'three';
import * as THREE from 'three';

/**
 * WebGL Shader-based Glass Effect
 * Creates realistic refraction and liquid-like distortion
 * using fragment shaders and real-time rendering
 */

const glassVertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vPosition = position;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const glassFragmentShader = `
#ifdef GL_ES
precision highp float;
#endif

#define PI 3.14159265359

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float uIOR; // Index of Refraction
uniform float uDistortionStrength;
uniform float uChromaticAberration;
uniform sampler2D uBackground; // Background texture to refract

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

// Simplex noise for organic distortion
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

// Fresnel effect for realistic glass edges
float fresnel(vec3 viewDir, vec3 normal, float power) {
    return pow(1.0 - abs(dot(viewDir, normal)), power);
}

void main() {
    vec2 uv = vUv;

    // Mouse position influence
    vec2 mouseUv = uMouse * 0.5 + 0.5;
    float mouseDist = length(uv - mouseUv);

    // Animated liquid distortion using layered noise
    float time = uTime * 0.3;

    // Layer 1: Large slow waves
    vec2 distortion1 = vec2(
        snoise(uv * 2.0 + vec2(time * 0.2, 0.0)),
        snoise(uv * 2.0 + vec2(0.0, time * 0.2))
    ) * 0.02;

    // Layer 2: Medium ripples
    vec2 distortion2 = vec2(
        snoise(uv * 4.0 - vec2(time * 0.4, time * 0.3)),
        snoise(uv * 4.0 + vec2(time * 0.3, -time * 0.4))
    ) * 0.015;

    // Layer 3: Fine detail
    vec2 distortion3 = vec2(
        snoise(uv * 8.0 + time * 0.5),
        snoise(uv * 8.0 - time * 0.5)
    ) * 0.008;

    // Mouse interaction - creates ripples
    vec2 mouseDistortion = vec2(0.0);
    if (mouseDist < 0.5) {
        float mouseInfluence = (0.5 - mouseDist) * 2.0;
        float ripple = sin(mouseDist * 20.0 - uTime * 3.0) * mouseInfluence;
        vec2 toMouse = normalize(uv - mouseUv);
        mouseDistortion = toMouse * ripple * 0.03;
    }

    // Combine all distortions
    vec2 totalDistortion = (distortion1 + distortion2 + distortion3 + mouseDistortion) * uDistortionStrength;

    // Refraction simulation using normal displacement
    // Simulate glass thickness and IOR
    vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
    vec3 refractNormal = normalize(vNormal + vec3(totalDistortion, 0.0));

    // Snell's law approximation for refraction offset
    float iorRatio = 1.0 / uIOR;
    vec2 refractOffset = refractNormal.xy * (1.0 - iorRatio) * 0.1;

    // Chromatic aberration - split RGB channels
    vec2 uvR = uv + totalDistortion + refractOffset * (1.0 + uChromaticAberration);
    vec2 uvG = uv + totalDistortion + refractOffset;
    vec2 uvB = uv + totalDistortion + refractOffset * (1.0 - uChromaticAberration);

    // Sample background with chromatic aberration
    // Since we don't have actual background texture, we'll create a procedural one
    // In production, you'd render the background to a texture first

    // Procedural background sampling (simulates your shader background)
    vec3 bgColor;

    // Simulate electromagnetic field colors with refraction
    float fieldR = sin(uvR.x * 10.0 + uTime) * cos(uvR.y * 10.0 - uTime);
    float fieldG = sin(uvG.x * 10.0 + uTime * 0.8) * cos(uvG.y * 10.0 - uTime * 0.8);
    float fieldB = sin(uvB.x * 10.0 + uTime * 1.2) * cos(uvB.y * 10.0 - uTime * 1.2);

    bgColor.r = fieldR * 0.4 + 0.3;
    bgColor.g = fieldG * 0.5 + 0.4;
    bgColor.b = fieldB * 0.6 + 0.5;

    // Fresnel effect - edges are more reflective
    float fresnelFactor = fresnel(viewDir, refractNormal, 3.0);

    // Glass tint and reflection color
    vec3 glassTint = vec3(0.95, 0.97, 1.0); // Slight blue tint
    vec3 reflectionColor = vec3(1.0, 1.0, 1.0);

    // Combine refracted background with fresnel reflection
    vec3 finalColor = mix(bgColor * glassTint, reflectionColor, fresnelFactor * 0.3);

    // Add subtle internal reflections (caustics)
    float caustic = sin(uvG.x * 30.0 + uTime * 2.0) * sin(uvG.y * 30.0 - uTime * 2.0);
    caustic = pow(abs(caustic), 3.0) * 0.1;
    finalColor += vec3(0.6, 0.8, 1.0) * caustic;

    // Edge glow enhancement
    finalColor += vec3(0.4, 0.6, 1.0) * fresnelFactor * 0.2;

    // Slight vignette for depth
    float vignette = 1.0 - length(uv - 0.5) * 0.3;
    finalColor *= vignette;

    // Output with transparency
    float alpha = 0.85 + fresnelFactor * 0.15;

    gl_FragColor = vec4(finalColor, alpha);
}
`;

export function GlassShader({ bounds, mouseRef }) {
  const meshRef = useRef();
  const materialRef = useRef();
  const { size, viewport } = useThree();

  const mouseTarget = useRef(new Vector2(0, 0));
  const mouseCurrent = useRef(new Vector2(0, 0));

  // Shader uniforms
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new Vector2(0, 0) },
      uResolution: { value: new Vector2(size.width, size.height) },
      uIOR: { value: 1.45 }, // Index of refraction (glass = ~1.5)
      uDistortionStrength: { value: 1.0 },
      uChromaticAberration: { value: 0.02 },
      uBackground: { value: null }
    }),
    [size]
  );

  // Animation loop
  useFrame((state) => {
    if (!materialRef.current) return;

    // Update time
    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();

    // Update mouse from ref if available
    if (mouseRef && mouseRef.current) {
        mouseTarget.current.set(mouseRef.current.x, mouseRef.current.y);
    }

    // Smooth mouse interpolation
    mouseCurrent.current.lerp(mouseTarget.current, 0.1);
    materialRef.current.uniforms.uMouse.value.copy(mouseCurrent.current);

    // Update resolution
    materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
  });

  // Calculate mesh position and scale from bounds
  const position = useMemo(() => {
    if (!bounds) return [0, 0, 0];
    return [
      (bounds.left + bounds.width / 2 - viewport.width / 2),
      -(bounds.top + bounds.height / 2 - viewport.height / 2),
      0.5 // Slightly in front
    ];
  }, [bounds, viewport]);

  const scale = useMemo(() => {
    if (!bounds) return [1, 1, 1];
    return [bounds.width, bounds.height, 1];
  }, [bounds]);

  if (!bounds) return null;

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={glassVertexShader}
        fragmentShader={glassFragmentShader}
        transparent={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}