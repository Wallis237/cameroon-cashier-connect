import { useState, useRef, useEffect } from "react";
import QrScanner from "qr-scanner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (result: string) => void;
  title?: string;
}

export function QRScanner({ isOpen, onClose, onScan, title = "Scan QR Code" }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isOpen]);

  const startScanner = async () => {
    if (!videoRef.current) return;

    try {
      setIsScanning(true);
      
      // Check for camera support
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera access not supported in this browser");
      }

      // Request camera permission first
      await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });

      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          console.log('QR Code detected:', result.data);
          onScan(result.data);
          stopScanner();
          onClose();
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: 'environment',
          maxScansPerSecond: 5,
          calculateScanRegion: (video) => {
            const scanRegionSize = Math.min(video.videoWidth, video.videoHeight) * 0.7;
            return {
              x: (video.videoWidth - scanRegionSize) / 2,
              y: (video.videoHeight - scanRegionSize) / 2,
              width: scanRegionSize,
              height: scanRegionSize,
            };
          },
        }
      );

      await qrScannerRef.current.start();
      setIsScanning(true);
      
      toast({
        title: "Camera Ready",
        description: "Point your camera at a QR code to scan",
      });
      
    } catch (error: any) {
      console.error("Error starting QR scanner:", error);
      let errorMessage = "Unable to access camera. Please check permissions.";
      
      if (error?.name === 'NotAllowedError') {
        errorMessage = "Camera access denied. Please allow camera permissions in your browser settings and refresh the page.";
      } else if (error?.name === 'NotFoundError') {
        errorMessage = "No camera found on this device.";
      } else if (error?.name === 'NotSupportedError') {
        errorMessage = "Camera not supported in this browser. Try using Chrome or Safari.";
      } else if (error?.name === 'NotReadableError') {
        errorMessage = "Camera is being used by another application. Please close other camera apps and try again.";
      }
      
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive",
      });
      setIsScanning(false);
      onClose();
    }
  };

  const stopScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleClose = () => {
    stopScanner();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              style={{ display: isOpen ? 'block' : 'none' }}
            />
            
            {!isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Initializing camera...
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Point your camera at a QR code to scan
            </p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="w-full"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}