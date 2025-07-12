import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, File } from 'lucide-react';

interface FormData {
    fileName: string;
    uploadedFile: File | null;
    description: string;
}

interface AddDocumentModalProps {
    onSave: (data: any) => void;
    onClose: () => void;
    documentData?: any; // optional, for edit mode
    projectId: number;
}

const AddDocumentModal: React.FC<AddDocumentModalProps> = ({
    onSave,
    onClose,
    documentData,
    projectId,
}) => {
    const [formData, setFormData] = useState<FormData>({
        fileName: '',
        uploadedFile: null,
        description: '',
    });

    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 🔄 Pre-fill form on edit
    useEffect(() => {
        if (documentData) {
            setFormData({
                fileName: documentData.title || '',
                uploadedFile: null,
                description: documentData.remarks || '',
            });
        }
    }, [documentData]);

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleFileUpload = (file: File) => {
        if (file.size > 10 * 1024 * 1024) {
            alert('फाइल साइज 10MB भन्दा बढी हुन सक्दैन।');
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'];
        if (!allowedTypes.includes(file.type)) {
            alert('केवल JPEG, PNG, PDF, र MP4 फाइलहरू मात्र अपलोड गर्न सकिन्छ।');
            return;
        }

        setFormData((prev) => ({
            ...prev,
            uploadedFile: file,
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
        setFormData({ fileName: '', uploadedFile: null, description: '' });
        onClose();
    };

    const handleSubmit = () => {
        if (!formData.fileName.trim()) {
            alert('फाइलको नाम आवश्यक छ।');
            return;
        }

        const dataToSend = {
            title: formData.fileName,
            file: formData.uploadedFile, // can be null if no change
            remarks: formData.description,
            project: projectId.toString(),
        };

        onSave(dataToSend); // Let parent decide if it's add/edit

        // Clear the form after saving
        setFormData({
            fileName: '',
            uploadedFile: null,
            description: '',
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">अन्य डकुमेन्टहरू सम्बन्धी विवरण</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-6">
                    {/* File Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            फाइलको नाम <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.fileName}
                            onChange={(e) => handleInputChange('fileName', e.target.value)}
                            placeholder="फाइलको नाम"
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            फाइल अपलोड गर्नुहोस् {documentData ? '' : <span className="text-red-500">*</span>}
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
                                accept=".jpg,.jpeg,.png,.pdf,.mp4"
                                onChange={handleFileInputChange}
                                className="hidden"
                            />

                            {formData.uploadedFile ? (
                                <div className="space-y-2">
                                    <File className="w-12 h-12 text-green-500 mx-auto" />
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
                                    <File className="w-12 h-12 text-blue-500 mx-auto" />
                                    <p className="text-sm text-gray-700">हालको फाइल: {documentData.file}</p>
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
                                        <Upload className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <p className="text-gray-700 font-medium">फाइल अपलोड गर्न यहाँ क्लिक गर्नुहोस्</p>
                                    <p className="text-sm text-gray-500">JPEG, PNG, PDF, MP4, max 10 MB</p>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">कैफियत</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="कैफियत लेख्नुहोस्..."
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
                        सेभ गर्नुहोस्
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddDocumentModal;
