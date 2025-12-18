import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSettings } from '../hooks/useSetting';
import axios from 'axios';
import toast from 'react-hot-toast';
import { toNepaliNumber } from '../utils/formatters';

interface EditProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    projectData: any;
    projectType: "ward" | "municipality" | "thematic" | "ward_thematic" | "municipality-pride" | "provience-transfer-projects" | "federal-gov-projects" | "budget-committee" | "wardrecommend";
}

interface FormData {
    plan_name: string;
    thematic_area: string;
    sub_area: string;
    project_level: string;
    expenditure_title: string;
    expenditure_center: string;
    proposed_amount: string;
    source: string;
    ward_no: number[]; // Changed from string to number[]
    location: string;
    gps_coordinate: string;
    expected_output: string;
    unit: string;
    fiscal_year: string;
    feasibility_study: string;
    detailed_study: string;
    environmental_study: string;
    description: string;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({
    isOpen,
    onClose,
    onSave,
    projectData,
    projectType
}) => {
    const [formData, setFormData] = useState<FormData>({
        plan_name: '',
        thematic_area: '',
        sub_area: '',
        project_level: '',
        expenditure_title: '',
        expenditure_center: '',
        proposed_amount: '',
        source: '',
        ward_no: [], // Now an array
        location: '',
        gps_coordinate: '',
        expected_output: '',
        unit: '',
        fiscal_year: '',
        feasibility_study: '',
        detailed_study: '',
        environmental_study: '',
        description: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // NEW: file states
    const [feasibilityFile, setFeasibilityFile] = useState<File | null>(null);
    const [detailedFile, setDetailedFile] = useState<File | null>(null);
    const [environmentalFile, setEnvironmentalFile] = useState<File | null>(null);

    const [existingFeasibilityUrl, setExistingFeasibilityUrl] = useState<string | null>(null);
    const [existingDetailedUrl, setExistingDetailedUrl] = useState<string | null>(null);
    const [existingEnvironmentalUrl, setExistingEnvironmentalUrl] = useState<string | null>(null);

    // Fetch dynamic dropdown data
    const { data: thematicAreas } = useSettings('विषयगत क्षेत्र', true);
    const { data: sub_areas } = useSettings('उप-क्षेत्र', true);
    const { data: projectLevels } = useSettings('योजनाको स्तर', true);
    const { data: expenditureTitles } = useSettings('खर्च शिर्षक', true);
    const { data: expenditureCenters } = useSettings('खर्च केन्द्र', true);
    const { data: sources } = useSettings('स्रोत', true);
    const { data: units } = useSettings('इकाई', true);
    const { data: fiscalYears } = useSettings('आर्थिक वर्ष', true);

    // Ward options
    const wardOptions = [
        { value: 1, label: 'वडा नं. - १' },
        { value: 2, label: 'वडा नं. - २' },
        { value: 3, label: 'वडा नं. - ३' },
        { value: 4, label: 'वडा नं. - ४' },
        { value: 5, label: 'वडा नं. - ५' },
        { value: 6, label: 'वडा नं. - ६' },
    ];


    // Load project data when modal opens
    useEffect(() => {
        if (isOpen && projectData) {
            setFormData({
                plan_name: projectData.plan_name || '',
                thematic_area: projectData.thematic_area?.id?.toString() || '',
                sub_area: projectData.sub_area?.id?.toString() || '',
                project_level: projectData.project_level?.id?.toString() || '',
                expenditure_title: projectData.expenditure_title?.id?.toString() || '',
                expenditure_center: projectData.expenditure_center?.id?.toString() || '',
                proposed_amount: projectData.budget || '',
                source: projectData.source?.id?.toString() || '',
                ward_no: Array.isArray(projectData.ward_no) ?
                    projectData.ward_no.map(Number) :
                    projectData.ward_no ? [Number(projectData.ward_no)] : [], // Handle both array and single value                
                location: projectData.location || '',
                gps_coordinate: projectData.gps_coordinate || '',
                expected_output: projectData.expected_result || '',
                unit: projectData.unit?.id?.toString() || '',
                fiscal_year: projectData.fiscal_year?.id?.toString() || '', // Handle both object and null cases
                feasibility_study: projectData.feasibility_study || '',
                detailed_study: projectData.detailed_study || '',
                environmental_study: projectData.environmental_study || '',
                description: projectData.remarks || ''
            });

            setExistingFeasibilityUrl(projectData.feasibility_file || null);
            setExistingDetailedUrl(projectData.detailed_file || null);
            setExistingEnvironmentalUrl(projectData.environmental_file || null);

            // Optionally: reset files on open
            setFeasibilityFile(null);
            setDetailedFile(null);
            setEnvironmentalFile(null);
        }
    }, [isOpen, projectData]);

    // Filter sub-areas based on selected thematic area
    const filteredSubAreas = sub_areas?.filter((sub_area: any) => {
        if (!formData.thematic_area) return true;
        return sub_area.thematic_area?.toString() === formData.thematic_area;
    }) || [];

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value };
            if (field === 'thematic_area') {
                newData.sub_area = '';
            }
            return newData;
        });

