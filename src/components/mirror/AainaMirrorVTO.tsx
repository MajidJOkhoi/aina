import React, { useState, useRef, useEffect } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { AainaProduct, AainaTryOnSession } from '../../types';
import {
  Sparkles,
  Camera,
  Upload,
  CheckCircle2,
  Sliders,
  RefreshCw,
  ShoppingBag,
  Share2,
  Info,
  Maximize2,
  RotateCcw,
  Zap,
} from 'lucide-react';

interface PresetModel {
  id: string;
  name: string;
  height: string;
  fit: string;
  image: string;
}

const PRESET_MODELS: PresetModel[] = [
  {
    id: 'model_1',
    name: 'Elena (Athletic / 178cm)',
    height: '178 cm · 5\'10"',
    fit: 'Size M / True to fit',
    image: '/src/assets/images/tryon_model_neutral_1791689718616.jpg',
  },
  {
    id: 'model_2',
    name: 'Kai (Slim / 182cm)',
    height: '182 cm · 6\'0"',
    fit: 'Size M / Relaxed drape',
    image: '/src/assets/images/hero_fashion_showcase_1791689679703.jpg',
  },
  {
    id: 'model_3',
    name: 'Priya (Curved / 168cm)',
    height: '168 cm · 5\'6"',
    fit: 'Size S / Tailored fit',
    image: '/src/assets/images/reel_streetwear_thumb_1791689693812.jpg',
  },
];

