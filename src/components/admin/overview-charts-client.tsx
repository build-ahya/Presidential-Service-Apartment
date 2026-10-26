'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const RequestsChart = dynamic(() => import('./overview-charts').then((m) => m.RequestsChart), {
  ssr: false,
  loading: () => <Skeleton className='h-64 w-full' />,
});

export function OverviewChartsClient(props: { data: { month: string; requests: number; confirmed: number }[] }) {
  return <RequestsChart {...props} />;
}
