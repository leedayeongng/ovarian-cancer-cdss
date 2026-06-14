'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  type PatientRecord,
  type UltrasoundData,
  type RMIData,
  type BloodData,
  getOverallRisk,
} from '@/lib/mockData';

/* ─── Shared UI primitives ─── */

function RiskBadge({ level }: { level: 'low' | 'medium' | 'high' }) {
  const cfg = {
    low:    { bg: 'bg-primary-pale', text: 'text-positive-deep', label: '저위험' },
    medium: { bg: 'bg-warning-bg',   text: 'text-warning-content', label: '주의' },
    high:   { bg: 'bg-negative-bg',  text: 'text-white', label: '고위험' },
  } as const;
  const { bg, text, label } = cfg[level];
  return (
    <span className={`${bg} ${text} text-sm font-bold px-4 py-1.5 rounded-full`}>{label}</span>
  );
}

function SectionHeader({ num, title, badge }: { num: string; title: string; badge?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="bg-ink text-primary text-xs font-bold px-3 py-1 rounded-full shrink-0">
        {num}
      </span>
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      {badge && (
        <span className="ml-auto text-xs text-mute bg-canvas-soft px-3 py-1 rounded-full font-medium">
          {badge}
        </span>
      )}
    </div>
  );
}

function ProbBar({ prob, color = 'bg-primary' }: { prob: number; color?: string }) {
  return (
    <div className="bg-canvas-soft rounded-full h-2.5 w-full overflow-hidden">
      <div className={`${color} rounded-full h-2.5`} style={{ width: `${prob}%` }} />
    </div>
  );
}

/* ─── Grad-CAM SVG ─── */

