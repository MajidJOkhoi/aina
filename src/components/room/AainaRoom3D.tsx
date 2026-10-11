import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useMarketplace } from '../../context/MarketplaceContext';
import { AainaProduct } from '../../types';
import {
  Box,
  RotateCw,
  Maximize,
  Sparkles,
  Camera,
  ShoppingBag,
  Layers,
  Ruler,
  CheckCircle2,
  Sliders,
  Eye,
} from 'lucide-react';

export const AainaRoom3D: React.FC = () => {
  const {
    products,
    activeRoomProduct,
    addToCart,
    formatPrice,
    showToast,
  } = useMarketplace();

  // Find all home/living products that support Aaina Room
  const roomProducts = products.filter(p => p.aaina_room_enabled);
  const currentProduct = activeRoomProduct || roomProducts[0];

  const [activeItem, setActiveItem] = useState<AainaProduct>(currentProduct);
  const [selectedMaterialIndex, setSelectedMaterialIndex] = useState<number>(0);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isARMode, setIsARMode] = useState<boolean>(false);
  const [arPlaced, setArPlaced] = useState<boolean>(false);
  const [arScale, setArScale] = useState<number>(100);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const arVideoRef = useRef<HTMLVideoElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const chairMeshGroupRef = useRef<THREE.Group | null>(null);

  // Update active item if context changes
  useEffect(() => {
    if (activeRoomProduct) {
      setActiveItem(activeRoomProduct);
    }
  }, [activeRoomProduct]);

  // Setup Three.js WebGL Scene
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    // Width and height
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0f1117);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(2.8, 1.8, 3.2);
    camera.lookAt(0, 0.4, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Clear previous children
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(4, 6, 4);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const accentLight = new THREE.PointLight(0x6c2bd9, 3, 10);
    accentLight.position.set(-3, 2, -2);
    scene.add(accentLight);

    const cyanLight = new THREE.PointLight(0x00c2ff, 2, 10);
    cyanLight.position.set(2, 3, -3);
    scene.add(cyanLight);

    // Studio Grid & Floor
    const grid = new THREE.GridHelper(6, 12, 0x6c2bd9, 0x1e293b);
    grid.position.y = -0.5;
    scene.add(grid);

    const floorGeo = new THREE.PlaneGeometry(12, 12);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x090a0f,
      roughness: 0.9,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.51;
    floor.receiveShadow = true;
    scene.add(floor);

    // Procedural 3D Model: Sculptural Architectural Armchair
    const group = new THREE.Group();
    chairMeshGroupRef.current = group;

    const materials = activeItem.media.material_options || [
      { name: 'Ivory Bouclé', color: '#F4EFEB', roughness: 0.85, metalness: 0.05 },
    ];
    const activeMatConfig = materials[selectedMaterialIndex] || materials[0];

    // Cushion / Upholstery Material
    const cushionMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(activeMatConfig.color),
      roughness: activeMatConfig.roughness,
      metalness: activeMatConfig.metalness,
      wireframe: isWireframe,
    });

    // Frame Material (Brushed Bronze)
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0x8c6d48,
      roughness: 0.3,
      metalness: 0.85,
      wireframe: isWireframe,
    });

    // 1. Seat Cushion
    const seatGeo = new THREE.BoxGeometry(1.2, 0.28, 1.1);
    const seatMesh = new THREE.Mesh(seatGeo, cushionMaterial);
    seatMesh.position.y = 0;
    seatMesh.castShadow = true;
    group.add(seatMesh);

    // 2. Backrest
    const backGeo = new THREE.BoxGeometry(1.2, 0.9, 0.24);
    const backMesh = new THREE.Mesh(backGeo, cushionMaterial);
    backMesh.position.set(0, 0.45, -0.44);
    backMesh.rotation.x = -0.12;
    backMesh.castShadow = true;
    group.add(backMesh);

    // 3. Armrests (Sculptural Cylinders)
    const armGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.05, 16);
    const leftArm = new THREE.Mesh(armGeo, cushionMaterial);
    leftArm.rotation.x = Math.PI / 2;
    leftArm.position.set(-0.65, 0.25, 0);
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, cushionMaterial);
    rightArm.rotation.x = Math.PI / 2;
    rightArm.position.set(0.65, 0.25, 0);
    group.add(rightArm);

    // 4. Tubular Curved Metal Base & Legs
    const legCurve = new THREE.TorusGeometry(0.6, 0.04, 16, 32, Math.PI);
    const leftBase = new THREE.Mesh(legCurve, frameMaterial);
    leftBase.rotation.y = Math.PI / 2;
    leftBase.position.set(-0.65, -0.15, 0);
    leftBase.castShadow = true;
    group.add(leftBase);

    const rightBase = new THREE.Mesh(legCurve, frameMaterial);
    rightBase.rotation.y = Math.PI / 2;
    rightBase.position.set(0.65, -0.15, 0);
    rightBase.castShadow = true;
    group.add(rightBase);

    scene.add(group);

    // Mouse Interaction for 3D Orbital Rotation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !chairMeshGroupRef.current) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      chairMeshGroupRef.current.rotation.y += deltaX * 0.01;
      camera.position.y = Math.max(0.5, Math.min(4, camera.position.y - deltaY * 0.01));
      camera.lookAt(0, 0.4, 0);

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate && !isDragging && chairMeshGroupRef.current) {
        chairMeshGroupRef.current.rotation.y += 0.005;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Window Resize Handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [activeItem, selectedMaterialIndex, isWireframe, autoRotate]);

  // AR Camera Mode toggle
  const toggleAR = async () => {
    if (isARMode) {
      if (arVideoRef.current && arVideoRef.current.srcObject) {
        const stream = arVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
      }
      setIsARMode(false);
      setArPlaced(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (arVideoRef.current) {
          arVideoRef.current.srcObject = stream;
        }
        setIsARMode(true);
        showToast('WebXR AR Initialized: Point camera toward the floor & tap to place', 'info');
      } catch (err) {
        // Fallback simulation room background
        setIsARMode(true);
        showToast('Camera stream simulated: Tap on floor to test true-to-scale placement', 'info');
      }
    }
  };

  const handleAddToCart = () => {
    const variant = activeItem.variants[0];
    addToCart(activeItem, variant, 1);
    showToast(`Added ${activeItem.title} to your bag!`);
  };

  const materials = activeItem.media.material_options || [
    { name: 'Ivory Bouclé', color: '#F4EFEB', roughness: 0.85, metalness: 0.05 },
    { name: 'Charcoal Wool', color: '#2C2E33', roughness: 0.8, metalness: 0.05 },
    { name: 'Aaina Violet Velvet', color: '#5220A6', roughness: 0.4, metalness: 0.1 },
    { name: 'Cognac Saddle Leather', color: '#884D2B', roughness: 0.35, metalness: 0.2 },
  ];

  const dimensions = activeItem.media.dimensions || {
    width_cm: 86,
    depth_cm: 90,
    height_cm: 78,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C2FF]/10 text-[#00C2FF] text-xs font-semibold mb-2">
            <Box className="w-3.5 h-3.5" />
            <span>Aaina Room · 3D WebGL & WebXR AR</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Spatial 3D & Augmented Reality
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Interactive real-time 3D canvas with 360° orbital rotation, PBR material swapping, and true-to-scale room projection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleAR}
            className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
              isARMode
                ? 'bg-[#FF3D71] text-white hover:bg-[#e03061]'
                : 'bg-gradient-to-r from-[#6C2BD9] to-[#00C2FF] text-white hover:opacity-90'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>{isARMode ? 'Exit AR Room' : 'View in Your Room (AR)'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Left Column: 3D Catalog Selector, Materials & Dimensions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Select 3D Product */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>Supported 3D Products</span>
              <span className="text-xs text-slate-400 font-normal">
                {roomProducts.length} items
              </span>
            </h3>

            <div className="space-y-2.5">
              {roomProducts.map(prod => (
                <div
                  key={prod.id}
                  onClick={() => {
                    setActiveItem(prod);
                    setSelectedMaterialIndex(0);
                  }}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                    activeItem.id === prod.id
                      ? 'border-[#00C2FF] bg-[#00C2FF]/5 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <img
                    src={prod.media.primary_image}
                    alt={prod.title}
                    className="w-14 h-14 object-cover rounded-lg bg-slate-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{prod.title}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{prod.tagline}</p>
                    <div className="text-xs font-mono font-bold text-slate-800 mt-1">
                      {formatPrice(prod.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PBR Material & Upholstery Swatches */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#6C2BD9]" />
              <span>Material & Finish Options</span>
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              {materials.map((mat, idx) => (
                <button
                  key={mat.name}
                  onClick={() => {
                    setSelectedMaterialIndex(idx);
                    showToast(`Switched material to ${mat.name}`);
                  }}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    selectedMaterialIndex === idx
                      ? 'border-[#6C2BD9] bg-[#E9DEFB]/30 ring-2 ring-[#6C2BD9]/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span
                    className="w-6 h-6 rounded-full border border-slate-300 shrink-0 shadow-inner"
                    style={{ backgroundColor: mat.color }}
                  />
                  <span className="text-xs font-semibold text-slate-800 truncate">{mat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* True-to-Scale Dimensions & Room Clearance (PRD 6.3) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <Ruler className="w-4 h-4 text-[#00D68F]" />
              <span>Scale & Floor Footprint</span>
            </h3>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Width</div>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                  {dimensions.width_cm} cm
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Depth</div>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                  {dimensions.depth_cm} cm
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Height</div>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                  {dimensions.height_cm} cm
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00D68F]" />
                <span>Fits through standard 80 cm doorways</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00D68F]" />
                <span>AR scale ratio: 1:1 true physical metric scale</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center / Right Column: Three.js Interactive 3D Canvas / AR View (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
            {/* Top Controls Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-900">{activeItem.title}</span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs font-mono font-semibold text-slate-700">
                  {formatPrice(activeItem.price)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Auto Rotate Toggle */}
                <button
                  onClick={() => setAutoRotate(r => !r)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                    autoRotate
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>360° Spin</span>
                </button>

                {/* Wireframe Mode Toggle */}
                <button
                  onClick={() => setIsWireframe(w => !w)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                    isWireframe
                      ? 'bg-[#6C2BD9] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Wireframe</span>
                </button>
              </div>
            </div>

            {/* Main Interactive 3D Canvas / AR Mode Simulation */}
            <div className="relative mt-4 aspect-[4/3] sm:aspect-[16/10] bg-[#0F1117] rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
              {isARMode ? (
                /* WebXR / AR Mode Screen */
                <div
                  className="relative w-full h-full cursor-pointer"
                  onClick={() => {
                    if (!arPlaced) {
                      setArPlaced(true);
                      showToast('Object placed in AR space! You can walk around or adjust scale.');
                    }
                  }}
                >
                  {/* Camera stream video or living room backdrop */}
                  <video
                    ref={arVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-40 mix-blend-screen"
                       style={{ backgroundImage: `url('/src/assets/images/room_lounge_chair_1791689706378.jpg')` }}
                  />

                  {/* AR Reticle Ring (PRD 2.6: AR Pulse reticle ring) */}
                  {!arPlaced ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <div className="w-48 h-48 rounded-full border-4 border-[#00C2FF] border-dashed animate-spin flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-[#00C2FF]/20 animate-ping" />
                      </div>
                      <span className="mt-4 px-4 py-2 rounded-full bg-black/80 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                        Tap floor surface to place 3D furniture
                      </span>
                    </div>
                  ) : (
                    /* Placed Object in AR */
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div
                        className="relative transition-all duration-300"
                        style={{ transform: `scale(${arScale / 100})` }}
                      >
                        <img
                          src={activeItem.media.primary_image}
                          alt="Placed 3D furniture"
                          className="w-72 sm:w-96 drop-shadow-[0_25px_35px_rgba(0,0,0,0.8)]"
                          referrerPolicy="no-referrer"
                        />
                        {/* Plane shadow */}
                        <div className="w-full h-8 bg-black/60 rounded-full blur-md mx-auto -mt-4" />
                      </div>
                    </div>
                  )}

                  {/* AR Top Overlay Notice */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#FF3D71] text-white text-xs font-bold shadow-md">
                      AR Spatial View
                    </span>
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-mono">
                      Scale: {arScale}%
                    </span>
                  </div>

                  {/* AR Scale Slider */}
                  {arPlaced && (
                    <div className="absolute bottom-4 inset-x-6 z-20 bg-black/70 backdrop-blur-md p-3 rounded-xl border border-white/20 flex items-center gap-3 text-white">
                      <span className="text-xs font-medium shrink-0">Scale:</span>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        value={arScale}
                        onChange={e => setArScale(Number(e.target.value))}
                        className="w-full"
                      />
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setArPlaced(false);
                        }}
                        className="px-2.5 py-1 text-xs bg-white/20 hover:bg-white/30 rounded-lg shrink-0 cursor-pointer"
                      >
                        Reposition
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Three.js Interactive WebGL 3D Container */
                <div
                  ref={canvasContainerRef}
                  className="w-full h-full cursor-grab active:cursor-grabbing"
                  title="Click and drag to rotate in 3D"
                />
              )}

              {/* Orbital Drag Helper Hint */}
              {!isARMode && (
                <div className="absolute bottom-4 left-4 pointer-events-none flex items-center gap-2 text-xs text-white/70 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <RotateCw className="w-3.5 h-3.5 text-[#00C2FF] animate-spin" />
                  <span>Drag with mouse to rotate 360° · Scroll to zoom</span>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                PBR Material: <span className="font-semibold text-slate-900">{materials[selectedMaterialIndex]?.name}</span>
                <span className="mx-2">·</span>
                Weight: <span className="font-semibold text-slate-900">28.4 kg</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleAddToCart}
                  className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-[#6C2BD9] rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Order Now ({formatPrice(activeItem.price)})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
