import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  ChevronDown,
  RotateCcw,
  FileText,
  Loader2
} from 'lucide-react';
import { toNepaliNumber } from '../utils/formatters';

interface DropdownOption {
  label: string;
  value: string | number;
}

interface WardOption {
  label: string;
  value: number;
}

const Reports: React.FC = () => {
  const [dropdownData, setDropdownData] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState<number | string>('');
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<number | string>('');
  const [selectedSubSector, setSelectedSubSector] = useState<number | string>('');
  const [selectedSource, setSelectedSource] = useState<number | string>('');
  const [selectedCostCenter, setSelectedCostCenter] = useState<number | string>('');
  const [selectedWard, setSelectedWard] = useState<number | string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportDownloadUrl, setReportDownloadUrl] = useState('');

  useEffect(() => {
    axios.get('http://43.205.239.123/api/reports/dropdowns/')
      .then(res => {
        const data = res.data;
        setDropdownData({
          fiscal_years: data.fiscal_years.map((y: any) => ({
            label: toNepaliNumber(y.year),
            value: y.id
          })),
          report_types: data.report_types.map((r: any) => ({
            label: r,
            value: r
          })),
          thematic_areas: data.thematic_areas.map((s: any) => ({
            label: s.name,
            value: s.id
          })),
          sub_areas: data.sub_areas.map((s: any) => ({
            label: s.name,
            value: s.id
          })),
          sources: data.sources.map((s: any) => ({
            label: s.name,
            value: s.id
          })),
          expenditure_centers: data.expenditure_centers.map((e: any) => ({
            label: e.name,
            value: e.id
          })),
          wards: data.wards.map((w: WardOption) => ({
            label: w.label,
            value: w.value
          })),
          statuses: data.statuses.map((s: any) => ({
            label: s,
            value: s
          })),
        });

        // if (data.fiscal_years.length > 0) setSelectedYear(data.fiscal_years[0].id);
        // if (data.report_types.length > 0) setSelectedReportType(data.report_types[0]);
        // if (data.thematic_areas.length > 0) setSelectedSector(data.thematic_areas[0].id);
        // if (data.sub_areas.length > 0) setSelectedSubSector(data.sub_areas[0].id);
        // if (data.sources.length > 0) setSelectedSource(data.sources[0].id);
        // if (data.expenditure_centers.length > 0) setSelectedCostCenter(data.expenditure_centers[0].id);
        // if (data.wards.length > 0) setSelectedWard(data.wards[0].value);
        // if (data.statuses.length > 0) setSelectedStatus(data.statuses[0]);
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
    setReportGenerated(false);
  };

  const handleGenerateReport = async () => {
    const payload = {
      fiscal_year: selectedYear || null,
      report_type: selectedReportType || null,
      thematic_area: selectedSector || null,
      sub_area: selectedSubSector || null,
      source: selectedSource || null,
      expenditure_center: selectedCostCenter || null,
      ward: selectedWard || null,
      status: selectedStatus || null
    };

    try {
      const response = await axios.post('http://43.205.239.123/api/reports/export-excel/', payload, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      setReportDownloadUrl(url);
      setReportGenerated(true);
    } catch (error: any) {
      console.error('❌ Report generation failed:', error?.response?.data || error.message);
    }
  };

  const DropdownSelect = ({
    value,
    onChange,
    options,
    placeholder
  }: {
    value: string | number;
    onChange: (value: string) => void;
    options: DropdownOption[];
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
          <option key={idx} value={option.value}>{option.label}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
    </div>
  );

  if (!dropdownData) return <div className="flex justify-center items-center py-12">
    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    <span className="ml-2 text-gray-600">लोड हुँदैछ...</span>
  </div>;

  return (
    <main className="flex-1 p-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DropdownSelect value={selectedYear} onChange={setSelectedYear} options={dropdownData.fiscal_years} placeholder="वर्ष चयन गर्नुहोस्" />
          <DropdownSelect value={selectedReportType} onChange={setSelectedReportType} options={dropdownData.report_types} placeholder="रिपोर्टको प्रकार चयन गर्नुहोस्" />
          <DropdownSelect value={selectedSector} onChange={setSelectedSector} options={dropdownData.thematic_areas} placeholder="क्षेत्र" />
          <DropdownSelect value={selectedSubSector} onChange={setSelectedSubSector} options={dropdownData.sub_areas} placeholder="उप-क्षेत्र" />
          <DropdownSelect value={selectedSource} onChange={setSelectedSource} options={dropdownData.sources} placeholder="स्रोत" />
          <DropdownSelect value={selectedCostCenter} onChange={setSelectedCostCenter} options={dropdownData.expenditure_centers} placeholder="खर्च केन्द्र" />
          <DropdownSelect value={selectedWard} onChange={setSelectedWard} options={dropdownData.wards} placeholder="वडा नं." />
          <DropdownSelect value={selectedStatus} onChange={setSelectedStatus} options={dropdownData.statuses} placeholder="स्थिति" />
        </div>

        <div className="flex items-center justify-center space-x-4">
          <button onClick={handleReset} className="flex items-center space-x-2 px-6 py-3 border border-gray-300 cursor-pointer rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
            <RotateCcw className="w-4 h-4" />
            <span>रिसेट गर्नुहोस्</span>
          </button>
          <button onClick={handleGenerateReport} className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white cursor-pointer rounded-lg hover:bg-blue-700 font-medium">
            <FileText className="w-4 h-4" />
            <span>रिपोर्ट बनाउनुहोस्</span>
          </button>
        </div>

        <div className="mt-8 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
          {reportGenerated ? (
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold text-green-700">रिपोर्ट सफलतापूर्वक तयार गरियो</h2>
              <p className="text-gray-700">तपाईंले बनाउन खोज्नु भएको रिपोर्ट तयार भइसकेको छ। कृपया डाउनलोड गर्नुहोस्।</p>
              <a href={reportDownloadUrl} download="Project-Report.xlsx" className="inline-block px-6 py-2 bg-blue-600 text-white cursor-pointer rounded hover:bg-blue-700">
                डाउनलोड गर्नुहोस्
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center cursor-pointer text-gray-500">
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
