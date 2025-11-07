import React, { useEffect, useState } from 'react';
import { FileText, Users, TrendingUp, Calendar } from 'lucide-react';
import type { AreaDistribution, BudgetArea, BudgetSummary, Summary, WardBudget } from '../types/dashboard';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import Notifications from './Notification/Notifications';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const COLORS = ['#3b82f6', '#ec4899', '#f97316', '#10b981', '#6366f1'];

const WARD_COLORS = [
  '#d62728', '#9467bd', '#1f77b4', '#2ca02c',
  '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf', '#ff7f0e'
];


interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-md font-semibold text-gray-600 mb-4">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color === 'text-blue-600' ? 'bg-blue-100' : 'bg-gray-100'}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};



const Dashboard: React.FC = () => {

  const [summary, setSummary] = useState<Summary | null>(null);
  const [budget, setBudget] = useState<BudgetSummary | null>(null);
  const [areaData, setAreaData] = useState<AreaDistribution[]>([]);
  const [wardData, setWardData] = useState<WardBudget[]>([]);
  const [budgetAreaData, setBudgetAreaData] = useState<BudgetArea[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const [summaryRes, budgetRes, areaRes, wardRes, budgetAreaRes] = await Promise.all([
          axios.get('http://213.199.53.33:8001/api/dashboard/summary/', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://213.199.53.33:8001/api/dashboard/budget-summary/', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://213.199.53.33:8001/api/dashboard/area-wise-distribution/', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://213.199.53.33:8001/api/dashboard/wardwise-budget/', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://213.199.53.33:8001/api/dashboard/budget-area/', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setSummary(summaryRes.data);
        setBudget(budgetRes.data);
        setAreaData(areaRes.data);
        setWardData(wardRes.data);
        setBudgetAreaData(budgetAreaRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);



  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="कुल परियोजनाहरू"
          value={summary ? summary.total_projects?.toString() : '...'}
          icon={<FileText className="w-6 h-6 text-blue-600" />}
          color="text-blue-600"
        />
        <StatCard
          title="सम्पन्न भएका परियोजनाहरू"
          value={summary ? summary.completed_projects?.toString() : '...'}
          icon={<Users className="w-6 h-6 text-blue-600" />}
          color="text-blue-600"
        />
        <StatCard
          title="सम्पन्न हुन बाँकी परियोजनाहरू"
          value={summary ? summary.not_started_projects?.toString() : '...'}
          icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
          color="text-blue-600"
        />
        <StatCard
          title="सञ्चालनमा रहेका परियोजनाहरू"
          value={summary ? summary.in_progress_projects?.toString() : '...'}
          icon={<Calendar className="w-6 h-6 text-blue-600" />}
          color="text-blue-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Overview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">बजेट एवं खर्च</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">खर्च</span>
                  <span className="text-sm font-medium">
                    {budget ? budget.expenditure_budget.toString() : '...'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: budget
                        ? `${Math.min(
                          (budget.expenditure_budget / budget.total_budget) * 100,
                          100
                        ).toFixed(2)}%`
                        : '0%',
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">बजेट</span>
                  <span className="text-sm font-medium">
                    {budget ? budget.total_budget.toString() : '...'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gray-400 h-2 rounded-full"
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-right">
              <p className="text-sm text-gray-600">बाँकी बजेट</p>
              <p className="text-lg font-semibold">{budget ? budget.remaining_budget.toString() : '...'} <span className="text-sm text-gray-500">64%</span></p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Project Status Chart */}
            <div className="bg-white rounded-lg shadow  p-6">
              <h3 className="text-lg font-semibold mb-4">क्षेत्रगत योजनाहरूको तथ्याङ्क</h3>
              <Doughnut
                data={{
                  labels: areaData.map(d => d.label),
                  datasets: [{ data: areaData.map(d => d.value), backgroundColor: COLORS }],
                }}
                options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
              />
            </div>

            {/* Budget Distribution Chart */}
            <div className="bg-white rounded-lg shadow  p-6">
              <h3 className="text-lg font-semibold mb-4">क्षेत्रगत वितिय विनियोजन</h3>
              <Doughnut
                data={{
                  labels: budgetAreaData.map(d => d.label),
                  datasets: [{ data: budgetAreaData.map(d => d.value), backgroundColor: WARD_COLORS }],
                }}
                options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
              />
            </div>

            {/* Ward Wise budget Distribution */}
            <div className="bg-white rounded-lg shadow p-6 mt-6 md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">वडागत वितिय विनियोजन (%)</h3>
              <Bar
                data={{
                  labels: wardData.map(d => d.ward_no),
                  datasets: [
                    { label: 'परियोजनाहरू', data: wardData.map(d => d.total_budget), backgroundColor: '#10b981' },
                  ],
                }}
                options={{
                  responsive: true,
                  scales: {
                    x: { title: { display: true, text: 'वडा' } },
                    y: { title: { display: true, text: '' } },
                  },
                  plugins: { legend: { position: 'bottom' } },
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar - Recent Projects */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <Notifications limit={6} showHeader={true} />

        </div>
      </div>
    </div>
  );
};

export default Dashboard;