import { patients } from '@/lib/mockData';
import CDSSClient from './CDSSClient';

export default async function CDSSPage({
  searchParams,
}: {
  searchParams: Promise<{ patientId?: string }>;
}) {
  const { patientId } = await searchParams;
  const record = patients.find(p => p.patient.id === patientId) ?? patients[0];
  return <CDSSClient record={record} />;
}
