const outputData = [
  { month: "Apr", target: 5.8, actual: 5.4 },
  { month: "May", target: 6.0, actual: 5.7 },
  { month: "Jun", target: 6.1, actual: 5.9 },
  { month: "Jul", target: 6.2, actual: 6.0 },
  { month: "Aug", target: 6.4, actual: 6.2 },
  { month: "Sep", target: 6.5, actual: 6.3 },
  { month: "Oct", target: 6.7, actual: 6.5 },
  { month: "Nov", target: 6.8, actual: 6.6 },
  { month: "Dec", target: 7.0, actual: 6.9 },
  { month: "Jan", target: 7.2, actual: 7.0 },
  { month: "Feb", target: 7.4, actual: 7.3 },
  { month: "Mar", target: 7.9, actual: 7.8 }
];

const annualTarget = outputData.reduce((sum, item) => sum + item.target, 0);
const annualActual = outputData.reduce((sum, item) => sum + item.actual, 0);
const achievement = (annualActual / annualTarget) * 100;
const bestMonth = outputData.reduce((best, item) => (item.actual > best.actual ? item : best), outputData[0]);
const averageMonthlyOutput = annualActual / outputData.length;
const maxValue = Math.max(...outputData.flatMap((item) => [item.target, item.actual]));

const stats = [
  { label: "Annual Target", value: `${annualTarget.toFixed(1)} MT`, detail: "Planned production for the financial year" },
  { label: "Projected Output", value: `${annualActual.toFixed(1)} MT`, detail: "Cumulative actual output trend" },
  { label: "Achievement", value: `${achievement.toFixed(1)}%`, detail: "Actual output against planned target" },
  { label: "Best Month", value: bestMonth.month, detail: `${bestMonth.actual.toFixed(1)} MT delivered` }
];

const makePoints = (key) =>
  outputData
    .map((item, index) => {
      const x = 50 + index * (700 / (outputData.length - 1));
      const y = 300 - (item[key] / maxValue) * 250;
      return `${x},${y}`;
    })
    .join(" ");

export default function OutputTarget() {
  return (
    <div className="min-h-screen bg-[#0A1020] text-white">
      <main className="mx-auto max-w-[1280px] px-6 py-8 md:py-12">
        <a href="/" className="text-xs font-bold uppercase tracking-widest text-[#C2A15D] hover:text-white">
          Back to Home
        </a>

        <section className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C2A15D]">Production Planning</span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-wide md:text-5xl">Annual Output Target Sheet</h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-300">
              This analysis compares month-wise coal production targets with delivered output. The trend shows steady
              improvement through the year, with the strongest volumes appearing in the closing quarter as dispatch,
              excavation, and operational coordination improve.
            </p>
          </div>
          <div className="border border-white/10 bg-[#0D1527] p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[#C2A15D]">Overview</p>
            <p className="mt-3 text-sm leading-7 text-gray-300">
              Output is tracking close to plan, with a narrow gap between annual target and actual production. The
              priority is to sustain March-level momentum while reducing monthly slippage in the first half of the year.
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

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
          <div className="border border-white/10 bg-[#0D1527] p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-300">Target vs Actual Output</h2>
              <div className="flex gap-4 text-xs text-gray-300">
                <span className="inline-flex items-center gap-2"><span className="h-2 w-5 bg-[#C2A15D]"></span>Target</span>
                <span className="inline-flex items-center gap-2"><span className="h-2 w-5 bg-[#22c55e]"></span>Actual</span>
              </div>
            </div>
            <div className="mt-5 overflow-x-auto">
              <svg viewBox="0 0 820 340" className="h-[340px] min-w-[760px] w-full">
                {[50, 112.5, 175, 237.5, 300].map((y) => (
                  <line key={y} x1="45" x2="770" y1={y} y2={y} stroke="rgba(255,255,255,0.08)" />
                ))}
                <polyline points={makePoints("target")} fill="none" stroke="#C2A15D" strokeWidth="4" strokeLinecap="round" />
                <polyline points={makePoints("actual")} fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
                {outputData.map((item, index) => {
                  const x = 50 + index * (700 / (outputData.length - 1));
                  const targetY = 300 - (item.target / maxValue) * 250;
                  const actualY = 300 - (item.actual / maxValue) * 250;
                  return (
                    <g key={item.month}>
                      <circle cx={x} cy={targetY} r="4" fill="#C2A15D" />
                      <circle cx={x} cy={actualY} r="4" fill="#22c55e" />
                      <text x={x} y="325" textAnchor="middle" fill="#cbd5e1" fontSize="12">{item.month}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="border border-white/10 bg-[#0D1527] p-5 md:p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-300">Monthly Actual Output</h2>
            <div className="mt-6 space-y-4">
              {outputData.map((item) => (
                <div key={item.month} className="grid grid-cols-[42px_1fr_54px] items-center gap-3 text-xs">
                  <span className="font-bold text-gray-300">{item.month}</span>
                  <div className="h-3 bg-white/10">
                    <div className="h-full bg-[#C2A15D]" style={{ width: `${(item.actual / maxValue) * 100}%` }}></div>
                  </div>
                  <span className="text-right text-gray-400">{item.actual.toFixed(1)} MT</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#C2A15D]">Analysis Notes</h2>
          <div className="mt-4 grid gap-4 text-sm leading-7 text-gray-300 md:grid-cols-3">
            <p>Average monthly production is {averageMonthlyOutput.toFixed(1)} MT, giving a stable base for year-end planning.</p>
            <p>The target gap narrows in the second half, indicating better equipment availability and stronger dispatch rhythm.</p>
            <p>March records the highest monthly output, making it the benchmark month for future production scheduling.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
