'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  addStoredPatient,
  generatePatientId,
  calcTygIndex,
} from '@/lib/patientStore';

/* ─── Types ─── */

type LabValues = {
  ca125: number;
  glucose: number;
  triglycerides: number;
  hdl: number;
  bmi: number;
};

type CsvRow = Record<string, string>;

/* ─── CSV parsing ─── */

function parseCSV(text: string): CsvRow[] {
  const clean = text.replace(/^﻿/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = clean.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
  });
}

const COL_ALIASES: Record<keyof LabValues, string[]> = {
  ca125:         ['CA-125', 'CA125', 'ca125', 'ca_125', 'Ca-125'],
  glucose:       ['Glucose', 'glucose', 'GLU', 'glu', 'FBS', 'fbs'],
  triglycerides: ['Triglycerides', 'triglycerides', 'TG', 'tg', 'TRI'],
  hdl:           ['HDL', 'hdl', 'HDL-C', 'hdl_c'],
  bmi:           ['BMI', 'bmi', 'body_mass_index'],
};

const FIELD_LABELS: Record<keyof LabValues, string> = {
  ca125: 'CA-125 (IU/mL)',
  glucose: 'Glucose (mg/dL)',
  triglycerides: 'Triglycerides (mg/dL)',
  hdl: 'HDL (mg/dL)',
  bmi: 'BMI (kg/m²)',
};

function extractLabValues(rows: CsvRow[]): { labs: LabValues; mapping: Record<keyof LabValues, string | null> } {
  if (rows.length === 0) {
    const empty = { ca125: 0, glucose: 0, triglycerides: 0, hdl: 0, bmi: 0 };
    const noMap = { ca125: null, glucose: null, triglycerides: null, hdl: null, bmi: null };
    return { labs: empty, mapping: noMap };
  }

  const row = rows[0];
  const csvKeys = Object.keys(row);
  const mapping: Record<keyof LabValues, string | null> = {
    ca125: null, glucose: null, triglycerides: null, hdl: null, bmi: null,
  };
  const labs: LabValues = { ca125: 0, glucose: 0, triglycerides: 0, hdl: 0, bmi: 0 };

  for (const field of Object.keys(COL_ALIASES) as (keyof LabValues)[]) {
    const matched = csvKeys.find(k => COL_ALIASES[field].includes(k));
    if (matched) {
      mapping[field] = matched;
      labs[field] = parseFloat(row[matched]) || 0;
    }
  }
  return { labs, mapping };
}

/* ─── Page ─── */

export default function NewPatientPage() {
  const router = useRouter();

  // Basic info
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<'F' | 'M'>('F');
  const [menopausal, setMenopausal] = useState<'true' | 'false'>('false');
  const [symptoms, setSymptoms] = useState('');

  // Lab / file
  const [csvRows, setCsvRows] = useState<CsvRow[]>([]);
  const [labValues, setLabValues] = useState<LabValues | null>(null);
  const [colMapping, setColMapping] = useState<Record<keyof LabValues, string | null> | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation
  const isFormValid = name.trim() && age.trim() && Number(age) > 0;

  /* ─── File handling ─── */

  const processFile = useCallback((file: File) => {
    setFileError('');
    const allowed = ['.csv', '.txt'];
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowed.includes(ext) && file.type !== 'text/csv') {
      setFileError('CSV 파일(.csv, .txt)만 업로드 가능합니다. Excel은 CSV로 저장 후 업로드하세요.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setFileError('파일 크기는 2MB 이하여야 합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      const rows = parseCSV(text);
      if (rows.length === 0) {
        setFileError('파일을 파싱할 수 없습니다. 헤더 행과 데이터 행이 있는지 확인하세요.');
        return;
      }
      const { labs, mapping } = extractLabValues(rows);
      setCsvRows(rows);
      setLabValues(labs);
      setColMapping(mapping);
      setFileName(file.name);
    };
    reader.readAsText(file, 'UTF-8');
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  /* ─── Submit ─── */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const labs = labValues ?? { ca125: 0, glucose: 0, triglycerides: 0, hdl: 0, bmi: 0 };
    const isMenupause = menopausal === 'true';
    const tygIndex = calcTygIndex(labs.triglycerides, labs.glucose);

    addStoredPatient({
      patient: {
        id: generatePatientId(),
        name: name.trim(),
        age: Number(age),
        sex,
        menopausal: isMenupause,
        bmi: labs.bmi,
        height: 0,
        weight: 0,
        studyDate: new Date().toISOString().split('T')[0],
        ward: '산부인과 외래',
        physician: '이○○ 교수',
        status: 'NEW',
        symptoms: symptoms.trim() || undefined,
      },
      ultrasound: {
        tumorDetected: false,
        tumorArea: 0,
        malignancyProbability: 0,
        benignProbability: 100,
        tumorType: '미검사',
        tumorTypeEn: 'Not Examined',
        figoHighStage: false,
        figoLabel: '미검사',
        borderIrregularity: 0,
      },
      rmi: {
        multilocular: 0,
        solidComponent: 0,
        bilateral: 0,
        ascites: 0,
        peritonealMetastasis: 0,
        uScore: 0,
        mScore: isMenupause ? 3 : 1,
        ca125: labs.ca125,
        rmi: 0,
      },
      blood: {
        glucose: labs.glucose,
        triglycerides: labs.triglycerides,
        hdl: labs.hdl,
        tygIndex,
        bmi: labs.bmi,
        xgbProb: 0,
        lgbmProb: 0,
        catboostProb: 0,
        ensembleProb: 0,
      },
    });

    router.push('/dashboard/patients');
  };

  /* ─── Render ─── */

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 text-xs text-mute mb-6">
        <Link href="/dashboard/patients" className="hover:text-ink transition-colors">환자 목록</Link>
        <span>/</span>
        <span className="text-ink font-semibold">신규 환자 등록</span>
      </div>

      <div className="mb-8">
        <p className="text-mute text-xs font-semibold uppercase tracking-widest mb-1">환자 관리</p>
        <h1 className="font-display font-black text-ink text-[32px] leading-tight">신규 환자 등록</h1>
        <p className="text-body text-sm mt-1">기본 정보를 직접 입력하고, Lab 수치는 CSV 파일로 업로드합니다.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ─── Section 1: 기본 정보 ─── */}
        <div className="bg-canvas rounded-[24px] border border-canvas-soft p-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-ink text-primary text-xs font-bold px-3 py-1 rounded-full">01</span>
            <h2 className="font-bold text-ink">기본 정보</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* 이름 */}
            <div>
              <label className="text-xs font-semibold text-mute uppercase tracking-wide block mb-2">
                이름 <span className="text-negative">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="예: 홍○○"
                className="w-full bg-canvas-soft border border-canvas-soft rounded-[12px] px-4 py-2.5 text-sm text-ink placeholder:text-mute focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* 나이 */}
            <div>
              <label className="text-xs font-semibold text-mute uppercase tracking-wide block mb-2">
                나이 <span className="text-negative">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  placeholder="예: 52"
                  min={1}
                  max={120}
                  className="w-full bg-canvas-soft border border-canvas-soft rounded-[12px] px-4 py-2.5 text-sm text-ink placeholder:text-mute focus:outline-none focus:border-primary transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-mute text-xs">세</span>
              </div>
            </div>

            {/* 성별 */}
            <div>
              <label className="text-xs font-semibold text-mute uppercase tracking-wide block mb-2">성별</label>
              <div className="flex gap-3">
                {(['F', 'M'] as const).map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setSex(v)}
                    className={`flex-1 py-2.5 rounded-[12px] text-sm font-semibold border transition-colors ${
                      sex === v
                        ? 'bg-primary-pale border-primary text-positive-deep'
                        : 'bg-canvas-soft border-canvas-soft text-mute hover:border-ink hover:text-ink'
                    }`}
                  >
                    {v === 'F' ? '여성 (F)' : '남성 (M)'}
                  </button>
                ))}
              </div>
            </div>

            {/* 폐경 여부 */}
            <div>
              <label className="text-xs font-semibold text-mute uppercase tracking-wide block mb-2">폐경 여부</label>
              <div className="flex gap-3">
                {([
                  { value: 'false', label: '폐경 전' },
                  { value: 'true',  label: '폐경 후' },
                ] as const).map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setMenopausal(value)}
                    className={`flex-1 py-2.5 rounded-[12px] text-sm font-semibold border transition-colors ${
                      menopausal === value
                        ? 'bg-primary-pale border-primary text-positive-deep'
                        : 'bg-canvas-soft border-canvas-soft text-mute hover:border-ink hover:text-ink'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

{/* 증상 */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-mute uppercase tracking-wide block mb-2">주요 증상 (선택)</label>
              <textarea
                value={symptoms}
                onChange={e => setSymptoms(e.target.value)}
                placeholder="예: 복통, 복부 팽만, 불규칙 출혈…"
                rows={2}
                className="w-full bg-canvas-soft border border-canvas-soft rounded-[12px] px-4 py-3 text-sm text-ink placeholder:text-mute resize-none focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        {/* ─── Section 2: Lab 수치 업로드 ─── */}
        <div className="bg-canvas rounded-[24px] border border-canvas-soft p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="bg-ink text-primary text-xs font-bold px-3 py-1 rounded-full">02</span>
              <h2 className="font-bold text-ink">Lab 수치 업로드</h2>
            </div>
            <span className="text-mute text-xs">선택 사항 · CSV / TXT</span>
          </div>
          <p className="text-mute text-xs mb-5 ml-[52px]">
            CA-125, Glucose, Triglycerides, HDL, BMI 컬럼이 있는 CSV 파일을 업로드하세요.
          </p>

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-[20px] p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
              dragging
                ? 'border-primary bg-primary-pale'
                : fileName
                ? 'border-positive bg-primary-pale'
                : 'border-canvas-soft hover:border-primary hover:bg-primary-pale/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              onChange={handleFileChange}
              className="hidden"
            />

            {fileName ? (
              <>
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mb-3">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-on-primary">
                    <path d="M3 9l4.5 4.5L15 5" />
                  </svg>
                </div>
                <p className="font-semibold text-ink text-sm">{fileName}</p>
                <p className="text-mute text-xs mt-1">{csvRows.length}개 데이터 행 파싱 완료 · 클릭하여 재업로드</p>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-canvas-soft flex items-center justify-center mb-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-mute">
                    <path d="M4 13v3h12v-3" />
                    <path d="M10 3v9" />
                    <path d="M7 6l3-3 3 3" />
                  </svg>
                </div>
                <p className="font-semibold text-ink text-sm">파일을 드래그하거나 클릭하여 업로드</p>
                <p className="text-mute text-xs mt-1">CSV, TXT · 최대 2MB</p>
                <div className="mt-3 bg-canvas-soft rounded-[10px] px-4 py-2 text-xs font-mono text-mute">
                  CA-125,Glucose,Triglycerides,HDL,BMI
                </div>
              </>
            )}
          </div>

          {/* File error */}
          {fileError && (
            <div className="mt-3 flex items-start gap-2 bg-[#320707] rounded-[12px] px-4 py-3">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="shrink-0 text-negative mt-0.5">
                <circle cx="7" cy="7" r="6" />
                <line x1="7" y1="4.5" x2="7" y2="7.5" />
                <circle cx="7" cy="9.5" r="0.75" fill="currentColor" stroke="none" />
              </svg>
              <p className="text-negative text-xs">{fileError}</p>
            </div>
          )}

          {/* Column mapping */}
          {colMapping && labValues && (
            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-semibold text-mute uppercase tracking-widest mb-3">컬럼 매핑 결과</p>
                <div className="rounded-[16px] overflow-hidden border border-canvas-soft">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-canvas-soft">
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-mute uppercase tracking-wide">CDSS 필드</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-mute uppercase tracking-wide">CSV 컬럼</th>
                        <th className="text-right px-4 py-2.5 text-xs font-semibold text-mute uppercase tracking-wide">값</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(Object.keys(FIELD_LABELS) as (keyof LabValues)[]).map(field => {
                        const csvCol = colMapping[field];
                        const value = labValues[field];
                        const isMapped = csvCol !== null && value > 0;
                        return (
                          <tr key={field} className="border-t border-canvas-soft">
                            <td className="px-4 py-3 text-body font-medium">{FIELD_LABELS[field]}</td>
                            <td className="px-4 py-3">
                              {csvCol ? (
                                <span className="text-xs font-mono bg-canvas-soft px-2 py-1 rounded-[6px] text-ink">{csvCol}</span>
                              ) : (
                                <span className="text-xs text-mute">매핑 없음</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {isMapped ? (
                                <span className="font-bold text-ink">{value}</span>
                              ) : (
                                <span className="text-mute text-xs">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Preview table */}
              {csvRows.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-mute uppercase tracking-widest mb-3">
                    파일 미리보기 ({csvRows.length}행)
                  </p>
                  <div className="rounded-[16px] overflow-auto border border-canvas-soft max-h-48">
                    <table className="w-full text-sm whitespace-nowrap">
                      <thead className="sticky top-0">
                        <tr className="bg-canvas-soft">
                          {Object.keys(csvRows[0]).map(col => (
                            <th key={col} className="text-left px-4 py-2.5 text-xs font-semibold text-mute uppercase tracking-wide border-r border-canvas-soft last:border-r-0">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {csvRows.map((row, i) => (
                          <tr key={i} className={i % 2 === 0 ? '' : 'bg-canvas-soft/40'}>
                            {Object.values(row).map((val, j) => (
                              <td key={j} className="px-4 py-2.5 text-ink font-mono border-r border-canvas-soft last:border-r-0">
                                {val}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── Actions ─── */}
        <div className="flex gap-3 pb-4">
          <Link
            href="/dashboard/patients"
            className="flex-1 text-center bg-canvas border border-canvas-soft text-ink font-semibold text-sm py-3.5 rounded-[16px] hover:bg-canvas-soft transition-colors"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={!isFormValid}
            className="flex-1 bg-primary text-on-primary font-semibold text-sm py-3.5 rounded-[16px] hover:bg-primary-active transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            환자 등록 완료
          </button>
        </div>
      </form>
    </div>
  );
}
