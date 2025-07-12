import React, { useState, useEffect } from 'react';
import { Plus, Edit, Download, Copy } from 'lucide-react';
import axios from 'axios';
import DropdownMenu from './DropDownMenu';
import * as BS from 'bikram-sambat-js';
import { toNepaliNumber } from '../utils/formatters';

const initiationChoices = [
    "उपभोक्ता समिति मार्फत",
    "सिलबन्दि दरभाउपत्र मार्फत",
    "बोलपत्र मार्फत",
    "अमानत मार्फत",
    "सोझै खरिद"
];

interface InitiationProcessSectionProps {
    projectId: number;
}

const InitiationProcessSection: React.FC<InitiationProcessSectionProps> = ({ projectId }) => {
    const [initiationProcess, setInitiationProcess] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedMethod, setSelectedMethod] = useState<string>('');
    const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
    const [flags, setFlags] = useState({
        is_confirmed: false,
        has_consumer_committee: false,
        has_agreement: false,
        has_payment_installment: false,
    });

    const fetchInitiationProcess = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:8000/api/projects/${projectId}/initiation-process/`);
            setInitiationProcess(res.data);
        } catch (err) {
            console.error('Error fetching initiation process:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFinalConfirm = async () => {
        // Assuming you have the BS library properly imported
        const today = new Date(); // current Gregorian date

        const bsDate = BS.ADToBS(today); // Convert to BS
        try {
            await axios.post(`http://localhost:8000/api/projects/${projectId}/initiation-process/`, {
                project: projectId,
                initiation_method: selectedMethod,
                started_at: bsDate,
                ...flags
            });
            setSelectedMethod('');
            setFlags({
                is_confirmed: false,
                has_consumer_committee: false,
                has_agreement: false,
                has_payment_installment: false
            });
            setShowConfirmDialog(false);
            fetchInitiationProcess();
        } catch (err) {
            console.error('Error adding initiation process:', err);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:8000/api/projects/initiation/${id}/`);
            fetchInitiationProcess();
        } catch (err) {
            console.error('Error deleting initiation process:', err);
            alert('मेटाउन सकिएन');
        }
    };

    useEffect(() => {
        fetchInitiationProcess();
    }, [projectId]);

    if (loading) return (
        <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">लोड गर्दै...</span>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">सुरुको प्रक्रिया</h3>
                <div className="flex gap-2 items-center">
                    <select
                        className="border rounded-md px-3 py-2 text-sm"
                        value={selectedMethod}
                        onChange={(e) => {
                            setSelectedMethod(e.target.value);
                            if (e.target.value) setShowConfirmDialog(true);
                        }}
                    >
                        <option value="">प्रारम्भ विधि छान्नुहोस्</option>
                        {initiationChoices.map((choice, idx) => (
                            <option key={idx} value={choice}>{choice}</option>
                        ))}
                    </select>
                </div>
            </div>

            {showConfirmDialog && (
                <div className="p-4 border rounded bg-gray-50">
                    <h4 className="text-sm font-medium mb-2">विकल्पहरू चयन गर्नुहोस्:</h4>
                    <div className="space-y-2">
                        {Object.entries(flags).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={value}
                                    onChange={() => setFlags(prev => ({ ...prev, [key]: !prev[key as keyof typeof flags] }))}
                                />
                                <label className="text-sm">
                                    {{
                                        is_confirmed: 'पुष्टि',
                                        has_consumer_committee: 'उपभोक्ता समिति',
                                        has_agreement: 'सम्झौता',
                                        has_payment_installment: 'किस्ता भुक्तानी'
                                    }[key as keyof typeof flags]}
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button onClick={handleFinalConfirm} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer">सेभ गर्नुहोस्</button>
                        <button onClick={() => setShowConfirmDialog(false)} className="px-4 py-2 bg-gray-200 rounded-lg cursor-pointer">रद्द गर्नुहोस्</button>
                    </div>
                </div>
            )}

            {initiationProcess.length === 0 ? (
                <div className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-lg font-medium">सुरुको प्रक्रिया डाटा उपलब्ध छैन।</p>
                    </div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-medium text-gray-900">क्र.स.</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">प्रारम्भ विधि</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">प्रारम्भ मिति</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">पुष्टि</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">उपभोक्ता समिति</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">सम्झौता</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">किस्ता भुक्तानी</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">अन्य</th>
                            </tr>
                        </thead>
                        <tbody>
                            {initiationProcess.map((item, index) => (
                                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-900">{index + 1}</td>
                                    <td className="py-3 px-4 text-gray-900">{item.initiation_method}</td>
                                    <td className="py-3 px-4 text-gray-900">{item.started_at ? toNepaliNumber(new Date(item.started_at).toLocaleDateString()) : '-'}</td>
                                    <td className="py-3 px-4 text-gray-900">{item.is_confirmed ? '✓' : '✗'}</td>
                                    <td className="py-3 px-4 text-center">{item.has_consumer_committee ? '✓' : '✗'}</td>
                                    <td className="py-3 px-4 text-center">{item.has_agreement ? '✓' : '✗'}</td>
                                    <td className="py-3 px-4 text-center">{item.has_payment_installment ? '✓' : '✗'}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center space-x-2">
                                            <button className="text-blue-600 hover:text-blue-800 cursor-pointer">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="text-blue-600 hover:text-blue-800 cursor-pointer">
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <button className="text-blue-600 hover:text-blue-800 cursor-pointer">
                                                <Copy className="w-4 h-4" />
                                            </button>
                                            <DropdownMenu id={item.id} onDelete={handleDelete} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default InitiationProcessSection;
