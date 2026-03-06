import React, { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader"; // Loader nativo

function Model({ url }: { url: string }) {
  // O useLoader é a forma padrão e estável de carregar ficheiros no Fiber
  const geometry = useLoader(STLLoader, url);

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial 
        color="#3b82f6" 
        roughness={0.2} 
        metalness={0.9} 
      />
    </mesh>
  );
}