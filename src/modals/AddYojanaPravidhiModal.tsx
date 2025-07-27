import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { useSettings } from '../hooks/useSetting';

interface Props {
  onClose: () => void;
  type: string; // 'ward', 'province', 'federal', etc.
}

const AddYojanaPravidhiModal: React.FC<Props> = ({ onClose, type }) => {
  const [formData, setFormData] = useState({
    plan_name: '',
    thematic_area: '',
    sub_area: '',
    // project_level: '',
    expenditure_title: '',
    expenditure_center: '',
    proposed_amount: '',
    source: '',
    ward_no: '',
    location: '',
    gps_coordinate: '',
    expected_result: '',
    unit: '',
    fiscal_year: '',
    feasibility_study: '',
    feasibility_consultant: '',
    detailed_study: '',
    environmental_study: '',
    plan_type: type || '', // or fixed as "municipality_level"
    project_level: ''
  });


  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  // Fetch dynamic dropdown data
  const { data: thematicAreas } = useSettings('विषयगत क्षेत्र', true);
  const { data: sub_areas } = useSettings('उप-क्षेत्र', true);
  const { data: projectLevels } = useSettings('योजनाको स्तर', true);
  const { data: expenditureTitles } = useSettings('खर्च शिर्षक', true);
  const { data: expenditureCenters } = useSettings('खर्च केन्द्र', true);
  const { data: sources } = useSettings('स्रोत', true);
  const { data: units } = useSettings('इकाई', true);
  const { data: fiscalYears } = useSettings('आर्थिक वर्ष', true);


 const filteredsub_areas = sub_areas?.filter((sub_area: any) => {
  if (!formData.thematic_area) return true;
  const selectedThematicArea = thematicAreas?.find(
    (area: any) => area.id.toString() === formData.thematic_area
  );
  return (sub_area as any).thematic_area === selectedThematicArea?.id;
}) || [];

  console.log(filteredsub_areas)
  // Ward options with proper mapping
  const wardOptions = [
    { value: 1, label: 'वडा नं. - १' },
    { value: 2, label: 'वडा नं. - २' },
    { value: 3, label: 'वडा नं. - ३' },
    { value: 4, label: 'वडा नं. - ४' },
    { value: 5, label: 'वडा नं. - ५' },
    { value: 6, label: 'वडा नं. - ६' },
  ];

  const requiredFields = [
    'plan_name', 'thematic_area', 'sub_area', 'project_level', 'gps_coordinate',
    'expenditure_title', 'expenditure_center', 'proposed_amount', 'source',
    'ward_no', 'feasibility_study', 'detailed_study', 'environmental_study'
  ];


  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: any = {};
    let isValid = true;

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = true;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const apiMap: Record<string, string> = {
    ward_level: '/api/planning/plan-entry/',
    municipality_level: '/api/planning/plan-entry/',
    'ward_requested_thematic': '/api/planning/plan-entry/',
    thematic_committee: '/api/planning/plan-entry/',
    pride_project: '/api/planning/plan-entry/',
    provincial: '/api/planning/plan-entry/',
    federal: '/api/planning/plan-entry/'
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('access_token')
    if (!validateForm()) {
      console.log(formData)
      alert('कृपया सबै आवश्यक फिल्डहरू भर्नुहोस्।');
      return;
    }

    const endpoint = apiMap[type];
    if (!endpoint) {
      alert('अमान्य प्रकार! उचित API पत्ता लागेन।');
      return;
    }

    try {
      await axios.post(`http://localhost:8000${endpoint}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('योजना सफलतापूर्वक थपियो!');
      onClose(); // Close modal
    } catch (error) {
      console.error('API Error:', error);
      alert('योजना थप्न असफल भयो।');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">योजना तथा कार्यक्रमको विवरण</h2>
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                आर्थिक वर्ष <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.fiscal_year}
                onChange={handleInputChange}
                name="fiscal_year" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">आर्थिक वर्ष</option>
                {fiscalYears.map(year => (
                  <option key={year.id} value={year.id.toString()}>{year.year}</option>
                ))}
              </select>
            </div>            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1 cursor-pointer">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              योजना तथा कार्यक्रमको नाम <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="plan_name"
              value={formData.plan_name}
              onChange={handleInputChange}
              placeholder="योजना तथा कार्यक्रमको नाम"
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.projectName ? 'border-red-500' : 'border-gray-300'
                }`}
            />
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                विषयगत क्षेत्र <span className="text-red-500">*</span>
              </label>
              <select
                name="thematic_area"
                value={formData.thematic_area}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.thematic_area ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">विषयगत क्षेत्र</option>
                {thematicAreas?.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                उप-क्षेत्र <span className="text-red-500">*</span>
              </label>
              <select
                name="sub_area"
                value={formData.sub_area}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.sub_area ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">उप-क्षेत्र</option>
                {filteredsub_areas?.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                योजनाको स्तर <span className="text-red-500">*</span>
              </label>
              <select
                name="project_level"
                value={formData.project_level}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.plan_level ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">योजनाको स्तर</option>
                {projectLevels?.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                खर्च शीर्षक <span className="text-red-500">*</span>
              </label>
              <select
                name="expenditure_title"
                value={formData.expenditure_title}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.expenditure_title ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">खर्च शीर्षक</option>
                {expenditureTitles?.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                खर्च केन्द्र <span className="text-red-500">*</span>
              </label>
              <select
                name="expenditure_center"
                value={formData.expenditure_center}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.expenditure_center ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">खर्च केन्द्र</option>
                {expenditureCenters?.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                प्रस्तावित रकम रु. <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="proposed_amount"
                value={formData.proposed_amount}
                onChange={handleInputChange}
                placeholder="प्रस्तावित रकम"
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.proposed_amount ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                स्रोत <span className="text-red-500">*</span>
              </label>
              <select
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.source ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">स्रोत</option>
                {sources?.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                योजना सञ्चालन स्थान
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="योजना सञ्चालन स्थान"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                वडा नं. <span className="text-red-500">*</span>
              </label>
              <select
                name="ward_no"
                value={formData.ward_no}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.ward ? 'border-red-500' : 'border-gray-300'
                  }`}
              >
                <option value="">वडा</option>
                {wardOptions?.map((item: any) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                योजना सञ्चालन स्थानको GPS CO-ORDINATE
              </label>
              <input
                type="text"
                name="gps_coordinate"
                value={formData.gps_coordinate}
                onChange={handleInputChange}
                placeholder="योजना सञ्चालन स्थानको GPS CO-ORDINATE"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                सम्पन्न गर्ने परिणाम
              </label>
              <input
                type="text"
                name="expected_result"
                value={formData.expected_result}
                onChange={handleInputChange}
                placeholder="सम्पन्न गर्ने परिणाम"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ईकाइ
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">ईकाइ</option>
                {units?.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

            </div>
          </div>

          {/* Study Reports */}
          <div className="space-y-4">
            {/* Feasibility Study */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                (क) सम्भाव्यता अध्ययन प्रतिवेदन <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="feasibility_study"
                    value="भएको"
                    checked={formData.feasibility_study === 'भएको'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  भएको
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="feasibility_study"
                    value="नभएको"
                    checked={formData.feasibility_study === 'नभएको'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  नभएको
                </label>
              </div>
            </div>

            {/* Detailed Study */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                (ख) विस्तृत अध्ययन प्रतिवेदन <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="detailed_study"
                    value="भएको"
                    checked={formData.detailed_study === 'भएको'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  भएको
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="detailed_study"
                    value="नभएको"
                    checked={formData.detailed_study === 'नभएको'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  नभएको
                </label>
              </div>
            </div>

            {/* Environmental Study */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                (ग) वातावरणीय अध्ययन प्रतिवेदन <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="environmental_study"
                    value="भएको"
                    checked={formData.environmental_study === 'भएको'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  भएको
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="environmental_study"
                    value="नभएको"
                    checked={formData.environmental_study === 'नभएको'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  नभएको
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              कैफियत
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="कैफियत"
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            रद्द गर्नुहोस्
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
          >
            थप गर्नुहोस्
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddYojanaPravidhiModal;
