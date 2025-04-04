
import React, { useState, useEffect } from 'react';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { Check, Copy, Loader, ExternalLink, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const QRScanner = () => {
  const [scanning, setScanning] = useState(true);
  const [scannedResult, setScannedResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check for camera permission
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => setCameraPermission(true))
      .catch(() => setCameraPermission(false));
  }, []);

  const handleDecode = (result: string) => {
    setScannedResult(result);
    setScanning(false);
    
    toast({
      title: "QR Code Detected",
      description: "Successfully scanned a QR code!",
    });
  };

  const handleError = (error: Error) => {
    console.error("QR Scanner error:", error);
    
    toast({
      title: "Scanning Error",
      description: "There was an error while scanning. Please try again.",
      variant: "destructive",
    });
  };

  const resetScanner = () => {
    setScannedResult('');
    setScanning(true);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(scannedResult)
      .then(() => {
        setCopied(true);
        
        toast({
          title: "Copied",
          description: "Result copied to clipboard",
        });
        
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        
        toast({
          title: "Copy Failed",
          description: "Failed to copy to clipboard",
          variant: "destructive",
        });
      });
  };

  const isValidUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Scan QR Code</h2>
            
            {cameraPermission === false && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      Camera access is blocked. Please allow camera access in your browser settings to scan QR codes.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {scanning ? (
              <div className="bg-gray-100 rounded-lg overflow-hidden mb-6">
                <div className="relative">
                  {cameraPermission !== false && (
                    <>
                      <div className="aspect-square max-w-md mx-auto">
                        <QrScanner
                          onDecode={handleDecode}
                          onError={handleError}
                          scanDelay={500}
                          constraints={{
                            facingMode: isMobile ? "environment" : "user"
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="border-2 border-primary w-2/3 h-2/3 max-w-xs max-h-xs rounded-lg opacity-70 flex items-center justify-center">
                            <div className="w-full h-full relative">
                              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl-sm"></div>
                              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr-sm"></div>
                              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary rounded-bl-sm"></div>
                              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary rounded-br-sm"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="p-4 text-center text-gray-600">
                  <p>Position QR code within the frame to scan</p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-6 mb-6 animate-scale-in">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Scan Result</h3>
                <div className="bg-white p-3 rounded border border-gray-300 mb-4">
                  <p className="break-all">{scannedResult}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="flex-1 flex items-center justify-center bg-primary text-white py-2 px-4 rounded-md font-medium shadow-md hover:bg-primary/90 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="mr-2 h-5 w-5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-5 w-5" />
                        Copy
                      </>
                    )}
                  </button>
                  {isValidUrl(scannedResult) && (
                    <a
                      href={scannedResult}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center bg-accent text-white py-2 px-4 rounded-md font-medium shadow-md hover:bg-accent/90 transition-colors"
                    >
                      <ExternalLink className="mr-2 h-5 w-5" />
                      Open Link
                    </a>
                  )}
                </div>
              </div>
            )}
            
            {!scanning && (
              <button
                onClick={resetScanner}
                className="w-full flex items-center justify-center bg-secondary text-gray-800 py-2 px-4 rounded-md font-medium shadow-md hover:bg-secondary/80 transition-colors"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                Scan Another Code
              </button>
            )}
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Scan any QR code to quickly extract its information</p>
          <p>For best results, ensure good lighting and a steady hand</p>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
