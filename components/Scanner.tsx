
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, RefreshCw, Type, AlertCircle } from 'lucide-react';

interface ScannerProps {
  onScan: (barcode: string, imageBase64?: string) => void;
  isLoading: boolean;
}

export const Scanner: React.FC<ScannerProps> = ({ onScan, isLoading }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [manualBarcode, setManualBarcode] = useState('');
  const [showManual, setShowManual] = useState(false);

  useEffect(() => {
    if (!showManual) {
      startCamera();
    }
    return () => stopCamera();
  }, [showManual]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setError(null);
    } catch (err) {
      setError('تعذر الوصول إلى الكاميرا. يرجى التأكد من منح الإذن.');
      setShowManual(true);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const captureFrame = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const base64 = dataUrl.split(',')[1];
        // In a real app, we'd use a barcode detection API or library here
        // For this "Smart" app, we'll send the frame to Gemini to decode
        onScan("FROM_IMAGE", base64);
      }
    }
  }, [onScan]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      onScan(manualBarcode.trim());
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl relative border-4 border-indigo-100">
        {showManual ? (
          <div className="p-8 text-center bg-indigo-50 min-h-[300px] flex flex-col justify-center">
            <AlertCircle className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">الإدخال اليدوي</h3>
            <p className="text-gray-500 mb-6">أدخل رقم الباركود الموجود أسفل الخطوط السوداء</p>
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <input
                type="text"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                placeholder="أدخل الباركود..."
                className="w-full px-4 py-3 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 outline-none text-center text-lg font-mono"
              />
              <button
                type="submit"
                disabled={isLoading || !manualBarcode}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50"
              >
                بحث عن المنتج
              </button>
            </form>
          </div>
        ) : (
          <div className="relative aspect-square md:aspect-video bg-black flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Scanner Overlay UI */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-64 h-48 border-2 border-white/50 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 border-2 border-indigo-400 rounded-lg animate-pulse" />
                <div className="absolute top-0 left-0 w-full h-0.5 bg-red-500/80 animate-[scan_2s_infinite]" />
              </div>
            </div>
            
            <button
              onClick={captureFrame}
              disabled={isLoading}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 p-4 rounded-full shadow-lg hover:scale-110 active:scale-95 transition disabled:opacity-50"
            >
              <Camera className="w-8 h-8 text-indigo-600" />
            </button>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setShowManual(!showManual)}
          className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-indigo-100 rounded-2xl text-indigo-600 font-semibold hover:bg-indigo-50 transition"
        >
          {showManual ? <Camera className="w-5 h-5" /> : <Type className="w-5 h-5" />}
          <span>{showManual ? 'فتح الكاميرا' : 'إدخال باركود يدوي'}</span>
        </button>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}</style>
    </div>
  );
};
