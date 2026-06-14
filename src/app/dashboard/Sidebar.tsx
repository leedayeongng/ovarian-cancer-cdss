'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

/* ─── Icons ─── */

function IconDashboard() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="1" width="6" height="6" rx="1.5" />
      <rect x="9" y="1" width="6" height="6" rx="1.5" />
      <rect x="1" y="9" width="6" height="6" rx="1.5" />
      <rect x="9" y="9" width="6" height="6" rx="1.5" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="5" r="3" />
      <path d="M1 15c0-2.8 2.2-5 5-5s5 2.2 5 5" />
      <circle cx="13" cy="5" r="2.5" />
      <path d="M15 15c0-2.2-1.6-4-3.8-4.7" />
    </svg>
  );
}

function IconUltrasound() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="7" height="9" rx="1.5" />
      <path d="M8 7.5c1.5 0 3-.5 4-1.5" />
      <path d="M8 8.5c1.5.3 3 .2 4 .5" />
      <path d="M8 9.5c1.5.5 3 1 4 2" />
      <circle cx="4.5" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconAI() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6" />
      <circle cx="8" cy="8" r="2" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="8" y1="10" x2="8" y2="14" />
      <line x1="2" y1="8" x2="6" y2="8" />
      <line x1="10" y1="8" x2="14" y2="8" />
    </svg>
  );
}

function IconDoc() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 1h7l3 3v11H3V1z" />
      <path d="M10 1v3h3" />
      <line x1="5" y1="7" x2="11" y2="7" />
      <line x1="5" y1="10" x2="9" y2="10" />
    </svg>
  );
}


/* ─── Sidebar ─── */

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useAuth();

  const isNurse = role === 'nurse';

  const handleLogout = () => {
    localStorage.removeItem('user-role');
    router.push('/login');
  };

  return (
    <aside className="w-52 shrink-0 bg-[#0e0f0c] flex flex-col h-full print:hidden">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#1e2d0e]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="text-on-primary text-[11px] font-black">OG</span>
          </div>
          <div>
            <p className="text-[#e8ebe6] text-sm font-bold leading-tight">OvaGuard</p>
            <p className="text-[#454745] text-[10px]">CDSS v2.0</p>
          </div>
        </Link>
      </div>

      {/* Section label */}
      <div className="px-5 pt-5 pb-2">
        <p className="text-[#454745] text-[10px] font-semibold uppercase tracking-widest">메뉴</p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-0.5">
        {/* 대시보드 */}
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-semibold transition-colors ${
            pathname === '/dashboard'
              ? 'bg-primary text-on-primary'
              : 'text-[#868685] hover:text-[#e8ebe6] hover:bg-[#1a1c18]'
          }`}
        >
          <IconDashboard />
          대시보드
        </Link>

        {/* 환자 목록 */}
        <Link
          href="/dashboard/patients"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-semibold transition-colors ${
            pathname.startsWith('/dashboard/patients') && !pathname.includes('/cdss')
              ? 'bg-primary text-on-primary'
              : 'text-[#868685] hover:text-[#e8ebe6] hover:bg-[#1a1c18]'
          }`}
        >
          <IconUsers />
          환자 목록
        </Link>

        {/* 초음파 */}
        <Link
          href="/dashboard/ultrasound"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-semibold transition-colors ${
            pathname.startsWith('/dashboard/ultrasound')
              ? 'bg-primary text-on-primary'
              : 'text-[#868685] hover:text-[#e8ebe6] hover:bg-[#1a1c18]'
          }`}
        >
          <IconUltrasound />
          초음파
        </Link>

        {/* CDSS AI */}
        <Link
          href="/dashboard/patients?cdss=1"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-semibold transition-colors ${
            pathname.includes('/cdss')
              ? 'bg-primary text-on-primary'
              : 'text-[#868685] hover:text-[#e8ebe6] hover:bg-[#1a1c18]'
          }`}
        >
          <IconAI />
          CDSS AI
        </Link>

        {/* 의뢰서 */}
        <Link
          href="/dashboard/referral"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-semibold transition-colors ${
            pathname.startsWith('/dashboard/referral')
              ? 'bg-primary text-on-primary'
              : 'text-[#868685] hover:text-[#e8ebe6] hover:bg-[#1a1c18]'
          }`}
        >
          <IconDoc />
          의뢰서
        </Link>
      </nav>

      {/* Doctor/Nurse info + logout */}
      <div className="px-5 py-4 border-t border-[#1e2d0e]">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#1a1c18] border border-[#2a2c28] flex items-center justify-center shrink-0">
            <span className="text-[#868685] text-[10px] font-bold">{role === 'nurse' ? 'RN' : 'Dr'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#e8ebe6] text-xs font-semibold">{role === 'nurse' ? '간호사' : '이○○ 교수'}</p>
            <p className="text-[#454745] text-[10px]">
              {role === 'nurse' ? '간호 스테이션' : '산부인과 · 종양내과'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left text-[#454745] text-[10px] font-semibold hover:text-[#868685] transition-colors"
        >
          로그아웃
        </button>
      </div>
    </aside>
  );
}
