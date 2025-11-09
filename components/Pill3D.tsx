import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export const Pill3D: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const currentMount = mountRef.current;

        // Scene
        const scene = new THREE.Scene();

        // Camera
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        camera.position.z = 5;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 2.0;
        controls.enableDamping = true;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Pill Geometry
        const pillGroup = new THREE.Group();
        const material1 = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.2, metalness: 0.3 }); // sky-500
        const material2 = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2, metalness: 0.3 }); // slate-50
        
        const cylinderHeight = 1.5;
        const radius = 0.8;

        // Create two halves to simulate a two-colored capsule
        const cylinderGeom1 = new THREE.CylinderGeometry(radius, radius, cylinderHeight / 2, 64);
        cylinderGeom1.translate(0, cylinderHeight / 4, 0);
        const half1 = new THREE.Mesh(cylinderGeom1, material1);
        
        const cylinderGeom2 = new THREE.CylinderGeometry(radius, radius, cylinderHeight / 2, 64);
        cylinderGeom2.translate(0, -cylinderHeight / 4, 0);
        const half2 = new THREE.Mesh(cylinderGeom2, material2);

        const sphereGeom = new THREE.SphereGeometry(radius, 64, 32);
        const topSphere = new THREE.Mesh(sphereGeom, material1);
        topSphere.position.y = cylinderHeight / 2;

        const bottomSphere = new THREE.Mesh(sphereGeom, material2);
        bottomSphere.position.y = -cylinderHeight / 2;
        
        pillGroup.add(half1, half2, topSphere, bottomSphere);
        pillGroup.rotation.z = Math.PI / 4; // Tilt it a bit

        scene.add(pillGroup);

        // Animation loop
        let animationFrameId: number;
        const animate = () => {
            controls.update();
            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        // Handle resize
        const handleResize = () => {
            if (currentMount) {
                camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            }
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (currentMount) {
                currentMount.removeChild(renderer.domElement);
            }
            cancelAnimationFrame(animationFrameId);
            // Dispose of Three.js objects
            scene.traverse(object => {
                if (object instanceof THREE.Mesh) {
                    object.geometry.dispose();
                    object.material.dispose();
                }
            })
        };
    }, []);

    return <div ref={mountRef} className="w-full h-full" />;
};
