import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, RotateCcw, Check } from 'lucide-react';

interface WebcamCaptureProps {
  onCapture: (imageData: string) => void;
  isCapturing?: boolean;
  title?: string;
}

export const WebcamCapture: React.FC<WebcamCaptureProps> = ({ 
  onCapture, 
  isCapturing = false,
  title = "Face Capture" 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const startCamera = useCallback(async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Unable to access camera. Please ensure camera permissions are granted.');
      console.error('Camera access error:', err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    stopCamera();
  }, [stopCamera]);

  const retake = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  const confirmCapture = useCallback(() => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  }, [capturedImage, onCapture]);

  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
        
        <div className="relative bg-muted rounded-lg overflow-hidden mb-4">
          {capturedImage ? (
            <img 
              src={capturedImage} 
              alt="Captured face"
              className="w-full h-auto"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-auto"
                style={{ display: stream ? 'block' : 'none' }}
              />
              {!stream && (
                <div className="aspect-video flex items-center justify-center bg-muted">
                  <div className="text-center text-muted-foreground">
                    <Camera className="w-12 h-12 mx-auto mb-2" />
                    <p>Camera not active</p>
                  </div>
                </div>
              )}
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {error && (
          <div className="text-destructive text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <div className="flex gap-2 justify-center">
          {!stream && !capturedImage && (
            <Button 
              onClick={startCamera}
              disabled={isCapturing}
              variant="secure"
              className="flex-1"
            >
              <Camera className="w-4 h-4 mr-2" />
              Start Camera
            </Button>
          )}

          {stream && !capturedImage && (
            <Button 
              onClick={captureImage}
              disabled={isCapturing}
              variant="vote"
              className="flex-1"
            >
              <Camera className="w-4 h-4 mr-2" />
              Capture
            </Button>
          )}

          {capturedImage && (
            <>
              <Button 
                onClick={retake}
                variant="outline"
                disabled={isCapturing}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake
              </Button>
              <Button 
                onClick={confirmCapture}
                variant="success"
                disabled={isCapturing}
              >
                <Check className="w-4 h-4 mr-2" />
                Confirm
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};