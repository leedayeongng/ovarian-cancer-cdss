'use client';

import { useState, useMemo } from 'react';
import { patients, getOverallRisk } from '@/lib/mockData';
import { useAuth } from '@/lib/authContext';
import { setPatientStatus } from '@/lib/patientStore';

const HIGH_RISK_PATIENTS = patients.filter(r => getOverallRisk(r) === 'high');

const HOSPITALS = [
  '서울대학교병원 산부인과',
  '삼성서울병원 산부인과',
  '서울아산병원 산부인과',
  '세브란스병원 산부인과',
  '국립암센터 부인암센터',
];

export default function ReferralPage() {
  const [selectedId, setSelectedId] = useState(HIGH_RISK_PATIENTS[0]?.patient.id ?? '');
  const [hospital, setHospital] = useState(HOSPITALS[0]);
  const [urgency, setUrgency] = useState<'urgent' | 'routine'>('urgent');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { role } = useAuth();
  const isNurse = role === 'nurse';

  const selected = useMemo(
    () => patients.find(r => r.patient.id === selectedId),
    [selectedId],
  );

  const autoFindings = useMemo(() => {
    if (!selected) return '';
    const { ultrasound, rmi, blood } = selected;
    return [
      `초음파 AI: 악성 확률 ${ultrasound.malignancyProbability}% (${ultrasound.tumorType})`,
      `RMI 스코어: ${rmi.rmi.toLocaleString()} (기준 >200 고위험, CA-125: ${rmi.ca125} IU/mL)`,
      `혈액·대사 AI 앙상블: ${blood.ensembleProb}% (TyG Index: ${blood.tygIndex.toFixed(2)})`,
      `FIGO 병기 추정: ${ultrasound.figoLabel || '미분류'}`,
    ].join('\n');
  }, [selected]);

  const handlePrint = () => {
    window.print();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedId) setPatientStatus(selectedId, '의뢰 완료');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 rounded-full bg-primary-pale flex items-center justify-center mb-6">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="12" fill="#9fe870" opacity="0.3" />
            <path d="M8 14l4 4 8-8" stroke="#054d28" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="font-display font-black text-ink text-2xl mb-2">의뢰서 전송 완료</h2>
        <p className="text-body text-sm text-center max-w-sm mb-6">
          {hospital}로 의뢰서가 전송되었습니다.<br />담당 교수님 확인 후 연락드릴 예정입니다.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-sm font-semibold text-mute hover:text-ink transition-colors"
        >
          새 의뢰서 작성
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <p className="text-mute text-xs font-semibold uppercase tracking-widest mb-1">문서</p>
        <h1 className="font-display font-black text-ink text-[32px] leading-tight">
          {isNurse ? '의뢰서 조회' : '의뢰서 작성'}
        </h1>
        <p className="text-body text-sm mt-1">
          {isNurse
            ? 'CDSS 고위험 판정 환자의 의뢰서를 조회합니다. (조회만 가능)'
            : 'CDSS 고위험 판정 환자를 3차 의료기관에 의뢰합니다.'}
        </p>
      </div>

      {/* Nurse permission notice */}
      {isNurse && (
        <div className="flex items-center gap-3 bg-canvas border border-canvas-soft rounded-[16px] px-5 py-3.5 mb-6">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-mute">
            <rect x="3" y="7" width="10" height="8" rx="1.5" />
            <path d="M5 7V5a3 3 0 016 0v2" />
          </svg>
          <p className="text-mute text-sm font-semibold">의뢰서 전송은 의사 권한이 필요합니다. 조회만 가능합니다.</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 print:block">
        {/* Left: high-risk patient list */}
        <div className="xl:col-span-1 print:hidden">
          <div className="bg-canvas rounded-[20px] border border-canvas-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-canvas-soft bg-canvas-soft">
              <p className="font-bold text-ink text-sm">고위험 환자 목록</p>
              <p className="text-mute text-xs mt-0.5">CDSS 분석 결과 고위험으로 판정된 환자</p>
            </div>
            {HIGH_RISK_PATIENTS.length === 0 ? (
              <p className="px-5 py-8 text-sm text-mute text-center">고위험 환자가 없습니다.</p>
            ) : (
              <div className="divide-y divide-canvas-soft">
                {HIGH_RISK_PATIENTS.map(record => {
                  const { patient, ultrasound, rmi } = record;
                  const isSelected = patient.id === selectedId;
                  return (
                    <button
                      key={patient.id}
                      onClick={() => setSelectedId(patient.id)}
                      className={`w-full text-left px-5 py-4 transition-colors ${
                        isSelected ? 'bg-primary-pale' : 'hover:bg-canvas-soft'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-negative-bg flex items-center justify-center shrink-0">
                          <span className="text-white text-xs font-black">{patient.name.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-sm ${isSelected ? 'text-positive-deep' : 'text-ink'}`}>
                            {patient.name}
                          </p>
                          <p className="text-mute text-xs truncate">{patient.id}</p>
                        </div>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-positive-deep bg-primary-pale px-2 py-0.5 rounded-full">선택</span>
                        )}
                      </div>
                      <div className="flex gap-4 text-xs text-mute ml-11">
                        <span>악성 {ultrasound.malignancyProbability}%</span>
                        <span>RMI {rmi.rmi.toLocaleString()}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: referral form */}
        <div className="xl:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Patient info (auto-filled) */}
            <div className="bg-canvas rounded-[20px] border border-canvas-soft p-6">
              <h2 className="font-bold text-ink text-sm mb-4 flex items-center gap-2">
                환자 정보
                <span className="bg-primary-pale text-positive-deep text-[10px] font-semibold px-2 py-0.5 rounded-full">자동 연동</span>
              </h2>
              {selected ? (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: '환자 ID',    value: selected.patient.id },
                    { label: '성명',       value: selected.patient.name },
                    { label: '나이 / 성별', value: `${selected.patient.age}세 / ${selected.patient.sex}` },
                    { label: '폐경 여부',  value: selected.patient.menopausal ? '폐경 후' : '폐경 전' },
                    { label: '진료과',     value: selected.patient.ward },
                    { label: '담당의',     value: selected.patient.physician },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-canvas-soft rounded-[12px] px-4 py-3">
                      <p className="text-mute text-xs font-semibold">{label}</p>
                      <p className="text-ink font-semibold text-sm mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-mute text-sm">환자를 선택하세요.</p>
              )}
            </div>

            {/* Referral details */}
            <div className="bg-canvas rounded-[20px] border border-canvas-soft p-6 space-y-4">
              <h2 className="font-bold text-ink text-sm mb-4">의뢰 정보</h2>

              {/* Receiving hospital */}
              <div>
                <label className="text-xs font-semibold text-mute uppercase tracking-wide block mb-2">
                  의뢰 병원
                </label>
                <select
                  value={hospital}
                  onChange={e => setHospital(e.target.value)}
                  className="w-full bg-canvas-soft border border-canvas-soft rounded-[12px] px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-primary transition-colors"
                >
                  {HOSPITALS.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              {/* Urgency */}
              <div>
                <label className="text-xs font-semibold text-mute uppercase tracking-wide block mb-2">
                  긴급도
                </label>
                <div className="flex gap-3">
                  {([
                    { value: 'urgent', label: '긴급 (Urgent)', desc: '24시간 내 확인 요망' },
                    { value: 'routine', label: '일반 (Routine)', desc: '정규 외래 예약' },
                  ] as const).map(({ value, label, desc }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setUrgency(value)}
                      className={`flex-1 text-left px-4 py-3 rounded-[12px] border transition-colors ${
                        urgency === value
                          ? 'border-primary bg-primary-pale'
                          : 'border-canvas-soft bg-canvas-soft hover:border-ink'
                      }`}
                    >
                      <p className={`text-sm font-semibold ${urgency === value ? 'text-positive-deep' : 'text-ink'}`}>
                        {label}
                      </p>
                      <p className="text-xs text-mute mt-0.5">{desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Findings (auto-filled) */}
            <div className="bg-canvas rounded-[20px] border border-canvas-soft p-6">
              <h2 className="font-bold text-ink text-sm mb-4 flex items-center gap-2">
                AI 분석 소견
                <span className="bg-primary-pale text-positive-deep text-[10px] font-semibold px-2 py-0.5 rounded-full">CDSS 자동 연동</span>
              </h2>
              <textarea
                readOnly
                value={autoFindings}
                rows={4}
                className="w-full bg-canvas-soft rounded-[12px] px-4 py-3 text-sm text-body font-mono resize-none focus:outline-none border border-transparent"
              />
            </div>

            {/* Clinical notes */}
            <div className="bg-canvas rounded-[20px] border border-canvas-soft p-6">
              <label className="font-bold text-ink text-sm block mb-4">
                임상 소견 (추가 기재)
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="담당 의사의 추가 소견을 입력하세요…"
                rows={4}
                className="w-full bg-canvas-soft rounded-[12px] px-4 py-3 text-sm text-ink placeholder:text-mute resize-none focus:outline-none focus:ring-1 focus:ring-primary border border-transparent focus:border-primary transition-colors"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {isNurse ? (
                <div className="relative group flex-1">
                  <div className="flex items-center justify-center gap-2 bg-canvas-soft text-mute font-semibold text-sm py-3.5 rounded-[16px] cursor-not-allowed opacity-60 select-none w-full border border-canvas-soft">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2.5" y="6" width="9" height="7" rx="1.5" />
                      <path d="M4.5 6V4.5a2.5 2.5 0 015 0V6" />
                    </svg>
                    의뢰서 전송
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-[#0e0f0c] border border-[#2a2c28] text-[#e8ebe6] text-[11px] font-semibold px-3 py-1.5 rounded-[8px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                    의사 권한이 필요합니다
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0e0f0c]" />
                  </div>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={!selected}
                  className="flex-1 bg-primary text-on-primary font-semibold text-sm py-3.5 rounded-[16px] hover:bg-primary-active transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  의뢰서 전송
                </button>
              )}
              <button
                type="button"
                onClick={handlePrint}
                disabled={!selected}
                className="flex-1 bg-canvas border border-canvas-soft text-ink font-semibold text-sm py-3.5 rounded-[16px] hover:bg-canvas-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M3 5V1h9v4" />
                  <path d="M3 9H1v5h13V9h-2" />
                  <rect x="3" y="9" width="9" height="5" />
                  <circle cx="12" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
                </svg>
                PDF 저장
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print\\:block, .print\\:block * { visibility: visible; }
          .print\\:block { position: fixed; top: 0; left: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}