        // If radio flipped to “नभएको”, clear file
        if (field === 'feasibility_study' && value === 'नभएको') {
            setFeasibilityFile(null);
        }
        if (field === 'detailed_study' && value === 'नभएको') {
            setDetailedFile(null);
        }
        if (field === 'environmental_study' && value === 'नभएको') {
            setEnvironmentalFile(null);
        }
    };

    const getApiEndpoint = () => {
        const baseUrl = '/api/planning';
        switch (projectType) {
            case 'ward':
                return `${baseUrl}/ward-office/ward-projects/${projectData.id}/`;
            case 'municipality':
                return `${baseUrl}/ward-office/municipality-projects/${projectData.id}/`;
            case 'thematic':
                return `${baseUrl}/thematic/thematic-plans/${projectData.id}/`;
            case 'ward_thematic':
                return `${baseUrl}/ward-office/ward-thematic-projects/${projectData.id}/`;
            case 'municipality-pride':
                return `${baseUrl}/municipality-pride-project/municipality-pride-projects/${projectData.id}/`;
            case 'provience-transfer-projects':
                return `${baseUrl}/budget-committee/provience-transfer-projects/${projectData.id}/`;
            case 'federal-gov-projects':
                return `${baseUrl}/budget-committee/federal-gov-projects/${projectData.id}/`;
            default:
                return '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('access_token');
            const endpoint = getApiEndpoint();
            if (!endpoint) {
                toast.error('अमान्य परियोजना प्रकार।');
                setIsSubmitting(false);
                return;
            }

            const payload = new FormData();

            payload.append('plan_name', formData.plan_name);
            payload.append(
                'thematic_area',
                formData.thematic_area ? String(parseInt(formData.thematic_area)) : ''
            );
            payload.append('sub_area', formData.sub_area ? String(parseInt(formData.sub_area)) : '');
            payload.append(
                'project_level',
                formData.project_level ? String(parseInt(formData.project_level)) : ''
            );
            payload.append(
                'expenditure_title',
                formData.expenditure_title ? String(parseInt(formData.expenditure_title)) : ''
            );
            payload.append(
                'expenditure_center',
                formData.expenditure_center ? String(parseInt(formData.expenditure_center)) : ''
            );
            payload.append(
                'proposed_amount',
                formData.proposed_amount ? String(parseFloat(formData.proposed_amount)) : ''
            );
            payload.append('source', formData.source ? String(parseInt(formData.source)) : '');
            formData.ward_no.forEach(w => payload.append('ward_no', String(w)));
            payload.append('location', formData.location);
            payload.append('gps_coordinate', formData.gps_coordinate);
            payload.append('expected_result', formData.expected_output);
            payload.append('unit', formData.unit ? String(parseInt(formData.unit)) : '');
            payload.append(
                'fiscal_year',
                formData.fiscal_year ? String(parseInt(formData.fiscal_year)) : ''
            );
            payload.append('feasibility_study', formData.feasibility_study);
            payload.append('detailed_study', formData.detailed_study);
            payload.append('environmental_study', formData.environmental_study);
            payload.append('remarks', formData.description);

            // attach files if any
            if (feasibilityFile && formData.feasibility_study === 'भएको') {
                payload.append('feasibility_file', feasibilityFile);
            }
            if (detailedFile && formData.detailed_study === 'भएको') {
                payload.append('detailed_file', detailedFile);
            }
            if (environmentalFile && formData.environmental_study === 'भएको') {
                payload.append('environmental_file', environmentalFile);
            }

            await axios.patch(endpoint, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('परियोजना सफलतापूर्वक अपडेट भयो!');
            onSave();
            onClose();
        } catch (error: any) {
            console.error('Error updating project:', error);
            const errorMessage =
                error.response?.data?.message || 'परियोजना अपडेट गर्न असफल भयो।';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">योजना सम्पादन गर्नुहोस्</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1 cursor-pointer">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Project Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            योजना तथा कार्यक्रमको नाम <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.plan_name}
                            onChange={(e) => handleInputChange('plan_name', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Row 1: Thematic Area, Sub-area, Level */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                विषयगत क्षेत्र <span className="text-red-500">*</span>
                            </label>
                            <select
                                required
                                value={formData.thematic_area}
                                onChange={(e) => handleInputChange('thematic_area', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                required
                                value={formData.sub_area}
                                onChange={(e) => handleInputChange('sub_area', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={!formData.thematic_area}
                            >
                                <option value="">उप-क्षेत्र</option>
                                {filteredSubAreas?.map((item: any) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                योजनाको स्तर
                            </label>
                            <select
                                value={formData.project_level}
                                onChange={(e) => handleInputChange('project_level', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                    {/* Row 2: Expenditure Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                खर्च शीर्षक <span className="text-red-500">*</span>
                            </label>
                            <select
                                required
                                value={formData.expenditure_title}
                                onChange={(e) => handleInputChange('expenditure_title', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                required
                                value={formData.expenditure_center}
                                onChange={(e) => handleInputChange('expenditure_center', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                required
                                value={formData.proposed_amount}
                                onChange={(e) => handleInputChange('proposed_amount', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Row 3: Source, Location, Ward */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                स्रोत <span className="text-red-500">*</span>
                            </label>
                            <select
                                required
                                value={formData.source}
                                onChange={(e) => handleInputChange('source', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                value={formData.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                वडा नं. <span className="text-red-500">*</span>
                            </label>
                            <select
                                required
                                multiple
                                value={formData.ward_no.map(String)} // Convert numbers to strings for comparison
                                onChange={(e) => {
                                    const selectedOptions = Array.from(e.target.selectedOptions);
                                    const selectedValues = selectedOptions.map(option => Number(option.value));
                                    setFormData(prev => ({ ...prev, ward_no: selectedValues }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-auto min-h-[42px]"
                            >
                                {wardOptions?.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                            {/* Display selected wards */}
                            {formData.ward_no.length > 0 && (
                                <div className="mt-2">
                                    <span className="text-sm text-gray-600">Selected: </span>
                                    {formData.ward_no.map(ward => (
                                        <span key={ward} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                                            {wardOptions.find(w => w.value === ward)?.label || `वडा ${ward}`}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Row 4: GPS, Output, Unit, Fiscal Year */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                GPS CO-ORDINATE
                            </label>
                            <input
                                type="text"
                                value={formData.gps_coordinate}
                                onChange={(e) => handleInputChange('gps_coordinate', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                सम्पन्न गर्ने परिणाम
                            </label>
                            <input
                                type="text"
                                value={formData.expected_output}
                                onChange={(e) => handleInputChange('expected_output', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ईकाइ
                            </label>
                            <select
                                value={formData.unit}
                                onChange={(e) => handleInputChange('unit', e.target.value)}
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                आर्थिक वर्ष <span className="text-red-500">*</span>
                            </label>
                            <select
                                required
                                value={formData.fiscal_year}
                                onChange={(e) => handleInputChange('fiscal_year', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">आर्थिक वर्ष</option>
                                {fiscalYears?.map((year: any) => (
                                    <option key={year.id} value={year.id.toString()}>
                                        {year.name || toNepaliNumber(year.year)} {/* Use whichever property exists */}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Study Reports */}
                    <div className="space-y-4">
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
                                        onChange={(e) => handleInputChange('feasibility_study', e.target.value)}
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
                                        onChange={(e) => handleInputChange('feasibility_study', e.target.value)}
                                        className="mr-2"
                                    />
                                    नभएको
                                </label>
                            </div>
                            {/* show existing file link if present */}
                            {existingFeasibilityUrl && (
                                <a
                                    href={existingFeasibilityUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 underline"
                                >
                                    पहिलेको फाइल हेर्नुहोस् / डाउनलोड गर्नुहोस्
                                </a>
                            )}

                            {formData.feasibility_study === 'भएको' && (
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,image/*"
                                    onChange={e =>
                                        setFeasibilityFile(e.target.files ? e.target.files[0] : null)
                                    }
                                    className="mt-1 block w-full text-sm text-gray-700"
                                />
                            )}
                        </div>

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
                                        onChange={(e) => handleInputChange('detailed_study', e.target.value)}
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
                                        onChange={(e) => handleInputChange('detailed_study', e.target.value)}
                                        className="mr-2"
                                    />
                                    नभएको
                                </label>
                            </div>
                            {/* show existing file link if present */}
                            {existingDetailedUrl && (
                                <a
                                    href={existingDetailedUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 underline"
                                >
                                    पहिलेको फाइल हेर्नुहोस् / डाउनलोड गर्नुहोस्
                                </a>
                            )}
                            {formData.detailed_study === 'भएको' && (
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,image/*"
                                    onChange={e =>
                                        setDetailedFile(e.target.files ? e.target.files[0] : null)
                                    }
                                    className="mt-1 block w-full text-sm text-gray-700"
                                />
                            )}
                        </div>

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
                                        onChange={(e) => handleInputChange('environmental_study', e.target.value)}
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
                                        onChange={(e) => handleInputChange('environmental_study', e.target.value)}
                                        className="mr-2"
                                    />
                                    नभएको
                                </label>
                            </div>
                            {/* show existing file link if present */}
                            {existingEnvironmentalUrl && (
                                <a
                                    href={existingEnvironmentalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 underline"
                                >
                                    पहिलेको फाइल हेर्नुहोस् / डाउनलोड गर्नुहोस्
                                </a>
                            )}
                            {formData.environmental_study === 'भएको' && (
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,image/*"
                                    onChange={e =>
                                        setEnvironmentalFile(e.target.files ? e.target.files[0] : null)
                                    }
                                    className="mt-1 block w-full text-sm text-gray-700"
                                />
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            कैफियत
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            rows={4}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            रद्द गर्नुहोस्
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50"
                        >
                            {isSubmitting ? 'अपडेट गर्दै...' : 'अपडेट गर्नुहोस्'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProjectModal;