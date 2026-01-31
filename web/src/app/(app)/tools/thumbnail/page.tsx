"use client";

import { useState, useRef, useEffect } from "react";
import {
  Image as ImageIcon,
  Download,
  Sparkles,
  Upload,
  X,
  Wand2,
  Loader2,
} from "lucide-react";

// Brand Colors
const COLORS = {
  white: "#FFFFFF",
  black: "#000000",
};

interface ImageSlot {
  id: number;
  image: HTMLImageElement | null;
  file: File | null;
  title1: string;
  title2: string;
  description: string;
  generated: boolean;
  textPosition: { title1: { x: number; y: number }; title2: { x: number; y: number } } | null;
}

// Analyze image to find best text positions
function analyzeImageForTextPlacement(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): { title1: { x: number; y: number }; title2: { x: number; y: number } } {
  // Define possible zones for text placement
  const zones = [
    { name: "top-left", x: 40, y: 40, region: { x: 0, y: 0, w: width * 0.5, h: height * 0.3 } },
    { name: "top-center", x: width * 0.25, y: 40, region: { x: width * 0.2, y: 0, w: width * 0.6, h: height * 0.3 } },
    { name: "bottom-left", x: 40, y: height - 150, region: { x: 0, y: height * 0.7, w: width * 0.5, h: height * 0.3 } },
    { name: "bottom-center", x: width * 0.25, y: height - 150, region: { x: width * 0.2, y: height * 0.7, w: width * 0.6, h: height * 0.3 } },
    { name: "mid-left", x: 40, y: height * 0.4, region: { x: 0, y: height * 0.3, w: width * 0.4, h: height * 0.4 } },
  ];

  // Analyze each zone for "emptiness" (low detail/variance)
  const zoneScores: { zone: typeof zones[0]; score: number }[] = [];

  for (const zone of zones) {
    const { x, y, w, h } = zone.region;
    const imageData = ctx.getImageData(x, y, w, h);
    const data = imageData.data;

    // Calculate variance (lower = more uniform/empty)
    let sum = 0;
    let sumSq = 0;
    const pixelCount = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      sum += brightness;
      sumSq += brightness * brightness;
    }

    const mean = sum / pixelCount;
    const variance = (sumSq / pixelCount) - (mean * mean);
    
    // Also check if area is dark enough for white text
    const isDark = mean < 150;
    
    // Score: lower variance is better, dark areas get bonus
    const score = variance + (isDark ? 0 : 2000);
    
    zoneScores.push({ zone, score });
  }

  // Sort by score (lower is better)
  zoneScores.sort((a, b) => a.score - b.score);

  // Pick best zone for title1 (main title)
  const bestForTitle1 = zoneScores[0].zone;
  
  // Pick different zone for title2 (prefer bottom if title1 is top, vice versa)
  let bestForTitle2 = zoneScores.find(z => {
    const isTitle1Top = bestForTitle1.name.includes("top") || bestForTitle1.name.includes("mid");
    const isThisBottom = z.zone.name.includes("bottom");
    return isTitle1Top ? isThisBottom : !isThisBottom;
  })?.zone || zoneScores[1].zone;

  // Add some randomness to positions
  const randomOffset = () => Math.floor(Math.random() * 30) - 15;

  return {
    title1: { 
      x: bestForTitle1.x + randomOffset(), 
      y: bestForTitle1.y + randomOffset() 
    },
    title2: { 
      x: bestForTitle2.x + randomOffset(), 
      y: bestForTitle2.y + randomOffset() 
    },
  };
}

export default function ThumbnailGeneratorPage() {
  const canvasRefs = [useRef<HTMLCanvasElement>(null), useRef<HTMLCanvasElement>(null), useRef<HTMLCanvasElement>(null)];
  const analysisCanvasRef = useRef<HTMLCanvasElement>(null);
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // 3 image slots
  const [slots, setSlots] = useState<ImageSlot[]>([
    { id: 1, image: null, file: null, title1: "", title2: "", description: "", generated: false, textPosition: null },
    { id: 2, image: null, file: null, title1: "", title2: "", description: "", generated: false, textPosition: null },
    { id: 3, image: null, file: null, title1: "", title2: "", description: "", generated: false, textPosition: null },
  ]);

  // Load logo on mount
  useEffect(() => {
    const logo = new Image();
    logo.crossOrigin = "anonymous";
    logo.src = "/assets/imod-logo.png";
    logo.onload = () => setLogoImage(logo);
  }, []);

  const handleImageUpload = (slotIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setSlots(prev => prev.map((slot, idx) => 
            idx === slotIndex ? { ...slot, image: img, file, generated: false, textPosition: null } : slot
          ));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const updateSlot = (slotIndex: number, field: keyof ImageSlot, value: any) => {
    setSlots(prev => prev.map((slot, idx) => 
      idx === slotIndex ? { ...slot, [field]: value, generated: false } : slot
    ));
  };

  const removeImage = (slotIndex: number) => {
    setSlots(prev => prev.map((slot, idx) => 
      idx === slotIndex ? { ...slot, image: null, file: null, generated: false, textPosition: null } : slot
    ));
  };

  const generateThumbnails = async () => {
    setIsGenerating(true);
    
    // Small delay for UI feedback
    await new Promise(resolve => setTimeout(resolve, 300));

    const WIDTH = 1280;
    const HEIGHT = 720;

    // Process each slot
    const newSlots = [...slots];
    
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      const canvas = canvasRefs[i].current;
      
      if (!canvas || !slot.image) continue;

      const ctx = canvas.getContext("2d");
      if (!ctx) continue;

      // Draw background image first (for analysis)
      const imgRatio = slot.image.width / slot.image.height;
      const targetRatio = WIDTH / HEIGHT;

      let sx = 0, sy = 0, sWidth = slot.image.width, sHeight = slot.image.height;

      if (imgRatio > targetRatio) {
        sWidth = slot.image.height * targetRatio;
        sx = (slot.image.width - sWidth) / 2;
      } else {
        sHeight = slot.image.width / targetRatio;
        sy = (slot.image.height - sHeight) / 2;
      }

      ctx.drawImage(slot.image, sx, sy, sWidth, sHeight, 0, 0, WIDTH, HEIGHT);

      // Analyze image for best text placement
      const textPosition = analyzeImageForTextPlacement(ctx, WIDTH, HEIGHT);
      newSlots[i] = { ...slot, textPosition, generated: true };

      // Now draw the final thumbnail
      drawFinalThumbnail(ctx, slot.image, textPosition, slot.title1, slot.title2, WIDTH, HEIGHT);
    }

    setSlots(newSlots);
    setIsGenerating(false);
  };

  const drawFinalThumbnail = (
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    textPosition: { title1: { x: number; y: number }; title2: { x: number; y: number } },
    title1: string,
    title2: string,
    WIDTH: number,
    HEIGHT: number
  ) => {
    // Clear and redraw image
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    const imgRatio = image.width / image.height;
    const targetRatio = WIDTH / HEIGHT;

    let sx = 0, sy = 0, sWidth = image.width, sHeight = image.height;

    if (imgRatio > targetRatio) {
      sWidth = image.height * targetRatio;
      sx = (image.width - sWidth) / 2;
    } else {
      sHeight = image.width / targetRatio;
      sy = (image.height - sHeight) / 2;
    }

    ctx.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, WIDTH, HEIGHT);

    // Subtle vignette
    const gradient = ctx.createRadialGradient(WIDTH/2, HEIGHT/2, 0, WIDTH/2, HEIGHT/2, WIDTH*0.8);
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(1, "rgba(0,0,0,0.25)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Helper function for text with strong shadow/outline
    const drawBoldText = (text: string, x: number, y: number, fontSize: number) => {
      ctx.font = `900 ${fontSize}px "FC Vision", "Noto Sans Thai", Arial Black, sans-serif`;
      ctx.textBaseline = "top";
      
      // Multiple shadow layers for bold outline effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
      for (let ox = -5; ox <= 5; ox += 2) {
        for (let oy = -5; oy <= 5; oy += 2) {
          ctx.fillText(text, x + ox, y + oy);
        }
      }
      
      // Main white text
      ctx.fillStyle = COLORS.white;
      ctx.fillText(text, x, y);
    };

    // Draw texts at analyzed positions
    if (title1) {
      drawBoldText(title1, textPosition.title1.x, textPosition.title1.y, 95);
    }
    if (title2) {
      drawBoldText(title2, textPosition.title2.x, textPosition.title2.y, 70);
    }

    // Draw logo (top-right) - BIG
    if (logoImage) {
      const logoSize = 150;
      const logoRatio = logoImage.width / logoImage.height;
      const logoWidth = logoSize * logoRatio;
      const logoHeight = logoSize;
      const logoX = WIDTH - logoWidth - 40;
      const logoY = 40;

      ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);
    }
  };

  const drawPreview = (slotIndex: number) => {
    const canvas = canvasRefs[slotIndex].current;
    const slot = slots[slotIndex];
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const WIDTH = 1280;
    const HEIGHT = 720;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    if (slot.image) {
      // Just show the image as preview (no text until generated)
      const imgRatio = slot.image.width / slot.image.height;
      const targetRatio = WIDTH / HEIGHT;

      let sx = 0, sy = 0, sWidth = slot.image.width, sHeight = slot.image.height;

      if (imgRatio > targetRatio) {
        sWidth = slot.image.height * targetRatio;
        sx = (slot.image.width - sWidth) / 2;
      } else {
        sHeight = slot.image.width / targetRatio;
        sy = (slot.image.height - sHeight) / 2;
      }

      ctx.drawImage(slot.image, sx, sy, sWidth, sHeight, 0, 0, WIDTH, HEIGHT);

      if (!slot.generated) {
        // Show "ready to generate" overlay
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.font = "bold 36px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("กด Generate เพื่อสร้าง Thumbnail", WIDTH/2, HEIGHT/2);
        ctx.textAlign = "left";
      }
    } else {
      // Placeholder
      const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
      gradient.addColorStop(0, "#2D1B4E");
      gradient.addColorStop(1, "#1A1A2E");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.font = "bold 48px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`อัปโหลดรูปที่ ${slotIndex + 1}`, WIDTH/2, HEIGHT/2);
      ctx.textAlign = "left";
    }
  };

  // Draw previews when slots change
  useEffect(() => {
    slots.forEach((slot, index) => {
      if (!slot.generated) {
        drawPreview(index);
      }
    });
  }, [slots, logoImage]);

  const downloadSingle = (slotIndex: number) => {
    const canvas = canvasRefs[slotIndex].current;
    if (!canvas || !slots[slotIndex].generated) return;

    const link = document.createElement("a");
    link.download = `thumbnail-${slotIndex + 1}-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const downloadAll = async () => {
    const generatedSlots = slots.filter(s => s.generated);
    if (generatedSlots.length === 0) return;

    // Dynamic import JSZip
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    
    for (let i = 0; i < 3; i++) {
      const canvas = canvasRefs[i].current;
      if (canvas && slots[i].generated) {
        const dataUrl = canvas.toDataURL("image/png");
        const base64 = dataUrl.split(",")[1];
        zip.file(`thumbnail-${i + 1}.png`, base64, { base64: true });
      }
    }
    
    const blob = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.download = `thumbnails-${Date.now()}.zip`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const hasAnyImage = slots.some(s => s.image);
  const hasAnyGenerated = slots.some(s => s.generated);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="text-pink-500" />
            Thumbnail Generator
          </h1>
          <p className="text-gray-400 mt-1">
            อัปโหลดรูป → ใส่ข้อความ → Generate อัตโนมัติ
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={generateThumbnails}
            disabled={!hasAnyImage || isGenerating}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg font-medium transition-all"
          >
            {isGenerating ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Wand2 size={18} />
            )}
            {isGenerating ? "กำลัง Generate..." : "Generate ทั้งหมด"}
          </button>
          <button
            onClick={downloadAll}
            disabled={!hasAnyGenerated}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg font-medium transition-all"
          >
            <Download size={18} />
            ดาวน์โหลด ZIP
          </button>
        </div>
      </div>

      {/* 3 Thumbnail Slots */}
      <div className="space-y-6">
        {slots.map((slot, index) => (
          <div key={slot.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${
                slot.generated ? "bg-green-600" : "bg-gradient-to-r from-pink-600 to-purple-600"
              }`}>
                {slot.generated ? "✓" : index + 1}
              </div>
              <h2 className="text-lg font-semibold text-white">
                Thumbnail {index + 1}
                {slot.generated && <span className="text-green-400 text-sm ml-2">Generated!</span>}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Preview */}
              <div>
                <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
                  <canvas
                    ref={canvasRefs[index]}
                    width={1280}
                    height={720}
                    className="w-full h-full object-contain"
                  />
                </div>
                <button
                  onClick={() => downloadSingle(index)}
                  disabled={!slot.generated}
                  className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg font-medium transition-all"
                >
                  <Download size={16} />
                  ดาวน์โหลด
                </button>
              </div>

              {/* Controls */}
              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">รูปพื้นหลัง</label>
                  {slot.image ? (
                    <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                      <div className="w-16 h-10 bg-gray-700 rounded overflow-hidden">
                        <img 
                          src={slot.file ? URL.createObjectURL(slot.file) : ""} 
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      </div>
                      <span className="text-sm text-gray-300 flex-1 truncate">
                        {slot.file?.name || "Uploaded"}
                      </span>
                      <button
                        onClick={() => removeImage(index)}
                        className="p-1.5 text-red-400 hover:bg-red-500/20 rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="block cursor-pointer">
                      <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-pink-500/50 transition-colors">
                        <Upload size={24} className="mx-auto text-gray-500 mb-1" />
                        <p className="text-gray-400 text-sm">คลิกเพื่ออัปโหลด</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(index, e)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Text Inputs */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    ข้อความหลัก <span className="text-pink-400">(ตัวใหญ่)</span>
                  </label>
                  <input
                    type="text"
                    value={slot.title1}
                    onChange={(e) => updateSlot(index, "title1", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="เช่น YANGWANG U9"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    ข้อความรอง <span className="text-purple-400">(ตัวเล็กกว่า)</span>
                  </label>
                  <input
                    type="text"
                    value={slot.title2}
                    onChange={(e) => updateSlot(index, "title2", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="เช่น ขับจริง Race Track"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    คำอธิบาย / Prompt <span className="text-cyan-400">(สำหรับสร้างภาพ)</span>
                  </label>
                  <textarea
                    value={slot.description}
                    onChange={(e) => updateSlot(index, "description", e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                    placeholder="เช่น รีวิวรถ BYD สีขาว พื้นหลังโชว์รูม สไตล์โมเดิร์น"
                  />
                </div>

                {/* Info */}
                <div className="bg-gray-800/50 rounded-lg p-3 text-sm text-gray-400">
                  <Sparkles size={14} className="inline text-yellow-400 mr-1" />
                  ระบบจะวิเคราะห์รูปและวางข้อความอัตโนมัติ ให้ไม่บังจุดสำคัญ
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hidden canvas for analysis */}
      <canvas ref={analysisCanvasRef} width={1280} height={720} className="hidden" />
    </div>
  );
}