function GradCAMImage({ prob }: { prob: number }) {
  return (
    <svg viewBox="0 0 380 280" className="w-full rounded-[16px]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="hm" cx="52%" cy="50%" r="42%">
          <stop offset="0%"   stopColor="#ff2222" stopOpacity="0.92" />
          <stop offset="28%"  stopColor="#ff7700" stopOpacity="0.78" />
          <stop offset="58%"  stopColor="#ffee00" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#0055ff" stopOpacity="0.08" />
        </radialGradient>
        <radialGradient id="tumorFill" cx="50%" cy="45%" r="50%">
          <stop offset="0%"   stopColor="#1e2f3a" />
          <stop offset="100%" stopColor="#0a0f18" />
        </radialGradient>
        <filter id="heatBlur">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <linearGradient id="legend" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#0055ff" />
          <stop offset="50%"  stopColor="#ffee00" />
          <stop offset="100%" stopColor="#ff2222" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="380" height="280" rx="16" fill="#0a0f18" />
      <ellipse cx="190" cy="140" rx="168" ry="122" fill="#111827" opacity="0.7" />
      <ellipse cx="190" cy="140" rx="138" ry="98" fill="#0f1d2a" opacity="0.5" />

      {/* Speckle texture */}
      <g fill="#64748b" opacity="0.18">
        <circle cx="48" cy="38" r="1.5" /><circle cx="92" cy="28" r="1" /><circle cx="138" cy="52" r="1.5" />
        <circle cx="180" cy="22" r="1" /><circle cx="228" cy="44" r="1.5" /><circle cx="268" cy="32" r="1" />
        <circle cx="314" cy="56" r="1.5" /><circle cx="348" cy="28" r="1" />
        <circle cx="35" cy="78" r="1" /><circle cx="76" cy="92" r="1.5" /><circle cx="118" cy="72" r="1" />
        <circle cx="162" cy="96" r="1.5" /><circle cx="224" cy="78" r="1" /><circle cx="272" cy="92" r="1.5" />
        <circle cx="318" cy="72" r="1" /><circle cx="355" cy="86" r="1.5" />
        <circle cx="28" cy="204" r="1" /><circle cx="72" cy="222" r="1.5" /><circle cx="112" cy="212" r="1" />
        <circle cx="302" cy="198" r="1.5" /><circle cx="342" cy="218" r="1" /><circle cx="368" cy="204" r="1.5" />
      </g>

      {/* Tumor mass */}
      <ellipse cx="198" cy="142" rx="72" ry="62" fill="url(#tumorFill)" />

      {/* Heat map overlay */}
      <ellipse cx="198" cy="142" rx="94" ry="80" fill="url(#hm)" filter="url(#heatBlur)" />

      {/* Bounding box */}
      <rect x="126" y="80" width="144" height="124" rx="4" fill="none" stroke="#9fe870" strokeWidth="2.5" strokeDasharray="8,4" />

      {/* Corner accents */}
      <path d="M126,80 L126,98 M126,80 L144,80"   stroke="#9fe870" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M270,80 L270,98 M270,80 L252,80"   stroke="#9fe870" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M126,204 L126,186 M126,204 L144,204" stroke="#9fe870" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M270,204 L270,186 M270,204 L252,204" stroke="#9fe870" strokeWidth="3.5" fill="none" strokeLinecap="round" />

      {/* Label tag */}
      <rect x="126" y="53" width="136" height="22" rx="5" fill="#9fe870" />
      <text x="135" y="69" fill="#0e0f0c" fontSize="11" fontFamily="monospace" fontWeight="700">
        Malignant · {prob.toFixed(1)} %
      </text>

      {/* Grad-CAM label */}
      <text x="16" y="268" fill="#4b5563" fontSize="10" fontFamily="monospace">Grad-CAM · ResNet-50</text>

      {/* Scale bar */}
      <line x1="300" y1="262" x2="344" y2="262" stroke="#4b5563" strokeWidth="1.5" />
      <line x1="300" y1="258" x2="300" y2="266" stroke="#4b5563" strokeWidth="1.5" />
      <line x1="344" y1="258" x2="344" y2="266" stroke="#4b5563" strokeWidth="1.5" />
      <text x="315" y="256" fill="#4b5563" fontSize="9" fontFamily="monospace">2 cm</text>

      {/* Heat legend */}
      <rect x="16" y="22" width="72" height="7" fill="url(#legend)" rx="2.5" />
      <text x="16" y="18" fill="#4b5563" fontSize="8" fontFamily="monospace">Low</text>
      <text x="70" y="18" fill="#4b5563" fontSize="8" fontFamily="monospace">High</text>
    </svg>
  );
}

/* ─── Section 1: Ultrasound AI ─── */

