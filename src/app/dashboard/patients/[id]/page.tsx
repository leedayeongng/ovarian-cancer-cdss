import Link from 'next/link';
import { notFound } from 'next/navigation';
import { patients, getOverallRisk } from '@/lib/mockData';
import { CdssLinkButton } from './CdssLinkButton';

function StatRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-canvas-soft last:border-0">
      <span className="text-mute text-sm">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? 'text-negative' : 'text-ink'}`}>{value}</span>
    </div>
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
  const risk = getOverallRisk(record);

  const riskCfg = {
    high:   { bg: 'bg-negative-bg',  text: 'text-white',           label: '고위험', desc: '즉각적인 3차 병원 의뢰를 권고합니다.' },
    medium: { bg: 'bg-warning-bg',   text: 'text-warning-content', label: '중위험', desc: '정밀 추적 관찰이 필요합니다.' },
    low:    { bg: 'bg-primary-pale', text: 'text-positive-deep',   label: '저위험', desc: '정기 검진을 유지하시기 바랍니다.' },
  }[risk];

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-mute mb-6">
        <Link href="/dashboard/patients" className="hover:text-ink transition-colors">환자 목록</Link>
        <span>/</span>
        <span className="text-ink font-semibold">{patient.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start gap-4 justify-between mb-6">
        <div>
          <p className="text-mute text-xs font-semibold uppercase tracking-widest mb-1">환자 상세</p>
          <h1 className="font-display font-black text-ink text-[32px] leading-tight">{patient.name}</h1>
          <p className="text-body text-sm mt-1">{patient.id} · {patient.age}세 · {patient.ward} · {patient.physician}</p>
        </div>
        <CdssLinkButton patientId={patient.id} variant="primary" />
      </div>

      {/* Risk banner */}
      <div className={`${riskCfg.bg} rounded-[20px] p-5 mb-6 flex items-center justify-between`}>
        <div>
          <p className={`text-xs font-semibold uppercase tracking-widest mb-0.5 ${riskCfg.text} opacity-70`}>종합 위험도</p>
          <p className={`font-black text-2xl ${riskCfg.text}`}>{riskCfg.label}</p>
          <p className={`text-xs mt-0.5 ${riskCfg.text} opacity-80`}>{riskCfg.desc}</p>
        </div>
        <span className={`${riskCfg.bg} ${riskCfg.text} text-sm font-bold px-4 py-1.5 rounded-full border border-current opacity-60`}>
          {riskCfg.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Basic info */}
        <div className="bg-canvas rounded-[20px] p-5 border border-canvas-soft">
          <h2 className="font-bold text-ink text-sm mb-4 flex items-center gap-2">
            <span className="bg-ink text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">01</span>
            기본 정보
          </h2>
          <StatRow label="환자 ID" value={patient.id} />
          <StatRow label="이름" value={patient.name} />
          <StatRow label="나이" value={`${patient.age}세`} />
          <StatRow label="성별" value={patient.sex === 'F' ? '여성' : '남성'} />
          <StatRow label="폐경 여부" value={patient.menopausal ? '폐경 후' : '폐경 전'} />
          <StatRow label="BMI" value={`${patient.bmi} kg/m²`} />
          {(patient.height > 0 || patient.weight > 0) && (
            <StatRow label="신장 / 체중" value={`${patient.height} cm / ${patient.weight} kg`} />
          )}
          <StatRow label="검사일" value={patient.studyDate} />
          <StatRow label="진료과" value={patient.ward} />
          <StatRow label="담당의" value={patient.physician} />
          {patient.symptoms && (
            <StatRow label="주요 증상" value={patient.symptoms} />
          )}
        </div>

        {/* Lab values */}
        <div className="bg-canvas rounded-[20px] p-5 border border-canvas-soft">
          <h2 className="font-bold text-ink text-sm mb-4 flex items-center gap-2">
            <span className="bg-ink text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">02</span>
            Lab 수치
            <span className="ml-auto bg-primary-pale text-positive-deep text-[10px] font-semibold px-2 py-0.5 rounded-full">EMR</span>
          </h2>
          <StatRow
            label="CA-125"
            value={`${rmi.ca125} IU/mL`}
            highlight={rmi.ca125 > 35}
          />
          <StatRow
            label="Glucose"
            value={`${blood.glucose} mg/dL`}
            highlight={blood.glucose >= 126}
          />
          <StatRow
            label="Triglycerides"
            value={`${blood.triglycerides} mg/dL`}
            highlight={blood.triglycerides >= 200}
          />
          <StatRow
            label="HDL"
            value={`${blood.hdl} mg/dL`}
            highlight={blood.hdl < 40}
          />
          <StatRow
            label="TyG Index"
            value={blood.tygIndex.toFixed(2)}
            highlight={blood.tygIndex >= 8.82}
          />
          <div className="mt-4 p-3 bg-canvas-soft rounded-[12px]">
            <p className="text-mute text-[10px] font-semibold uppercase tracking-wide mb-1">AI 앙상블 예측</p>
            <div className="flex items-center justify-between">
              <span className={`font-black text-2xl ${blood.ensembleProb >= 70 ? 'text-negative' : 'text-ink'}`}>
                {blood.ensembleProb}%
              </span>
              <span className="text-mute text-xs">악성 확률</span>
            </div>
          </div>
        </div>

        {/* Ultrasound info */}
        <div className="bg-canvas rounded-[20px] p-5 border border-canvas-soft">
          <h2 className="font-bold text-ink text-sm mb-4 flex items-center gap-2">
            <span className="bg-ink text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">03</span>
            초음파 소견
          </h2>
          <StatRow
            label="종양 탐지"
            value={ultrasound.tumorDetected ? '있음' : '없음'}
            highlight={ultrasound.tumorDetected}
          />
          <StatRow label="종양 크기" value={`${ultrasound.tumorArea} cm²`} />
          <StatRow label="종양 유형" value={ultrasound.tumorType} />
          <StatRow
            label="악성 확률"
            value={`${ultrasound.malignancyProbability}%`}
            highlight={ultrasound.malignancyProbability >= 70}
          />
          <StatRow
            label="경계 불규칙도"
            value={`${ultrasound.borderIrregularity} / 1.00`}
            highlight={ultrasound.borderIrregularity >= 0.6}
          />
          <StatRow label="FIGO 병기" value={ultrasound.figoLabel || '해당 없음'} />
          <div className="mt-4">
            <p className="text-mute text-[10px] font-semibold uppercase tracking-wide mb-2">RMI 지수</p>
            <div className="flex items-center gap-3">
              <span className={`font-black text-2xl ${rmi.rmi > 200 ? 'text-negative' : 'text-ink'}`}>
                {rmi.rmi.toLocaleString()}
              </span>
              <span className="text-mute text-xs">기준: &gt;200 고위험</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-5 bg-ink rounded-[20px] p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-1">
          <p className="text-primary font-bold mb-1">멀티모달 AI 종합 분석을 실행하시겠습니까?</p>
          <p className="text-[#868685] text-sm">
            초음파 AI · RMI 스코어 · 혈액대사 AI 세 모듈을 동시에 실행합니다.
          </p>
        </div>
        <CdssLinkButton patientId={patient.id} variant="cta" />
      </div>
    </div>
  );
}
