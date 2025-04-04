
import React, { useState } from 'react';
import Header from '@/components/Header';
import QRGenerator from '@/components/QRGenerator';
import QRScanner from '@/components/QRScanner';
import Footer from '@/components/Footer';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'generate' | 'scan'>('generate');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-grow">
        {activeTab === 'generate' ? <QRGenerator /> : <QRScanner />}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
