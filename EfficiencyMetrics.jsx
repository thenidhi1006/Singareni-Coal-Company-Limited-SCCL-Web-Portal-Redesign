const efficiencyData = [
  { name: "Underground", efficiency: 78, volume: 18, color: "#C2A15D" },
  { name: "Opencast", efficiency: 88, volume: 46, color: "#22c55e" },
  { name: "Transport", efficiency: 82, volume: 39, color: "#3b82f6" },
  { name: "Processing", efficiency: 85, volume: 34, color: "#ef4444" }
];

const balanceData = [
  { metric: "Excavation", score: 86 },
  { metric: "Coal Handling", score: 84 },
  { metric: "Dispatch", score: 81 },
  { metric: "Washeries", score: 76 },
  { metric: "Equipment Use", score: 83 }
];

const averageEfficiency =
  efficiencyData.reduce((sum, item) => sum + item.efficiency, 0) / efficiencyData.length;
const totalVolume = efficiencyData.reduce((sum, item) => sum + item.volume, 0);
const strongestUnit = efficiencyData.reduce(
  (best, item) => (item.efficiency > best.efficiency ? item : best),
  efficiencyData[0]
);
const topVolumeUnit = efficiencyData.reduce((best, item) => (item.volume > best.volume ? item : best), efficiencyData[0]);

const stats = [
  { label: "Average Efficiency", value: `${averageEfficiency.toFixed(1)}%`, detail: "Across mining, transport, and processing functions" },
  { label: "Tracked Volume", value: `${totalVolume} MT`, detail: "Combined volumetric movement under review" },
  { label: "Top Efficiency", value: strongestUnit.name, detail: `${strongestUnit.efficiency}% operational efficiency` },
  { label: "Highest Volume", value: topVolumeUnit.name, detail: `${topVolumeUnit.volume} MT handled` }
];

export default function EfficiencyMetrics() {
  return (
    <div className="min-h-screen bg-[#0A1020] text-white">
      <main className="mx-auto max-w-[1280px] px-6 py-8 md:py-12">
        <a href="/" className="text-xs font-bold uppercase tracking-widest text-[#C2A15D] hover:text-white">
          Back to Home
        </a>

        <section className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C2A15D]">Operational Performance</span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-wide md:text-5xl">Efficiency & Volumetric Metrics</h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-300">
              This dashboard reviews how efficiently SCCL converts equipment, manpower, transport capacity, and
              processing facilities into coal movement. The metrics combine percentage efficiency with handled volume
              so high-performing and high-load areas are visible together.
            </p>
          </div>
          <div className="border border-white/10 bg-[#0D1527] p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[#C2A15D]">Overview</p>
            <p className="mt-3 text-sm leading-7 text-gray-300">
              Opencast operations lead both efficiency and volume, while transport and processing remain important
              leverage points. Improving dispatch reliability and equipment use can raise the total system average.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="border border-white/10 bg-white/[0.03] p-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{item.label}</p>
              <h2 className="mt-2 text-2xl font-extrabold text-[#C2A15D]">{item.value}</h2>
              <p className="mt-2 text-xs leading-5 text-gray-400">{item.detail}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="border border-white/10 bg-[#0D1527] p-5 md:p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-300">Operational Efficiency</h2>
            <div className="mt-6 space-y-5">
              {efficiencyData.map((item) => (
                <div key={item.name}>
                  <div className="mb-2 flex items-center justify-between gap-4 text-xs">
                    <span className="font-bold text-gray-300">{item.name}</span>
                    <span className="text-[#C2A15D]">{item.efficiency}%</span>
                  </div>
                  <div className="h-4 bg-white/10">
                    <div className="h-full" style={{ width: `${item.efficiency}%`, backgroundColor: item.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-white/10 bg-[#0D1527] p-5 md:p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-300">Volumetric Contribution</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
              <div
                className="mx-auto h-52 w-52 rounded-full border border-white/10"
                style={{
                  background: `conic-gradient(${efficiencyData
                    .reduce((segments, item, index) => {
                      const previous = segments.total;
                      const next = previous + (item.volume / totalVolume) * 100;
                      segments.parts.push(`${item.color} ${previous}% ${next}%`);
                      segments.total = next;
                      return segments;
                    }, { parts: [], total: 0 }).parts.join(", ")})`
                }}
                aria-label="Volumetric contribution chart"
              ></div>
              <div className="space-y-4">
                {efficiencyData.map((item) => (
                  <div key={item.name} className="grid grid-cols-[14px_1fr_auto] items-center gap-3 text-xs">
                    <span className="h-3 w-3" style={{ backgroundColor: item.color }}></span>
                    <span className="font-bold text-gray-300">{item.name}</span>
                    <span className="text-gray-400">{item.volume} MT</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border border-white/10 bg-[#0D1527] p-5 md:p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-300">System Balance Index</h2>
            <div className="mt-6 space-y-4">
              {balanceData.map((item) => (
                <div key={item.metric} className="grid grid-cols-[110px_1fr_42px] items-center gap-3 text-xs">
                  <span className="font-bold text-gray-300">{item.metric}</span>
                  <div className="h-3 bg-white/10">
                    <div className="h-full bg-[#C2A15D]" style={{ width: `${item.score}%` }}></div>
                  </div>
                  <span className="text-right text-gray-400">{item.score}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#C2A15D]">Analysis Notes</h2>
            <div className="mt-4 grid gap-4 text-sm leading-7 text-gray-300 md:grid-cols-2">
              <p>Opencast production carries the largest volume base and remains the strongest driver of aggregate performance.</p>
              <p>Transport efficiency is healthy, but even small delays can affect dispatch and stockyard movement at scale.</p>
              <p>Processing efficiency supports quality control and customer readiness, especially when output rises sharply.</p>
              <p>Underground operations have lower volume but remain strategically important for reserve access and continuity.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
