import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function CarModel() {
  const meshRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={meshRef}>
      {/* Car Body */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[3, 1, 1.5]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      
      {/* Car Roof */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[2.5, 0.8, 1.2]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>
      
      {/* Front Windshield */}
      <mesh position={[0.8, 0.2, 0]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.1, 0.8, 1.2]} />
        <meshStandardMaterial color="#e5e7eb" transparent opacity={0.7} />
      </mesh>
      
      {/* Rear Windshield */}
      <mesh position={[-0.8, 0.2, 0]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[0.1, 0.8, 1.2]} />
        <meshStandardMaterial color="#e5e7eb" transparent opacity={0.7} />
      </mesh>
      
      {/* Wheels */}
      <mesh position={[1.2, -0.8, 0.8]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[1.2, -0.8, -0.8]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[-1.2, -0.8, 0.8]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[-1.2, -0.8, -0.8]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      
      {/* Headlights */}
      <mesh position={[1.6, -0.3, 0.4]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[1.6, -0.3, -0.4]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

function FloatingParts() {
  const partsRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (partsRef.current) {
      partsRef.current.children.forEach((part, index) => {
        part.position.y = Math.sin(state.clock.elapsedTime + index) * 0.2 + 2
        part.rotation.y += 0.01
      })
    }
  })

  return (
    <group ref={partsRef}>
      {/* Floating gear */}
      <mesh position={[2, 2, 0]}>
        <torusGeometry args={[0.3, 0.1, 8, 16]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      
      {/* Floating wrench */}
      <mesh position={[-2, 2.5, 1]}>
        <boxGeometry args={[0.8, 0.1, 0.1]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>
      
      {/* Floating screw */}
      <mesh position={[0, 2.2, -1.5]}>
        <cylinderGeometry args={[0.1, 0.1, 0.3, 8]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>
    </group>
  )
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>
  )
}

export function Hero3D() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />
          
          <CarModel />
          <FloatingParts />
          
          <OrbitControls 
            enableZoom={false} 
            autoRotate 
            autoRotateSpeed={0.5}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
          />
          
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  )
}





