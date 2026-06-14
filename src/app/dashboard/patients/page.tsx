'use client';

import { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { patients as mockPatients, getOverallRisk, type PatientRecord } from '@/lib/mockData';
import { getStoredPatients, getStatusOverrides } from '@/lib/patientStore';
import { useAuth } from '@/lib/authContext';

type RiskFilter = 'all' | 'high' | 'medium' | 'low';

function CdssBanner() {
  const searchParams = useSearchParams();
  if (!searchParams.get('cdss')) return null;
  return (
    <div className="flex items-center gap-3 bg-primary-pale border border-primary rounded-[16px] px-5 py-3.5 mb-6 animate-pulse">
      <span className="relative shrink-0 flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
      </span>
      <p className="text-negative text-sm font-semibold">
        CDSS 분석을 위해 환자를 먼저 선택하세요
      </p>
    </div>
  );
}

function IconLock() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="9" height="6.5" rx="1.5" />
      <path d="M4 6V4.5a2.5 2.5 0 015 0V6" />
    </svg>
  );
}

function NewPatientButton({ isNurse }: { isNurse: boolean }) {
  if (isNurse) {
    return (
      <Link
        href="/dashboard/patients/new"
        className="shrink-0 flex items-center gap-2 bg-primary text-on-primary font-semibold text-sm px-5 py-2.5 rounded-[16px] hover:bg-primary-active transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="7" y1="1" x2="7" y2="13" />
          <line x1="1" y1="7" x2="13" y2="7" />
        </svg>
        신규 환자 등록
      </Link>
    );
  }

  return (
    <div className="relative group shrink-0">
      <div className="flex items-center gap-2 bg-canvas border border-canvas-soft text-mute font-semibold text-sm px-5 py-2.5 rounded-[16px] cursor-not-allowed opacity-60 select-none">
        <IconLock />
        신규 환자 등록
      </div>
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap bg-[#0e0f0c] border border-[#2a2c28] text-[#e8ebe6] text-[11px] font-semibold px-3 py-1.5 rounded-[8px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
        간호사 권한이 필요합니다
        <div className="absolute top-full right-4 border-4 border-transparent border-t-[#0e0f0c]" />
      </div>
    </div>
  );
}

export default function PatientsPage() {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'custom'>('all');
  const [customDate, setCustomDate] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [storedPatients, setStoredPatients] = useState<PatientRecord[]>([]);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, string>>({});
  const { role } = useAuth();

  const isNurse = role === 'nurse';

  useEffect(() => {
    setStoredPatients(getStoredPatients());
    setStatusOverrides(getStatusOverrides());
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const patients = useMemo(() => [...mockPatients, ...storedPatients], [storedPatients]);

  const today = new Date().toISOString().split('T')[0];

  const filtered = useMemo(() => {
    const q = search.trim();
    return patients.filter(record => {
      const { patient } = record;
      const matchSearch =
        !q ||
        patient.name.includes(q) ||
        patient.id.toLowerCase().includes(q.toLowerCase()) ||
        patient.physician.includes(q);
      const matchRisk = riskFilter === 'all' || getOverallRisk(record) === riskFilter;
      const matchDate =
        dateFilter === 'all'    ? true :
        dateFilter === 'today'  ? patient.studyDate === today :
        customDate              ? patient.studyDate === customDate : true;
      return matchSearch && matchRisk && matchDate;
    });
  }, [search, riskFilter, dateFilter, customDate, patients, today]);

  const riskCfg = {
    high:   { bg: 'bg-negative-bg',  text: 'text-white',           dot: 'bg-negative', label: '고위험' },
    medium: { bg: 'bg-warning-bg',   text: 'text-warning-content', dot: 'bg-warning',  label: '중위험' },
    low:    { bg: 'bg-primary-pale', text: 'text-positive-deep',   dot: 'bg-positive', label: '저위험' },
  } as const;

  return (
    <div className="p-8">
      <Suspense>
        <CdssBanner />
      </Suspense>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-mute text-xs font-semibold uppercase tracking-widest mb-1">환자 관리</p>
          <h1 className="font-display font-black text-ink text-[32px] leading-tight">환자 목록</h1>
          <p className="text-body text-sm mt-1">등록된 환자 {patients.length}명을 조회하고 분석을 시작합니다.</p>
        </div>
        <NewPatientButton isNurse={isNurse} />
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mute" width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="6.5" cy="6.5" r="4.5" />
            <line x1="10.5" y1="10.5" x2="13.5" y2="13.5" />
          </svg>
          <input
            type="text"
            placeholder="이름, 환자 ID, 담당의 검색…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-canvas border border-canvas-soft rounded-[14px] pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-mute focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Date filter */}
        <div className="flex items-center gap-2 shrink-0">
          {/* 전체 */}
          <button
            onClick={() => { setDateFilter('all'); setCustomDate(''); }}
            className={`text-sm font-semibold px-4 py-2.5 rounded-[14px] border transition-colors ${
              dateFilter === 'all'
                ? 'bg-ink text-primary border-ink'
                : 'bg-canvas border-canvas-soft text-body hover:text-ink'
            }`}
          >
            전체
          </button>
          {/* 오늘 */}
          <button
            onClick={() => { setDateFilter('today'); setCustomDate(''); }}
            className={`text-sm font-semibold px-4 py-2.5 rounded-[14px] border transition-colors ${
              dateFilter === 'today'
                ? 'bg-ink text-primary border-ink'
                : 'bg-canvas border-canvas-soft text-body hover:text-ink'
            }`}
          >
            오늘
          </button>
          {/* 날짜 직접 선택 */}
          <div className="relative">
            <button
              onClick={() => dateInputRef.current?.showPicker()}
              className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-[14px] border transition-colors ${
                dateFilter === 'custom'
                  ? 'bg-ink text-primary border-ink'
                  : 'bg-canvas border-canvas-soft text-body hover:text-ink'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="2.5" width="12" height="11" rx="2" />
                <line x1="1" y1="6" x2="13" y2="6" />
                <line x1="4.5" y1="1" x2="4.5" y2="4" />
                <line x1="9.5" y1="1" x2="9.5" y2="4" />
              </svg>
              {dateFilter === 'custom' && customDate
                ? customDate.replace(/-/g, '.')
                : '날짜 선택'}
            </button>
            <input
              ref={dateInputRef}
              type="date"
              className="absolute inset-0 opacity-0 cursor-pointer w-full"
              value={customDate}
              onChange={e => {
                setCustomDate(e.target.value);
                setDateFilter('custom');
              }}
            />
          </div>
        </div>

        {/* Risk filter dropdown */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(v => !v)}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-[14px] border transition-colors ${
              riskFilter !== 'all'
                ? 'bg-ink text-primary border-ink'
                : 'bg-canvas border-canvas-soft text-body hover:text-ink'
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="1" y1="3.5" x2="12" y2="3.5" />
              <line x1="3" y1="6.5" x2="10" y2="6.5" />
              <line x1="5" y1="9.5" x2="8"  y2="9.5" />
            </svg>
            위험도
            {riskFilter !== 'all' && (
              <span className="text-xs font-bold">
                · {riskCfg[riskFilter as keyof typeof riskCfg].label}
              </span>
            )}
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>
              <path d="M2 4l3.5 3.5L9 4" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-40 bg-canvas border border-canvas-soft rounded-[16px] shadow-lg z-50 overflow-hidden">
              {([
                { value: 'all',    label: '전체',   dot: null },
                { value: 'high',   label: '고위험', dot: 'bg-negative' },
                { value: 'medium', label: '중위험', dot: 'bg-warning' },
                { value: 'low',    label: '저위험', dot: 'bg-positive' },
              ] as { value: RiskFilter; label: string; dot: string | null }[]).map(({ value, label, dot }) => (
                <button
                  key={value}
                  onClick={() => { setRiskFilter(value); setDropdownOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold transition-colors ${
                    riskFilter === value ? 'bg-canvas-soft text-ink' : 'text-body hover:bg-canvas-soft hover:text-ink'
                  }`}
                >
                  {dot
                    ? <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                    : <span className="w-2 h-2 rounded-full shrink-0 border border-mute" />
                  }
                  {label}
                  {riskFilter === value && (
                    <svg className="ml-auto" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Patient list */}
      <div className="bg-canvas rounded-[24px] border border-canvas-soft overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-mute text-sm">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <table className="w-full table-fixed">
            <colgroup>
              <col className="w-[13%]" />
              <col className="w-[14%]" />
              <col className="w-[12%]" />
              <col className="w-[13%]" />
              <col className="w-[13%]" />
              <col className="w-[13%]" />
              <col className="w-[13%]" />
              <col className="w-[11%]" />
            </colgroup>
            <thead>
              <tr className="bg-canvas-soft">
                <th className="text-left px-5 py-3 text-xs font-semibold text-mute uppercase tracking-wide">환자</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-mute uppercase tracking-wide hidden lg:table-cell">PT_ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-mute uppercase tracking-wide hidden md:table-cell">나이 / 폐경</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-mute uppercase tracking-wide hidden md:table-cell">CA-125</th>
                <th className="text-right pl-4 pr-6 py-3 text-xs font-semibold text-mute uppercase tracking-wide hidden lg:table-cell">RMI</th>
                <th className="text-left pl-6 pr-4 py-3 text-xs font-semibold text-mute uppercase tracking-wide">위험도</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-mute uppercase tracking-wide hidden md:table-cell">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-mute uppercase tracking-wide">액션</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(record => {
                const risk = getOverallRisk(record);
                const cfg = riskCfg[risk];
                const { patient, rmi } = record;

                const statusCfg: Record<string, { bg: string; text: string }> = {
                  'NEW':     { bg: 'bg-canvas-soft',   text: 'text-mute' },
                  '분석 중':  { bg: 'bg-warning-bg',    text: 'text-warning-content' },
                  '검토 완료': { bg: 'bg-primary-pale',  text: 'text-positive-deep' },
                  '의뢰 완료': { bg: 'bg-negative-bg',   text: 'text-white' },
                };
                const currentStatus = statusOverrides[patient.id] ?? patient.status;
                const sc = statusCfg[currentStatus] ?? { bg: 'bg-canvas-soft', text: 'text-mute' };

                return (
                  <tr key={patient.id} className="border-t border-canvas-soft hover:bg-canvas-soft/50 transition-colors group">
                    {/* 환자 */}
                    <td className="px-5 py-4 truncate">
                      <Link href={`/dashboard/patients/${patient.id}`} className="font-semibold text-ink text-sm group-hover:text-primary transition-colors truncate block">
                        {patient.name}
                      </Link>
                    </td>
                    {/* PT_ID */}
                    <td className="px-4 py-4 text-xs text-mute font-mono truncate hidden lg:table-cell">{patient.id}</td>
                    {/* 나이/폐경 */}
                    <td className="px-4 py-4 text-sm text-body hidden md:table-cell whitespace-nowrap">
                      {patient.age}세 / {patient.menopausal ? '폐경 후' : '폐경 전'}
                    </td>
                    {/* CA-125 */}
                    <td className="pl-4 pr-6 py-4 text-right hidden md:table-cell">
                      <span className={`font-bold text-sm tabular-nums ${rmi.ca125 > 35 ? 'text-negative' : 'text-ink'}`}>
                        {rmi.ca125}
                      </span>
                    </td>
                    {/* RMI */}
                    <td className="pl-4 pr-6 py-4 text-right hidden lg:table-cell">
                      <span className={`font-bold text-sm tabular-nums ${rmi.rmi > 200 ? 'text-negative' : 'text-ink'}`}>
                        {rmi.rmi.toLocaleString()}
                      </span>
                    </td>
                    {/* 위험도 */}
                    <td className="pl-6 pr-4 py-4">
                      <span className="inline-flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                        <span className="text-xs font-semibold text-ink">{cfg.label}</span>
                      </span>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${sc.bg} ${sc.text}`}>
                        {currentStatus}
                      </span>
                    </td>
                    {/* 액션 */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/patients/${patient.id}`}
                          className="text-xs font-semibold text-mute border border-canvas-soft px-3 py-1.5 rounded-[10px] hover:text-ink hover:border-ink transition-colors"
                        >
                          상세
                        </Link>
                        <Link
                          href={`/dashboard/patients/${patient.id}/cdss`}
                          className="text-xs font-semibold bg-primary text-on-primary px-3 py-1.5 rounded-[10px] hover:bg-primary-active transition-colors"
                        >
                          CDSS →
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-mute text-xs mt-3 text-right">총 {filtered.length}명 표시 중 (전체 {patients.length}명)</p>
    </div>
  );
}
