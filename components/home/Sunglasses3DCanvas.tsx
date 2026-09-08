"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { Hand } from "lucide-react"

interface Sunglasses3DCanvasProps {
  modelPath?: string
  className?: string
}

export function Sunglasses3DCanvas({
  modelPath = "/video/blender1.glb",
  className = "",
}: Sunglasses3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loading, setLoading] = useState(true)
  const [showDragHint, setShowDragHint] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    let animationFrameId: number
    let hintTimer: NodeJS.Timeout

    // 1. Scene Setup
    const scene = new THREE.Scene()

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 1000)
    camera.position.set(0, 0, 4.2)

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // 4. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.5)
    mainLight.position.set(5, 8, 5)
    scene.add(mainLight)

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.2)
    fillLight.position.set(-5, 3, -2)
    scene.add(fillLight)

    const topLight = new THREE.DirectionalLight(0xffffff, 1.5)
    topLight.position.set(0, 10, 0)
    scene.add(topLight)

    const bounceLight = new THREE.DirectionalLight(0xffffff, 0.8)
    bounceLight.position.set(0, -6, 4)
    scene.add(bounceLight)

    // 5. Controls Setup
    const controls = new OrbitControls(camera, renderer.domElement)

    controls.target.set(0, 0, 0)
    controls.enableDamping = true
    controls.dampingFactor = 0.06

    controls.enableZoom = false
    controls.enablePan = false
    controls.autoRotate = false
    controls.rotateSpeed = 0.75

    // Full vertical and horizontal rotation
    controls.minPolarAngle = 0.01
    controls.maxPolarAngle = Math.PI - 0.01
    controls.minAzimuthAngle = -Infinity
    controls.maxAzimuthAngle = Infinity

    controls.update()

    let lastFrameTime = performance.now()
    const startTime = performance.now()
    let autoTime = 0
    let isInteracting = false
    let lastInteractionTime = -10000

    const handleControlStart = () => {
      setHasInteracted(true)
      setShowDragHint(false)
      clearTimeout(hintTimer)
      isInteracting = true
    }

    const handleControlEnd = () => {
      isInteracting = false
      lastInteractionTime = performance.now()
    }

    controls.addEventListener("start", handleControlStart)
    controls.addEventListener("end", handleControlEnd)

    // 6. Model Container Group
    const modelGroup = new THREE.Group()
    scene.add(modelGroup)

    // 7. Load GLTF Model
    const loader = new GLTFLoader()

    loader.load(
      modelPath,
      (gltf) => {
        const rawObject = gltf.scene

        // Remove unwanted embedded image planes
        const toRemove: THREE.Object3D[] = []

        rawObject.traverse((child) => {
          const name = child.name.toLowerCase()

          if (
            name.includes("chatgpt image") ||
            name.includes("image jul")
          ) {
            toRemove.push(child)
          }
        })

        toRemove.forEach((child) => {
          child.parent?.remove(child)
        })

        // Centre the GLB geometry
        rawObject.updateMatrixWorld(true)

        const originalBox = new THREE.Box3().setFromObject(rawObject)
        const originalCenter = originalBox.getCenter(new THREE.Vector3())

        rawObject.position.sub(originalCenter)

        // Create a pivot at the true centre
        const pivotGroup = new THREE.Group()
        pivotGroup.add(rawObject)

        /*
         * Front-facing upright default orientation.
         * The GLB model's natural position at (0,0,0) faces straight forward
         * into the camera (matching the reference product photo).
         */
        pivotGroup.rotation.set(0, 0, 0)

        pivotGroup.updateMatrixWorld(true)

        // Resize after centering
        const displayBox = new THREE.Box3().setFromObject(pivotGroup)
        const displaySize = displayBox.getSize(new THREE.Vector3())

        const mainDimension = Math.max(
          displaySize.x,
          displaySize.y,
          displaySize.z
        )

        if (mainDimension > 0) {
          const isMobile = typeof window !== "undefined" && window.innerWidth < 768
          const targetSize = isMobile ? 0.8 : 1.25
          pivotGroup.scale.setScalar(targetSize / mainDimension)
        }

        // Material improvements
        rawObject.traverse((child) => {
          if (!(child as THREE.Mesh).isMesh) return

          const mesh = child as THREE.Mesh
          const materials = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material]

          materials.forEach((material) => {
            material.side = THREE.DoubleSide

            if (
              material instanceof THREE.MeshStandardMaterial ||
              material instanceof THREE.MeshPhysicalMaterial
            ) {
              material.envMapIntensity = 2.5
            }

            material.needsUpdate = true
          })
        })

        modelGroup.add(pivotGroup)

        // Keep everything centred
        modelGroup.position.set(0, 0, 0)

        controls.target.set(0, 0, 0)
        controls.update()

        setLoading(false)

        // Show drag hint for exactly 2 seconds after model finishes loading
        setShowDragHint(true)
        clearTimeout(hintTimer)
        hintTimer = setTimeout(() => {
          setShowDragHint(false)
        }, 2000)
      },
      undefined,
      (error) => {
        console.error("Error loading 3D model:", error)
        setLoadError(true)
        setLoading(false)
      }
    )

    // 8. Resize Handler
    const handleResize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      if (width === 0 || height === 0) return

      camera.aspect = width / height
      camera.updateProjectionMatrix()

      renderer.setSize(width, height)
    }

    const resizeObserver = new ResizeObserver(() => {
      handleResize()
    })
    resizeObserver.observe(container)
    handleResize()

    // 9. Animation Loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      const now = performance.now()
      const delta = Math.min((now - lastFrameTime) / 1000, 0.1)
      lastFrameTime = now

      const isUserActive = isInteracting || (now - lastInteractionTime < 2000)

      if (!isUserActive) {
        autoTime += delta

        // Gentle auto movement targets
        const targetXRot = Math.sin(autoTime * 0.5) * 0.12
        const targetYRotSpeed = 0.25
        const targetXPos = Math.sin(autoTime * 0.6) * 0.03
        const targetYPos = Math.sin(autoTime * 1.0) * 0.04

        // Apply with smooth lerping
        modelGroup.rotation.x = THREE.MathUtils.lerp(modelGroup.rotation.x, targetXRot, 4 * delta)
        modelGroup.rotation.y += targetYRotSpeed * delta
        modelGroup.position.x = THREE.MathUtils.lerp(modelGroup.position.x, targetXPos, 3 * delta)
        modelGroup.position.y = THREE.MathUtils.lerp(modelGroup.position.y, targetYPos, 3 * delta)
      } else {
        // Smoothly ease back to center when user is actively dragging
        modelGroup.rotation.x = THREE.MathUtils.lerp(modelGroup.rotation.x, 0, 6 * delta)
        modelGroup.position.x = THREE.MathUtils.lerp(modelGroup.position.x, 0, 6 * delta)
        modelGroup.position.y = THREE.MathUtils.lerp(modelGroup.position.y, 0, 6 * delta)
      }

      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    // 10. Cleanup
    return () => {
      clearTimeout(hintTimer)
      resizeObserver.disconnect()
      controls.removeEventListener("start", handleControlStart)
      controls.removeEventListener("end", handleControlEnd)
      cancelAnimationFrame(animationFrameId)
      renderer.dispose()
      scene.clear()
    }
  }, [modelPath])

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[350px] flex items-center justify-center select-none ${className}`}
    >
      {/* Three.js Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing focus:outline-none"
      />

      {/* Interactive White Palm Cursor Drag Hint (Displays for 2 Seconds After Loading) */}
      {showDragHint && !hasInteracted && !loadError && (
        <>
          <style jsx>{`
            @keyframes dragSwipe {
              0% {
                transform: translate(45px, -50%);
              }
              50% {
                transform: translate(-45px, -50%);
              }
              100% {
                transform: translate(45px, -50%);
              }
            }
          `}</style>
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 z-20 flex flex-col items-center justify-center transition-opacity duration-500"
            style={{ animation: "dragSwipe 1.8s ease-in-out infinite" }}
          >
            <div className="relative flex items-center justify-center">
              {/* White Circular Touch Ripple at fingertip */}
              <div className="absolute -top-3 left-[11px] -translate-x-1/2 w-7 h-7 rounded-full bg-white/40 border border-white animate-ping" />
              <div className="absolute -top-2 left-[11px] -translate-x-1/2 w-5 h-5 rounded-full bg-white/95 shadow-md border border-black/10" />

              {/* Clean White Hand Pointer Icon */}
              <svg
                width="42"
                height="42"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
              >
                <path
                  d="M9 11.24V2.5C9 1.67 9.67 1 10.5 1C11.33 1 12 1.67 12 2.5V9.8H12.85C13.54 9.8 14.1 10.36 14.1 11.05V11.8H14.95C15.64 11.8 16.2 12.36 16.2 13.05V13.8H17.05C17.74 13.8 18.3 14.36 18.3 15.05V16C18.3 19.31 15.61 22 12.3 22H10.1C7.62 22 5.43 20.36 4.67 18.01L2.61 11.66C2.33 10.8 2.79 9.87 3.65 9.59C4.33 9.37 5.07 9.61 5.49 10.19L7.5 13V11.24H9Z"
                  fill="white"
                  stroke="#000000"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </>
      )}

      {/* Load Error Fallback */}
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center z-10 text-neutral-400 text-sm">
          Unable to render 3D preview
        </div>
      )}
    </div>
  )
}
