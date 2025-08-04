
import { useState, useRef, useEffect } from "react";
import QrScanner from "qr-scanner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (result: string) => void;
  title?: string;
}

export function QRScanner({ isOpen, onClose, onScan, title }: QRScannerProps) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const scanTitle = title || t("Scan QR Code");

  useEffect(() => {
    if (isOpen && videoRef.current) {
      checkCameraPermission();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isOpen]);

  const checkCameraPermission = async () => {
    try {
      console.log('Checking camera permission...');
      
      // Request user media permission first
      await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      // Check if camera is available
      const hasCamera = await QrScanner.hasCamera();
      console.log('Has camera:', hasCamera);
      
      if (!hasCamera) {
        throw new Error("No camera found");
      }

      setHasPermission(true);
      startScanner();
    } catch (error: any) {
      console.error("Camera permission error:", error);
      setHasPermission(false);
      
      let errorMessage = "Camera access failed.";
      if (error?.name === 'NotAllowedError') {
        errorMessage = t("Camera permission denied. Please allow camera access and try again.");
      } else if (error?.name === 'NotFoundError' || error?.message === 'No camera found') {
        errorMessage = "No camera found on this device.";
      } else if (error?.name === 'NotSupportedError') {
        errorMessage = "Camera not supported in this browser.";
      }
      
      toast({
        title: t("Camera Error"),
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const startScanner = async () => {
    if (!videoRef.current) {
      console.log('Video ref not available');
      return;
    }

    try {
      console.log('Starting QR scanner...');
      
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          console.log('QR Code scanned:', result.data);
          onScan(result.data);
          stopScanner();
          onClose();
          
          toast({
            title: t("QR Code Scanned"),
            description: `${t("Successfully scanned")}: ${result.data.substring(0, 50)}${result.data.length > 50 ? '...' : ''}`,
          });
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: 'environment',
          maxScansPerSecond: 5,
          returnDetailedScanResult: true,
        }
      );

      console.log('About to start scanner...');
      await qrScannerRef.current.start();
      setIsScanning(true);
      
      console.log('QR scanner started successfully');
      
    } catch (error: any) {
      console.error("Error starting QR scanner:", error);
      setIsScanning(false);
      setHasPermission(false);
      
      let errorMessage = "Failed to start camera scanner.";
      if (error?.name === 'NotAllowedError') {
        errorMessage = t("Camera permission denied. Please allow camera access.");
      } else if (error?.name === 'NotFoundError') {
        errorMessage = "No camera found on this device.";
      } else if (error?.name === 'NotSupportedError') {
        errorMessage = "Camera not supported in this browser.";
      }
      
      toast({
        title: t("Scanner Error"),
        description: errorMessage,
        variant: "destructive",
      });
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
    setHasPermission(null);
    onClose();
  };

  const retryCamera = () => {
    setHasPermission(null);
    checkCameraPermission();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            {scanTitle}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
            {hasPermission === false ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <Camera className="h-12 w-12 mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">{t("Camera Access Required")}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("Please allow camera access to scan QR codes")}
                </p>
                <Button onClick={retryCamera} variant="outline">
                  <Camera className="h-4 w-4 mr-2" />
                  {t("Allow Camera")}
                </Button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  style={{ display: 'block' }}
                  muted
                  playsInline
                />
                
                {!isScanning && hasPermission && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-center text-white">
                      <Camera className="h-12 w-12 mx-auto mb-2 animate-pulse" />
                      <p className="text-sm">{t("Initializing camera...")}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          {isScanning && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {t("Point your camera at a QR code to scan")}
              </p>
            </div>
          )}
          
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="w-full"
          >
            <X className="h-4 w-4 mr-2" />
            {t("Cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
