interface ChartCardProps {
  title: string;
  percentage: string;
  label: string;
  colorClass: string;
  strokeColor: string;
  description: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, percentage, label, colorClass, strokeColor, description }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    <div className="flex items-center justify-center mb-4">
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={strokeColor}
            strokeWidth="20"
            strokeDasharray="251.2 0"
            className="opacity-100"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${colorClass}`}>{percentage}</span>
        </div>
      </div>
    </div>
    <div className="flex items-center justify-center space-x-2">
      <div className={`w-3 h-3 ${colorClass} rounded-full`}></div>
      <span className="text-sm text-gray-600">{label}</span>
    </div>
    <div className="mt-4 pt-4 border-t border-gray-200">
      <p className="text-sm text-gray-700">{description}</p>
    </div>
  </div>
);

export default ChartCard;
