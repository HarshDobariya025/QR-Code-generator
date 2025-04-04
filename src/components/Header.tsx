
import React from 'react';
import { QrCode, ScanLine } from 'lucide-react';

interface HeaderProps {
  activeTab: 'generate' | 'scan';
  setActiveTab: (tab: 'generate' | 'scan') => void;
}

const Header = ({ activeTab, setActiveTab }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto py-4">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">QR Code Verse</h1>
        <div className="flex justify-center">
          <div className="bg-gray-100 p-1 rounded-lg inline-flex">
            <button
              onClick={() => setActiveTab('generate')}
              className={`flex items-center px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === 'generate'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <QrCode className="mr-2 h-5 w-5" />
              Generate
            </button>
            <button
              onClick={() => setActiveTab('scan')}
              className={`flex items-center px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === 'scan'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ScanLine className="mr-2 h-5 w-5" />
              Scan
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
