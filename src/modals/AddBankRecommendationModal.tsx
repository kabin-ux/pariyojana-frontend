import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, File, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

interface FormData {
    fileName: string;
    uploadedFile: File | null;
    description: string;
    bank_account_number: string;
}

interface AddDocumentModalProps {
    onSave: (data: any) => void;
    onClose: () => void;
    documentData?: any;
    projectId: number;
    isAccountPhoto?: boolean;
}

const AddBankRecommendationModal: React.FC<AddDocumentModalProps> = ({
    onSave,
    onClose,
    documentData,
    projectId,
    isAccountPhoto = false,
}) => {
    const [formData, setFormData] = useState<FormData>({
        fileName: 'बैंक खाता सञ्चालन सिफारिस',
        uploadedFile: null,
        description: '',
        bank_account_number: '',
    });

    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Pre-fill form on edit
    useEffect(() => {
        if (documentData) {
            setFormData({
                fileName: documentData.title || 'बैंक खाता सञ्चालन सिफारिस',
                uploadedFile: null,
                description: documentData.remarks || '',
                bank_account_number: documentData.bank_account_number || '',
            });
        }
    }, [documentData]);

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleFileUpload = (check_photo: File) => {
        if (check_photo.size > 10 * 1024 * 1024) {
            toast.error('फाइल साइज 10MB भन्दा बढी हुन सक्दैन।');
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'];
        if (!allowedTypes.includes(check_photo.type)) {
            toast.error('केवल JPEG, PNG, PDF, र MP4 फाइलहरू मात्र अपलोड गर्न सकिन्छ।');
            return;
        }

        setFormData((prev) => ({
            ...prev,
            uploadedFile: check_photo,
        }));
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === 'dragenter' || e.type === 'dragover');
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleCancel = () => {
        setFormData({ fileName: '', uploadedFile: null, description: '', bank_account_number: '' });
        onClose();
    };

    const handleSubmit = () => {
        if (isAccountPhoto) {
            // Validation for account photo
            if (!formData.bank_account_number.trim()) {
                toast.error('खाता नम्बर आवश्यक छ।');
                return;
            }
        } else {
            // Validation for bank recommendation
            if (!formData.fileName.trim()) {
                toast.error('फाइलको नाम आवश्यक छ।');
                return;
            }
        }

        const dataToSend = isAccountPhoto ? {
            bank_account_number: formData.bank_account_number,
            file: formData.uploadedFile,
            remarks: formData.description,
            project: projectId.toString(),
        } : {
            title: formData.fileName,
            file: formData.uploadedFile,
            remarks: formData.description,
            project: projectId.toString(),
        };

        onSave(dataToSend);

        // Clear the form after saving
        setFormData({
            fileName: '',
            uploadedFile: null,
            description: '',
            bank_account_number: '',
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {isAccountPhoto ? 'खाता फोटो अपलोड गर्नुहोस्' : 'बैंक खाता सञ्चालन सिफारिस अपलोड गर्नुहोस्'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-6">
                    {/* Title/Account Number Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {isAccountPhoto ? 'खाता नम्बर' : 'फाइलको नाम'} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={isAccountPhoto ? formData.bank_account_number : formData.fileName}
                            onChange={(e) => handleInputChange(isAccountPhoto ? 'bank_account_number' : 'fileName', e.target.value)}
                            placeholder={isAccountPhoto ? 'खाता नम्बर लेख्नुहोस्...' : 'फाइलको नाम लेख्नुहोस्...'}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {isAccountPhoto ? 'चेकको फोटो अपलोड गर्नुहोस्' : 'फाइल अपलोड गर्नुहोस्'}
                            {documentData ? '' : <span className="text-red-500">*</span>}
                        </label>
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center ${dragActive
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 bg-gray-50'
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={isAccountPhoto ? ".jpg,.jpeg,.png" : ".jpg,.jpeg,.png,.pdf,.mp4"}
                                onChange={handleFileInputChange}
                                className="hidden"
                            />

                            {formData.uploadedFile ? (
                                <div className="space-y-2">
                                    {isAccountPhoto ? (
                                        <Camera className="w-12 h-12 text-green-500 mx-auto" />
                                    ) : (
                                        <File className="w-12 h-12 text-green-500 mx-auto" />
                                    )}
                                    <p className="text-sm">{formData.uploadedFile.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {(formData.uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                    <button onClick={handleUploadClick} className="text-blue-600 text-sm cursor-pointer">
                                        अर्को फाइल छान्नुहोस्
                                    </button>
                                </div>
                            ) : documentData?.file ? (
                                <div className="space-y-2">
                                    {isAccountPhoto ? (
                                        <Camera className="w-12 h-12 text-blue-500 mx-auto" />
                                    ) : (
                                        <File className="w-12 h-12 text-blue-500 mx-auto" />
                                    )}
                                    <p className="text-sm text-gray-700">
                                        हालको फाइल: {documentData.file.split('/').pop()}
                                    </p>
                                    <button
                                        onClick={handleUploadClick}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                                    >
                                        फाइल परिवर्तन गर्नुहोस्
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                                        {isAccountPhoto ? (
                                            <Camera className="w-8 h-8 text-blue-600" />
                                        ) : (
                                            <Upload className="w-8 h-8 text-blue-600" />
                                        )}
                                    </div>
                                    <p className="text-gray-700 font-medium">
                                        {isAccountPhoto ? 'फोटो अपलोड गर्न यहाँ क्लिक गर्नुहोस्' : 'फाइल अपलोड गर्न यहाँ क्लिक गर्नुहोस्'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {isAccountPhoto ? 'JPEG, PNG, max 10 MB' : 'JPEG, PNG, PDF, MP4, max 10 MB'}
                                    </p>
                                    <button
                                        onClick={handleUploadClick}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                                    >
                                        फाइल छान्नुहोस्
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Remarks */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {isAccountPhoto ? 'टिप्पणी' : 'कैफियत'}
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder={isAccountPhoto ? 'टिप्पणी लेख्नुहोस्...' : 'कैफियत लेख्नुहोस्...'}
                            rows={4}
                            className="w-full px-3 py-2 border rounded-md resize-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                    <button
                        onClick={handleCancel}
                        className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                    >
                        रद्द गर्नुहोस्
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 cursor-pointer"
                    >
                        {documentData ? 'अपडेट गर्नुहोस्' : 'सेभ गर्नुहोस्'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddBankRecommendationModal;