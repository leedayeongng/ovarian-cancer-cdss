import Link from 'next/link';
import { patients, getOverallRisk } from '@/lib/mockData';

const MOCK_TODAY_TOTAL = 12;
const MOCK_REFERRAL_COUNT = 2;

export default function DashboardPage() {
  const highRiskCount = patients.filter(r => getOverallRisk(r) === 'high').length;

  const recentPatients = [...patients].sort(
    (a, b) => b.patient.studyDate.localeCompare(a.patient.studyDate)
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-mute text-xs font-semibold uppercase tracking-widest mb-1">
          OvaGuard CDSS
        </p>
        <h1 className="font-display font-black text-ink text-[32px] leading-tight">대시보드</h1>
        <p className="text-body text-sm mt-1">오늘의 외래 현황과 최근 분석 결과를 확인합니다.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-canvas rounded-[20px] p-5 border border-canvas-soft">
          <p className="text-mute text-xs font-semibold uppercase tracking-wide mb-3">오늘 외래</p>
          <p className="font-black text-ink text-4xl">{MOCK_TODAY_TOTAL}</p>
          <p className="text-mute text-xs mt-1">명 · 산부인과 외래</p>
        </div>

        <div className="bg-canvas rounded-[20px] p-5 border border-canvas-soft">
          <p className="text-mute text-xs font-semibold uppercase tracking-wide mb-3">고위험 환자</p>
          <p className="font-black text-negative text-4xl">{highRiskCount}</p>
          <p className="text-mute text-xs mt-1">명 · 즉시 확인 필요</p>
        </div>

        <div className="bg-canvas rounded-[20px] p-5 border border-canvas-soft">
          <p className="text-mute text-xs font-semibold uppercase tracking-wide mb-3">의뢰 건수</p>
          <p className="font-black text-ink text-4xl">{MOCK_REFERRAL_COUNT}</p>
          <p className="text-mute text-xs mt-1">건 · 이번 달</p>
        </div>

        <div className="bg-canvas rounded-[20px] p-5 border border-canvas-soft">
          <p className="text-mute text-xs font-semibold uppercase tracking-wide mb-3">분석 완료</p>
          <p className="font-black text-positive-deep text-4xl">{patients.length}</p>
          <p className="text-mute text-xs mt-1">명 · 누적</p>
        </div>
      </div>

      {/* High-risk alert */}
      {highRiskCount > 0 && (
        <div className="bg-ink rounded-[20px] p-5 mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-negative animate-pulse shrink-0" />
            <div>
              <p className="text-primary font-bold text-sm">고위험 환자 {highRiskCount}명이 즉각 조치가 필요합니다</p>
              <p className="text-[#868685] text-xs mt-0.5">3차 병원 의뢰 또는 정밀 검사를 권고합니다.</p>
            </div>
          </div>
          <Link
            href="/dashboard/patients"
            className="shrink-0 bg-primary text-on-primary text-xs font-semibold px-4 py-2 rounded-[12px] hover:bg-primary-active transition-colors"
          >
            환자 목록 보기 →
          </Link>
        </div>
      )}

      {/* Recent patients */}
      <div className="bg-canvas rounded-[24px] border border-canvas-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-canvas-soft flex items-center justify-between">
          <h2 className="font-bold text-ink">최근 분석 환자</h2>
          <Link href="/dashboard/patients" className="text-xs text-mute hover:text-ink font-semibold transition-colors">
            전체 보기 →
          </Link>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-canvas-soft">
              <th className="text-left px-6 py-3 text-xs font-semibold text-mute uppercase tracking-wide w-[20%]">환자</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-mute uppercase tracking-wide w-[16%]">검사일</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-mute uppercase tracking-wide w-[16%]">위험도</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-mute uppercase tracking-wide w-[16%]">악성확률</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-mute uppercase tracking-wide w-[16%]">RMI</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-mute uppercase tracking-wide w-[16%]"></th>
            </tr>
          </thead>
          <tbody>
            {recentPatients.map((record) => {
              const risk = getOverallRisk(record);
              const { patient, ultrasound, rmi } = record;
              const riskCfg = {
                high:   { bg: 'bg-negative-bg',  text: 'text-white',           dot: 'bg-negative', label: '고위험' },
                medium: { bg: 'bg-warning-bg',   text: 'text-warning-content', dot: 'bg-warning',  label: '중위험' },
                low:    { bg: 'bg-primary-pale',  text: 'text-positive-deep',  dot: 'bg-positive', label: '저위험' },
              }[risk];

              return (
                <tr key={patient.id} className="border-t border-canvas-soft hover:bg-canvas-soft/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${riskCfg.bg}`}>
                        <span className={`text-xs font-black ${riskCfg.text}`}>{patient.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-ink text-sm">{patient.name}</p>
                        <p className="text-mute text-xs">{patient.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-body">{patient.studyDate}</td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${riskCfg.dot}`} />
                      <span className="text-xs font-semibold text-ink">{riskCfg.label}</span>
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className={`font-bold text-sm ${ultrasound.malignancyProbability >= 70 ? 'text-negative' : 'text-ink'}`}>
                      {ultrasound.malignancyProbability}%
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className={`font-bold text-sm ${rmi.rmi > 200 ? 'text-negative' : 'text-ink'}`}>
                      {rmi.rmi.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/dashboard/patients/${patient.id}`}
                      className="text-xs font-semibold text-mute hover:text-ink transition-colors"
                    >
                      상세 →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
