import Link from 'next/link';
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
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold text-mute hover:text-ink transition-colors">
            홈
          </Link>
          <Link
            href="/cdss"
            className="bg-primary text-on-primary text-sm font-semibold px-5 py-2.5 rounded-[24px] hover:bg-primary-active transition-colors"
          >
            CDSS 시작하기
          </Link>
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
    <span className={`${bg} ${text} text-xs font-bold px-3 py-1 rounded-full`}>{label}</span>
  );
}

export default function PatientsPage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-canvas-soft">
        <div className="bg-canvas border-b border-canvas-soft px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <p className="text-mute text-xs font-semibold uppercase tracking-widest mb-2">환자 관리</p>
            <h1 className="font-display font-black text-ink text-[40px] leading-tight">환자 목록</h1>
            <p className="text-body mt-2">등록된 환자 {patients.length}명의 CDSS 분석 현황을 확인합니다.</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-10">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: '전체 환자', value: patients.length, color: 'text-ink' },
              { label: '고위험군',  value: patients.filter(r => getOverallRisk(r) === 'high').length,   color: 'text-negative' },
              { label: '저위험군',  value: patients.filter(r => getOverallRisk(r) === 'low').length,    color: 'text-positive-deep' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-canvas rounded-[20px] p-6 border border-canvas-soft text-center">
                <p className={`font-black text-4xl ${color}`}>{value}</p>
                <p className="text-mute text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Patient list */}
          <div className="space-y-4">
            {patients.map((record) => {
              const risk = getOverallRisk(record);
              const { patient, ultrasound, rmi, blood } = record;

              return (
                <div
                  key={patient.id}
                  className="bg-canvas rounded-[24px] p-6 border border-canvas-soft hover:border-primary transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Patient identity */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                        risk === 'high' ? 'bg-negative-bg' :
                        risk === 'medium' ? 'bg-warning-bg' :
                        'bg-primary-pale'
                      }`}>
                        <span className={`text-lg font-black ${
                          risk === 'high' ? 'text-white' :
                          risk === 'medium' ? 'text-warning-content' :
                          'text-positive-deep'
                        }`}>
                          {patient.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-bold text-ink">{patient.name}</span>
                          <span className="text-mute text-sm">{patient.age}세 · {patient.menopausal ? '폐경 후' : '폐경 전'}</span>
                          <RiskBadge level={risk} />
                        </div>
                        <p className="text-mute text-xs mt-0.5">{patient.id} · 검사일 {patient.studyDate} · {patient.physician}</p>
                      </div>
                    </div>

                    {/* Key metrics */}
                    <div className="flex items-center gap-6 flex-wrap">
                      <div className="text-center">
                        <p className="text-mute text-[10px] font-semibold uppercase tracking-wide">악성 확률</p>
                        <p className={`font-black text-xl ${ultrasound.malignancyProbability >= 70 ? 'text-negative' : 'text-ink'}`}>
                          {ultrasound.malignancyProbability}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-mute text-[10px] font-semibold uppercase tracking-wide">RMI</p>
                        <p className={`font-black text-xl ${rmi.rmi > 200 ? 'text-negative' : 'text-ink'}`}>
                          {rmi.rmi.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-mute text-[10px] font-semibold uppercase tracking-wide">앙상블</p>
                        <p className={`font-black text-xl ${blood.ensembleProb >= 70 ? 'text-negative' : 'text-ink'}`}>
                          {blood.ensembleProb}%
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 shrink-0">
                      <Link
                        href={`/patients/${patient.id}`}
                        className="text-sm font-semibold text-mute border border-canvas-soft px-4 py-2.5 rounded-[14px] hover:text-ink hover:border-ink transition-colors"
                      >
                        상세 보기
                      </Link>
                      <Link
                        href={`/cdss?patientId=${patient.id}`}
                        className="bg-primary text-on-primary text-sm font-semibold px-4 py-2.5 rounded-[14px] hover:bg-primary-active transition-colors"
                      >
                        CDSS 분석 →
                      </Link>
                    </div>
                  </div>

                  {/* Mini progress bars */}
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {[
                      { label: '초음파 AI', value: ultrasound.malignancyProbability },
                      { label: 'RMI 위험도', value: Math.min((rmi.rmi / 5000) * 100, 100) },
                      { label: '혈액·대사 AI', value: blood.ensembleProb },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div className="flex justify-between text-[10px] text-mute mb-1">
                          <span className="font-semibold">{label}</span>
                          <span>{Math.round(value)}%</span>
                        </div>
                        <div className="bg-canvas-soft rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${value >= 70 ? 'bg-negative' : value >= 40 ? 'bg-warning' : 'bg-primary'}`}
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
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
