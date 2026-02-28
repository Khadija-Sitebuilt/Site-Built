import {
  Chart as ChartJS,
  CategoryScale,
  PointElement,
  LineElement,
  LinearScale,
  BarElement,
  Tooltip,
  ArcElement,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  PointElement,
  LineElement,
  LinearScale,
  BarElement,
  ArcElement,
  Filler,
  Legend,
  Tooltip,
);

const lineOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    y: {
      min: 90,
      max: 100,
      ticks: {
        callback: function (value: string | number) {
          if (typeof value === "number" && (value % 3 === 0 || value === 100)) {
            return value;
          }
        },
      },
    },
  },
};

const barOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: {
      grid: {
        offset: false,
      },
    },
    y: {
      max: 60,
      ticks: {
        stepSize: 15,
      },
    },
  },
};

const doughnutOptions = {
  responsive: true,
  rotation: 90,
  circumference: 360,
};

const areaOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    y: {
      min: 0,
      ticks: {
        stepSize: 600,
      },
    },
    x: { border: { display: true, color: "green", width: 2 } },
  },
};

export default function AnalyticsDashboard() {
  return (
    <div className="flex flex-col gap-6 bg-white p-6 rounded-[0.875rem]">
      <div className="flex gap-6 items-start">
        <div className="flex-1 bg-white rounded-[0.875rem] p-5 border border-black/10 shadow-md min-w-0">
          <h2 className="font-['Arial',sans-serif] text-[#0a0a0a] leading-4 mb-1.5">
            Accuracy Trends
          </h2>
          <p className="font-['Arial',sans-serif] text-[#717182] text-sm leading-5 mb-6">
            Weekly accuracy rates over time
          </p>

          <Line
            options={lineOptions}
            data={{
              labels: [
                "Week 1",
                "Week 2",
                "Week 3",
                "Week 4",
                "Week 5",
                "Week 6",
              ],
              datasets: [
                {
                  label: "",
                  data: [94, 97, 98, 97.5, 98.7, 99],
                  borderColor: "#16a34a",
                  pointStyle: "circle",
                  pointRadius: 3,
                  pointBackgroundColor: "white",
                  pointBorderWidth: 3,
                  tension: 0.4,
                },
              ],
            }}
          />
        </div>

        <div className="flex-1 bg-white rounded-[0.875rem] p-5 border border-black/10 shadow-md min-w-0">
          <h2 className="font-['Arial',sans-serif] text-[#0a0a0a] leading-4 mb-1.5">
            Upload Duration
          </h2>
          <p className="font-['Arial',sans-serif] text-[#717182] text-sm leading-5 mb-6">
            Average time per project (minutes)
          </p>

          <Bar
            options={barOptions}
            data={{
              labels: [
                "Landmark",
                "Marina Bay",
                "Downtown",
                "Residence",
                "Shopping",
              ],
              datasets: [
                {
                  label: "",
                  data: [45, 32, 58, 28, 39],
                  backgroundColor: "#2563eb",
                  borderColor: "#2563eb",
                  borderWidth: 1,
                },
              ],
            }}
          />
        </div>
      </div>

      <div className="flex gap-6 items-start">
        <div className="flex-1 bg-white rounded-[0.875rem] p-5 border border-black/10 shadow-md min-w-0">
          <h2 className="font-['Arial',sans-serif] text-[#0a0a0a] leading-4 mb-1.5">
            Project Status Distribution
          </h2>
          <p className="font-['Arial',sans-serif] text-[#717182] text-sm leading-5 mb-6">
            Current project states
          </p>

          <Doughnut
            options={doughnutOptions}
            data={{
              labels: ["Completed: 156", "Active: 24", "Pending: 8"],
              datasets: [
                {
                  data: [156, 24, 8],
                  backgroundColor: ["green", "blue", "orange"],
                  borderColor: "white",
                  borderWidth: 7,
                },
              ],
            }}
          />
        </div>

        <div className="flex-1 bg-white rounded-[0.875rem] p-5 border border-black/10 shadow-md min-w-0">
          <h2 className="font-['Arial',sans-serif] text-[#0a0a0a] leading-4 mb-1.5">
            Monthly Progress
          </h2>
          <p className="font-['Arial',sans-serif] text-[#717182] text-sm leading-5 mb-6">
            Photos uploaded and projects completed
          </p>

          <Line
            options={areaOptions}
            data={{
              labels: ["Jun", "Jul", "Aug", "Sept", "Oct"],
              datasets: [
                {
                  fill: true,
                  data: [1200, 1800, 2100, 1950, 2400],
                  borderColor: "#2563eb",
                  backgroundColor: "#2563eb99",
                  pointRadius: 0,
                  pointHoverRadius: 0,
                  tension: 0.4,
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
}
