import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  ChevronDown,
  RotateCcw,
  FileText
} from 'lucide-react';

const Reports: React.FC = () => {
  const [dropdownData, setDropdownData] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedReportType, setSelectedReportType] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedSubSector, setSelectedSubSector] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedCostCenter, setSelectedCostCenter] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportDownloadUrl, setReportDownloadUrl] = useState('');


  useEffect(() => {
    axios.get('http://localhost:8000/api/reports/dropdowns/')
      .then(res => {
        setDropdownData(res.data);

        if (res.data.fiscal_years.length > 0) setSelectedYear(res.data.fiscal_years[0].year);
        if (res.data.report_types.length > 0) setSelectedReportType(res.data.report_types[0]);
        if (res.data.thematic_areas.length > 0) setSelectedSector(res.data.thematic_areas[0].name);
        if (res.data.sub_areas.length > 0) setSelectedSubSector(res.data.sub_areas[0].name);
        if (res.data.sources.length > 0) setSelectedSource(res.data.sources[0].name);
        if (res.data.expenditure_centers.length > 0) setSelectedCostCenter(res.data.expenditure_centers[0].name);
        if (res.data.wards.length > 0) setSelectedWard(res.data.wards[0]);
        if (res.data.statuses.length > 0) setSelectedStatus(res.data.statuses[0]);
      })
      .catch(err => console.error('Failed to load dropdown data:', err));
  }, []);

  const handleReset = () => {
    setSelectedYear('');
    setSelectedReportType('');
    setSelectedSector('');
    setSelectedSubSector('');
    setSelectedSource('');
    setSelectedCostCenter('');
    setSelectedWard('');
    setSelectedStatus('');
  };

  const handleGenerateReport = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/reports/export-excel/', {
        fiscal_year: selectedYear,
        report_type: selectedReportType,
        thematic_area: selectedSector,
        sub_area: selectedSubSector,
        source: selectedSource,
        expenditure_center: selectedCostCenter,
        ward: selectedWard,
        status: selectedStatus
      }, {
        responseType: 'blob' // for downloading files
      });

      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      setReportDownloadUrl(url);
      setReportGenerated(true);
    } catch (error) {
      console.error('Report generation failed:', error);
    }
  };


  const DropdownSelect = ({
    value,
    onChange,
    options,
    placeholder
  }: {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder: string;
  }) => (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-gray-700"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option, idx) => (
          <option key={idx} value={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
    </div>
  );

  if (!dropdownData) return <div className="p-6 text-center">लोड हुँदैछ...</div>;

  return (
    <main className="flex-1 p-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <ChevronLeft className="w-4 h-4" />
        <div className="flex items-center space-x-2">
          <Home className="w-4 h-4" />
          <span>गृहपृष्ठ</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-medium">रिपोर्टहरू</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">रिपोर्टहरू</h1>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DropdownSelect value={selectedYear} onChange={setSelectedYear} options={dropdownData.fiscal_years.map((y: any) => y.year)} placeholder="वर्ष चयन गर्नुहोस्" />
          <DropdownSelect value={selectedReportType} onChange={setSelectedReportType} options={dropdownData.report_types} placeholder="रिपोर्टको प्रकार चयन गर्नुहोस्" />
          <DropdownSelect value={selectedSector} onChange={setSelectedSector} options={dropdownData.thematic_areas.map((s: any) => s.name)} placeholder="क्षेत्र" />
          <DropdownSelect value={selectedSubSector} onChange={setSelectedSubSector} options={dropdownData.sub_areas.map((s: any) => s.name)} placeholder="उप-क्षेत्र" />
          <DropdownSelect value={selectedSource} onChange={setSelectedSource} options={dropdownData.sources.map((s: any) => s.name)} placeholder="स्रोत" />
          <DropdownSelect value={selectedCostCenter} onChange={setSelectedCostCenter} options={dropdownData.expenditure_centers.map((e: any) => e.name)} placeholder="खर्च केन्द्र" />
          <DropdownSelect value={selectedWard} onChange={setSelectedWard} options={dropdownData.wards} placeholder="वडा नं." />
          <DropdownSelect value={selectedStatus} onChange={setSelectedStatus} options={dropdownData.statuses} placeholder="स्थिति" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-4">
          <button onClick={handleReset} className="flex items-center space-x-2 px-6 py-3 border cursor-pointer border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
            <RotateCcw className="w-4 h-4" />
            <span>रिसेट गर्नुहोस्</span>
          </button>
          <button onClick={handleGenerateReport} className="flex items-center space-x-2 px-6 py-3 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            <FileText className="w-4 h-4" />
            <span>रिपोर्ट बनाउनुहोस्</span>
          </button>
        </div>

        {/* Report Preview Area */}
        <div className="mt-8 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
          {reportGenerated ? (
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold text-green-700">रिपोर्ट सफलतापूर्वक तयार गरियो</h2>
              <p className="text-gray-700">तपाईंले बनाउन खोज्नु भएको रिपोर्ट तयार भइसकेको छ। कृपया डाउनलोड गर्नुहोस्।</p>
              <a
                href={reportDownloadUrl}
                download="report.xlsx"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                डाउनलोड गर्नुहोस्
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-500">
              <FileText className="w-12 h-12 mb-4" />
              <p className="text-lg font-medium mb-2">रिपोर्ट प्रिभ्यू</p>
              <p className="text-sm">फिल्टर चयन गरेर "रिपोर्ट बनाउनुहोस्" बटनमा क्लिक गर्नुहोस्</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
};

export default Reports;
