"use client";
import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useSTLLoader } from "@react-three/drei";

function Model({ url }: { url: string }) {
  // Adicionamos um cache key único baseado na URL para evitar bugs de re-render
  const geometry = useSTLLoader(url);

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      {/* Cor azul metálica premium para combinar com o teu design */}
      <meshStandardMaterial 
        color="#3b82f6" 
        roughness={0.2} 
        metalness={0.9} 
      />
    </mesh>
  );
}

export default function STLViewer({ url }: { url: string }) {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px', cursor: 'grab' }}>
      <Canvas shadows camera={{ position: [0, 0, 100], fov: 45 }}>
        {/* Luz ambiente para garantir que não haja sombras totalmente pretas */}
        <ambientLight intensity={0.4} />
        
        <Suspense fallback={null}>
          {/* O Stage centra o modelo automaticamente e ajusta o tamanho (muito importante para STL) */}
          <Stage 
            environment="city" 
            intensity={0.6} 
            contactShadow={{ opacity: 0.5, blur: 2 }}
            adjustCamera
          >
            <Model url={url} />
          </Stage>
        </Suspense>

        <OrbitControls 
          makeDefault 
          enableDamping 
          dampingFactor={0.1}
          autoRotate={true} // Dá um toque profissional ao girar sozinho no início
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}