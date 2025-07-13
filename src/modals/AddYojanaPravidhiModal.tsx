import React, { useState } from 'react';
import { X } from 'lucide-react';

interface FormData {
  projectName: string;
  department: string;
  subDepartment: string;
  projectLevel: string;
  expenditure: string;
  expenditureCenter: string;
  approvedAmount: string;
  source: string;
  implementationLocation: string;
  ward: string;
  gpsCoordinate: string;
  completionPeriod: string;
  unit: string;
  feasibilityStudy: string;
  detailedStudy: string;
  environmentalStudy: string;
  description: string;
}

interface ValidationErrors {
  [key: string]: boolean;
}

const AddYojanaPravidhiModal: React.FC = ({onClose}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    projectName: '',
    department: '',
    subDepartment: '',
    projectLevel: '',
    expenditure: '',
    expenditureCenter: '',
    approvedAmount: '',
    source: '',
    implementationLocation: '',
    ward: '',
    gpsCoordinate: '',
    completionPeriod: '',
    unit: '',
    feasibilityStudy: '',
    detailedStudy: '',
    environmentalStudy: '',
    description: ''
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const requiredFields = [
    'projectName', 'department', 'subDepartment', 'projectLevel', 
    'expenditure', 'expenditureCenter', 'approvedAmount', 'source', 
    'ward', 'feasibilityStudy', 'detailedStudy', 'environmentalStudy'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    requiredFields.forEach(field => {
      if (!formData[field as keyof FormData]) {
        newErrors[field] = true;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      alert('कृपया सबै आवश्यक फिल्डहरू भर्नुहोस्।');
      return;
    }

    console.log('Form submitted:', formData);
    alert('योजना सफलतापूर्वक थपियो!');
    setIsOpen(false);
  };

  const handleClose = () => {
    onClose()
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">योजना तथा कार्यक्रमको विवरण</h2>
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 px-3 py-2 rounded text-sm">
              आर्थिक बर्ष: २०७९/८०
            </div>
            <button 
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              योजना तथा कार्यक्रमको नाम <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleInputChange}
              placeholder="योजना तथा कार्यक्रमको नाम"
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.projectName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                विभागगत क्षेत्र <span className="text-red-500">*</span>
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.department ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">विभागगत क्षेत्र</option>
                <option value="agriculture">कृषि</option>
                <option value="education">शिक्षा</option>
                <option value="health">स्वास्थ्य</option>
                <option value="infrastructure">पूर्वाधार</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                उप-क्षेत्र <span className="text-red-500">*</span>
              </label>
              <select
                name="subDepartment"
                value={formData.subDepartment}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.subDepartment ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">उप-क्षेत्र</option>
                <option value="primary">प्राथमिक</option>
                <option value="secondary">माध्यमिक</option>
                <option value="tertiary">तृतीयक</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                योजनाको स्तर <span className="text-red-500">*</span>
              </label>
              <select
                name="projectLevel"
                value={formData.projectLevel}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.projectLevel ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">योजनाको स्तर</option>
                <option value="federal">संघीय</option>
                <option value="provincial">प्रदेशीय</option>
                <option value="local">स्थानीय</option>
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
                name="expenditure"
                value={formData.expenditure}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.expenditure ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">खर्च शीर्षक</option>
                <option value="current">चालु</option>
                <option value="capital">पूँजीगत</option>
                <option value="financing">वित्तिय</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                खर्च केन्द्र <span className="text-red-500">*</span>
              </label>
              <select
                name="expenditureCenter"
                value={formData.expenditureCenter}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.expenditureCenter ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">खर्च केन्द्र</option>
                <option value="center1">केन्द्र १</option>
                <option value="center2">केन्द्र २</option>
                <option value="center3">केन्द्र ३</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                प्रस्तावित रकम रु. <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="approvedAmount"
                value={formData.approvedAmount}
                onChange={handleInputChange}
                placeholder="प्रस्तावित रकम"
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.approvedAmount ? 'border-red-500' : 'border-gray-300'
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
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.source ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">स्रोत</option>
                <option value="government">सरकारी</option>
                <option value="donor">दातृ</option>
                <option value="private">निजी</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                योजना सञ्चालन स्थान
              </label>
              <input
                type="text"
                name="implementationLocation"
                value={formData.implementationLocation}
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
                name="ward"
                value={formData.ward}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.ward ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">वडा नं.</option>
                <option value="1">वडा नं. १</option>
                <option value="2">वडा नं. २</option>
                <option value="3">वडा नं. ३</option>
                <option value="4">वडा नं. ४</option>
                <option value="5">वडा नं. ५</option>
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
                name="gpsCoordinate"
                value={formData.gpsCoordinate}
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
                name="completionPeriod"
                value={formData.completionPeriod}
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
                <option value="pieces">थान</option>
                <option value="meters">मिटर</option>
                <option value="liters">लिटर</option>
                <option value="kg">केजी</option>
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
                    name="feasibilityStudy"
                    value="yes"
                    checked={formData.feasibilityStudy === 'yes'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  भएको
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="feasibilityStudy"
                    value="no"
                    checked={formData.feasibilityStudy === 'no'}
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
                    name="detailedStudy"
                    value="yes"
                    checked={formData.detailedStudy === 'yes'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  भएको
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="detailedStudy"
                    value="no"
                    checked={formData.detailedStudy === 'no'}
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
                    name="environmentalStudy"
                    value="yes"
                    checked={formData.environmentalStudy === 'yes'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  भएको
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="environmentalStudy"
                    value="no"
                    checked={formData.environmentalStudy === 'no'}
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

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            रद्द गर्नुहोस्
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            थप गर्नुहोस्
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddYojanaPravidhiModal;