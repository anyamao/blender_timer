import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useRef } from "react";
import { Mesh } from "three";

const BlenderModel = () => {
  const meshRef = useRef<Mesh>(null);

  const gltf = useLoader(GLTFLoader, "/Timer_mockup_2.glb");

  return (
    <primitive
      ref={meshRef}
      object={gltf.scene}
      scale={1}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
    />
  );
};

export default BlenderModel;
