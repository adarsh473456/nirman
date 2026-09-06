'use client';

import * as React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { UserRole, UserProfile } from '../../types';
import { UserCircle2, Building2, ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  icon?: React.ReactNode;
}

export const AppInput = (props: InputProps) => {
  const { label, placeholder, icon, className = '', ...rest } = props;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLInputElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="w-full relative text-left">
      {label && (
        <label className="block mb-1.5 text-xs font-semibold text-zinc-300">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <input
          className={`peer relative z-10 border-2 border-[var(--color-border)] h-11 w-full rounded-xl bg-[var(--color-surface)] px-4 text-xs font-normal text-white outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-[var(--color-bg)] focus:border-brand-400 placeholder:text-zinc-500 ${className}`}
          placeholder={placeholder}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          {...rest}
        />
        {isHovering && (
          <>
            <div
              className="absolute pointer-events-none top-0 left-0 right-0 h-[2px] z-20 rounded-t-xl overflow-hidden"
              style={{
                background: `radial-gradient(40px circle at ${mousePosition.x}px 0px, var(--color-text-primary) 0%, transparent 70%)`,
              }}
            />
            <div
              className="absolute pointer-events-none bottom-0 left-0 right-0 h-[2px] z-20 rounded-b-xl overflow-hidden"
              style={{
                background: `radial-gradient(40px circle at ${mousePosition.x}px 2px, var(--color-text-primary) 0%, transparent 70%)`,
              }}
            />
          </>
        )}
        {icon && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 text-zinc-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export interface LoginOneProps {
  onAuthenticate?: (role: UserRole, profile?: Partial<UserProfile>, supplierId?: string) => void;
  onOpenSupplierRegistration?: () => void;
}

export default function LoginOne({
  onAuthenticate,
  onOpenSupplierRegistration,
}: LoginOneProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('buyer');
  const [email, setEmail] = useState('v.mehta@zenithaero.com');
  const [password, setPassword] = useState('••••••••••••');
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const leftSection = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - leftSection.left,
      y: e.clientY - leftSection.top,
    });
  };

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'buyer') setEmail('v.mehta@zenithaero.com');
    else if (role === 'supplier') setEmail('info@precisiontech-dyn.com');
    else setEmail('compliance@constellar.os');
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAuthenticate) return;
    if (selectedRole === 'buyer') {
      onAuthenticate('buyer', {
        name: 'Vikram Mehta',
        email: email || 'v.mehta@zenithaero.com',
        company: 'Zenith Aero Robotics',
        role: 'buyer',
      });
    } else if (selectedRole === 'supplier') {
      onAuthenticate(
        'supplier',
        {
          name: 'Rajesh Sharma',
          email: email || 'info@precisiontech-dyn.com',
          company: 'PrecisionTech Dynamics',
          role: 'supplier',
        },
        'sup-001'
      );
    } else {
      onAuthenticate('admin', {
        name: 'Platform Auditor',
        email: email || 'compliance@constellar.os',
        company: 'Constellar Verification Bureau',
        role: 'admin',
      });
    }
  };

  const socialIcons = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
          <path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"/>
        </svg>
      ),
      href: '#',
      gradient: 'bg-[var(--color-bg)]',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
          <path fill="currentColor" d="M6.94 5a2 2 0 1 1-4-.002a2 2 0 0 1 4 .002M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z"/>
        </svg>
      ),
      href: '#',
      bg: 'bg-[var(--color-bg)]',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
          <path fill="currentColor" d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396z"/>
        </svg>
      ),
      href: '#',
      bg: 'bg-[var(--color-bg)]',
    },
  ];

  return (
    <div className="w-full flex items-center justify-center">
      <div className="card w-full max-w-[390px] bg-[var(--color-surface)]/90 border-2 border-[var(--color-border)] rounded-2xl flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl overflow-hidden transition-all duration-300">
        
        {/* Role Pill Switcher */}
        <div className="p-2.5 bg-zinc-950/70 border-b border-[var(--color-border)]">
          <div className="grid grid-cols-3 gap-1 bg-zinc-900 p-0.5 rounded-xl border border-[var(--color-border)] text-[11px]">
            <button
              type="button"
              onClick={() => handleRoleChange('buyer')}
              className={`py-1.5 px-2 rounded-lg font-bold transition flex items-center justify-center space-x-1 ${
                selectedRole === 'buyer'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <UserCircle2 className="w-3.5 h-3.5" />
              <span>Buyer</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('supplier')}
              className={`py-1.5 px-2 rounded-lg font-bold transition flex items-center justify-center space-x-1 ${
                selectedRole === 'supplier'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Supplier</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`py-1.5 px-2 rounded-lg font-bold transition flex items-center justify-center space-x-1 ${
                selectedRole === 'admin'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Form Container with interactive mouse tracking gradient */}
        <div
          className="w-full px-5 py-5 relative overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Mouse follow radial glow */}
          <div
            className={`absolute pointer-events-none w-[350px] h-[350px] bg-gradient-to-r from-purple-400/20 via-sky-400/20 to-pink-400/20 rounded-full blur-3xl transition-opacity duration-200 ${
              isHovering ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transform: `translate(${mousePosition.x - 175}px, ${mousePosition.y - 175}px)`,
              transition: 'transform 0.08s ease-out',
            }}
          />

          <form className="text-center grid gap-3.5 relative z-10" onSubmit={handleSignIn}>
            <div className="grid gap-2">
              <h2 className="text-2xl font-black tracking-tight text-white">Sign In</h2>
              
              {/* Social icons */}
              <div className="flex items-center justify-center">
                <ul className="flex gap-2.5">
                  {socialIcons.map((social, index) => (
                    <li key={index} className="list-none">
                      <a
                        href={social.href}
                        onClick={(e) => {
                          e.preventDefault();
                          if (onAuthenticate) onAuthenticate(selectedRole);
                        }}
                        className="w-8 h-8 bg-zinc-900 rounded-full flex justify-center items-center relative z-[1] border border-[var(--color-border)] overflow-hidden group transition hover:border-brand-400"
                      >
                        <div
                          className={`absolute inset-0 w-full h-full bg-brand-600 scale-y-0 origin-bottom transition-transform duration-300 ease-in-out group-hover:scale-y-100`}
                        />
                        <span className="text-zinc-300 transition-all duration-300 z-[2] group-hover:text-white">
                          {social.icon}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <span className="text-[11px] text-zinc-400">or use your {selectedRole.toUpperCase()} account</span>
            </div>

            <div className="grid gap-2.5 items-center">
              <AppInput
                placeholder="Email address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <AppInput
                placeholder="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Demo password reset instructions sent.');
                }}
                className="font-normal text-zinc-400 hover:text-zinc-200 text-[11px]"
              >
                Forgot your password?
              </a>
              {selectedRole === 'supplier' && onOpenSupplierRegistration && (
                <button
                  type="button"
                  onClick={onOpenSupplierRegistration}
                  className="text-emerald-400 hover:underline text-[11px] font-bold"
                >
                  Register Plant
                </button>
              )}
            </div>

            {/* Shimmer Submit Button */}
            <div className="flex justify-center items-center pt-1">
              <button
                type="submit"
                className="group/button relative w-full inline-flex justify-center items-center overflow-hidden rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 px-5 py-2.5 text-xs font-bold text-white transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg hover:shadow-brand-500/30 cursor-pointer border border-brand-400/40"
              >
                <span className="text-xs font-bold px-2 py-0.5 flex items-center space-x-1.5">
                  <span>Sign In as {selectedRole.toUpperCase()}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
                  <div className="relative h-full w-10 bg-white/25" />
                </div>
              </button>
            </div>
          </form>
        </div>

        {/* Quick Demo Personas Footer */}
        <div className="p-2.5 bg-zinc-950/70 border-t border-[var(--color-border)] text-center">
          <div className="flex items-center justify-center space-x-1 text-[10px] text-zinc-400">
            <span className="text-zinc-500 font-bold uppercase tracking-wider">Quick:</span>
            <button
              type="button"
              onClick={() => onAuthenticate && onAuthenticate('buyer', { name: 'Vikram Mehta', email: 'v.mehta@zenithaero.com', company: 'Zenith Aero Robotics', role: 'buyer' })}
              className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-brand-900/50 text-zinc-300 hover:text-brand-300 font-medium transition"
            >
              Zenith (Buyer)
            </button>
            <button
              type="button"
              onClick={() => onAuthenticate && onAuthenticate('supplier', { name: 'Rajesh Sharma', email: 'info@precisiontech-dyn.com', company: 'PrecisionTech', role: 'supplier' }, 'sup-001')}
              className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-emerald-900/50 text-zinc-300 hover:text-emerald-300 font-medium transition"
            >
              PrecisionTech
            </button>
            <button
              type="button"
              onClick={() => onAuthenticate && onAuthenticate('admin', { name: 'Platform Auditor', email: 'compliance@constellar.os', company: 'Audit Bureau', role: 'admin' })}
              className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-amber-900/50 text-zinc-300 hover:text-amber-300 font-medium transition"
            >
              Admin
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
