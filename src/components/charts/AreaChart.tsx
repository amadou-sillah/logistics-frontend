import { AreaChart as RechartsArea, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface AreaChartProps {
  data: Array<{ name: string; value: number }>
  color?: string
}

export default function AreaChart({ data, color = '#3b82f6' }: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <RechartsArea data={data}>
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip contentStyle={{ background: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
        <Area type="monotone" dataKey="value" stroke={color} fill="url(#areaGradient)" strokeWidth={2} />
      </RechartsArea>
    </ResponsiveContainer>
  )
}
