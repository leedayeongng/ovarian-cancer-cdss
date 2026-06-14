import Link from 'next/link';
import { notFound } from 'next/navigation';
import { patients, getOverallRisk } from '@/lib/mockData';

function NavBar() {
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
          <span className="bg-canvas-soft text-mute text-xs font-semibold px-3 py-1.5 rounded-full">
            환자 상세
          </span>
        </div>
      </div>
    </nav>
  );
}

function RiskBadge({ level }: { level: 'low' | 'medium' | 'high' }) {
  const cfg = {
    low:    { bg: 'bg-primary-pale', text: 'text-positive-deep', label: '저위험' },
    medium: { bg: 'bg-warning-bg',   text: 'text-warning-content', label: '중위험' },
    high:   { bg: 'bg-negative-bg',  text: 'text-white', label: '고위험' },
  } as const;
  const { bg, text, label } = cfg[level];
  return (
    <span className={`${bg} ${text} text-sm font-bold px-4 py-1.5 rounded-full`}>{label}</span>
  );
}

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = patients.find(p => p.patient.id === id);

  if (!record) notFound();

  const { patient, ultrasound, rmi, blood } = record;
  const overallRisk = getOverallRisk(record);
  const overallLabel = { high: '고위험', medium: '중위험', low: '저위험' }[overallRisk];

  const riskColor = {
    high:   'text-negative',
    medium: 'text-warning-content',
    low:    'text-positive-deep',
  }[overallRisk];

  const riskBg = {
    high:   'bg-negative-bg',
    medium: 'bg-warning-bg',
    low:    'bg-primary-pale',
  }[overallRisk];

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-canvas-soft">
        {/* Page header */}
        <div className="bg-canvas border-b border-canvas-soft px-6 py-8">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end gap-4 justify-between">
            <div>
              <p className="text-mute text-xs font-semibold uppercase tracking-widest mb-2">환자 상세 정보</p>
              <h1 className="font-display font-black text-ink text-[40px] leading-tight">
                {patient.name}
              </h1>
              <p className="text-body mt-1">{patient.id} · {patient.age}세 · {patient.menopausal ? '폐경 후' : '폐경 전'} · {patient.ward}</p>
            </div>
            <Link
              href={`/cdss?patientId=${patient.id}`}
              className="bg-primary text-on-primary font-semibold text-base px-8 py-4 rounded-[20px] hover:bg-primary-active transition-colors self-start md:self-auto"
            >
              CDSS 분석 시작 →
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
          {/* Overall risk banner */}
          <div className={`${riskBg} rounded-[24px] p-6 flex items-center justify-between`}>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${riskColor}`}>종합 위험도 등급</p>
              <p className={`font-black text-4xl ${riskColor}`}>{overallLabel}</p>
              <p className={`text-sm mt-1 ${riskColor} opacity-80`}>
                {overallRisk === 'high'
                  ? '즉각적인 전문의 의뢰가 필요합니다'
                  : overallRisk === 'medium'
                  ? '정밀 추적 관찰을 권고합니다'
                  : '정기 검진을 유지하시기 바랍니다'}
              </p>
            </div>
            <RiskBadge level={overallRisk} />
          </div>

          {/* Patient info */}
          <div className="bg-canvas rounded-[24px] p-6 border border-canvas-soft">
            <h2 className="font-bold text-ink mb-5">기본 정보</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: '환자 ID',    value: patient.id },
                { label: '담당 의사',  value: patient.physician },
                { label: '나이',       value: `${patient.age}세` },
                { label: '성별',       value: patient.sex === 'F' ? '여성' : '남성' },
                { label: '폐경 여부',  value: patient.menopausal ? '폐경 후' : '폐경 전' },
                { label: 'BMI',        value: `${patient.bmi} kg/m²` },
                { label: '신장 / 체중', value: `${patient.height} cm / ${patient.weight} kg` },
                { label: '검사일',     value: patient.studyDate },
              ].map(({ label, value }) => (
                <div key={label} className="bg-canvas-soft rounded-[12px] px-4 py-3">
                  <p className="text-mute text-xs font-semibold">{label}</p>
                  <p className="text-ink font-semibold text-sm mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Ultrasound summary */}
            <div className="bg-canvas rounded-[24px] p-6 border border-canvas-soft">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-ink text-primary text-[10px] font-bold px-2.5 py-0.5 rounded-full">01</span>
                <h3 className="font-bold text-ink text-sm">초음파 AI</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-mute text-xs">악성 확률</p>
                  <p className={`font-black text-3xl ${ultrasound.malignancyProbability >= 70 ? 'text-negative' : ultrasound.malignancyProbability >= 40 ? 'text-warning-content' : 'text-positive-deep'}`}>
                    {ultrasound.malignancyProbability}%
                  </p>
                </div>
                <div className="bg-canvas-soft rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${ultrasound.malignancyProbability >= 70 ? 'bg-negative' : ultrasound.malignancyProbability >= 40 ? 'bg-warning' : 'bg-primary'}`}
                    style={{ width: `${ultrasound.malignancyProbability}%` }}
                  />
                </div>
                <div className="pt-2 border-t border-canvas-soft space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-mute">종양 크기</span>
                    <span className="text-ink font-semibold">{ultrasound.tumorArea} cm²</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-mute">종양 유형</span>
                    <span className="text-ink font-semibold">{ultrasound.tumorType}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-mute">FIGO 병기</span>
                    <span className="text-ink font-semibold">{ultrasound.figoLabel || '해당 없음'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RMI summary */}
            <div className="bg-canvas rounded-[24px] p-6 border border-canvas-soft">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-ink text-primary text-[10px] font-bold px-2.5 py-0.5 rounded-full">02</span>
                <h3 className="font-bold text-ink text-sm">RMI 스코어</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-mute text-xs">RMI 지수</p>
                  <p className={`font-black text-3xl ${rmi.rmi > 200 ? 'text-negative' : rmi.rmi > 50 ? 'text-warning-content' : 'text-positive-deep'}`}>
                    {rmi.rmi.toLocaleString()}
                  </p>
                </div>
                <div className="bg-canvas-soft rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${rmi.rmi > 200 ? 'bg-negative' : rmi.rmi > 50 ? 'bg-warning' : 'bg-primary'}`}
                    style={{ width: `${Math.min((rmi.rmi / 5000) * 100, 100)}%` }}
                  />
                </div>
                <div className="pt-2 border-t border-canvas-soft space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-mute">CA-125</span>
                    <span className="text-ink font-semibold">{rmi.ca125} IU/mL</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-mute">U 스코어</span>
                    <span className="text-ink font-semibold">{rmi.uScore}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-mute">M 스코어</span>
                    <span className="text-ink font-semibold">{rmi.mScore}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Blood AI summary */}
            <div className="bg-canvas rounded-[24px] p-6 border border-canvas-soft">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-ink text-primary text-[10px] font-bold px-2.5 py-0.5 rounded-full">03</span>
                <h3 className="font-bold text-ink text-sm">혈액·대사 AI</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-mute text-xs">앙상블 확률</p>
                  <p className={`font-black text-3xl ${blood.ensembleProb >= 70 ? 'text-negative' : blood.ensembleProb >= 40 ? 'text-warning-content' : 'text-positive-deep'}`}>
                    {blood.ensembleProb}%
                  </p>
                </div>
                <div className="bg-canvas-soft rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${blood.ensembleProb >= 70 ? 'bg-negative' : blood.ensembleProb >= 40 ? 'bg-warning' : 'bg-primary'}`}
                    style={{ width: `${blood.ensembleProb}%` }}
                  />
                </div>
                <div className="pt-2 border-t border-canvas-soft space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-mute">TyG 인덱스</span>
                    <span className="text-ink font-semibold">{blood.tygIndex.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-mute">Glucose</span>
                    <span className="text-ink font-semibold">{blood.glucose} mg/dL</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-mute">HDL</span>
                    <span className="text-ink font-semibold">{blood.hdl} mg/dL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-ink rounded-[24px] p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <p className="text-primary font-bold text-lg mb-2">AI 종합 분석을 실행하시겠습니까?</p>
              <p className="text-[#c5edab] text-sm leading-relaxed">
                초음파 AI, RMI 스코어, 혈액·대사 AI 세 가지 모듈로 멀티모달 분석을 수행합니다.
                EMR 데이터는 자동으로 연동됩니다.
              </p>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <Link
                href={`/cdss?patientId=${patient.id}`}
                className="bg-primary text-on-primary font-semibold text-sm px-8 py-3.5 rounded-[16px] hover:bg-primary-active transition-colors text-center"
              >
                CDSS 분석 시작 →
              </Link>
              <Link
                href="/patients"
                className="text-mute text-sm text-center hover:text-canvas-soft transition-colors"
              >
                환자 목록으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-ink px-6 py-8 border-t border-[#1e2d0e]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-mute text-xs">
            © 2024 OvaGuard CDSS — 본 결과는 임상 참고용이며 최종 진단은 의사가 판단해야 합니다.
          </p>
          <Link href="/" className="text-mute text-xs hover:text-canvas-soft transition-colors">
            홈으로 돌아가기
          </Link>
        </div>
      </footer>
    </>
  );
}
