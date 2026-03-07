import { Camera, RotateCw, X } from "lucide-react";
import { useEffect } from "react";
import { useCamera } from "../camera/useCamera";
import { Button } from "./ui/button";

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export default function CameraCapture({
  onCapture,
  onClose,
}: CameraCaptureProps) {
  const {
    isActive,
    isSupported,
    error,
    isLoading,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    retry,
    videoRef,
    canvasRef,
  } = useCamera({
    facingMode: "environment",
    quality: 0.9,
    format: "image/jpeg",
  });

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startCamera, stopCamera]);

  const handleCapture = async () => {
    const file = await capturePhoto();
    if (file) {
      onCapture(file);
      await stopCamera();
    }
  };

  const handleClose = async () => {
    await stopCamera();
    onClose();
  };

  const handleSwitchCamera = async () => {
    await switchCamera();
  };

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isSupported === false) {
    return (
      <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-card border rounded-lg p-6 max-w-md w-full space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Camera Not Supported</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-muted-foreground">
            Your browser does not support camera access. Please try using a
            different browser or device.
          </p>
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border rounded-lg overflow-hidden max-w-2xl w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Take Photo
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative bg-black" style={{ minHeight: "400px" }}>
          <div className="w-full" style={{ aspectRatio: "4/3" }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ display: isActive ? "block" : "none" }}
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />

            {!isActive && !error && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                  <p className="text-white">Initializing camera...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 border-t border-destructive/20">
            <p className="text-sm text-destructive font-medium mb-2">
              {error.type === "permission" && "Camera permission denied"}
              {error.type === "not-found" && "No camera found"}
              {error.type === "not-supported" && "Camera not supported"}
              {error.type === "unknown" && "Camera error"}
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              {error.message}
            </p>
            <Button onClick={retry} size="sm" disabled={isLoading}>
              Try Again
            </Button>
          </div>
        )}

        <div className="p-4 border-t bg-muted/30 flex items-center justify-center gap-3">
          {isMobile && isActive && (
            <Button
              variant="outline"
              size="lg"
              onClick={handleSwitchCamera}
              disabled={isLoading}
              className="gap-2"
            >
              <RotateCw className="h-5 w-5" />
              Switch
            </Button>
          )}

          <Button
            size="lg"
            onClick={handleCapture}
            disabled={!isActive || isLoading}
            className="gap-2 min-w-[140px]"
          >
            <Camera className="h-5 w-5" />
            Capture Photo
          </Button>
        </div>
      </div>
    </div>
  );
}
