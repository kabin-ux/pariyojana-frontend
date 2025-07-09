import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface ProjectFormData {
  name: string;
  sector: string;
  subSector: string;
  source: string;
  costCenter: string;
  budget: string;
  wardNo: string;
  implementationLocation: string;
  gpsCoordinates: string;
  totalEstimatedCost: string;
  fiscalYear: string;
  description: string;
}

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
  initialData?: Partial<ProjectFormData>;
  mode: 'add' | 'edit';
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode
}) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    sector: '',
    subSector: '',
    source: '',
    costCenter: '',
    budget: '',
    wardNo: '',
    implementationLocation: '',
    gpsCoordinates: '',
    totalEstimatedCost: '',
    fiscalYear: '२०८१/८२',
    description: ''
  });

  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  // Options for dropdowns
  const sectorOptions = [
    'सामाजिक विकास',
    'सुशासन तथा संस्थागत विकास',
    'आर्थिक विकास',
    'पूर्वाधार विकास'
  ];

  const subSectorOptions = {
    'सामाजिक विकास': [
      'महिला, बालबालिका तथा समाज कल्याण',
      'युवा तथा खेलकुद',
      'शिक्षा',
      'स्वास्थ्य'
    ],
    'सुशासन तथा संस्थागत विकास': [
      'संस्थागत क्षमता विकास',
      'न्याय तथा कानून व्यवस्था'
    ],
    'आर्थिक विकास': [
      'कृषि',
      'उद्योग तथा व्यापार',
      'पर्यटन'
    ],
    'पूर्वाधार विकास': [
      'यातायात',
      'सञ्चार',
      'ऊर्जा'
    ]
  };

  const sourceOptions = [
    'नेपाल सरकार (संघीय)',
    'प्रदेश सरकार',
    'आन्तरिक',
    'दातृ निकाय'
  ];

  const costCenterOptions = [
    'केन्द्र',
    'वडा'
  ];

  const wardOptions = [
    'वडा नं. - १',
    'वडा नं. - २',
    'वडा नं. - ३',
    'वडा नं. - ४',
    'वडा नं. - ५',
    'वडा नं. - ६',
    'वडा नं. - ७',
    'वडा नं. - ८',
    'वडा नं. - ९'
  ];

  const fiscalYearOptions = [
    '२०८१/८२',
    '२०८०/८१',
    '२०७९/८०'
  ];

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  const handleDropdownToggle = (dropdown: string) => {
    setDropdownOpen(dropdownOpen === dropdown ? null : dropdown);
  };

  const handleOptionSelect = (field: keyof ProjectFormData, value: string) => {
    handleInputChange(field, value);
    setDropdownOpen(null);
  };

  const DropdownField = ({ 
    label, 
    field, 
    options, 
    required = false, 
    placeholder 
  }: {
    label: string;
    field: keyof ProjectFormData;
    options: string[];
    required?: boolean;
    placeholder: string;
  }) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => handleDropdownToggle(field)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between"
        >
          <span className={formData[field] ? 'text-gray-900' : 'text-gray-400'}>
            {formData[field] || placeholder}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
        {dropdownOpen === field && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleOptionSelect(field, option)}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            योजना तथा कार्यक्रमको विवरण
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              आर्थिक वर्ष: {formData.fiscalYear}
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              योजना तथा कार्यक्रमको नाम <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="योजना तथा कार्यक्रमको नाम"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DropdownField
              label="विषयगत क्षेत्र"
              field="sector"
              options={sectorOptions}
              required
              placeholder="विषयगत क्षेत्र"
            />
            <DropdownField
              label="उप-क्षेत्र"
              field="subSector"
              options={formData.sector ? subSectorOptions[formData.sector] || [] : []}
              required
              placeholder="उप-क्षेत्र"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                योजनाको स्तर
              </label>
              <input
                type="text"
                value={formData.implementationLocation}
                onChange={(e) => handleInputChange('implementationLocation', e.target.value)}
                placeholder="योजनाको स्तर"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DropdownField
              label="खर्च शीर्षक"
              field="costCenter"
              options={costCenterOptions}
              placeholder="खर्च शीर्षक"
            />
            <DropdownField
              label="खर्च केन्द्र"
              field="source"
              options={sourceOptions}
              placeholder="खर्च केन्द्र"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                विनियोजित रकम रु. <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                placeholder="विनियोजित रकम"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DropdownField
              label="स्रोत"
              field="source"
              options={sourceOptions}
              placeholder="स्रोत"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                योजना संचालन स्थान
              </label>
              <input
                type="text"
                value={formData.implementationLocation}
                onChange={(e) => handleInputChange('implementationLocation', e.target.value)}
                placeholder="योजना संचालन स्थान"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <DropdownField
              label="वडा नं."
              field="wardNo"
              options={wardOptions}
              required
              placeholder="वडा नं."
            />
          </div>

          {/* Fourth Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                योजना संचालन स्थानको GPS CO-ORDINATE
              </label>
              <input
                type="text"
                value={formData.gpsCoordinates}
                onChange={(e) => handleInputChange('gpsCoordinates', e.target.value)}
                placeholder="योजना संचालन स्थानको GPS CO-ORDINATE"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                समग्र लागत परिणाम
              </label>
              <input
                type="text"
                value={formData.totalEstimatedCost}
                onChange={(e) => handleInputChange('totalEstimatedCost', e.target.value)}
                placeholder="समग्र लागत परिणाम"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <DropdownField
              label="ईकाइ"
              field="fiscalYear"
              options={fiscalYearOptions}
              placeholder="ईकाइ"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              कैफियत
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="कैफियत"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              रद्द गर्नुहोस्
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              जेष गर्नुहोस्
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Example usage component
const AddEditProjectModal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [editData, setEditData] = useState<Partial<ProjectFormData> | undefined>();

  const handleAddProject = () => {
    setMode('add');
    setEditData(undefined);
    setIsModalOpen(true);
  };

  const handleEditProject = () => {
    setMode('edit');
    setEditData({
      name: 'IMS-Test',
      sector: 'सामाजिक विकास',
      subSector: 'महिला, बालबालिका तथा समाज कल्याण',
      source: 'नेपाल सरकार (संघीय)',
      costCenter: 'वडा',
      budget: '६,००,००,०००.००',
      wardNo: 'वडा नं. - १'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (data: ProjectFormData) => {
    console.log('Form submitted:', data);
    // Here you would typically send the data to your backend
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">परियोजना व्यवस्थापन</h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex space-x-4">
            <button
              onClick={handleAddProject}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              नयाँ परियोजना थप्नुहोस्
            </button>
            
            <button
              onClick={handleEditProject}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
            >
              परियोजना सम्पादन गर्नुहोस्
            </button>
          </div>
        </div>

        <ProjectFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          initialData={editData}
          mode={mode}
        />
      </div>
    </div>
  );
};

export default AddEditProjectModal;