export const AainaMirrorVTO: React.FC = () => {
  const {
    products,
    activeMirrorProduct,
    startMirrorTryOn,
    addToCart,
    formatPrice,
    saveTryOnSession,
    showToast,
  } = useMarketplace();

  // Find all apparel products that support Mirror
  const mirrorApparel = products.filter(p => p.aaina_mirror_enabled);
  const currentGarment = activeMirrorProduct || mirrorApparel[0];

  const [selectedModel, setSelectedModel] = useState<PresetModel>(PRESET_MODELS[0]);
  const [userUploadedPhoto, setUserUploadedPhoto] = useState<string | null>(null);
  const [activeGarment, setActiveGarment] = useState<AainaProduct>(currentGarment);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 to 100 for before/after slider
  const [viewAngle, setViewAngle] = useState<'front' | 'back'>('front');
  const [selectedSize, setSelectedSize] = useState<string>('M');

  // AI Style Chat query state
  const [styleAdviceQuery, setStyleAdviceQuery] = useState<string>('');
  const [styleAdviceResponse, setStyleAdviceResponse] = useState<string | null>(
    'The sculpted shoulders and cobalt piping on this jacket pair exceptionally well with neutral pleated trousers or raw dark denim. For footwear, clean optic sneakers balance the technical luxury drape.'
  );

  // Camera stream state
  const [isLiveCameraActive, setIsLiveCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // When activeMirrorProduct changes externally
  useEffect(() => {
    if (activeMirrorProduct) {
      setActiveGarment(activeMirrorProduct);
    }
  }, [activeMirrorProduct]);

  // Handle camera toggle
  const toggleLiveCamera = async () => {
    if (isLiveCameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      setIsLiveCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsLiveCameraActive(true);
        showToast('Camera enabled: Align your shoulders inside the frame', 'info');
      } catch (err) {
        showToast('Camera access denied or unavailable in this environment', 'error');
      }
    }
  };

  // Run AI Try-On Pipeline Simulation per PRD 6.2
  const runTryOnGeneration = () => {
    setIsProcessing(true);
    setProgressPercent(10);
    setProcessingStage('MediaPipe Pose: Estimating 18 skeletal landmarks...');

    setTimeout(() => {
      setProgressPercent(35);
      setProcessingStage('LIP Human Parsing: Segmenting torso and boundary contours...');
    }, 600);

    setTimeout(() => {
      setProgressPercent(70);
      setProcessingStage('CP-VTON: Warping fabric mesh to user silhouette...');
    }, 1300);

    setTimeout(() => {
      setProgressPercent(95);
      setProcessingStage('U-Net Diffusion: Blending lighting, micro-textures, and shadow...');
    }, 2000);

    setTimeout(() => {
      setIsProcessing(false);
      setProgressPercent(100);
      setProcessingStage('');
      setSliderPosition(50);
      showToast('AI Virtual Try-On render complete! Drag the mirror slider to compare.', 'success');
    }, 2600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUserUploadedPhoto(url);
      showToast('Personal photo loaded. Running fit alignment...');
      runTryOnGeneration();
    }
  };

  const handleSaveLook = () => {
    const newSession: AainaTryOnSession = {
      id: `vto_${Date.now()}`,
      user_id: 'usr_89201',
      product_id: activeGarment.id,
      input_photo_url: userUploadedPhoto || selectedModel.image,
      garment_image_url: activeGarment.media.primary_image,
      output_image_url: activeGarment.media.primary_image,
      size_recommended: `${selectedSize} (Certainty 94%)`,
      fit_score: 95,
      fit_feedback: 'Optimal drape across shoulders with ergonomic sleeve drop.',
      created_at: new Date().toISOString(),
    };
    saveTryOnSession(newSession);
  };

  const handleAddToCartWithSession = () => {
    const variant = activeGarment.variants[selectedVariantIndex] || activeGarment.variants[0];
    const sessionId = `vto_session_${Date.now()}`;
    addToCart(activeGarment, variant, 1, sessionId);
    showToast(`Added ${activeGarment.title} (Size ${selectedSize}) with Try-On attribution!`);
  };

  const handleAskStyleAdvisor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!styleAdviceQuery.trim()) return;
    const q = styleAdviceQuery;
    setStyleAdviceQuery('');
    setStyleAdviceResponse('Consulting Aaina Style Intelligence...');
    setTimeout(() => {
      setStyleAdviceResponse(
        `Stylist Recommendation for "${q}": This ${activeGarment.title} is best styled with tonal bottom layers to highlight the jacket silhouette. We suggest pairing it with high-waist tailored trousers and a minimalist monochrome tee.`
      );
    }, 800);
  };

  const currentPhoto = userUploadedPhoto || selectedModel.image;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9DEFB] text-[#6C2BD9] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Aaina Mirror · AI Virtual Try-On</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            See it on you. <span className="text-[#6C2BD9]">Then buy it.</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Simulated photorealistic garment fitting powered by MediaPipe pose estimation, LIP neural parsing, and CP-VTON fabric deformation.
          </p>
        </div>

        {/* Quick Pipeline Status Indicator */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#00D68F]" />
          <span>VTO Pipeline Ready (Latency &lt; 2.6s)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Left Column: Garment Selector & Sizing Guide (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Garment Selection Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>Select Garment to Try</span>
              <span className="text-xs text-slate-400 font-normal">
                {mirrorApparel.length} items
              </span>
            </h3>

            <div className="grid grid-cols-3 gap-2.5">
              {mirrorApparel.map(garment => (
                <button
                  key={garment.id}
                  onClick={() => {
                    setActiveGarment(garment);
                    setSelectedVariantIndex(0);
                    runTryOnGeneration();
                  }}
                  className={`relative rounded-xl overflow-hidden border p-1 text-left transition-all cursor-pointer ${
                    activeGarment.id === garment.id
                      ? 'border-[#6C2BD9] ring-2 ring-[#6C2BD9]/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={garment.media.primary_image}
                    alt={garment.title}
                    className="w-full h-20 object-cover rounded-lg bg-slate-50"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-[11px] font-semibold text-slate-900 truncate mt-1">
                    {garment.title}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    {formatPrice(garment.price)}
                  </div>
                </button>
              ))}
            </div>

            {/* Garment Details & Color Variants */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Selected Apparel
              </div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                {activeGarment.title}
              </div>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                {activeGarment.tagline}
              </p>

              {/* Color Swatches */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Color:</span>
                {activeGarment.variants.map((v, idx) => (
                  <button
                    key={v.sku}
                    onClick={() => {
                      setSelectedVariantIndex(idx);
                      runTryOnGeneration();
                    }}
                    style={{ backgroundColor: v.colorHex }}
                    title={v.color}
                    className={`w-6 h-6 rounded-full border cursor-pointer transition-transform ${
                      selectedVariantIndex === idx
                        ? 'ring-2 ring-offset-2 ring-[#6C2BD9] scale-110'
                        : 'border-slate-300 hover:scale-105'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* AI Size Recommendation Engine (PRD 6.2) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#FFB020]" />
                <span>AI Fit & Size Guidance</span>
              </h3>
              <span className="text-[11px] font-bold text-[#00D68F] bg-[#00D68F]/10 px-2 py-0.5 rounded-full">
                94% Fit Certainty
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Based on your calibrated measurements (Height: 178cm, Chest: 96cm, Waist: 80cm) and the garment stretch matrix:
            </p>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Recommended Size</span>
                <span className="text-base font-extrabold text-[#6C2BD9]">Size M</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Relaxed chest taper with standard sleeve length. No tight pulling across shoulders.
              </div>
            </div>

            {/* Manual Size Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Try Size:</span>
              {['XS', 'S', 'M', 'L', 'XL'].map(sz => (
                <button
                  key={sz}
                  onClick={() => {
                    setSelectedSize(sz);
                    showToast(`Updated fit preview to Size ${sz}`);
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedSize === sz
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* AI Style Advisor Consultation */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#00C2FF]" />
              <span>Aaina Style Intelligence</span>
            </h3>

            {styleAdviceResponse && (
              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/60 leading-relaxed mb-3">
                {styleAdviceResponse}
              </div>
            )}

            <form onSubmit={handleAskStyleAdvisor} className="flex gap-2">
              <input
                type="text"
                placeholder="Ask e.g. 'How to style for a dinner party?'"
                value={styleAdviceQuery}
                onChange={e => setStyleAdviceQuery(e.target.value)}
                className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6C2BD9]"
              />
              <button
                type="submit"
                className="px-3 py-2 text-xs font-semibold bg-[#6C2BD9] text-white rounded-lg hover:bg-[#5822b3] transition-colors cursor-pointer"
              >
                Ask
              </button>
            </form>
          </div>
        </div>

        {/* Center / Right Column: Interactive VTO Canvas & Before/After Slider (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            {/* Top Toolbar: Model Picker & Camera Upload */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">Model:</span>
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
                  {PRESET_MODELS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedModel(m);
                        setUserUploadedPhoto(null);
                        runTryOnGeneration();
                      }}
                      className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                        selectedModel.id === m.id && !userUploadedPhoto
                          ? 'bg-white text-slate-900 shadow-sm font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {m.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Upload own photo */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>Upload Selfie</span>
                </button>

                {/* Webcam Live Stream Button */}
                <button
                  onClick={toggleLiveCamera}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isLiveCameraActive
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{isLiveCameraActive ? 'Stop Camera' : 'Live Camera'}</span>
                </button>

                {/* Re-render button */}
                <button
                  onClick={runTryOnGeneration}
                  disabled={isProcessing}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Re-run VTO AI Pipeline"
                >
                  <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin text-[#6C2BD9]' : ''}`} />
                </button>
              </div>
            </div>

            {/* Main Interactive Try-On Visual Area */}
            <div className="relative mt-4 aspect-[4/5] sm:aspect-[16/11] bg-slate-950 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center select-none">
              {/* Webcam stream view if active */}
              {isLiveCameraActive ? (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                  {/* MediaPipe landmark pose reticle overlay */}
                  <div className="absolute inset-0 border-2 border-dashed border-[#00C2FF]/60 pointer-events-none flex flex-col items-center justify-center">
                    <div className="w-48 h-64 border border-[#6C2BD9]/80 rounded-full animate-pulse-glow" />
                    <span className="text-xs text-[#00C2FF] font-mono bg-black/60 px-3 py-1 rounded-full mt-4">
                      Align upper body within reticle
                    </span>
                  </div>
                </div>
              ) : (
                /* Interactive Before / After Split Slider with Mirror-Shine Divider */
                <div className="relative w-full h-full overflow-hidden">
                  {/* Layer 1: "After" Image (Virtual Try-on simulation with active garment) */}
                  <img
                    src={activeGarment.media.primary_image}
                    alt="Aaina Mirror AI Simulated Garment"
                    className="absolute inset-0 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />

                  {/* Layer 2: "Before" Image (Original model/photo clipped by slider) */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${sliderPosition}%` }}
                  >
                    <img
                      src={currentPhoto}
                      alt="Original user photo"
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ width: '100%', maxWidth: 'none' }}
                      referrerPolicy="no-referrer"
                    />
                    {/* Badge */}
                    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/20">
                      Original Photo
                    </div>
                  </div>

                  {/* "After" Badge on right side */}
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full border border-[#00C2FF]/40 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#00C2FF]" />
                    <span>Aaina Mirror AI Result</span>
                  </div>

                  {/* Mirror-Shine Slider Bar & Draggable Divider (PRD 2.6) */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    {/* Center Handle Button */}
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white shadow-xl flex items-center justify-center border border-slate-200 text-slate-800">
                      <Sliders className="w-4 h-4 text-[#6C2BD9]" />
                    </div>
                  </div>

                  {/* Range input for slider manipulation */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={e => setSliderPosition(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                    aria-label="Before and after try-on comparison slider"
                  />

                  {/* Angle Toggle (Front / Back) */}
                  <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1 bg-black/70 backdrop-blur-md p-1 rounded-lg border border-white/20 text-xs">
                    <button
                      onClick={() => setViewAngle('front')}
                      className={`px-2.5 py-1 rounded font-medium transition-colors ${
                        viewAngle === 'front' ? 'bg-[#6C2BD9] text-white' : 'text-slate-300'
                      }`}
                    >
                      Front Angle
                    </button>
                    <button
                      onClick={() => setViewAngle('back')}
                      className={`px-2.5 py-1 rounded font-medium transition-colors ${
                        viewAngle === 'back' ? 'bg-[#6C2BD9] text-white' : 'text-slate-300'
                      }`}
                    >
                      Back Angle
                    </button>
                  </div>
                </div>
              )}

              {/* Processing Modal Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 z-40 bg-black/75 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6C2BD9] via-[#FF3D71] to-[#00C2FF] flex items-center justify-center shadow-2xl animate-spin">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-bold mt-5 tracking-tight">
                    Generating Photorealistic Fit
                  </h4>
                  <p className="text-xs text-slate-300 font-mono mt-1 max-w-sm">
                    {processingStage}
                  </p>

                  <div className="w-64 h-2 bg-white/20 rounded-full mt-5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#6C2BD9] to-[#00C2FF] transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions & Buy CTA */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00D68F]" />
                  <span>MediaPipe landmark keypoints verified</span>
                </span>
                <span className="text-slate-300">·</span>
                <span>Auto-cleared after 24 hours</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleSaveLook}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Save Look</span>
                </button>

                <button
                  onClick={handleAddToCartWithSession}
                  className="flex-1 sm:flex-none px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#6C2BD9] to-[#00C2FF] hover:opacity-95 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Buy This Fit ({formatPrice(activeGarment.price)})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
