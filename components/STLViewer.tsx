import React, { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader"; // Carregador nativo

function Model({ url }: { url: string }) {
  // Utilizamos o hook de carregamento genérico com o STLLoader do Three.js
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