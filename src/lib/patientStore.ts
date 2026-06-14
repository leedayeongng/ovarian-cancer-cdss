import type { PatientRecord, PatientStatus } from './mockData';

const STORAGE_KEY = 'ovaguard_registered_patients';
const STATUS_KEY  = 'ovaguard_patient_statuses';

export function getStoredPatients(): PatientRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PatientRecord[]) : [];
  } catch {
    return [];
  }
}

export function addStoredPatient(record: PatientRecord): void {
  const existing = getStoredPatients();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, record]));
}

export function getStatusOverrides(): Record<string, PatientStatus> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STATUS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, PatientStatus>) : {};
  } catch {
    return {};
  }
}

export function setPatientStatus(id: string, status: PatientStatus): void {
  const overrides = getStatusOverrides();
  overrides[id] = status;
  localStorage.setItem(STATUS_KEY, JSON.stringify(overrides));
}

export function generatePatientId(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `PT-${year}-${rand}`;
}

export function calcTygIndex(triglycerides: number, glucose: number): number {
  if (triglycerides <= 0 || glucose <= 0) return 0;
  return parseFloat(Math.log((triglycerides * glucose) / 2).toFixed(2));
}
