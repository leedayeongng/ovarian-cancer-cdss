import { notFound } from 'next/navigation';
import { patients } from '@/lib/mockData';
import CDSSContent from './CDSSContent';

export default async function CDSSPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = patients.find(p => p.patient.id === id);
  if (!record) notFound();
  return <CDSSContent record={record} />;
}
