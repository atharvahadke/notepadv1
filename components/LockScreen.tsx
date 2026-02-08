import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface LockScreenProps {
  isSetupMode: boolean;
  onUnlock: (password: string) => void;
  onSetPassword: (password: string) => void;
  onCancelSetup?: () => void;
}

const LockScreen: React.FC<LockScreenProps> = ({ isSetupMode, onUnlock, onSetPassword, onCancelSetup }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSetupMode) {
      if (password.length < 4) {
        setError('Password must be at least 4 characters');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      onSetPassword(password);
    } else {
      onUnlock(password);
      setTimeout(() => setError('Incorrect password'), 200);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center p-4 overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-purple/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-neon-cyan/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-black/50 border border-neon-cyan/30 mb-8 shadow-[0_0_30px_-5px_rgba(0,243,255,0.2)] backdrop-blur-xl group">
             {/* Rotating border effect */}
             <div className="absolute inset-0 rounded-3xl border border-neon-purple/30 rotate-6 scale-90 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-100"></div>
             
            {isSetupMode ? <ShieldCheck size={40} className="text-neon-cyan drop-shadow-[0_0_10px_#00f3ff]" /> : <Lock size={40} className="text-neon-pink drop-shadow-[0_0_10px_#ff00ff]" />}
          </div>
          <h2 className="text-4xl font-bold text-white mb-3 tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            {isSetupMode ? 'Secure Protocol' : 'Access Control'}
          </h2>
          <p className="text-neutral-400 text-sm tracking-wide">
            {isSetupMode 
              ? 'INITIALIZE MASTER ENCRYPTION KEY' 
              : 'ENTER SECURITY CREDENTIALS'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSetupMode ? "CREATE PASSCODE" : "ENTER PASSCODE"}
                className="w-full bg-black/50 border border-white/10 hover:border-neon-cyan/50 focus:border-neon-cyan text-white px-6 py-5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-neon-cyan/50 transition-all text-center text-2xl placeholder:text-neutral-700 tracking-[0.5em] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
                autoFocus
                />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-neon-cyan shadow-[0_0_10px_#00f3ff] transition-all duration-300 group-focus-within:w-1/2"></div>
            </div>
            
            {isSetupMode && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                 <div className="relative group">
                    <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="CONFIRM PASSCODE"
                    className="w-full bg-black/50 border border-white/10 hover:border-neon-purple/50 focus:border-neon-purple text-white px-6 py-5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-neon-purple/50 transition-all text-center text-2xl placeholder:text-neutral-700 tracking-[0.5em] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
                    />
                 </div>
              </motion.div>
            )}
          </div>

          {error && (
            <p className="text-red-400 text-xs text-center font-bold tracking-widest animate-pulse bg-red-900/10 py-2 rounded-lg border border-red-500/20 shadow-[0_0_10px_rgba(255,0,0,0.2)]">
                ⚠ {error.toUpperCase()}
            </p>
          )}

          <button
            type="submit"
            className="group w-full bg-white text-black hover:bg-neon-cyan hover:text-black font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 mt-6 shadow-[0_0_20px_-5px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_-5px_#00f3ff] hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden"
          >
            <span className="relative z-10 tracking-wider text-sm">{isSetupMode ? 'ENGAGE PROTOCOL' : 'UNLOCK SYSTEM'}</span>
            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>
          
          {isSetupMode && onCancelSetup && (
             <button
             type="button"
             onClick={onCancelSetup}
             className="w-full text-neutral-600 hover:text-neon-cyan py-2 transition-colors text-xs font-medium tracking-widest"
           >
             ABORT SETUP
           </button>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default LockScreen;