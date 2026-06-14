import Link from 'next/link';
import Image from 'next/image';
import ScrollObserver from './ScrollObserver';

/* ─── CSS Animations (spring easing, staggered reveal) ─── */

function HeroStyles() {
  return (
    <style>{`
      @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(1.5rem); filter: blur(4px); }
        to   { opacity: 1; transform: translateY(0);      filter: blur(0); }
      }
      .ha1 { animation: fadeSlideUp 0.9s cubic-bezier(0.16,1,0.3,1) both; }
      .ha2 { animation: fadeSlideUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
      .ha3 { animation: fadeSlideUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.22s both; }
      .ha4 { animation: fadeSlideUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.34s both; }
      .ha5 { animation: fadeSlideUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.46s both; }
      .spring { transition: transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s cubic-bezier(0.16,1,0.3,1); }
      .spring:hover { transform: scale(1.025) translateY(-2px); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
      .spring-btn { transition: all 0.5s cubic-bezier(0.16,1,0.3,1); }
      .spring-btn:hover { transform: scale(1.04) translateY(-1px); }
    `}</style>
  );
}

/* ─── NavBar: Floating Glass Pill ─── */

function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-6 pointer-events-none">
      <div className="flex items-center gap-1 pl-2 pr-2 py-2 rounded-full backdrop-blur-xl bg-white/[0.06] border border-white/10 pointer-events-auto shadow-[0_1px_0_rgba(255,255,255,0.04),0_8px_32px_rgba(0,0,0,0.4)]">
        <Link href="/" className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/[0.06] transition-colors shrink-0">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <span className="text-on-primary text-[9px] font-black">OG</span>
          </div>
          <span className="text-[#e8ebe6] font-bold text-sm tracking-tight">OvaGuard</span>
        </Link>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <Link
          href="/#features"
          className="text-sm font-medium text-[#868685] hover:text-[#e8ebe6] transition-colors px-4 py-2 rounded-full hover:bg-white/[0.06] whitespace-nowrap"
        >
          시스템 소개
        </Link>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <Link
          href="/login"
          className="spring-btn bg-primary text-on-primary text-sm font-semibold px-5 py-2 rounded-full hover:bg-primary-active"
        >
          CDSS 시작하기 →
        </Link>
      </div>
    </nav>
  );
}

/* ─── Grad-CAM thumbnail SVG ─── */

function GradCAMThumb() {
  return (
    <svg viewBox="0 0 200 130" className="w-full rounded-[10px]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="hm" cx="52%" cy="48%" r="44%">
          <stop offset="0%"   stopColor="#ff2222" stopOpacity="0.92" />
          <stop offset="28%"  stopColor="#ff7700" stopOpacity="0.72" />
          <stop offset="60%"  stopColor="#ffee00" stopOpacity="0.44" />
          <stop offset="100%" stopColor="#0055ff" stopOpacity="0.05" />
        </radialGradient>
        <filter id="hb"><feGaussianBlur stdDeviation="6" /></filter>
        <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0055ff" />
          <stop offset="50%" stopColor="#ffee00" />
          <stop offset="100%" stopColor="#ff2222" />
        </linearGradient>
      </defs>
      <rect width="200" height="130" rx="10" fill="#080d12" />
      <ellipse cx="98" cy="65" rx="68" ry="50" fill="#111827" opacity="0.8" />
      <ellipse cx="102" cy="65" rx="52" ry="40" fill="#0f1d2a" />
      <ellipse cx="102" cy="65" rx="62" ry="47" fill="url(#hm)" filter="url(#hb)" />
      <rect x="50" y="26" width="100" height="76" rx="3" fill="none" stroke="#9fe870" strokeWidth="1.5" strokeDasharray="5,3" />
      <path d="M50,26 L50,40 M50,26 L64,26" stroke="#9fe870" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M150,26 L150,40 M150,26 L136,26" stroke="#9fe870" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M50,102 L50,88 M50,102 L64,102" stroke="#9fe870" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M150,102 L150,88 M150,102 L136,102" stroke="#9fe870" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <rect x="50" y="11" width="100" height="13" rx="3" fill="#9fe870" />
      <text x="57" y="21" fill="#0e0f0c" fontSize="8" fontFamily="monospace" fontWeight="700">Malignant · 72.4 %</text>
      <text x="8" y="124" fill="#374151" fontSize="7" fontFamily="monospace">Grad-CAM · ResNet-50</text>
      <rect x="8" y="7" width="36" height="5" fill="url(#lg)" rx="2" />
      <text x="8" y="6" fill="#374151" fontSize="6" fontFamily="monospace">Low</text>
      <text x="36" y="6" fill="#374151" fontSize="6" fontFamily="monospace">Hi</text>
    </svg>
  );
}

