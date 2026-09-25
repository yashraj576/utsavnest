import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, X, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { isAdminLoginModalOpen, setIsAdminLoginModalOpen, loginAdmin } = useApp();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isAdminLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(password);
    if (!success) {
      setError(true);
      setPassword('');
    } else {
      setError(false);
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-[#FAF7F2] rounded-3xl max-w-sm w-full p-6 border border-[#E7DECD] shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            setIsAdminLoginModalOpen(false);
            setError(false);
            setPassword('');
          }}
          className="absolute top-4 right-4 p-2 text-[#78716C] hover:text-[#1C1917] rounded-full hover:bg-stone-200/50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center pt-2">
          <div className="w-12 h-12 rounded-2xl bg-[#78350F] text-[#FDE68A] flex items-center justify-center mx-auto shadow-md mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-serif-luxury text-xl font-bold text-[#1C1917]">
            Admin Login
          </h2>
          <p className="text-xs text-[#78716C] mt-1">
            Enter administrative password to access the store dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-[#44403C] uppercase tracking-wide mb-1 text-left">
              Password
            </label>
            <input
              type="password"
              autoFocus
              required
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(false);
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-[#D7CDBB] bg-white text-sm focus:outline-none focus:border-[#78350F]"
            />
            {error && (
              <div className="flex items-center gap-1.5 text-xs text-[#DC2626] mt-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Incorrect password. Access denied.</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#78350F] hover:bg-[#92400E] text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Lock className="w-4 h-4 text-[#FDE68A]" />
            <span>Login</span>
            <ArrowRight className="w-4 h-4 text-[#FDE68A]" />
          </button>
        </form>

        <div className="mt-5 pt-3 border-t border-[#E7DECD] text-center">
          <span className="text-[10px] text-[#A8A29E] flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B45309]" />
            Local session authorized for store owner
          </span>
        </div>
      </div>
    </div>
  );
};
