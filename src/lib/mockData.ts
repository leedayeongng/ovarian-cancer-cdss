export type PatientStatus = 'NEW' | '분석 중' | '검토 완료' | '의뢰 완료';

export type PatientInfo = {
  id: string;
  name: string;
  age: number;
  sex: string;
  menopausal: boolean;
  bmi: number;
  height: number;
  weight: number;
  studyDate: string;
  ward: string;
  physician: string;
  status: PatientStatus;
  symptoms?: string;
};

export type UltrasoundData = {
  tumorDetected: boolean;
  tumorArea: number;
  malignancyProbability: number;
  benignProbability: number;
  tumorType: string;
  tumorTypeEn: string;
  figoHighStage: boolean;
  figoLabel: string;
  borderIrregularity: number;
};

export type RMIData = {
  multilocular: 0 | 1;
  solidComponent: 0 | 1;
  bilateral: 0 | 1;
  ascites: 0 | 1;
  peritonealMetastasis: 0 | 1;
  uScore: 0 | 1 | 3;
  mScore: 1 | 3;
  ca125: number;
  rmi: number;
};

export type BloodData = {
  glucose: number;
  triglycerides: number;
  hdl: number;
  tygIndex: number;
  bmi: number;
  xgbProb: number;
  lgbmProb: number;
  catboostProb: number;
  ensembleProb: number;
};

export type PatientRecord = {
  patient: PatientInfo;
  ultrasound: UltrasoundData;
  rmi: RMIData;
  blood: BloodData;
};

export function getOverallRisk(record: PatientRecord): 'low' | 'medium' | 'high' {
  const { blood, rmi } = record;
  if (blood.ensembleProb >= 70 || rmi.rmi > 200) return 'high';
  if (blood.ensembleProb >= 40 || rmi.rmi > 50) return 'medium';
  return 'low';
}

