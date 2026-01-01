import React from 'react';
import { X } from 'lucide-react';
import { toNepaliNumber } from '../../utils/formatters';

interface NewProjectForm {
  project_name: string;
  thematic_area: string;
  sub_area: string;
  project_level: string;
  expenditure_title: string;
  expenditure_center: string;
  budget: string;
  source: string;
  operation_location: string;
  ward_no: number[]; // Changed from string to string[]
  location_gps: string;
  outcome: string;
  unit: string;
  description: string;
  fiscal_year: string;
}

interface ProjectFormProps {
  isOpen: boolean;
  formData: NewProjectForm;
  isSubmitting: boolean;
  editingProjectId: number | null;
  thematicAreas: any[];
  sub_areas: any[];
  projectLevels: any[];
  expenditureTitles: any[];
  expenditureCenters: any[];
  sources: any[];
  units: any[];
  fiscalYears: any[];
  wardOptions: { value: number; label: string }[];
  filteredsub_areas: any[];
  onInputChange: (field: keyof NewProjectForm, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onWardNoChange: (wards: number[]) => void; // Add this new prop
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  isOpen,
  formData,
  isSubmitting,
  editingProjectId,
  thematicAreas,
  projectLevels,
  expenditureTitles,
  expenditureCenters,
  sources,
  units,
  fiscalYears,
  wardOptions,
  filteredsub_areas,
  onInputChange,
  onSubmit,
  onCancel,
  onWardNoChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">योजना तथा कार्यक्रमको विवरण</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">आर्थिक वर्ष: २०८२/८३</span>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              योजना तथा कार्यक्रमको नाम <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.project_name}
              onChange={(e) => onInputChange('project_name', e.target.value)}
              placeholder="योजना तथा कार्यक्रमको नाम"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Row 1: area, Sub-area, Level */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                विषयगत क्षेत्र <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.thematic_area}
                onChange={(e) => onInputChange('thematic_area', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">विषयगत क्षेत्र</option>
                {thematicAreas.map(area => (
                  <option key={area.id} value={area.id.toString()}>{area.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                उप-क्षेत्र <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.sub_area}
                onChange={(e) => onInputChange('sub_area', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!formData.thematic_area}
              >
                <option value="">उप-क्षेत्र</option>
                {filteredsub_areas.map(sub_area => (
                  <option key={sub_area.id} value={sub_area.id.toString()}>{sub_area.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                योजनाको स्तर
              </label>
              <select
                value={formData.project_level}
                onChange={(e) => onInputChange('project_level', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">योजनाको स्तर</option>
                {projectLevels.map(level => (
                  <option key={level.id} value={level.id.toString()}>{level.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Expenditure Title, Cost Center, Amount, Fiscal Year */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                खर्च शिर्षक
              </label>
              <select
                value={formData.expenditure_title}
                onChange={(e) => onInputChange('expenditure_title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">खर्च शिर्षक</option>
                {expenditureTitles.map(title => (
                  <option key={title.id} value={title.id.toString()}>{title.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                खर्च केन्द्र <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.expenditure_center}
                onChange={(e) => onInputChange('expenditure_center', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">खर्च केन्द्र</option>
                {expenditureCenters.map(center => (
                  <option key={center.id} value={center.id.toString()}>{center.name}</option>
                ))}
              </select>
            </div>

            <div className='hidden'>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                बजेट रु. <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name='budget'
                value={formData.budget}
                onChange={(e) => onInputChange('budget', e.target.value)}
                placeholder="बजेट"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                आर्थिक वर्ष <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.fiscal_year}
                onChange={(e) => onInputChange('fiscal_year', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">आर्थिक वर्ष</option>
                {fiscalYears.map(year => (
                  <option key={year.id} value={year.id.toString()}>{toNepaliNumber(year.year)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Source, Operation Location, Ward No */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                स्रोत <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.source}
                onChange={(e) => onInputChange('source', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">स्रोत</option>
                {sources.map(source => (
                  <option key={source.id} value={source.id.toString()}>{source.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                योजना संचालन स्थान
              </label>
              <input
                type="text"
                value={formData.operation_location}
                onChange={(e) => onInputChange('operation_location', e.target.value)}
                placeholder="योजना संचालन स्थान"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                वडा नं.
              </label>
              <div className="grid grid-cols-3 gap-2">
                {wardOptions.map((ward) => (
                  <label key={ward.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={ward.value}
                      checked={formData.ward_no.includes(ward.value)}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        const newWardNos = e.target.checked
                          ? [...formData.ward_no, value]
                          : formData.ward_no.filter((w) => w !== value);
                        onWardNoChange(newWardNos);
                      }}
                      className="accent-blue-500"
                    />
                    <span className="text-sm">{ward.label}</span>
                  </label>
                ))}
              </div>

              {formData.ward_no.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.ward_no.map((ward) => (
                    <span
                      key={ward}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {wardOptions.find((w) => w.value === ward)?.label || ward}
                    </span>
                  ))}
                </div>
              )}
            </div>


          </div>

          {/* Row 4: GPS, Expected Result, Unit */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                योजना संचालन स्थानको GPS CO-ORDINATE
              </label>
              <input
                type="text"
                value={formData.location_gps}
                onChange={(e) => onInputChange('location_gps', e.target.value)}
                placeholder="योजना संचालन स्थानको GPS CO-ORDINATE"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                गर्नु पर्ने कार्य
              </label>
              <input
                type="text"
                value={formData.outcome}
                onChange={(e) => onInputChange('outcome', e.target.value)}
                placeholder="गर्नु पर्ने कार्य"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ईकाइ
              </label>
              <select
                value={formData.unit}
                onChange={(e) => onInputChange('unit', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">ईकाइ</option>
                {units.map(unit => (
                  <option key={unit.id} value={unit.id.toString()}>{unit.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              कैफियत
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => onInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="विस्तृत विवरण..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              रद्द गर्नुहोस्
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (editingProjectId ? 'अपडेट गर्दै...' : 'थप्दै...') : (editingProjectId ? 'अपडेट गर्नुहोस्' : 'थप गर्नुहोस्')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;