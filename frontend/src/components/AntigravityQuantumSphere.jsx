import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function AntigravityQuantumSphere({ isReducedMotion = false }) {
  const mountRef = useRef(null);
  const [fps, setFps] = useState(120);
  const [orbitVec, setOrbitVec] = useState([0.94, 0.12, -0.44]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let scene, camera, renderer, animationFrameId;
    let coreMesh, innerCore, ring1, ring2, ring3, particlesMesh;
    let mouseX = 0, mouseY = 0;
    let targetRotX = 0, targetRotY = 0;
    let lastTime = performance.now();
    let frameCount = 0;
    let isVisible = true;

    try {
      const width = container.clientWidth || 400;
      const height = container.clientHeight || 400;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
      camera.position.z = 24;

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);

      // 1. Central Quantum Core (Icosahedron + Wireframe)
      const coreGeo = new THREE.IcosahedronGeometry(4.2, 2);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        wireframe: true,
        emissive: 0x00363a,
        emissiveIntensity: 0.8,
        roughness: 0.1,
        metalness: 0.9,
      });
      coreMesh = new THREE.Mesh(coreGeo, coreMat);
      scene.add(coreMesh);

      // Inner pulsating singularity
      const innerGeo = new THREE.SphereGeometry(2.4, 24, 24);
      const innerMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        wireframe: false,
        transparent: true,
        opacity: 0.35,
      });
      innerCore = new THREE.Mesh(innerGeo, innerMat);
      coreMesh.add(innerCore);

      // 2. Gimbal Orbital Rings (Zero-G stabilizers)
      const ringGeo1 = new THREE.TorusGeometry(6.8, 0.08, 16, 100);
      const ringMat1 = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.7,
      });
      ring1 = new THREE.Mesh(ringGeo1, ringMat1);
      scene.add(ring1);

      const ringGeo2 = new THREE.TorusGeometry(8.2, 0.07, 16, 100);
      const ringMat2 = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6, // Electric Violet
        transparent: true,
        opacity: 0.65,
      });
      ring2 = new THREE.Mesh(ringGeo2, ringMat2);
      ring2.rotation.x = Math.PI / 3;
      scene.add(ring2);

      const ringGeo3 = new THREE.TorusGeometry(9.6, 0.06, 16, 100);
      const ringMat3 = new THREE.MeshBasicMaterial({
        color: 0x10b981, // Cyber Emerald
        transparent: true,
        opacity: 0.55,
      });
      ring3 = new THREE.Mesh(ringGeo3, ringMat3);
      ring3.rotation.y = Math.PI / 4;
      scene.add(ring3);

      // 3. Swarming Quantum Tensor Particles
      const particleCount = 450;
      const positions = new Float32Array(particleCount * 3);
      const pColors = new Float32Array(particleCount * 3);
      const cyan = new THREE.Color(0x00f0ff);
      const violet = new THREE.Color(0x8b5cf6);
      const emerald = new THREE.Color(0x65f2b5);

      for (let i = 0; i < particleCount * 3; i += 3) {
        const radius = 10 + Math.random() * 8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = radius * Math.cos(phi);

        const choice = Math.random();
        const col = choice < 0.5 ? cyan : choice < 0.8 ? violet : emerald;
        pColors[i] = col.r;
        pColors[i + 1] = col.g;
        pColors[i + 2] = col.b;
      }

      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

      const pMat = new THREE.PointsMaterial({
        size: 0.35,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });

      particlesMesh = new THREE.Points(pGeo, pMat);
      scene.add(particlesMesh);

      // 4. Photonic Lighting
      const ambLight = new THREE.AmbientLight(0x08080c, 1.5);
      scene.add(ambLight);

      const cyanPoint = new THREE.PointLight(0x00f0ff, 3, 50);
      cyanPoint.position.set(12, 12, 12);
      scene.add(cyanPoint);

      const violetPoint = new THREE.PointLight(0x8b5cf6, 2.5, 50);
      violetPoint.position.set(-12, -12, 10);
      scene.add(violetPoint);

      // Mouse tracking
      const handleMouseMove = (e) => {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        mouseX = x;
        mouseY = y;
        targetRotY = x * 0.8;
        targetRotX = -y * 0.8;

        const vecZ = Math.sqrt(Math.max(0, 1 - x * x - y * y));
        setOrbitVec([
          parseFloat(x.toFixed(2)),
          parseFloat(y.toFixed(2)),
          parseFloat((-vecZ).toFixed(2)),
        ]);
      };

      const handleResize = () => {
        if (!container || !camera || !renderer) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener('resize', handleResize);
      container.addEventListener('mousemove', handleMouseMove);

      // Intersection Observer
      const observer = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
      });
      observer.observe(container);

      // Animation Loop
      let clock = new THREE.Clock();
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        if (!isVisible || document.hidden) return;

        const elapsed = clock.getElapsedTime();

        // FPS calculation
        frameCount++;
        const now = performance.now();
        if (now - lastTime >= 1000) {
          setFps(Math.round((frameCount * 1000) / (now - lastTime)));
          frameCount = 0;
          lastTime = now;
        }

        // Rotations
        if (coreMesh) {
          coreMesh.rotation.y = elapsed * 0.25 + targetRotY * 0.5;
          coreMesh.rotation.x = elapsed * 0.15 + targetRotX * 0.5;
          const scale = 1 + Math.sin(elapsed * 2.5) * 0.05;
          innerCore.scale.set(scale, scale, scale);
        }

        if (ring1) {
          ring1.rotation.z = elapsed * 0.4;
          ring1.rotation.x = Math.sin(elapsed * 0.2) * 0.3;
        }
        if (ring2) {
          ring2.rotation.y = elapsed * 0.3;
          ring2.rotation.z = Math.cos(elapsed * 0.25) * 0.3;
        }
        if (ring3) {
          ring3.rotation.x = -elapsed * 0.25;
          ring3.rotation.y = elapsed * 0.2;
        }

        if (particlesMesh) {
          particlesMesh.rotation.y = elapsed * 0.08;
        }

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        window.removeEventListener('resize', handleResize);
        container.removeEventListener('mousemove', handleMouseMove);
        observer.disconnect();
        if (animationFrameId) cancelAnimationFrame(animationFrameId);

        if (renderer && renderer.domElement) {
          if (renderer.domElement.parentNode === container) {
            container.removeChild(renderer.domElement);
          }
          renderer.dispose();
        }
        if (coreGeo) coreGeo.dispose();
        if (coreMat) coreMat.dispose();
        if (innerGeo) innerGeo.dispose();
        if (innerMat) innerMat.dispose();
        if (ringGeo1) ringGeo1.dispose();
        if (ringMat1) ringMat1.dispose();
        if (ringGeo2) ringGeo2.dispose();
        if (ringMat2) ringMat2.dispose();
        if (ringGeo3) ringGeo3.dispose();
        if (ringMat3) ringMat3.dispose();
        if (pGeo) pGeo.dispose();
        if (pMat) pMat.dispose();
      };
    } catch (err) {
      console.warn("WebGL sphere render fallback:", err);
    }
  }, [isReducedMotion]);

  return (
    <div className="position-relative w-100 h-100 overflow-hidden rounded-3 bg-[#0e0e12] shadow-[0_0_60px_rgba(0,240,255,0.15)]" style={{ minHeight: '380px', aspectRatio: '1 / 1' }}>
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="position-absolute top-0 start-0 w-100 h-100" style={{ cursor: 'crosshair' }} />

      {/* Layer 2: Glass HUD Top Micro-telemetry */}
      <div className="position-absolute top-0 start-0 w-100 p-3 d-flex justify-content-between align-items-start pointer-events-none" style={{ zIndex: 2 }}>
        <div className="d-flex flex-column font-label-hud px-2 py-1 rounded" style={{ background: 'rgba(14, 14, 18, 0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ color: '#00f0ff', fontWeight: 600 }}>SYS_VIEW // HOLO_SPHERE_01</span>
          <span style={{ color: '#94a3b8', fontSize: '9px' }}>FPS: {fps}.0 | BUFFER: QUAD</span>
        </div>
        <div className="d-flex align-items-center gap-1 font-label-hud px-2 py-1 rounded" style={{ background: 'rgba(14, 14, 18, 0.85)', backdropFilter: 'blur(12px)', color: '#65f2b5', border: '1px solid rgba(16,185,129,0.25)' }}>
          <span className="rounded-circle animate-ag-pulse" style={{ width: '6px', height: '6px', backgroundColor: '#65f2b5', display: 'inline-block' }}></span>
          <span>ORBIT_VEC: [{orbitVec.join(', ')}]</span>
        </div>
      </div>

      {/* Layer 2: Bottom Status Bar */}
      <div className="position-absolute bottom-0 start-0 w-100 p-3 pointer-events-none" style={{ zIndex: 2 }}>
        <div className="d-flex align-items-center justify-content-between font-label-hud px-3 py-2 rounded" style={{ background: 'rgba(14, 14, 18, 0.88)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,240,255,0.2)' }}>
          <div className="d-flex align-items-center gap-2 text-light">
            <span className="material-symbols-outlined" style={{ color: '#7df4ff', fontSize: '15px' }}>memory</span>
            <span className="text-uppercase" style={{ letterSpacing: '0.08em' }}>CORE: PYTHON 3.14t ASYNC MESH</span>
          </div>
          <span className="font-code-terminal" style={{ color: '#00f0ff' }}>v2027.04</span>
        </div>
      </div>

      {/* Hairline Corner Crosshairs (+) */}
      <span className="hud-crosshair-tl">+</span>
      <span className="hud-crosshair-tr">+</span>
      <span className="hud-crosshair-bl">+</span>
      <span className="hud-crosshair-br">+</span>
    </div>
  );
}
