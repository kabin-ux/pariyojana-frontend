import React, { useEffect, useState } from 'react';
import { X, Download, User } from 'lucide-react';
import CitizenshipFileUploadModal from './CitizenshipFileUploadModal';

interface FormRow {
    id: number;
    post: string;
    full_name: string;
    gender: string;
    address: string;
    citizenship_no: string;
    contact_no: string;
    citizenshipCopy: string;
    citizenship_front?: File | null;
    citizenship_back?: File | null;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    rows: FormRow[];
    onSave: (rows: FormRow[]) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, rows, onSave }) => {
    const [formRows, setFormRows] = useState<FormRow[]>(rows);
    const [fileUploadModalOpen, setFileUploadModalOpen] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

    //  Reset form rows when modal opens/closes or rows prop changes
    useEffect(() => {
        if (isOpen) {
            setFormRows(rows);
            console.log(rows)
        }
    }, [isOpen, rows]);


    if (!isOpen) return null;

    // const handleAddMember = () => {
    //     const newId = Math.max(...formRows.map(row => row.id)) + 1;
    //     const newRow: FormRow = {
    //         id: newId,
    //         post: 'सदस्य',
    //         full_name: '',
    //         gender: '',
    //         address: '',
    //         citizenship_no: '',
    //         contact_no: '',
    //         citizenshipCopy: '',
    //         citizenship_front: null,
    //         citizenship_back: null
    //     };
    //     setFormRows(prev => [...prev, newRow]);
    // };

    const handleDeleteRow = (id: number) => {
        // Only allow deletion if it's a सदस्य position and there are more than the original rows
        const rowToDelete = formRows.find(row => row.id === id);
        if (rowToDelete && rowToDelete.post === 'सदस्य' && formRows.length > rows.length) {
            setFormRows(prev => prev.filter(row => row.id !== id));
        }
    };
    const handleInputChange = (id: number, field: keyof FormRow, value: string) => {
        setFormRows(prev =>
            prev.map(row =>
                row.id === id ? { ...row, [field]: value } : row
            )
        );
    };

    const handleFileUpload = (rowId: number) => {
        setSelectedRowId(rowId);
        setFileUploadModalOpen(true);
    };

    const handleSaveFiles = (rowId: number, frontFile: File | null, backFile: File | null) => {
        setFormRows(prev =>
            prev.map(row =>
                row.id === rowId ? {
                    ...row,
                    citizenship_front: frontFile,
                    citizenship_back: backFile,
                    citizenshipCopy: (frontFile || backFile) ? 'अपलोड गरिएको' : ''
                } : row
            )
        );
    };

    const handleSave = () => {
        onSave(formRows);
        onClose();
    };

    const getSelectedRow = () => {
        return formRows.find(row => row.id === selectedRowId);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-4 overflow-auto max-h-[calc(90vh-120px)]">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700">क्र.स</th>
                                    <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700">पद</th>
                                    <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700">नाम थर</th>
                                    <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700">लिंग</th>
                                    <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700">ठेगाना</th>
                                    <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700">नागरिकता प्र. नं.</th>
                                    <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700">सम्पर्क नं.</th>
                                    <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700">नागरिकता प्रतिलिपी</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formRows.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 p-2">
                                            <div className="text-sm text-gray-700 text-center">{row.id}</div>
                                        </td>
                                        <td className="border border-gray-300 p-2">
                                            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm font-medium">
                                                {row.post}
                                            </div>
                                        </td>
                                        <td className="border border-gray-300 p-2">
                                            <input
                                                type="text"
                                                value={row.full_name}
                                                onChange={(e) => handleInputChange(row.id, 'full_name', e.target.value)}
                                                placeholder="नाम थर"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="border border-gray-300 p-2">
                                            <select
                                                value={row.gender}
                                                onChange={(e) => handleInputChange(row.id, 'gender', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">लिंग</option>
                                                <option value="पुरुष">पुरुष</option>
                                                <option value="महिला">महिला</option>
                                                <option value="अन्य">अन्य</option>
                                            </select>
                                        </td>
                                        <td className="border border-gray-300 p-2">
                                            <input
                                                type="text"
                                                value={row.address}
                                                onChange={(e) => handleInputChange(row.id, 'address', e.target.value)}
                                                placeholder="ठेगाना"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="border border-gray-300 p-2">
                                            <input
                                                type="text"
                                                value={row.citizenship_no}
                                                onChange={(e) => handleInputChange(row.id, 'citizenship_no', e.target.value)}
                                                placeholder="नागरिकता प्र. नं."
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="border border-gray-300 p-2">
                                            <input
                                                type="text"
                                                value={row.contact_no}
                                                onChange={(e) => handleInputChange(row.id, 'contact_no', e.target.value)}
                                                placeholder="सम्पर्क नं."
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </td>
                                      {/* // Update the file upload button display */}
                                        <td className="border border-gray-300 p-2">
                                            <button
                                                onClick={() => handleFileUpload(row.id)}
                                                className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${row.citizenship_front || row.citizenship_back
                                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                                    } transition-colors`}
                                            >
                                                <Download size={14} />
                                                {row.citizenship_front || row.citizenship_back ? 'अपडेट गर्नुहोस्' : 'फाइल अपलोड'}
                                            </button>
                                            {(row.citizenship_front || row.citizenship_back) && (
                                                <div className="text-xs mt-1 ${
      row.citizenship_front && row.citizenship_back 
        ? 'text-green-600' 
        : 'text-yellow-600'
    }">
                                                    {row.citizenship_front && row.citizenship_back
                                                        ? 'दुवै फाइल अपलोड गरिएको'
                                                        : 'एक फाइल अपलोड गरिएको'}
                                                </div>
                                            )}
                                        </td>
                                        <td className="border border-gray-300 p-2">
                                            {row.post === 'सदस्य' && formRows.length > rows.length && (
                                                <button
                                                    onClick={() => handleDeleteRow(row.id)}
                                                    className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors cursor-pointer"
                                                >
                                                    <X size={12} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>                    
                </div>

                <CitizenshipFileUploadModal
                    isOpen={fileUploadModalOpen}
                    onClose={() => setFileUploadModalOpen(false)}
                    rowId={selectedRowId || 0}
                    onSaveFiles={handleSaveFiles}
                    frontFile={getSelectedRow()?.citizenship_front}
                    backFile={getSelectedRow()?.citizenship_back}
                />

                <div className="flex items-center justify-between p-4 border-t bg-gray-50">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User size={16} />
                        <span>श्रम मन्त्रालय</span>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            रद्द गर्नुहोस
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
                        >
                            सेभ गर्नुहोस
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;