import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
// import { toPng } from 'html-to-image';
import { toPng } from 'html-to-image';
import { Download, Save, Link, Mail, Phone, Wifi, MapPin, CalendarDays, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const QR_TYPES = [
  { id: 'url', label: 'URL', icon: Link, placeholder: 'https://example.com' },
  { id: 'email', label: 'Email', icon: Mail, placeholder: 'email@example.com' },
  { id: 'phone', label: 'Phone', icon: Phone, placeholder: '+1234567890' },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi, placeholder: 'SSID, Password' },
  { id: 'location', label: 'Location', icon: MapPin, placeholder: 'Latitude, Longitude' },
  { id: 'event', label: 'Event', icon: CalendarDays, placeholder: 'Event details' },
  { id: 'text', label: 'Text', icon: CheckCircle, placeholder: 'Enter any text' },
];

const QRGenerator = () => {
  const [qrType, setQrType] = useState('url');
  const [qrValue, setQrValue] = useState('');
  const [qrColor, setQrColor] = useState('#000000');
  const [qrBgColor, setQrBgColor] = useState('#FFFFFF');
  const [qrSize, setQrSize] = useState(200);
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [successfullyGenerated, setSuccessfullyGenerated] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const placeholder = QR_TYPES.find(type => type.id === qrType)?.placeholder || '';
  const TypeIcon = QR_TYPES.find(type => type.id === qrType)?.icon || Link;

  const generateQRCode = async () => {
    if (!qrValue.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a value to generate a QR code",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setSuccessfullyGenerated(false);

    try {
      const formattedValue = formatQRValue();
      const url = await QRCode.toDataURL(formattedValue, {
        width: qrSize,
        margin: 1,
        color: {
          dark: qrColor,
          light: qrBgColor,
        },
      });
      
      setQrImageUrl(url);
      setSuccessfullyGenerated(true);
      
      toast({
        title: "QR Code Generated",
        description: "Your QR code has been successfully generated",
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your QR code",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const formatQRValue = () => {
    switch (qrType) {
      case 'url':
        if (!qrValue.startsWith('http://') && !qrValue.startsWith('https://')) {
          return `https://${qrValue}`;
        }
        return qrValue;
      case 'email':
        return `mailto:${qrValue}`;
      case 'phone':
        return `tel:${qrValue}`;
      case 'wifi':
        const [ssid, password] = qrValue.split(',').map(s => s.trim());
        return `WIFI:S:${ssid};T:WPA;P:${password};;`;
      case 'location':
        const [lat, lng] = qrValue.split(',').map(s => s.trim());
        return `geo:${lat},${lng}`;
      case 'event':
        return `BEGIN:VEVENT\nSUMMARY:${qrValue}\nEND:VEVENT`;
      default:
        return qrValue;
    }
  };

  const downloadQRCode = () => {
    if (qrRef.current) {
      toPng(qrRef.current)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `qrcode-${Date.now()}.png`;
          link.href = dataUrl;
          link.click();
          
          toast({
            title: "QR Code Downloaded",
            description: "Your QR code has been downloaded successfully",
          });
        })
        .catch((error) => {
          console.error('Error downloading QR code:', error);
          toast({
            title: "Download Failed",
            description: "There was an error downloading your QR code",
            variant: "destructive",
          });
        });
    }
  };

  useEffect(() => {
    setQrImageUrl('');
    setSuccessfullyGenerated(false);
  }, [qrType]);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-6 bg-gradient-to-br from-secondary to-white">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Generate QR Code</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">QR Code Type</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {QR_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setQrType(type.id)}
                      className={`p-2 rounded-lg flex flex-col items-center justify-center text-xs sm:text-sm transition-all ${
                        qrType === type.id
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <type.icon className="h-5 w-5 mb-1" />
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="qrValue" className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <TypeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="qrValue"
                    value={qrValue}
                    onChange={(e) => setQrValue(e.target.value)}
                    placeholder={placeholder}
                    className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="qrColor" className="block text-sm font-medium text-gray-700 mb-2">
                    Foreground Color
                  </label>
                  <div className="flex">
                    <input
                      type="color"
                      id="qrColor"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="h-10 w-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <input 
                      type="text"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="ml-2 flex-1 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="qrBgColor" className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <div className="flex">
                    <input
                      type="color"
                      id="qrBgColor"
                      value={qrBgColor}
                      onChange={(e) => setQrBgColor(e.target.value)}
                      className="h-10 w-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <input 
                      type="text"
                      value={qrBgColor}
                      onChange={(e) => setQrBgColor(e.target.value)}
                      className="ml-2 flex-1 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="qrSize" className="block text-sm font-medium text-gray-700 mb-2">
                  Size: {qrSize}px
                </label>
                <input
                  type="range"
                  id="qrSize"
                  min="100"
                  max="400"
                  step="10"
                  value={qrSize}
                  onChange={(e) => setQrSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <button
                onClick={generateQRCode}
                disabled={isGenerating || !qrValue.trim()}
                className={`w-full bg-primary text-white py-2 px-4 rounded-md font-medium shadow-md hover:bg-primary/90 transition-colors ${
                  isGenerating || !qrValue.trim() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-rotate mr-2 h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  'Generate QR Code'
                )}
              </button>
            </div>
            
            <div className="md:w-1/2 p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Your QR Code</h2>
              
              <div 
                ref={qrRef}
                className="flex flex-col items-center justify-center bg-white rounded-lg border-2 border-dashed border-gray-300 h-64 mb-6"
              >
                {qrImageUrl ? (
                  <div className="animate-scale-in">
                    <img 
                      src={qrImageUrl} 
                      alt="Generated QR Code" 
                      className="max-w-full max-h-56"
                    />
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <CheckCircle className="mx-auto h-12 w-12 mb-2 text-gray-400" />
                    <p>Your QR code will appear here</p>
                    <p className="text-sm">Fill in the form and click Generate</p>
                  </div>
                )}
              </div>
              
              <button
                onClick={downloadQRCode}
                disabled={!successfullyGenerated}
                className={`w-full flex items-center justify-center bg-accent text-white py-2 px-4 rounded-md font-medium shadow-md hover:bg-accent/90 transition-colors ${
                  !successfullyGenerated ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Download className="mr-2 h-5 w-5" />
                Download QR Code
              </button>
              
              {successfullyGenerated && (
                <p className="text-center text-sm text-gray-600 mt-4">
                  Test your QR code by scanning it with a QR code reader app
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
