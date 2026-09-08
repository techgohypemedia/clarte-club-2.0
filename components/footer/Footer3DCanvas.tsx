"use client"

import React, { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

interface Footer3DCanvasProps {
  className?: string
  modelPath?: string
}

export function Footer3DCanvas({
  className = "",
  modelPath = "/untitled (2).glb",
}: Footer3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    let animationFrameId: number

    // 1. Scene setup
    const scene = new THREE.Scene()

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
    camera.position.set(0, 0.3, 3.8)

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3

    // 4. Lighting setup (Premium studio lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xfffbf0, 3.2)
    keyLight.position.set(4, 6, 4)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0xf5eedc, 1.8)
    fillLight.position.set(-4, 2, -2)
    scene.add(fillLight)

    const topLight = new THREE.DirectionalLight(0xffffff, 1.5)
    topLight.position.set(0, 8, 0)
    scene.add(topLight)

    const rimLight = new THREE.PointLight(0xc9b07a, 2.0, 15)
    rimLight.position.set(0, 2, -3)
    scene.add(rimLight)

    // 5. Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.enableZoom = false
    controls.enablePan = false
    controls.rotateSpeed = 0.8
    controls.minPolarAngle = Math.PI * 0.15
    controls.maxPolarAngle = Math.PI * 0.85
    controls.update()

    let lastFrameTime = performance.now()
    const startTime = performance.now()
    let isUserInteracting = false
    let lastInteractionTime = -10000

    const onStart = () => {
      isUserInteracting = true
    }
    const onEnd = () => {
      isUserInteracting = false
      lastInteractionTime = performance.now()
    }

    controls.addEventListener("start", onStart)
    controls.addEventListener("end", onEnd)

    // 6. Model Container Group
    const modelGroup = new THREE.Group()
    scene.add(modelGroup)

    // 7. Load GLTF Model
    const loader = new GLTFLoader()
    loader.load(
      modelPath,
      (gltf) => {
        const rawObject = gltf.scene

        // Center model geometry
        rawObject.updateMatrixWorld(true)
        const box = new THREE.Box3().setFromObject(rawObject)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())

        rawObject.position.sub(center)

        const maxDim = Math.max(size.x, size.y, size.z)
        const pivot = new THREE.Group()
        pivot.add(rawObject)

        if (maxDim > 0) {
          const targetScale = 2.1 / maxDim
          pivot.scale.setScalar(targetScale)
        }

        // Upright default orientation
        pivot.rotation.set(0, 0, 0)

        // Enhance materials
        rawObject.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh
            if (mesh.material) {
              const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
              mats.forEach((m) => {
                m.side = THREE.DoubleSide
                if (m instanceof THREE.MeshStandardMaterial || m instanceof THREE.MeshPhysicalMaterial) {
                  m.roughness = Math.min(m.roughness, 0.6)
                  m.needsUpdate = true
                }
              })
            }
          }
        })

        modelGroup.add(pivot)
        controls.target.set(0, 0, 0)
        controls.update()
        setIsLoaded(true)
      },
      undefined,
      (error) => {
        console.error("Error loading 3D model:", error)
        setHasError(true)
      }
    )

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return
      const width = container.clientWidth
      const height = container.clientHeight
      if (width === 0 || height === 0) return

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    const resizeObserver = new ResizeObserver(() => handleResize())
    resizeObserver.observe(container)
    handleResize()

    // 9. Animation Loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      const now = performance.now()
      const delta = Math.min((now - lastFrameTime) / 1000, 0.1)
      lastFrameTime = now

      const isDragging = isUserInteracting || (now - lastInteractionTime < 1500)

      // Lock position stably in place (no floating up/down)
      modelGroup.position.set(0, 0, 0)

      if (!isDragging) {
        // Smooth default 360 rotation in place
        modelGroup.rotation.y += 0.45 * delta
      }

      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    // 10. Cleanup
    return () => {
      resizeObserver.disconnect()
      controls.removeEventListener("start", onStart)
      controls.removeEventListener("end", onEnd)
      cancelAnimationFrame(animationFrameId)
      renderer.dispose()
      scene.clear()
    }
  }, [modelPath])

  if (hasError) return null

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[220px] sm:h-[240px] md:h-[220px] flex items-center justify-center select-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing focus:outline-none"
        title="Clarté Club 3D Shopping Bag - Drag to rotate"
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="size-5 rounded-full border border-white/20 border-t-[#C9B07A] animate-spin" />
        </div>
      )}
    </div>
  )
}