export const patients: PatientRecord[] = [
  {
    patient: {
      id: 'PT-2024-08934',
      name: '김○○',
      age: 54,
      sex: 'F',
      menopausal: true,
      bmi: 27.3,
      height: 162,
      weight: 71.7,
      studyDate: '2024-11-12',
      ward: '산부인과 외래',
      physician: '이○○ 교수',
      status: '의뢰 완료',
    },
    ultrasound: {
      tumorDetected: true,
      tumorArea: 12.4,
      malignancyProbability: 72,
      benignProbability: 28,
      tumorType: '장액성 낭선암',
      tumorTypeEn: 'Serous Cystadenocarcinoma',
      figoHighStage: true,
      figoLabel: '3기 (Stage III)',
      borderIrregularity: 0.78,
    },
    rmi: {
      multilocular: 1,
      solidComponent: 1,
      bilateral: 0,
      ascites: 1,
      peritonealMetastasis: 1,
      uScore: 3,
      mScore: 3,
      ca125: 387,
      rmi: 3483,
    },
    blood: {
      glucose: 118,
      triglycerides: 198,
      hdl: 42,
      tygIndex: 9.37,
      bmi: 27.3,
      xgbProb: 88,
      lgbmProb: 85,
      catboostProb: 91,
      ensembleProb: 88,
    },
  },
  {
    patient: {
      id: 'PT-2024-07231',
      name: '이○○',
      age: 47,
      sex: 'F',
      menopausal: false,
      bmi: 24.8,
      height: 165,
      weight: 67.5,
      studyDate: '2024-10-28',
      ward: '산부인과 외래',
      physician: '박○○ 교수',
      status: '분석 중',
    },
    ultrasound: {
      tumorDetected: true,
      tumorArea: 8.7,
      malignancyProbability: 65,
      benignProbability: 35,
      tumorType: '점액성 낭선암',
      tumorTypeEn: 'Mucinous Cystadenocarcinoma',
      figoHighStage: true,
      figoLabel: '2기 (Stage II)',
      borderIrregularity: 0.71,
    },
    rmi: {
      multilocular: 1,
      solidComponent: 1,
      bilateral: 1,
      ascites: 0,
      peritonealMetastasis: 0,
      uScore: 3,
      mScore: 1,
      ca125: 260,
      rmi: 780,
    },
    blood: {
      glucose: 112,
      triglycerides: 182,
      hdl: 45,
      tygIndex: 9.01,
      bmi: 24.8,
      xgbProb: 76,
      lgbmProb: 71,
      catboostProb: 78,
      ensembleProb: 75,
    },
  },
  {
    patient: {
      id: 'PT-2024-09156',
      name: '박○○',
      age: 62,
      sex: 'F',
      menopausal: true,
      bmi: 23.1,
      height: 158,
      weight: 57.7,
      studyDate: '2024-11-05',
      ward: '부인과 종양 클리닉',
      physician: '김○○ 교수',
      status: 'NEW',
    },
    ultrasound: {
      tumorDetected: true,
      tumorArea: 5.2,
      malignancyProbability: 45,
      benignProbability: 55,
      tumorType: '경계성 종양 의심',
      tumorTypeEn: 'Borderline Tumor (Suspicious)',
      figoHighStage: false,
      figoLabel: '1기 (Stage I)',
      borderIrregularity: 0.52,
    },
    rmi: {
      multilocular: 0,
      solidComponent: 1,
      bilateral: 0,
      ascites: 0,
      peritonealMetastasis: 0,
      uScore: 1,
      mScore: 3,
      ca125: 52,
      rmi: 156,
    },
    blood: {
      glucose: 98,
      triglycerides: 145,
      hdl: 53,
      tygIndex: 8.34,
      bmi: 23.1,
      xgbProb: 54,
      lgbmProb: 49,
      catboostProb: 58,
      ensembleProb: 54,
    },
  },
  {
    patient: {
      id: 'PT-2024-06782',
      name: '최○○',
      age: 38,
      sex: 'F',
      menopausal: false,
      bmi: 21.4,
      height: 168,
      weight: 60.4,
      studyDate: '2024-10-15',
      ward: '산부인과 외래',
      physician: '이○○ 교수',
      status: 'NEW',
    },
    ultrasound: {
      tumorDetected: true,
      tumorArea: 2.8,
      malignancyProbability: 18,
      benignProbability: 82,
      tumorType: '양성 낭종',
      tumorTypeEn: 'Benign Cyst',
      figoHighStage: false,
      figoLabel: '없음',
      borderIrregularity: 0.24,
    },
    rmi: {
      multilocular: 0,
      solidComponent: 1,
      bilateral: 0,
      ascites: 0,
      peritonealMetastasis: 0,
      uScore: 1,
      mScore: 1,
      ca125: 18,
      rmi: 18,
    },
    blood: {
      glucose: 88,
      triglycerides: 95,
      hdl: 62,
      tygIndex: 7.65,
      bmi: 21.4,
      xgbProb: 22,
      lgbmProb: 20,
      catboostProb: 25,
      ensembleProb: 22,
    },
  },
  {
    patient: {
      id: 'PT-2024-10423',
      name: '정○○',
      age: 55,
      sex: 'F',
      menopausal: true,
      bmi: 28.6,
      height: 160,
      weight: 73.2,
      studyDate: '2024-11-18',
      ward: '부인과 종양 클리닉',
      physician: '박○○ 교수',
      status: '검토 완료',
    },
    ultrasound: {
      tumorDetected: true,
      tumorArea: 7.3,
      malignancyProbability: 58,
      benignProbability: 42,
      tumorType: '자궁내막양 종양',
      tumorTypeEn: 'Endometrioid Tumor',
      figoHighStage: false,
      figoLabel: '2기 (Stage II)',
      borderIrregularity: 0.63,
    },
    rmi: {
      multilocular: 1,
      solidComponent: 1,
      bilateral: 0,
      ascites: 1,
      peritonealMetastasis: 0,
      uScore: 3,
      mScore: 3,
      ca125: 112,
      rmi: 1008,
    },
    blood: {
      glucose: 125,
      triglycerides: 175,
      hdl: 38,
      tygIndex: 9.18,
      bmi: 28.6,
      xgbProb: 65,
      lgbmProb: 61,
      catboostProb: 68,
      ensembleProb: 65,
    },
  },
];

// backwards compatibility
export const mockPatient = patients[0].patient;
export const mockUltrasound = patients[0].ultrasound;
export const mockRMI = patients[0].rmi;
export const mockBlood = patients[0].blood;
