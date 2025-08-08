import React, { useState } from "react";

interface StatusCardProps {
  title: string;
  status: 'ok' | 'warn' | 'fail' | 'skip';
  details?: string;
  onTest?: () => Promise<void>;
  loading?: boolean;
}

export const StatusCard: React.FC<StatusCardProps> = ({ 
  title, 
  status, 
  details, 
  onTest,
  loading = false 
}) => {
  const [isTesting, setIsTesting] = useState(false);

  const getStatusColor = () => {
    switch (status) {
      case 'ok': return 'text-success';
      case 'warn': return 'text-warning';
      case 'fail': return 'text-error';
      case 'skip': return 'text-base-content/50';
      default: return 'text-base-content/50';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'ok': return '✅';
      case 'warn': return '⚠️';
      case 'fail': return '❌';
      case 'skip': return '⏭️';
      default: return '⏭️';
    }
  };

  const handleTest = async () => {
    if (!onTest || isTesting) return;
    
    setIsTesting(true);
    try {
      await onTest();
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="bg-base-100 p-6 rounded-lg border border-base-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className={`text-2xl ${getStatusColor()}`}>
          {getStatusIcon()}
        </div>
      </div>
      
      {details && (
        <p className="text-sm text-base-content/70 mb-4">{details}</p>
      )}
      
      {onTest && (
        <button
          onClick={handleTest}
          disabled={isTesting || loading}
          className={`btn btn-sm ${
            isTesting || loading ? 'btn-disabled' : 'btn-primary'
          }`}
        >
          {isTesting || loading ? 'Testing...' : 'Test Now'}
        </button>
      )}
    </div>
  );
};
