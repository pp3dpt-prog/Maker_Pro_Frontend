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
  <meshPhysicalMaterial
    color="#3b82f6"      // Podes mudar para a cor que quiseres (ex: Azul, Branco, etc.)
    roughness={0.7}      // O PLA não é um espelho, é mate/acetinado
    metalness={0.0}      // PLA é plástico, nunca deve ter valor de metal
    clearcoat={0.1}      // Um brilho muito subtil para simular a camada de topo
    clearcoatRoughness={0.5} 
    reflectivity={0.5}   // Refletividade padrão para plásticos
  />
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