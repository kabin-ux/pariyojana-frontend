import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import type { SettingsItem } from '../types/settings';
import { dependentDataApi } from '../services/settingsApi';
import { toNepaliNumber } from '../utils/formatters';

interface AddEditModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: Partial<SettingsItem>) => void;
    item?: SettingsItem | null;
    activeTab: string;
    mode: 'add' | 'edit';
}

const AddEditModal: React.FC<AddEditModalProps> = ({
    open,
    onClose,
    onSave,
    item,
    activeTab,
    mode
}) => {
    const [formData, setFormData] = useState<any>({});
    const [thematicAreas, setThematicAreas] = useState<any[]>([]);
    const [subThematicAreas, setSubThematicAreas] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            loadDependentData();
            if (mode === 'edit' && item) {
                // Convert is_active to status for form handling
                const formItem = { ...item, status: item.is_active };
                setFormData(formItem);
            } else {
                resetForm();
            }
        }
    }, [open, item, mode, activeTab]);

    const loadDependentData = async () => {
        try {
            if (activeTab === 'उप-क्षेत्र' || activeTab === 'समुह') {
                const areas = await dependentDataApi.getThematicAreas();
                setThematicAreas(areas);
            }
            if (activeTab === 'समुह') {
                const subAreas = await dependentDataApi.getSubThematicAreas();
                setSubThematicAreas(subAreas);
            }
        } catch (error) {
            console.error('Error loading dependent data:', error);
        }
    };

    const resetForm = () => {
        const defaultData: any = {
            name: '',
            status: true // This will be converted to is_active when saving
        };

        // Add tab-specific default fields
        switch (activeTab) {
            case 'विषयगत क्षेत्र':
                defaultData.committee_name = ''; // Changed from 'committee'
                break;
            case 'उप-क्षेत्र':
                defaultData.thematic_area = '';
                break;
            case 'समुह':
                defaultData.thematic_area = '';
                defaultData.sub_area = ''; // Changed from 'sub_thematic_area'
                break;
            case 'इकाई':
                defaultData.short_name = '';
                break;
            case 'आर्थिक वर्ष':
                defaultData.year = ''; // Changed from 'committee'
                break;
            case 'नमुनाहरु':
                defaultData.code = '';
                defaultData.title = '';
                break;
        }

        setFormData(defaultData);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Convert status back to is_active for API
            const apiData = { ...formData };
            if ('status' in apiData) {
                apiData.is_active = apiData.status;
                delete apiData.status;
            }
            onSave(apiData);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [field]: value
        }));
    };

    const renderFormFields = () => {
        switch (activeTab) {
            case 'विषयगत क्षेत्र':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                विषयगत क्षेत्रको नाम *
                            </label>
                            <input
                                type="text"
                                value={formData.name || ''}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                विषयगत समिति *
                            </label>
                            <input
                                type="text"
                                value={formData.committee_name || ''} // Changed from 'committee'
                                onChange={(e) => handleInputChange('committee_name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </>
                );

            case 'उप-क्षेत्र':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                विषयगत क्षेत्र *
                            </label>
                            <select
                                value={formData.thematic_area || ''}
                                onChange={(e) => handleInputChange('thematic_area', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="">छान्नुहोस्</option>
                                {thematicAreas.map((area) => (
                                    <option key={area.id} value={area.id}>
                                        {area.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                उप-क्षेत्रको नाम *
                            </label>
                            <input
                                type="text"
                                value={formData.name || ''}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </>
                );

            case 'समुह':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                विषयगत क्षेत्र *
                            </label>
                            <select
                                value={formData.thematic_area || ''}
                                onChange={(e) => handleInputChange('thematic_area', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="">छान्नुहोस्</option>
                                {thematicAreas.map((area) => (
                                    <option key={area.id} value={area.id}>
                                        {area.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                उप-क्षेत्र *
                            </label>
                            <select
                                value={formData.sub_area || ''} // Changed from 'sub_thematic_area'
                                onChange={(e) => handleInputChange('sub_area', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="">छान्नुहोस्</option>
                                {subThematicAreas
                                    .filter(subArea => !formData.thematic_area || subArea.thematic_area == formData.thematic_area)
                                    .map((subArea) => (
                                        <option key={subArea.id} value={subArea.id}>
                                            {subArea.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                समूहको नाम *
                            </label>
                            <input
                                type="text"
                                value={formData.name || ''}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </>
                );

            case 'इकाई':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                इकाइको नाम *
                            </label>
                            <input
                                type="text"
                                value={formData.name || ''}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                इकाइको संक्षिप्त नाम *
                            </label>
                            <input
                                type="text"
                                value={formData.short_name || ''}
                                onChange={(e) => handleInputChange('short_name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </>
                );
            case 'आर्थिक वर्ष':
                return (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            आर्थिक वर्ष *
                        </label>
                        <input
                            type="text"
                            value={toNepaliNumber (formData.year) || ''}
                            onChange={(e) => handleInputChange('year', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>
                );
            case 'नमुनाहरु':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                कोड *
                            </label>
                            <input
                                type="text"
                                value={formData.code || ''}
                                onChange={(e) => handleInputChange('code', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                शिर्षक *
                            </label>
                            <input
                                type="text"
                                value={formData.title || ''}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </>
                );

            default:
                return (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            नाम *
                        </label>
                        <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>
                );
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {mode === 'add' ? 'नयाँ प्रविष्टि थप्नुहोस्' : 'सम्पादन गर्नुहोस्'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {renderFormFields()}

                    {/* Status toggle for non-template tabs */}
                    {activeTab !== 'नमुनाहरु' && (
                        <div className="flex items-center space-x-3">
                            <label className="block text-sm font-medium text-gray-700">
                                स्थिति
                            </label>
                            <button
                                type="button"
                                onClick={() => handleInputChange('status', !formData.status)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.status ? 'bg-green-500' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.status ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    )}

                    <div className="flex items-center justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            रद्द गर्नुहोस्
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            <span>{loading ? 'सेभ गर्दै...' : 'सेभ गर्नुहोस्'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditModal;