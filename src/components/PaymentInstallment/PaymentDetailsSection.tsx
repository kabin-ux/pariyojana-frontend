import React, { useState } from 'react';
import { toNepaliNumber } from '../../utils/formatters';
import PaymentDetailModal from '../../modals/AddPaymentDetailsModal';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FileCheck, Upload } from 'lucide-react';
import * as BS from 'bikram-sambat-js';

interface PaymentDetailsSectionProps {
    paymentDetails: any[];
    project: any;
    refetch: () => void;
}

const PaymentDetailsSection: React.FC<PaymentDetailsSectionProps> = ({
    paymentDetails,
    project,
    refetch
}) => {
    const [isPaymentDetailModalOpen, setPaymentDetailModalOpen] = useState(false);
  const today = new Date();
    const bsDate = BS.ADToBS(today);

    const totalPaid = paymentDetails?.reduce(
        (sum, item) => sum + Number(item.amount_paid || 0),
        0
    ) ?? 0;

    const totalPercent = paymentDetails.reduce(
        (sum, item) => sum + (Number(item.payment_percent) || 0),
        0
    );

    const maxProgress = paymentDetails.reduce((max, item) => Math.max(max, item.physical_progress || 0), 0);
    const remainingAmount = parseFloat(String(project.budget ?? '0')) - totalPaid;

    const savePaymentDetails = async (data: any) => {
        try {
            const token = localStorage.getItem('access_token');
            const url = `/api/projects/${project.serial_number}/payment-details/`;

            await axios.post(url, {
                title: data.title,
                amount_paid: data.amount_paid,
                payment_percent: data.payment_percent,
                physical_progress: data.physical_progress,
                agreement_amount: data.agreement_amount
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            toast.success('भुक्तानी विवरण सफलतापूर्वक थपियो');
            refetch();
            setPaymentDetailModalOpen(false);
        } catch (error) {
            console.error('Payment details submission failed:', error);
            toast.error('भुक्तानी विवरण सेभ गर्न सकिएन');
        }
    };

    const handlePayment = async (projectId: number) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get(
                `/api/projects/installment/payment/project/${projectId}/pdf/`,
                {
                    responseType: 'blob',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const file = new Blob([response.data], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
        } catch (error) {
            console.error('Failed to fetch payment PDF:', error);
            toast.error('भुक्तानी विवरण डाउनलोड गर्न सकिएन');
        }
    };

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">भुक्तानी सम्बन्धी विवरण</h3>
            <div className="overflow-x-auto">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <button
                        type="button"
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition cursor-pointer"
                        onClick={() => setPaymentDetailModalOpen(true)}
                    >
                        नयाँ प्रविष्टी गर्नुहोस
                    </button>
                    <button
                        type="button"
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
                        onClick={() => handlePayment(project.serial_number)}
                    >
                        भुक्तानी विवरण
                    </button>
                </div>

                <table className="min-w-full rounded-lg shadow-sm">
                    <thead className="bg-gray-100">
                        <tr className="text-sm font-semibold text-gray-700">
                            <th className="text-left py-3 px-4">क्र.स.</th>
                            <th className="text-left py-3 px-4">शीर्षक</th>
                            <th className="text-left py-3 px-4">जारी मिति</th>
                            <th className="text-left py-3 px-4">भुक्तानी गरिएको रकम</th>
                            <th className="text-left py-3 px-4">भुक्तनी प्रतिशत (%)</th>
                            <th className="text-left py-3 px-4">भौतिक प्रगती (%)</th>
                            <th className="text-left py-3 px-4">अन्य</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paymentDetails.map((item, index) => (
                            <tr
                                key={item.serial_no}
                                className={`text-sm text-gray-800 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    } hover:bg-blue-50`}
                            >
                                <td className="py-3 px-4">{toNepaliNumber(item.id)}</td>
                                <td className="py-3 px-4">{item.title}</td>
                                <td className="py-3 px-4">{toNepaliNumber(bsDate)}</td>
                                <td className="py-3 px-4">{toNepaliNumber(item.amount_paid)}</td>
                                <td className="py-3 px-4">{toNepaliNumber(item.payment_percent)}%</td>
                                <td className="py-3 px-4">
                                    {toNepaliNumber(item.physical_progress ?? 0)}%
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center space-x-3">
                                        <button
                                            type="button"
                                            title="Upload File"
                                            className="text-blue-600 hover:text-blue-800 transition cursor-pointer"
                                            onClick={() => console.log("Upload clicked")}
                                        >
                                            <Upload className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            title="Download PDF"
                                            className="text-blue-600 hover:text-blue-800 transition cursor-pointer"
                                            onClick={() => console.log("Download PDF clicked")}
                                        >
                                            <FileCheck className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-gray-600 mb-1">कुल भुक्तानी गरिएको रकम:</p>
                        <p className="text-lg font-semibold">रु. {toNepaliNumber(totalPaid?.toFixed(2))}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-1">कुल भुक्तानी हुन बाकी रकम:</p>
                        <p className="text-lg font-semibold">रु. {toNepaliNumber(remainingAmount?.toFixed(2))}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-1">कुल भुक्तनी प्रतिशत (%):</p>
                        <p className="text-lg font-semibold">
                            {toNepaliNumber(totalPercent?.toFixed(2))}%
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-1">कुल भौतिक प्रगती (%):</p>
                        <p className="text-lg font-semibold">{toNepaliNumber(maxProgress)}%</p>
                    </div>
                </div>
            </div>

            {isPaymentDetailModalOpen && (
                <PaymentDetailModal
                    onClose={() => setPaymentDetailModalOpen(false)}
                    onSave={savePaymentDetails}
                    usedTitles={paymentDetails.map(p => p.title)}
                    initialData={{
                        title: '',
                        amount_paid: '',
                        payment_percent: 0,
                        physical_progress: 0,
                        agreement_amount: project.budget || 0
                    }}
                />
            )}
        </div>
    );
};

export default PaymentDetailsSection;