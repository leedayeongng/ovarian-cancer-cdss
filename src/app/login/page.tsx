'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { UserRole } from '@/lib/authContext';

const ACCOUNTS: Record<UserRole, { id: string; pw: string }> = {
  doctor: { id: 'doctor', pw: '1234' },
  nurse:  { id: 'nurse',  pw: '1234' },
};

function IconLock() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="6" width="9" height="7" rx="1.5" />
      <path d="M4.5 6V4.5a2.5 2.5 0 015 0V6" />
    </svg>
  );
}

function IconStethoscope() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2v6a4 4 0 008 0V2" />
      <path d="M10 12v3a3 3 0 006 0v-2" />
      <circle cx="16" cy="13" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconNurse() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="6" r="3.5" />
      <path d="M3 19c0-3.9 3.1-7 7-7s7 3.1 7 7" />
      <line x1="10" y1="11" x2="10" y2="15" />
      <line x1="8" y1="13" x2="12" y2="13" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setId('');
    setPw('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 600));

    const account = ACCOUNTS[selectedRole];
    if (id === account.id && pw === account.pw) {
      localStorage.setItem('user-role', selectedRole);
      router.push('/dashboard');
    } else {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0e0f0c] flex-col justify-between p-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="text-on-primary text-xs font-black">OG</span>
          </div>
          <span className="text-[#e8ebe6] font-bold text-base tracking-tight">OvaGuard CDSS</span>
        </Link>

        {/* Center copy */}
        <div>
          <div className="mb-8">
            <span className="bg-primary-pale text-positive-deep text-xs font-semibold px-3 py-1.5 rounded-full">
              AI 기반 임상의사결정지원
            </span>
          </div>
          <h2 className="font-display font-black text-[#e8ebe6] text-[40px] leading-tight mb-4">
            환자 맞춤형<br />난소암 AI<br />진단 지원
          </h2>
          <p className="text-[#454745] text-sm leading-relaxed max-w-xs">
            초음파 AI · RMI 스코어 · 혈액대사 AI 세 모듈을 통합한 멀티모달 분석으로 신속하고 정확한 임상 판단을 지원합니다.
          </p>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-2 mt-8">
            {['초음파 AI (ResNet-50)', 'RMI 스코어 자동 계산', '혈액·대사 AI 앙상블', '고위험 환자 알림'].map(label => (
              <span key={label} className="text-xs text-[#868685] border border-[#1e2d0e] px-3 py-1.5 rounded-full">
                {label}
              </span>
            ))}
          </div>

          {/* Role access info */}
          <div className="mt-8 space-y-2.5">
            <p className="text-[#454745] text-[10px] font-semibold uppercase tracking-widest">역할별 접근 권한</p>
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-primary text-[9px] font-bold">Dr</span>
              </div>
              <div>
                <p className="text-[#868685] text-xs font-semibold">의사</p>
                <p className="text-[#454745] text-[11px]">CDSS 분석 실행 · 의뢰서 작성/전송 · 초음파 업로드</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#1e2d0e] flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[#868685] text-[9px] font-bold">RN</span>
              </div>
              <div>
                <p className="text-[#868685] text-xs font-semibold">간호사</p>
                <p className="text-[#454745] text-[11px]">신규 환자 등록 · 환자 조회 · CDSS 결과 조회 · 초음파 업로드</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-8">
          {[
            { value: '94.7%', label: '민감도' },
            { value: '91.2%', label: '특이도' },
            { value: '<2분', label: '분석 시간' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="font-black text-primary text-2xl">{value}</p>
              <p className="text-[#454745] text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center bg-canvas-soft px-6 py-12">
        {/* Mobile logo */}
        <Link href="/" className="flex items-center gap-2.5 mb-10 lg:hidden">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
            <span className="text-on-primary text-xs font-black">OG</span>
          </div>
          <span className="text-ink font-bold text-base tracking-tight">OvaGuard CDSS</span>
        </Link>

        <div className="w-full max-w-sm">
          <h1 className="font-display font-black text-ink text-[32px] leading-tight mb-1">로그인</h1>
          <p className="text-mute text-sm mb-8">CDSS 시스템에 접속하려면 로그인이 필요합니다.</p>

          {/* Role selector */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-mute uppercase tracking-wide mb-3">역할 선택</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleSelect('doctor')}
                className={`relative flex flex-col items-center gap-2.5 px-4 py-4 rounded-[16px] border-2 transition-all ${
                  selectedRole === 'doctor'
                    ? 'border-primary bg-primary-pale'
                    : 'border-canvas-soft bg-canvas hover:border-ink/20'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  selectedRole === 'doctor' ? 'bg-primary text-on-primary' : 'bg-canvas-soft text-mute'
                }`}>
                  <IconStethoscope />
                </div>
                <div className="text-center">
                  <p className={`text-sm font-bold ${selectedRole === 'doctor' ? 'text-positive-deep' : 'text-ink'}`}>
                    의사
                  </p>
                  <p className="text-mute text-[10px] mt-0.5">분석 · 의뢰 권한</p>
                </div>
                {selectedRole === 'doctor' && (
                  <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4l2 2 3-3" stroke="#0e0f0c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('nurse')}
                className={`relative flex flex-col items-center gap-2.5 px-4 py-4 rounded-[16px] border-2 transition-all ${
                  selectedRole === 'nurse'
                    ? 'border-primary bg-primary-pale'
                    : 'border-canvas-soft bg-canvas hover:border-ink/20'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  selectedRole === 'nurse' ? 'bg-primary text-on-primary' : 'bg-canvas-soft text-mute'
                }`}>
                  <IconNurse />
                </div>
                <div className="text-center">
                  <p className={`text-sm font-bold ${selectedRole === 'nurse' ? 'text-positive-deep' : 'text-ink'}`}>
                    간호사
                  </p>
                  <p className="text-mute text-[10px] mt-0.5">등록 · 조회 권한</p>
                </div>
                {selectedRole === 'nurse' && (
                  <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4l2 2 3-3" stroke="#0e0f0c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Form (visible after role selection) */}
          <div className={`transition-all duration-300 ${selectedRole ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* ID */}
              <div>
                <label className="text-xs font-semibold text-mute uppercase tracking-wide block mb-2">
                  아이디
                </label>
                <input
                  type="text"
                  value={id}
                  onChange={e => { setId(e.target.value); setError(''); }}
                  placeholder="아이디를 입력하세요"
                  autoComplete="username"
                  className={`w-full bg-canvas border rounded-[14px] px-4 py-3 text-sm text-ink placeholder:text-mute focus:outline-none transition-colors ${
                    error ? 'border-negative' : 'border-canvas-soft focus:border-primary'
                  }`}
                />
              </div>

              {/* PW */}
              <div>
                <label className="text-xs font-semibold text-mute uppercase tracking-wide block mb-2">
                  비밀번호
                </label>
                <input
                  type="password"
                  value={pw}
                  onChange={e => { setPw(e.target.value); setError(''); }}
                  placeholder="비밀번호를 입력하세요"
                  autoComplete="current-password"
                  className={`w-full bg-canvas border rounded-[14px] px-4 py-3 text-sm text-ink placeholder:text-mute focus:outline-none transition-colors ${
                    error ? 'border-negative' : 'border-canvas-soft focus:border-primary'
                  }`}
                />
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 bg-[#320707] rounded-[12px] px-4 py-3">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-negative" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <circle cx="7" cy="7" r="6" />
                    <line x1="7" y1="4.5" x2="7" y2="7.5" />
                    <circle cx="7" cy="9.5" r="0.75" fill="currentColor" stroke="none" />
                  </svg>
                  <p className="text-negative text-xs font-semibold">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !id || !pw || !selectedRole}
                className="w-full bg-primary text-on-primary font-semibold text-sm py-3.5 rounded-[16px] hover:bg-primary-active transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                      <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    로그인 중…
                  </>
                ) : (
                  selectedRole
                    ? `${selectedRole === 'doctor' ? '의사' : '간호사'}로 로그인`
                    : '로그인'
                )}
              </button>
            </form>
          </div>

          {/* Mock hint */}
          <div className="mt-6 bg-canvas border border-canvas-soft rounded-[14px] px-4 py-3.5">
            <p className="text-mute text-xs font-semibold mb-2.5">테스트 계정</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selectedRole === 'doctor' ? 'bg-primary-pale text-positive-deep' : 'text-mute'}`}>
                  의사
                </span>
                <div className="flex gap-4 text-xs text-body font-mono">
                  <span>ID: <span className="text-ink font-bold">doctor</span></span>
                  <span>PW: <span className="text-ink font-bold">1234</span></span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selectedRole === 'nurse' ? 'bg-primary-pale text-positive-deep' : 'text-mute'}`}>
                  간호사
                </span>
                <div className="flex gap-4 text-xs text-body font-mono">
                  <span>ID: <span className="text-ink font-bold">nurse</span></span>
                  <span>PW: <span className="text-ink font-bold">1234</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-mute text-xs mt-10">© 2024 OvaGuard CDSS — 임상 참고용</p>
      </div>
    </div>
  );
}
