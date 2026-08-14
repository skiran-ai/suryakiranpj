import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function ThreeHeroCanvas({ isReducedMotion = false }) {
  const mountRef = useRef(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    // Check OS-level prefers-reduced-motion or user toggle
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion || prefersReduced) {
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    let scene = null;
    let camera = null;
    let renderer = null;
    let particlesMesh = null;
    let knotMesh = null;
    let animationFrameId = null;
    let isVisible = true;
    let isTabActive = !document.hidden;

    let mouseX = 0;
    let mouseY = 0;
    let targetCameraZ = 40;
    let currentCameraZ = 80;

    // Check WebGL availability safely
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    let particlesGeometry = null;
    let particlesMaterial = null;
    let knotGeometry = null;
    let knotMaterial = null;
    let ambientLight = null;
    let pointLight = null;

    try {
      // 1. Scene Setup
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x0a0c16, 0.0015);

      // 2. Camera Setup
      const aspect = container.clientWidth / (container.clientHeight || 1);
      camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
      camera.position.set(0, 0, currentCameraZ);

      // 3. Renderer with high-refresh display optimization
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "default",
        precision: "mediump"
      });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);

      // 4. Ambient Glowing Particles System
      const particleCount = window.innerWidth < 768 ? 450 : 1000;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      const colorPalette = [
        new THREE.Color('#38bdf8'), // Cyan
        new THREE.Color('#818cf8'), // Indigo
        new THREE.Color('#0ea5e9'), // Deep Blue
      ];

      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 120;
        positions[i + 1] = (Math.random() - 0.5) * 120;
        positions[i + 2] = (Math.random() - 0.5) * 120;

        const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i] = col.r;
        colors[i + 1] = col.g;
        colors[i + 2] = col.b;
      }

      particlesGeometry = new THREE.BufferGeometry();
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      particlesMaterial = new THREE.PointsMaterial({
        size: 0.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });

      particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particlesMesh);

      // 5. Wireframe 3D Geometry Centerpiece (TorusKnot)
      knotGeometry = new THREE.TorusKnotGeometry(8, 2.2, 80, 14);
      knotMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        wireframe: true,
        emissive: 0x1e1b4b,
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.25,
      });
      knotMesh = new THREE.Mesh(knotGeometry, knotMaterial);
      knotMesh.position.set(0, 0, -10);
      scene.add(knotMesh);

      // 6. Lighting
      ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambientLight);

      pointLight = new THREE.PointLight(0x38bdf8, 2, 100);
      pointLight.position.set(20, 20, 20);
      scene.add(pointLight);

      // 7. Mouse Movement with passive listener
      const handleMouseMove = (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener('mousemove', handleMouseMove, { passive: true });

      // 8. Resize Handler with debounced projection
      const handleResize = () => {
        if (!container || !camera || !renderer) return;
        const width = container.clientWidth;
        const height = container.clientHeight || 1;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      window.addEventListener('resize', handleResize, { passive: true });

      // 9. Intersection Observer (pause rendering when out of viewport)
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
          });
        },
        { threshold: 0.05 }
      );
      observer.observe(container);

      // 10. Tab visibility listener (pause rendering when tab is hidden)
      const handleVisibilityChange = () => {
        isTabActive = !document.hidden;
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // 11. Handle Context Loss
      const handleContextLost = (e) => {
        e.preventDefault();
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      };
      const handleContextRestored = () => {
        animate();
      };
      renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);
      renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored, false);

      // 12. Render Animation Loop
      const clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        // Skip rendering if not visible or tab in background
        if (!isVisible || !isTabActive) return;

        const elapsedTime = clock.getElapsedTime();

        // Smooth camera entrance lerp (replaces external GSAP)
        if (Math.abs(currentCameraZ - targetCameraZ) > 0.05) {
          currentCameraZ += (targetCameraZ - currentCameraZ) * 0.03;
          camera.position.z = currentCameraZ;
        }

        // Rotate Meshes
        if (knotMesh) {
          knotMesh.rotation.x = elapsedTime * 0.15;
          knotMesh.rotation.y = elapsedTime * 0.2;
        }

        if (particlesMesh) {
          particlesMesh.rotation.y = elapsedTime * 0.03;
        }

        // Parallax Camera Sway
        camera.position.x += (mouseX * 4 - camera.position.x) * 0.04;
        camera.position.y += (-mouseY * 4 - camera.position.y) * 0.04;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        observer.disconnect();

        if (animationFrameId) cancelAnimationFrame(animationFrameId);

        if (renderer && renderer.domElement) {
          renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
          renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
          if (container && renderer.domElement.parentNode === container) {
            container.removeChild(renderer.domElement);
          }
          renderer.forceContextLoss();
          renderer.dispose();
        }

        if (particlesGeometry) particlesGeometry.dispose();
        if (particlesMaterial) particlesMaterial.dispose();
        if (knotGeometry) knotGeometry.dispose();
        if (knotMaterial) knotMaterial.dispose();

        if (scene) {
          if (particlesMesh) scene.remove(particlesMesh);
          if (knotMesh) scene.remove(knotMesh);
          if (ambientLight) scene.remove(ambientLight);
          if (pointLight) scene.remove(pointLight);
          scene.clear();
        }
      };
    } catch (err) {
      console.warn("WebGL initialization fallback:", err);
      setWebglSupported(false);
    }
  }, [isReducedMotion]);

  if (isReducedMotion || !webglSupported) {
    return (
      <div
        className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(56, 189, 248, 0.15) 0%, rgba(10, 12, 22, 1) 70%)',
          zIndex: 0
        }}
      />
    );
  }

  return (
    <div
      ref={mountRef}
      className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.85 }}
    />
  );
}
