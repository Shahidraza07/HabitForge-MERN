import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ConsistencyChart({ data }) {
  return (
    <div style={{ background: '#1E293B', padding: '1.5rem', borderRadius: '12px', marginTop: '2rem' }}>
      <h3 style={{ marginBottom: '1rem', color: '#fff' }}>📈 Consistency Trend</h3>
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="name" stroke="#94A3B8" />
            <YAxis stroke="#94A3B8" />
            <Tooltip contentStyle={{ background: '#0F172A', borderRadius: '8px', color: '#fff' }} />
            <Line type="monotone" dataKey="completions" stroke="#3B82F6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}