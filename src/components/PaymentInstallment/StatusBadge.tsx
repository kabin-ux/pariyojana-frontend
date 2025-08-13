import React from 'react';

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'अपलोड गरिएको':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'in-progress':
            case 'प्रगतिमा':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'pending':
            case 'बाँकी':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
            {status}
        </span>
    );
};

export default StatusBadge;