import React, { useState } from 'react';
import { X, Lock, KeyRound, ShieldAlert, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { storeService } from '../../services/storeService';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  if (!isOpen) return null;

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const success = storeService.adminLogin(password);
    setLoading(false);

    if (success) {
      onLoginSuccess();
      onClose();
    } else {
      setError('Invalid admin password. Default credentials: Rayyan@1234');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0d0d17] border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-300 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-900/30">
            <Lock className="w-7 h-7 text-purple-400" />
          </div>
          <h3 className="text-2xl font-black text-white font-['Outfit']">Admin Portal Login</h3>
          <p className="text-xs text-gray-400 mt-1">
            Restricted area for order approvals and store configuration
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Admin Passcode
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter admin password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-400 transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-gray-400 mt-1.5">
              Default passcode: <code className="text-amber-300 font-mono">Rayyan@1234</code>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full glow-btn text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-xl"
          >
            <span>{loading ? 'Authenticating...' : 'ACCESS ADMIN DASHBOARD'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
