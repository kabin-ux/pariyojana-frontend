import  { useEffect, useState } from 'react';
import { X, Eye, User, Clock, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/hooks';
import toast from 'react-hot-toast';

interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    role?: string;
    full_name?: string;
}

interface AuthenticationModalProps {
    onClose: () => void;
    documentData: any;
    projectIdNum: string | number;
    editMapCostId: string | number | null;
    onAuthenticationSent?: (data: any) => void;
}

export default function AuthenticationModal({
    onClose,
    documentData,
    projectIdNum,
    editMapCostId,
    onAuthenticationSent
}: AuthenticationModalProps) {
    const { user } = useAuth();

    const [currentModal, setCurrentModal] = useState('form');
    const [users, setUsers] = useState<User[]>([]);
    const [selectedChecker, setSelectedChecker] = useState<number | ''>('');
    const [selectedApprover, setSelectedApprover] = useState<number | ''>('');
    const [remarks, setRemarks] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem('access_token')
        try {
            const response = await fetch('http://213.199.53.33/api/users/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const userData = await response.json();
            setUsers(userData);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users');
        }
    };

    const handleSendAuthentication = async () => {
        if (!selectedChecker || !selectedApprover) {
            setError('कृपया चेक जाँच गर्ने र स्वीकृत गर्ने व्यक्ति छान्नुहोस्');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(
                `http://213.199.53.33/api/projects/${projectIdNum}/map-cost-estimate/${editMapCostId}/`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    },
                    body: JSON.stringify({
                        checker: selectedChecker,
                        approver: selectedApprover,
                        remarks: remarks,
                        uploader_name: user?.full_name
                    })
                }
            );

            if (!response.ok) {
                throw new Error('Failed to send for authentication');
            }

            const result = await response.json();
            console.log('Authentication sent successfully:', result);

            setCurrentModal('details');

            if (onAuthenticationSent) {
                onAuthenticationSent(result);
            }
        } catch (err) {
            console.error('Error sending authentication:', err);
            toast.error('प्रमाणीकरण पठाउन असफल भयो। कृपया पुनः प्रयास गर्नुहोस्।');
        } finally {
            setLoading(false);
        }
    };

    const getUserDisplayName = (user: User) => {
        const fullName = `${user.first_name} ${user.last_name}`.trim();
        return fullName || user.username;
    };

    const FormModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col" style={{ maxHeight: '90vh' }}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">प्रमाणीकरण प्रक्रिया</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto flex-grow">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-8">
                        {/* Left Section */}
                        <div className="flex-1">
                            <div className="mb-6">
                                <p className="text-gray-700 mb-4">{documentData.title}</p>
                                <button className="px-4 py-2 bg-orange-100 text-orange-600 rounded border border-orange-300 hover:bg-orange-200 transition-colors">
                                    {documentData?.status === 'pending' ? 'अपलोड गरिएको' : documentData?.status}
                                </button>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-700">फायललहरू :</span>
                                    <span className="text-gray-600">२०८२-०३-२१</span>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="text-blue-500 font-medium">{documentData.file}</div>
                                    <div className="flex items-center gap-2 ml-auto">
                                        <Eye size={16} className="text-gray-400" />
                                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                            <User size={16} className="text-gray-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-gray-700 font-medium mb-4">केफियत</h3>
                                <textarea
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="केफियत लेख्नुहोस..."
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">
                                    चेक जाँच गर्ने व्यक्ति: <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedChecker}
                                        onChange={(e) => setSelectedChecker(Number(e.target.value) || '')}
                                        className="w-full p-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    >
                                        <option value="">चेक जाँच गर्ने व्यक्ति छान्नुहोस्</option>
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.full_name} {user.role && `(${user.role})`}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">
                                    स्वीकृत गर्ने व्यक्ति: <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedApprover}
                                        onChange={(e) => setSelectedApprover(Number(e.target.value) || '')}
                                        className="w-full p-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    >
                                        <option value="">स्वीकृत गर्ने व्यक्ति छान्नुहोस्</option>
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.full_name} {user.role && `(${user.role})`}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="w-80">
                            <div className="mb-6">
                                <h3 className="text-gray-700 font-medium mb-4">अपलोड कर्ता :</h3>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                        <User size={20} className="text-gray-600" />
                                    </div>
                                    <span className="text-gray-800">{user?.full_name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fixed Footer with Button */}
                <div className="p-4 border-t bg-gray-50 sticky bottom-0">
                    <div className="flex justify-center">
                        <button
                            onClick={handleSendAuthentication}
                            disabled={loading || !selectedChecker || !selectedApprover}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'पठाउँदै...' : 'चेक जाँच गर्न पठाउनुहोस'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const DetailsModal = () => {
        const checkerUser = users.find(u => u.id === selectedChecker);
        console.log(checkerUser)
        const approverUser = users.find(u => u.id === selectedApprover);

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col" style={{ maxHeight: '90vh' }}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">प्रमाणीकरण प्रक्रिया</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="p-6 overflow-y-auto flex-grow">
                        <div className="flex gap-8">
                            {/* Left Section */}
                            <div className="flex-1">
                                <div className="mb-6">
                                    <p className="text-gray-700 mb-4">सम्बन्धित अध्यायन प्रतिवेदन : प्रमाणीकरण सम्बन्धी</p>
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                                        चेक जाँचको लागी पत्राइएको
                                    </button>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-700">फायललहरू :</span>
                                        <span className="text-gray-600">२०८२-०३-२७</span>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="text-blue-500 font-medium">committee-template-1_5.pdf</div>
                                        <div className="flex items-center gap-2 ml-auto">
                                            <Eye size={16} className="text-gray-400" />
                                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                                <User size={16} className="text-gray-600" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                            <User size={20} className="text-gray-600" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-800">Allan Saud</span>
                                            <span className="text-gray-500 text-sm ml-2">२०८२-०३-२७</span>
                                        </div>
                                        <button className="ml-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                                            सफलतापूर्वक पठाइएको
                                        </button>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <svg width="4" height="16" viewBox="0 0 4 16" fill="currentColor">
                                                <circle cx="2" cy="2" r="2" />
                                                <circle cx="2" cy="8" r="2" />
                                                <circle cx="2" cy="14" r="2" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Section */}
                            <div className="w-80">
                                <div className="mb-6">
                                    <h3 className="text-gray-700 font-medium mb-4">अपलोड कर्ता :</h3>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                            <User size={20} className="text-gray-600" />
                                        </div>
                                        <span className="text-gray-800">{user?.full_name}</span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-gray-700 font-medium mb-4">चेक जाँच गर्ने व्यक्ति :</h3>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                            <User size={20} className="text-gray-600" />
                                        </div>
                                        <span className="text-gray-800">
                                            {checkerUser ? getUserDisplayName(checkerUser) : 'Unknown'}
                                        </span>
                                        <Clock size={16} className="text-orange-500 ml-auto" />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-gray-700 font-medium mb-4">स्वीकृत गर्ने व्यक्ति :</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                            <User size={20} className="text-gray-600" />
                                        </div>
                                        <span className="text-gray-800">
                                            {approverUser ? getUserDisplayName(approverUser) : 'Unknown'}
                                        </span>
                                        <Clock size={16} className="text-orange-500 ml-auto" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fixed Footer with Button */}
                    <div className="p-4 border-t bg-gray-50 sticky bottom-0">
                        <div className="flex justify-center">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                बन्द गर्नुहोस्
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return currentModal === 'form' ? <FormModal /> : <DetailsModal />;
}