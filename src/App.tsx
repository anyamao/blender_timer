import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  KeyboardControls,
} from "@react-three/drei";
import BlenderModel from "./BlenderModel";
import { useFrame } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useKeyboardControls } from "@react-three/drei";

function CameraController() {
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const [Play, setPlay] = useState(false);
  const controlsRef = useRef<any>();
  const [lastPosition, setLastPosition] = useState(new THREE.Vector3(5, 5, 5));
  const isUserInteractingRef = useRef(false);

  useEffect(() => {
    const unsubscribe = subscribeKeys((state) => {
      /*
      console.log("Key state:", {
        forward: state.forward,
        backward: state.backward,
        left: state.left,
        right: state.right,
      });
          */
    });

    const controls = controlsRef.current;
    if (controls) {
      const onStart = () => {
        isUserInteractingRef.current = true;
      };
      const onEnd = () => {
        isUserInteractingRef.current = false;
      };

      controls.addEventListener("start", onStart);
      controls.addEventListener("end", onEnd);

      return () => {
        unsubscribe();
        controls.removeEventListener("start", onStart);
        controls.removeEventListener("end", onEnd);
      };
    }

    return unsubscribe;
  }, [subscribeKeys]);

  useFrame(() => {
    if (!controlsRef.current) return;

    const { forward, backward, left, right } = getKeys();
    const camera = controlsRef.current.object;

    const isMoving = forward || backward || left || right;

    if (isMoving && !isUserInteractingRef.current) {
      const moveSpeed = 0.2;
      const forwardVector = new THREE.Vector3();
      camera.getWorldDirection(forwardVector);
      forwardVector.y = 0;
      forwardVector.normalize();

      const rightVector = new THREE.Vector3();
      rightVector.crossVectors(camera.up, forwardVector).normalize();

      if (forward) {
        camera.position.addScaledVector(forwardVector, moveSpeed);
      }
      if (backward) {
        camera.position.addScaledVector(forwardVector, -moveSpeed);
      }
      if (left) {
        camera.position.addScaledVector(rightVector, moveSpeed);
      }
      if (right) {
        camera.position.addScaledVector(rightVector, -moveSpeed);
      }

      if (camera.position.z < -10 && Play === false) {
        setPlay(true);
        console.log("reached");
      }
      if (Play) {
        console.log("blue");
      }

      camera.position.y = 10;

      const lookDirection = new THREE.Vector3();
      camera.getWorldDirection(lookDirection);
      controlsRef.current.target.copy(camera.position).add(lookDirection);

      setLastPosition(camera.position.clone());
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      target={[0, 10, -10]}
      enableZoom={false}
      enablePan={false}
      maxPolarAngle={2.2}
    />
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <BlenderModel />
      <CameraController />
      <Environment preset="city" />
      <gridHelper args={[20, 20]} />
    </>
  );
}

function App() {
  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex flex justify-center ">
      <div className=" h-[80px] bg-green-300 bg- mb-[30px]  z-10 flex fixed bottom-0">
        Hi! Follow me to a place lol
      </div>
      <KeyboardControls
        map={[
          { name: "forward", keys: ["KeyW", "ArrowUp"] },
          { name: "backward", keys: ["KeyS", "ArrowDown"] },
          { name: "left", keys: ["KeyA", "ArrowLeft"] },
          { name: "right", keys: ["KeyD", "ArrowRight"] },
        ]}
      >
        <Canvas
          className="!absolute top-0 left-0"
          shadows
          camera={{ position: [5, 10, 5], fov: 50 }}
        >
          <Scene />
        </Canvas>
      </KeyboardControls>
    </div>
  );
}

export default App;
