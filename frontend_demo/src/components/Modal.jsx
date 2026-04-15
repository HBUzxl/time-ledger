import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} mx-4 animate-scale-in overflow-hidden`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'default' }) => {
  const typeStyles = {
    default: 'bg-slate-800 hover:bg-slate-700',
    danger: 'bg-red-500 hover:bg-red-600',
    warning: 'bg-amber-500 hover:bg-amber-600',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-slate-600 mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button 
          onClick={onClose}
          className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {cancelText}
        </button>
        <button 
          onClick={onConfirm}
          className={`px-4 py-2 text-white rounded-lg transition-colors ${typeStyles[type]}`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export const Toast = ({ message, type = 'info', isVisible, onClose }) => {
  if (!isVisible) return null;

  const typeStyles = {
    info: 'bg-slate-800',
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className={`${typeStyles[type]} text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3`}>
        <span>{message}</span>
        <button onClick={onClose} className="hover:opacity-80">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