function UltrasoundSection({ data }: { data: UltrasoundData }) {
  const us = data;

  return (
    <div className="bg-canvas rounded-[24px] p-6 md:p-8 border border-canvas-soft">
      <SectionHeader num="Section 01" title="초음파 AI 모델 출력" badge="ResNet-50 · Grad-CAM" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Grad-CAM */}
        <div>
          <p className="text-mute text-xs font-semibold uppercase tracking-widest mb-3">Grad-CAM 시각화</p>
          <GradCAMImage prob={us.malignancyProbability} />
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="bg-canvas-soft rounded-[16px] p-4 flex items-center justify-between">
            <div>
              <p className="text-mute text-xs font-semibold uppercase tracking-wide">종양 탐지</p>
              <p className="text-ink font-bold text-lg mt-0.5">{us.tumorDetected ? '있음' : '없음'}</p>
            </div>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${us.tumorDetected ? 'bg-negative-bg text-white' : 'bg-primary-pale text-positive-deep'}`}>
              {us.tumorDetected ? 'DETECTED' : 'CLEAR'}
            </span>
          </div>

          <div className="bg-canvas-soft rounded-[16px] p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-mute text-xs font-semibold uppercase tracking-wide">악성 확률</p>
              <span className="font-black text-negative text-2xl">{us.malignancyProbability}%</span>
            </div>
            <ProbBar prob={us.malignancyProbability} color="bg-negative" />
            <p className="text-mute text-xs mt-1.5">양성 {us.benignProbability}% / 악성 {us.malignancyProbability}%</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-canvas-soft rounded-[16px] p-4">
              <p className="text-mute text-xs font-semibold">종양 크기</p>
              <p className="text-ink font-bold text-xl mt-1">{us.tumorArea} cm²</p>
            </div>
            <div className="bg-canvas-soft rounded-[16px] p-4">
              <p className="text-mute text-xs font-semibold">경계 불규칙도</p>
              <p className={`font-bold text-xl mt-1 ${us.borderIrregularity >= 0.6 ? 'text-negative' : 'text-ink'}`}>
                {us.borderIrregularity}
              </p>
              <p className="text-mute text-xs">/ 1.00</p>
            </div>
          </div>

          <div className="bg-canvas-soft rounded-[16px] p-4">
            <p className="text-mute text-xs font-semibold uppercase tracking-wide mb-1.5">종양 유형</p>
            <p className="text-ink font-bold">{us.tumorType}</p>
            <p className="text-mute text-xs mt-0.5">{us.tumorTypeEn}</p>
          </div>

          <div className="bg-canvas-soft rounded-[16px] p-4 flex items-center justify-between">
            <div>
              <p className="text-mute text-xs font-semibold uppercase tracking-wide">FIGO 병기</p>
              <p className="text-ink font-bold text-lg mt-0.5">{us.figoLabel || '해당 없음'}</p>
            </div>
            <RiskBadge level={us.figoHighStage ? 'high' : us.malignancyProbability >= 40 ? 'medium' : 'low'} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Section 2: RMI Score ─── */

function RMISection({ data }: { data: RMIData }) {
  const r = data;
  const isHighRisk = r.rmi > 200;
  const featureCount = [r.multilocular, r.solidComponent, r.bilateral, r.ascites, r.peritonealMetastasis].filter(v => v === 1).length;

  const uFeatures = [
    { label: '다방성 낭종', value: r.multilocular },
    { label: '고형 성분',   value: r.solidComponent },
    { label: '양측성',      value: r.bilateral },
    { label: '복수',        value: r.ascites },
    { label: '복막전이',    value: r.peritonealMetastasis },
  ];

  return (
    <div className="bg-canvas rounded-[24px] p-6 md:p-8 border border-canvas-soft">
      <SectionHeader num="Section 02" title="RMI 스코어 (Risk of Malignancy Index)" badge="EMR 자동 연동" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* U-score table */}
        <div>
          <p className="text-mute text-xs font-semibold uppercase tracking-widest mb-3">U 스코어 초음파 항목</p>
          <div className="rounded-[16px] overflow-hidden border border-canvas-soft">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-canvas-soft">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-mute uppercase tracking-wide">항목</th>
                  <th className="text-center px-4 py-2.5 text-xs font-semibold text-mute uppercase tracking-wide">결과</th>
                  <th className="text-center px-4 py-2.5 text-xs font-semibold text-mute uppercase tracking-wide">점수</th>
                </tr>
              </thead>
              <tbody>
                {uFeatures.map(({ label, value }) => (
                  <tr key={label} className="border-t border-canvas-soft">
                    <td className="px-4 py-3 text-body">{label}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${value ? 'bg-negative-bg text-white' : 'bg-canvas-soft text-mute'}`}>
                        {value ? '있음' : '없음'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-ink">{value}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-ink bg-canvas-soft">
                  <td className="px-4 py-3 font-bold text-ink" colSpan={2}>
                    U 스코어 최종 (특이사항 {featureCount}개 → U={r.uScore})
                  </td>
                  <td className="px-4 py-3 text-center font-black text-2xl text-ink">{r.uScore}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* RMI Calculation */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-canvas-soft rounded-[16px] p-4">
              <p className="text-mute text-xs font-semibold flex items-center gap-1.5">
                M 스코어
                <span className="bg-primary-pale text-positive-deep px-2 py-0.5 rounded-full text-[10px]">EMR</span>
              </p>
              <p className="text-ink font-black text-3xl mt-1">{r.mScore}</p>
              <p className="text-mute text-xs mt-0.5">{r.mScore === 3 ? '폐경 후 (×3)' : '폐경 전 (×1)'}</p>
            </div>
            <div className="bg-canvas-soft rounded-[16px] p-4">
              <p className="text-mute text-xs font-semibold flex items-center gap-1.5">
                CA-125
                <span className="bg-primary-pale text-positive-deep px-2 py-0.5 rounded-full text-[10px]">EMR</span>
              </p>
              <p className="text-ink font-black text-3xl mt-1">{r.ca125}</p>
              <p className="text-mute text-xs mt-0.5">IU/mL (정상 &lt;35)</p>
            </div>
          </div>

          <div className="bg-canvas-soft rounded-[16px] p-5">
            <p className="text-mute text-xs font-semibold uppercase tracking-wide mb-3">RMI 계산식</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-canvas rounded-[10px] px-3 py-2 font-bold text-ink text-sm border border-canvas-soft">U = {r.uScore}</span>
              <span className="text-mute font-bold">×</span>
              <span className="bg-canvas rounded-[10px] px-3 py-2 font-bold text-ink text-sm border border-canvas-soft">M = {r.mScore}</span>
              <span className="text-mute font-bold">×</span>
              <span className="bg-canvas rounded-[10px] px-3 py-2 font-bold text-ink text-sm border border-canvas-soft">CA-125 = {r.ca125}</span>
              <span className="text-mute font-bold">=</span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-mute text-xs font-semibold">RMI 최종 값</p>
                <p className="font-black text-ink leading-none mt-1" style={{ fontSize: 52 }}>
                  {r.rmi.toLocaleString()}
                </p>
              </div>
              <RiskBadge level={isHighRisk ? 'high' : r.rmi > 50 ? 'medium' : 'low'} />
            </div>
            <p className="text-mute text-xs mt-2">위험 기준: &gt;200 = 고위험 / &lt;200 = 저위험</p>
          </div>
        </div>
      </div>

      {isHighRisk && (
        <div className="mt-6 bg-ink rounded-[20px] p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <p className="text-primary font-bold text-base mb-1">⚠ 고위험군으로 판정되었습니다</p>
            <p className="text-[#c5edab] text-sm">
              RMI {r.rmi.toLocaleString()} — 3차 의료기관 전문의 의뢰를 즉시 권고합니다.
            </p>
          </div>
          <button className="shrink-0 bg-primary text-on-primary font-semibold text-sm px-6 py-3 rounded-[16px] hover:bg-primary-active transition-colors">
            의뢰서 작성하기 →
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Section 3: Blood / Metabolic AI ─── */

function BloodSection({
  data,
  ultrasound,
  rmi,
}: {
  data: BloodData;
  ultrasound: UltrasoundData;
  rmi: RMIData;
}) {
  const b = data;

  const tygRisk = b.tygIndex >= 8.82 ? 'high' : b.tygIndex >= 8.0 ? 'medium' : 'low';
  const ensembleRisk = b.ensembleProb >= 70 ? 'high' : b.ensembleProb >= 40 ? 'medium' : 'low';

  const models = [
    { name: 'XGBoost',    prob: b.xgbProb },
    { name: 'LightGBM',  prob: b.lgbmProb },
    { name: 'CatBoost',  prob: b.catboostProb },
    { name: '앙상블 평균', prob: b.ensembleProb },
  ];

  const markers = [
    { label: 'Glucose',       value: b.glucose,       unit: 'mg/dL', ref: '정상 <100', risk: b.glucose >= 126 ? 'high' : b.glucose >= 100 ? 'medium' : 'low' },
    { label: 'Triglycerides', value: b.triglycerides,  unit: 'mg/dL', ref: '정상 <150', risk: b.triglycerides >= 200 ? 'high' : b.triglycerides >= 150 ? 'medium' : 'low' },
    { label: 'HDL',           value: b.hdl,            unit: 'mg/dL', ref: '정상 ≥50',  risk: b.hdl < 40 ? 'high' : b.hdl < 50 ? 'medium' : 'low' },
  ] as const;

  const bmiLabel = b.bmi >= 30 ? '비만' : b.bmi >= 25 ? '과체중' : b.bmi >= 18.5 ? '정상' : '저체중';
  const bmiRisk = (b.bmi >= 25 ? 'medium' : 'low') as 'low' | 'medium' | 'high';

  const usRiskLabel = ultrasound.malignancyProbability >= 70 ? '고위험' : ultrasound.malignancyProbability >= 40 ? '중위험' : '저위험';
  const rmiRiskLabel = rmi.rmi > 200 ? '고위험' : rmi.rmi > 50 ? '중위험' : '저위험';
  const bloodRiskLabel = b.ensembleProb >= 70 ? '고위험' : b.ensembleProb >= 40 ? '중위험' : '저위험';

  return (
    <div className="bg-canvas rounded-[24px] p-6 md:p-8 border border-canvas-soft">
      <SectionHeader num="Section 03" title="혈액·대사 AI 예측" badge="XGB + LGBM + CatBoost" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: markers + TyG */}
        <div className="space-y-4">
          <div className="bg-canvas-soft rounded-[16px] p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-mute text-xs font-semibold uppercase tracking-wide">TyG 인덱스</p>
                <p className="font-black text-ink text-3xl leading-none mt-1">{b.tygIndex.toFixed(2)}</p>
              </div>
              <RiskBadge level={tygRisk} />
            </div>
            <div className="relative h-3 rounded-full overflow-hidden flex mt-4">
              <div className="bg-primary-pale flex-[4]" />
              <div className="bg-warning flex-[1]" />
              <div className="bg-negative flex-[3]" />
            </div>
            <div className="flex justify-between text-[10px] text-mute mt-1 font-mono">
              <span>0</span><span>정상</span><span>8.0 8.82</span><span>고위험 12+</span>
            </div>
            <div className="relative mt-1" style={{ marginLeft: `${Math.min((b.tygIndex / 12) * 100, 100)}%` }}>
              <div className="absolute -translate-x-1/2 -top-6">
                <div className="w-3 h-3 rounded-full bg-ink border-2 border-primary shadow" />
              </div>
            </div>
          </div>

          <div className="bg-canvas-soft rounded-[16px] overflow-hidden">
            <p className="px-4 pt-4 text-mute text-xs font-semibold uppercase tracking-widest">핵심 혈액 마커</p>
            <div className="divide-y divide-canvas">
              {markers.map(({ label, value, unit, ref, risk }) => (
                <div key={label} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-ink font-semibold text-sm">{label}</p>
                    <p className="text-mute text-xs">{ref}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-ink">{value} <span className="text-mute font-normal text-xs">{unit}</span></span>
                    <RiskBadge level={risk} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-canvas-soft rounded-[16px] p-4 flex items-center justify-between">
            <div>
              <p className="text-mute text-xs font-semibold uppercase tracking-wide">BMI / 비만도</p>
              <p className="text-ink font-black text-2xl mt-1">{b.bmi} <span className="text-mute text-sm font-normal">kg/m²</span></p>
              <p className="text-mute text-xs">{bmiLabel}</p>
            </div>
            <RiskBadge level={bmiRisk} />
          </div>
        </div>

        {/* Right: AI models */}
        <div className="space-y-4">
          <div className="bg-canvas-soft rounded-[16px] p-5">
            <p className="text-mute text-xs font-semibold uppercase tracking-widest mb-4">AI 앙상블 예측 확률</p>
            <div className="space-y-4">
              {models.map(({ name, prob }, i) => (
                <div key={name} className={i === 3 ? 'pt-4 border-t border-canvas' : ''}>
                  {i === 3 && <p className="text-xs text-mute mb-3 font-semibold">최종 앙상블 평균</p>}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-sm ${i === 3 ? 'font-bold text-ink' : 'font-medium text-body'}`}>{name}</span>
                    <span className={`font-bold ${i === 3 ? 'text-negative text-xl' : 'text-ink'}`}>{prob}%</span>
                  </div>
                  <ProbBar prob={prob} color={i === 3 ? 'bg-negative' : 'bg-primary'} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-canvas-soft rounded-[16px] p-5">
            <p className="text-mute text-xs font-semibold uppercase tracking-wide mb-3">AI 위험도 등급</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-black text-ink text-2xl">
                  {ensembleRisk === 'high' ? 'High' : ensembleRisk === 'medium' ? 'Medium' : 'Low'}
                </p>
                <p className="text-mute text-xs mt-0.5">앙상블 확률 {b.ensembleProb}% 기준</p>
              </div>
              <RiskBadge level={ensembleRisk} />
            </div>
          </div>
        </div>
      </div>

      {/* Cross-check alert */}
      <div className="mt-6 bg-[#fffbeb] border border-warning rounded-[20px] p-5">
        <div className="flex items-start gap-3">
          <span className="text-warning-content text-xl mt-0.5">⚡</span>
          <div>
            <p className="text-warning-content font-bold text-sm mb-1">Cross-Check 알림</p>
            <p className="text-warning-content text-sm leading-relaxed">
              초음파 AI {usRiskLabel}({ultrasound.malignancyProbability}%) + RMI {rmiRiskLabel}({rmi.rmi.toLocaleString()}) + 혈액·대사 AI {bloodRiskLabel}({b.ensembleProb}%) —{' '}
              {usRiskLabel === '고위험' && rmiRiskLabel === '고위험' && bloodRiskLabel === '고위험'
                ? <strong className="font-bold">세 모듈 모두 고위험 신호 확인. 정밀 조직검사 및 3차 병원 즉시 의뢰를 강력 권고합니다.</strong>
                : '복합 위험도 평가 결과입니다. 담당 의사의 종합 판단이 필요합니다.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── NavBar ─── */

function NavBar({ patientId }: { patientId?: string }) {
  return (
    <nav className="sticky top-0 z-50 bg-canvas border-b border-canvas-soft">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-on-primary text-[11px] font-black">OG</span>
            </div>
            <span className="font-semibold text-ink text-sm tracking-tight">OvaGuard CDSS</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/patients" className="text-sm font-semibold text-mute hover:text-ink transition-colors">
            ← 환자 목록
          </Link>
          {patientId && (
            <Link href={`/patients/${patientId}`} className="text-sm font-semibold text-mute hover:text-ink transition-colors">
              환자 상세
            </Link>
          )}
          <span className="bg-primary-pale text-positive-deep text-xs font-semibold px-3 py-1.5 rounded-full">
            CDSS 분석 도구
          </span>
        </div>
      </div>
    </nav>
  );
}

/* ─── Main Client Component ─── */

export default function CDSSClient({ record }: { record: PatientRecord }) {
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const { patient, ultrasound, rmi, blood } = record;
  const overallRisk = getOverallRisk(record);
  const overallLabel = { high: '고위험', medium: '중위험', low: '저위험' }[overallRisk];

  const summaryMessage = {
    high: '세 가지 모듈 모두 고위험 신호. 즉각적인 3차 병원 의뢰를 권고합니다.',
    medium: '일부 모듈에서 위험 신호 감지. 정밀 추적 관찰을 권고합니다.',
    low: '현재 위험도는 낮습니다. 정기 검진을 유지하시기 바랍니다.',
  }[overallRisk];

  const handleAnalyze = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2200));
    setLoading(false);
    setAnalyzed(true);
  };

  return (
    <>
      <NavBar patientId={patient.id} />
      <main className="min-h-screen bg-canvas-soft">
        <div className="bg-canvas border-b border-canvas-soft px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <p className="text-mute text-xs font-semibold uppercase tracking-widest mb-2">임상의사결정지원 시스템</p>
            <h1 className="font-display font-black text-ink text-[40px] leading-tight">CDSS 분석 도구</h1>
            <p className="text-body mt-2">멀티모달 AI로 난소암 위험도를 종합 평가합니다.</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
          {/* Patient info card */}
          <div className="bg-canvas rounded-[24px] p-6 border border-canvas-soft">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-bold text-ink">환자 정보</h2>
              <span className="bg-primary-pale text-positive-deep text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse inline-block" />
                EMR 자동 수신
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: '환자 ID',    value: patient.id },
                { label: '성명',       value: patient.name },
                { label: '나이 / 성별', value: `${patient.age}세 / ${patient.sex}` },
                { label: '검사일',     value: patient.studyDate },
                { label: '폐경 여부',  value: patient.menopausal ? '폐경 후' : '폐경 전' },
                { label: 'BMI',        value: `${patient.bmi} kg/m²` },
                { label: '담당 의사',  value: patient.physician },
                { label: '진료과',     value: patient.ward },
              ].map(({ label, value }) => (
                <div key={label} className="bg-canvas-soft rounded-[12px] px-4 py-3">
                  <p className="text-mute text-xs font-semibold">{label}</p>
                  <p className="text-ink font-semibold text-sm mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis trigger */}
          {!analyzed && (
            <div className="bg-canvas rounded-[24px] p-10 border border-canvas-soft flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary-pale flex items-center justify-center mb-5">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="11" fill="#054d28" opacity="0.15" />
                  <circle cx="14" cy="14" r="7"  fill="#054d28" opacity="0.3" />
                  <circle cx="14" cy="14" r="4"  fill="#9fe870" />
                </svg>
              </div>
              <h2 className="font-display font-black text-ink text-[28px] leading-tight mb-3">
                CDSS 분석을 시작합니다
              </h2>
              <p className="text-body text-sm max-w-md mb-8 leading-relaxed">
                초음파 AI, RMI 스코어, 혈액·대사 AI 세 가지 모듈을 동시에 실행합니다.
                EMR 데이터는 이미 자동 수신되었습니다.
              </p>
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="bg-primary text-on-primary font-semibold text-base px-10 py-4 rounded-[24px] hover:bg-primary-active transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                      <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    AI 분석 중…
                  </>
                ) : (
                  'CDSS 분석 실행 →'
                )}
              </button>
              {loading && (
                <p className="text-mute text-xs mt-4">초음파 AI · RMI · 혈액 AI 병렬 분석 중</p>
              )}
            </div>
          )}

          {/* Results */}
          {analyzed && (
            <div className="space-y-6">
              <div className="bg-ink rounded-[24px] p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <p className="text-primary font-bold mb-1">분석 완료 — 종합 판정: {overallLabel}</p>
                  <p className="text-[#c5edab] text-sm">{summaryMessage}</p>
                </div>
                <span className={`text-sm font-bold px-5 py-2.5 rounded-full shrink-0 ${
                  overallRisk === 'high' ? 'bg-negative-bg text-white' :
                  overallRisk === 'medium' ? 'bg-warning text-on-primary' :
                  'bg-primary text-on-primary'
                }`}>
                  {overallLabel}군
                </span>
              </div>

              <UltrasoundSection data={ultrasound} />
              <RMISection data={rmi} />
              <BloodSection data={blood} ultrasound={ultrasound} rmi={rmi} />
            </div>
          )}
        </div>
      </main>

      <footer className="bg-ink px-6 py-8 border-t border-[#1e2d0e]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-mute text-xs">
            © 2024 OvaGuard CDSS — 본 결과는 임상 참고용이며 최종 진단은 의사가 판단해야 합니다.
          </p>
          <Link href="/patients" className="text-mute text-xs hover:text-canvas-soft transition-colors">
            환자 목록으로 돌아가기
          </Link>
        </div>
      </footer>
    </>
  );
}
