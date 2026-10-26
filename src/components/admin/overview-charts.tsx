'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const config = {
  requests: { label: 'Requests', color: 'var(--chart-2)' },
  confirmed: { label: 'Confirmed', color: 'var(--primary)' },
} satisfies ChartConfig;

export function RequestsChart({ data }: { data: { month: string; requests: number; confirmed: number }[] }) {
  return (
    <ChartContainer config={config} className='aspect-auto h-64 w-full'>
      <AreaChart data={data} margin={{ left: 4, right: 4, top: 8 }}>
        <defs>
          {(['requests', 'confirmed'] as const).map((k) => (
            <linearGradient key={k} id={`fill-${k}`} x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor={`var(--color-${k})`} stopOpacity={0.5} />
              <stop offset='95%' stopColor={`var(--color-${k})`} stopOpacity={0.05} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis dataKey='month' tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator='dot' />} />
        <Area dataKey='requests' type='monotone' fill='url(#fill-requests)' stroke='var(--color-requests)' strokeWidth={2} />
        <Area dataKey='confirmed' type='monotone' fill='url(#fill-confirmed)' stroke='var(--color-confirmed)' strokeWidth={2} />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
}
