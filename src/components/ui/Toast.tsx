// src/components/ui/Toast.tsx
import React, { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'success', 
  duration = 3000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isLeaving, setIsLeaving] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!isVisible) return null;

  // Style configurations based on type
  const toastStyles = {
    success: {
      bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      border: 'border-l-4 border-emerald-700'
    },
    error: {
      bg: 'bg-gradient-to-r from-red-500 to-rose-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      border: 'border-l-4 border-rose-700'
    },
    warning: {
      bg: 'bg-gradient-to-r from-amber-500 to-orange-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      border: 'border-l-4 border-orange-700'
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      border: 'border-l-4 border-indigo-700'
    }
  };

  const { bg, icon, border } = toastStyles[type];

  return (
    <div className={`fixed top-4 right-4 z-50 ${bg} text-white px-6 py-4 rounded-xl shadow-2xl flex items-start gap-3 min-w-[320px] max-w-md transform transition-all duration-300 ease-out ${
      isLeaving 
        ? 'translate-x-full opacity-0 scale-95' 
        : 'translate-x-0 opacity-100 scale-100'
    } ${border} backdrop-blur-sm bg-opacity-95`}>
      {/* Icon Container */}
      <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center p-1.5 mt-0.5">
        {icon}
      </div>
      
      {/* Message */}
      <div className="flex-1">
        <p className="text-sm font-medium leading-tight">{message}</p>
      </div>
      
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="flex-shrink-0 w-6 h-6 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ease-out hover:scale-110"
        aria-label="Close notification"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 rounded-b-xl overflow-hidden">
        <div 
          className={`h-full ${type === 'success' ? 'bg-emerald-300' : type === 'error' ? 'bg-rose-300' : type === 'warning' ? 'bg-amber-300' : 'bg-indigo-300'} transition-all duration-300 ease-linear`}
          style={{ 
            width: isLeaving ? '0%' : '100%',
            transition: `width ${duration}ms linear`
          }}
        />
      </div>
    </div>
  );
};

export default Toast;