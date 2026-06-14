'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/authContext';

function IconLock() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="6" width="9" height="7" rx="1.5" />
      <path d="M4.5 6V4.5a2.5 2.5 0 015 0V6" />
    </svg>
  );
}

export function CdssLinkButton({
  patientId,
  variant = 'primary',
}: {
  patientId: string;
  variant?: 'primary' | 'cta';
}) {
  const { role } = useAuth();
  const isNurse = role === 'nurse';

  const baseClass =
    variant === 'cta'
      ? 'shrink-0 font-semibold text-sm px-8 py-3 rounded-[16px] transition-colors'
      : 'shrink-0 font-semibold text-sm px-6 py-3 rounded-[16px] transition-colors';

  if (isNurse) {
    return (
      <div className="relative group shrink-0">
        <div
          className={`${baseClass} flex items-center gap-2 bg-canvas-soft text-mute cursor-not-allowed opacity-60 select-none`}
        >
          <IconLock />
          CDSS 분석 실행
        </div>
        <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap bg-[#0e0f0c] border border-[#2a2c28] text-[#e8ebe6] text-[11px] font-semibold px-3 py-1.5 rounded-[8px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
          의사 권한이 필요합니다
          <div className="absolute top-full right-4 border-4 border-transparent border-t-[#0e0f0c]" />
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/dashboard/patients/${patientId}/cdss`}
      className={`${baseClass} bg-primary text-on-primary hover:bg-primary-active`}
    >
      CDSS 분석 실행 →
    </Link>
  );
}