/* ─── Hero Dashboard (Double-Bezel Bento Grid) ─── */

function HeroDashboard() {
  return (
    <div className="ha5 relative w-full max-w-[400px] ml-auto">
      <div
        className="absolute -inset-10 -z-10 rounded-[4rem] opacity-25 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 55% 40%, #9fe870 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="bg-white/[0.04] rounded-[28px] p-[5px] border border-white/[0.09]"
        style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.07), 0 32px 64px rgba(0,0,0,0.5)' }}
      >
        <div className="grid gap-[5px]" style={{ gridTemplateColumns: '1fr 0.82fr' }}>

          {/* Card A: Ultrasound AI — tall */}
          <div
            className="spring row-span-2 bg-[#0f1512] border border-white/[0.07] rounded-[23px] p-4 flex flex-col gap-3"
            style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.04)' }}
          >
            <div className="flex items-center justify-between">
              <p className="text-[#454745] text-[10px] font-semibold uppercase tracking-widest">초음파 AI</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#320707] text-[#f87171]">고위험</span>
            </div>
            <GradCAMThumb />
            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#454745] text-xs">악성 확률</span>
                  <span className="text-primary font-black text-2xl leading-none">72.4%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="h-full rounded-full bg-[#d03238]" style={{ width: '72.4%' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { l: '종양 크기', v: '4.2 cm²' },
                  { l: 'FIGO 병기', v: 'IIIC' },
                  { l: '경계 불규칙', v: '0.82' },
                  { l: '종양 유형', v: '장액성' },
                ].map(({ l, v }) => (
                  <div key={l} className="bg-white/[0.03] rounded-[8px] px-2.5 py-1.5">
                    <p className="text-[#2a2c28] text-[9px] font-semibold uppercase">{l}</p>
                    <p className="text-[#868685] text-[11px] font-bold">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card B: RMI Score */}
          <div
            className="spring bg-[#0f1512] border border-white/[0.07] rounded-[23px] p-4"
            style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.04)' }}
          >
            <p className="text-[#454745] text-[10px] font-semibold uppercase tracking-widest mb-0.5">RMI 스코어</p>
            <p className="text-primary font-black leading-none mb-0.5" style={{ fontSize: '2.2rem' }}>3,483</p>
            <p className="text-[#d03238] text-[11px] font-bold mb-3">기준 &gt;200 고위험</p>
            <div className="grid grid-cols-3 gap-1 text-center">
              {[{ l: 'U', v: '3' }, { l: 'M', v: '×3' }, { l: 'CA-125', v: '1161' }].map(({ l, v }) => (
                <div key={l} className="bg-white/[0.03] rounded-[8px] py-1.5">
                  <p className="text-[#2a2c28] text-[8px] font-semibold uppercase">{l}</p>
                  <p className="text-[#868685] text-xs font-bold">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card C: AI Ensemble */}
          <div
            className="spring bg-[#0f1512] border border-white/[0.07] rounded-[23px] p-4"
            style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.04)' }}
          >
            <p className="text-[#454745] text-[10px] font-semibold uppercase tracking-widest mb-0.5">AI 앙상블</p>
            <p className="text-primary font-black leading-none mb-0.5" style={{ fontSize: '2.2rem' }}>88%</p>
            <div className="space-y-1.5 mt-2">
              {[
                { n: 'XGBoost', v: 86 },
                { n: 'LightGBM', v: 91 },
                { n: 'CatBoost', v: 87 },
              ].map(({ n, v }) => (
                <div key={n} className="flex items-center gap-2">
                  <span className="text-[#2a2c28] text-[9px] w-14 shrink-0">{n}</span>
                  <div className="flex-1 h-[3px] rounded-full bg-white/[0.06]">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${v}%` }} />
                  </div>
                  <span className="text-[#454745] text-[9px] w-6 text-right">{v}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card D: CDSS Result — full width */}
          <div
            className="col-span-2 rounded-[23px] px-5 py-3.5 flex items-center justify-between border"
            style={{
              background: 'rgba(159,232,112,0.07)',
              borderColor: 'rgba(159,232,112,0.2)',
              boxShadow: 'inset 0 1px 1px rgba(159,232,112,0.05)',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary">
                  <path d="M7 2v5M7 9.5v.5" />
                  <circle cx="7" cy="7" r="6" />
                </svg>
              </div>
              <div>
                <p className="text-primary font-bold text-sm leading-tight">고위험군 판정</p>
                <p className="text-[#4a7a2a] text-xs">3차 병원 즉시 의뢰 권고</p>
              </div>
            </div>
            <span className="shrink-0 bg-primary text-on-primary text-[10px] font-bold px-3 py-1.5 rounded-full">
              CDSS 결과
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Hero Section ─── */

function HeroSection() {
  return (
    <section className="relative bg-[#0e0f0c] min-h-screen flex items-center overflow-hidden">

      {/* Background image */}
      <Image
        src="/hero-pg.png"
        alt=""
        fill
        className="object-cover object-center"
        priority
        aria-hidden="true"
      />

      {/* Dark overlay — keeps text legible */}
      <div className="absolute inset-0 z-[1] bg-[#060807]/78" />

      {/* Dot grid texture — on top of overlay */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none select-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(30,45,14,0.45) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Radial glow — top-left */}
      <div
        className="absolute top-0 left-0 w-[700px] h-[500px] pointer-events-none z-[2]"
        style={{
          background: 'radial-gradient(ellipse at top left, rgba(159,232,112,0.07) 0%, transparent 65%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-10 lg:gap-16 items-center">

          {/* LEFT: Copy */}
          <div>
            <div className="ha1 mb-7">
              <span
                className="inline-flex items-center gap-2 border text-xs font-semibold px-4 py-1.5 rounded-full"
                style={{
                  background: 'rgba(159,232,112,0.08)',
                  borderColor: 'rgba(159,232,112,0.22)',
                  color: '#9fe870',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
                AI 기반 임상의사결정지원 시스템
              </span>
            </div>

            <div className="ha2">
              <h1
                className="font-display font-black leading-[0.93] tracking-tight"
                style={{ fontSize: 'clamp(52px, 7.5vw, 90px)' }}
              >
                <span className="block text-[#e8ebe6]">난소암,</span>
                <span className="block text-primary">조기에</span>
                <span className="block text-[#e8ebe6]">발견합니다</span>
              </h1>
            </div>

            <div className="ha3">
              <p className="text-[#5a5c5a] text-lg mt-6 leading-relaxed max-w-md" style={{ wordBreak: 'keep-all' }}>
                초음파 AI, RMI 스코어, 혈액대사 AI를 통합 분석해<br />
                난소암 위험도를{' '}
                <span className="text-[#868685] font-semibold">2분 이내</span>에 평가하는 멀티모달 CDSS입니다.
              </p>
            </div>

            {/* Trust stats */}
            <div className="ha3 flex flex-wrap items-center gap-x-6 gap-y-3 mt-7">
              {[
                { value: '94.7%', label: '민감도' },
                { value: '91.2%', label: '특이도' },
                { value: '< 2분', label: '분석 시간' },
              ].map(({ value, label }, i) => (
                <div key={label} className="flex items-center gap-4">
                  {i > 0 && <div className="w-px h-6 bg-white/[0.08]" />}
                  <div>
                    <p className="text-primary font-black text-2xl leading-none">{value}</p>
                    <p className="text-[#3a3c3a] text-xs mt-0.5 font-semibold">{label}</p>
                  </div>
                </div>
              ))}
              <div className="w-px h-6 bg-white/[0.08]" />
              <p className="text-[#3a3c3a] text-xs leading-snug font-mono">
                ResNet-50 · XGBoost<br />LightGBM · CatBoost
              </p>
            </div>

            {/* CTA */}
            <div className="ha4 mt-9 flex items-center gap-5">
              <Link
                href="/login"
                className="spring-btn inline-flex items-center gap-2.5 bg-primary text-on-primary font-semibold text-base px-7 py-4 rounded-[24px] hover:bg-primary-active"
              >
                CDSS 분석 시작하기
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="2" y1="7.5" x2="13" y2="7.5" />
                  <polyline points="9,3 13,7.5 9,12" />
                </svg>
              </Link>
              <Link href="/#features" className="text-[#454745] text-sm font-semibold hover:text-[#868685] transition-colors">
                기능 살펴보기 ↓
              </Link>
            </div>

            <p className="ha4 text-[#1e2d0e] text-xs mt-6">모든 데이터는 가상의 mock 데이터입니다.</p>
          </div>

          {/* RIGHT: Dashboard bento */}
          <div className="hidden lg:flex justify-end">
            <HeroDashboard />
          </div>
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(14,15,12,0.7))' }}
      />
    </section>
  );
}

/* ─── Features Section ─── */

function FeaturesSection() {
  return (
    <section id="features" className="bg-canvas py-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="mb-12" data-reveal>
          <p className="text-mute text-sm font-semibold uppercase tracking-widest mb-3">분석 모듈</p>
          <h2 className="font-display font-black text-ink text-[40px] leading-tight">
            세 가지 AI 모듈로<br />통합 분석
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="bg-canvas-soft rounded-[24px] p-6" data-reveal data-delay="80">
            <div className="w-10 h-10 rounded-[12px] bg-primary-pale flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="2" width="16" height="16" rx="3" fill="#054d28" />
                <ellipse cx="10" cy="10" rx="5" ry="4" fill="none" stroke="#9fe870" strokeWidth="1.5" />
                <ellipse cx="9.5" cy="9.5" rx="3" ry="2.5" fill="#ff4400" opacity="0.6" />
              </svg>
            </div>
            <h3 className="text-ink font-bold text-lg mb-2">초음파 AI 분석</h3>
            <p className="text-body text-sm leading-relaxed">
              ResNet-50 기반 딥러닝 모델로 종양 탐지, 양성/악성 분류, FIGO 병기 예측,
              Grad-CAM 시각화를 자동 수행합니다.
            </p>
            <ul className="mt-4 space-y-1.5">
              {['종양 탐지 및 Bounding Box', '악성 확률 (%) 출력', 'Grad-CAM 히트맵', 'FIGO 병기 분류'].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-body">
                  <span className="text-positive text-xs">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-primary-pale rounded-[24px] p-6" data-reveal data-delay="180">
            <div className="w-10 h-10 rounded-[12px] bg-positive-deep bg-opacity-20 flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="3" y="5" width="14" height="11" rx="2" fill="#054d28" />
                <path d="M6 10h2l1.5-3 2 6 1.5-3H16" stroke="#9fe870" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="text-ink font-bold text-lg mb-2">RMI 위험도 평가</h3>
            <p className="text-body text-sm leading-relaxed">
              EMR 연동으로 CA-125, 폐경 여부를 자동 수신하고 초음파 결과와 결합해
              RMI 스코어를 즉시 산출합니다.
            </p>
            <ul className="mt-4 space-y-1.5">
              {['U-스코어 자동 도출', 'M-스코어 (폐경 여부)', 'CA-125 자동 연동', 'RMI = U × M × CA-125'].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-body">
                  <span className="text-positive text-xs">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-ink rounded-[24px] p-6" data-reveal data-delay="280">
            <div className="w-10 h-10 rounded-[12px] bg-[#1a2a0e] flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="7" fill="#9fe870" opacity="0.15" />
                <circle cx="10" cy="10" r="4" fill="#9fe870" opacity="0.4" />
                <circle cx="10" cy="10" r="2" fill="#9fe870" />
              </svg>
            </div>
            <h3 className="text-primary font-bold text-lg mb-2">혈액·대사 AI 예측</h3>
            <p className="text-[#c5edab] text-sm leading-relaxed">
              XGBoost, LightGBM, CatBoost 앙상블 모델로 TyG 인덱스,
              혈액 마커 기반 난소암 위험도를 예측합니다.
            </p>
            <ul className="mt-4 space-y-1.5">
              {['TyG 인덱스 자동 계산', '핵심 혈액 마커 분석', 'AI 앙상블 예측 확률', '초음파-혈액 Cross-Check'].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-[#c5edab]">
                  <span className="text-primary text-xs">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Stats Section ─── */

function StatsSection() {
  const stats = [
    { value: '94.7%', label: '민감도 (Sensitivity)', sub: '악성 종양 탐지율' },
    { value: '91.2%', label: '특이도 (Specificity)', sub: '양성 종양 분류율' },
    { value: '< 2분', label: '분석 소요 시간', sub: '버튼 클릭 후 즉시' },
    { value: '3개', label: 'AI 모델 앙상블', sub: 'XGB + LGBM + CatBoost' },
  ];

  return (
    <section className="bg-canvas-soft py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-mute text-sm font-semibold uppercase tracking-widest mb-10 text-center" data-reveal>
          성능 지표
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map(({ value, label, sub }, i) => (
            <div key={label} className="bg-canvas rounded-[24px] p-6" data-reveal data-delay={i * 80}>
              <p
                className="font-display font-black text-ink leading-none"
                style={{ fontSize: 'clamp(32px, 4vw, 44px)' }}
              >
                {value}
              </p>
              <p className="text-ink font-semibold text-sm mt-2">{label}</p>
              <p className="text-mute text-xs mt-1">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works Section ─── */

function HowItWorksSection() {
  const steps = [
    { num: '01', title: 'EMR 자동 수신', desc: '환자의 혈액 검사, CA-125, 폐경 여부, BMI 등 임상 정보가 EMR에서 자동으로 수신됩니다.' },
    { num: '02', title: '초음파 AI 분석', desc: '업로드된 초음파 이미지를 딥러닝 모델이 실시간으로 분석해 종양 특성과 병기를 예측합니다.' },
    { num: '03', title: 'CDSS 종합 판정', desc: '세 가지 AI 모듈의 결과를 통합해 위험도 등급과 임상 권고 사항을 즉시 생성합니다.' },
  ];

  return (
    <section className="bg-canvas py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12" data-reveal>
          <p className="text-mute text-sm font-semibold uppercase tracking-widest mb-3">사용 방법</p>
          <h2 className="font-display font-black text-ink text-[40px] leading-tight">
            3단계로 완성되는<br />CDSS 분석
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map(({ num, title, desc }, i) => (
            <div key={num} className="flex flex-col gap-4" data-reveal data-delay={i * 120}>
              <span className="font-display font-black text-[56px] text-primary leading-none">{num}</span>
              <h3 className="font-bold text-ink text-lg">{title}</h3>
              <p className="text-body text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Section ─── */

function CTASection() {
  return (
    <section className="bg-ink py-20 px-6">
      <div className="max-w-3xl mx-auto text-center" data-reveal>
        <h2
          className="font-display font-black text-primary leading-tight mb-4"
          style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}
        >
          지금 바로<br />시작하세요
        </h2>
        <p className="text-canvas-soft text-lg mb-10">
          mock 데이터로 CDSS 분석 도구를 직접 체험해보세요.
        </p>
        <Link
          href="/login"
          className="inline-block bg-primary text-on-primary font-semibold text-base px-8 py-4 rounded-[24px] hover:bg-primary-active transition-colors"
        >
          CDSS 분석 시작하기 →
        </Link>
      </div>
    </section>
  );
}

/* ─── Footer ─── */

function Footer() {
  return (
    <footer className="bg-ink px-6 py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
              <span className="text-on-primary text-[10px] font-black">OG</span>
            </div>
            <span className="text-canvas-soft font-semibold text-sm">OvaGuard CDSS</span>
          </div>
          <p className="text-mute text-xs leading-relaxed max-w-xs">
            AI 기반 난소암 조기진단 임상의사결정지원 시스템.<br />
            본 시스템은 연구 목적의 프로토타입입니다.
          </p>
        </div>
        <div className="flex gap-12 text-sm">
          <div>
            <p className="text-canvas-soft font-semibold mb-3">분석 모듈</p>
            <ul className="space-y-2 text-mute">
              <li>초음파 AI</li>
              <li>RMI 스코어</li>
              <li>혈액·대사 AI</li>
            </ul>
          </div>
          <div>
            <p className="text-canvas-soft font-semibold mb-3">정보</p>
            <ul className="space-y-2 text-mute">
              <li>시스템 소개</li>
              <li>사용 방법</li>
              <li>면책 조항</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto border-t border-[#1e2d0e] mt-10 pt-6">
        <p className="text-mute text-xs">
          © 2024 OvaGuard CDSS. 본 시스템의 출력은 임상 참고용이며 최종 진단은 반드시 의사가 판단해야 합니다.
        </p>
      </div>
    </footer>
  );
}

/* ─── Page ─── */

export default function HomePage() {
  return (
    <>
      <HeroStyles />
      <ScrollObserver />
      <NavBar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
