"use client"; // Necessário para componentes interativos no Next.js

import React, { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

// Componente que carrega e renderiza o modelo
function Model({ url }: { url: string }) {
  // Carrega a geometria usando o loader do Three.js
  const geometry = useLoader(STLLoader, url);

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color="#3b82f6" roughness={0.2} metalness={0.9} />
    </mesh>
  );
}

// Componente principal do Visualizador
export default function STLViewer({ url }: { url: string }) {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <Suspense fallback={null}>
          <Stage 
            environment="city" 
            intensity={0.6} 
            adjustCamera={true}
            // Removemos o objeto complexo e passamos as props de forma que o TS aceite melhor
            shadows={true} 
          >
            <Model url={url} />
          </Stage>
        </Suspense>
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
}