import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Eye,
    MoreVertical,
    Plus,
    Search,
    Edit3,
    Key,
    UserCheck,
    UserX,
    Trash2,
    Users,
    Filter,
    Download,
    RefreshCw
} from 'lucide-react';
import UserFormModal from '../components/UserFormModal';
import toast from 'react-hot-toast';
import type { User } from '../context/types';
import Swal from 'sweetalert2';


// Create a separate component for the UserRow to use hooks properly
const UserRow: React.FC<{
    user: User;
    index: number;
    setSelectedUser: (user: User) => void;
    setModalOpen: (open: boolean) => void;
    setEditMode: (mode: boolean) => void;
    setViewMode: (mode: boolean) => void;
    setResetPasswordUser: (user: User) => void;
    setShowPasswordModal: (show: boolean) => void;
    toggleUserStatus: (userId: number, newStatus: boolean) => void;
    deleteUser: (userId: number) => void;
    getRoleColor: (role: string) => string;
    handleResetPassword: (user: User) => void;
}> = ({
    user,
    index,
    setSelectedUser,
    setModalOpen,
    setEditMode,
    setViewMode,
    // setResetPasswordUser,
    // setShowPasswordModal,
    handleResetPassword,
    toggleUserStatus,
    deleteUser,
    getRoleColor
}) => {
        const [menuOpen, setMenuOpen] = useState(false);
        const menuRef = useRef<HTMLDivElement>(null);
console.log("delete",user)
        useEffect(() => {
            const handleOutsideClick = (e: MouseEvent) => {
                if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                    setMenuOpen(false);
                }
            };

            document.addEventListener('mousedown', handleOutsideClick);
            return () => document.removeEventListener('mousedown', handleOutsideClick);
        }, []);

        return (
            <tr key={user.user_id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 text-sm text-gray-900">{index + 1}</td>
                <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {user.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="font-medium text-gray-900">{user.full_name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                    </div>
                </td>
                <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                        {user.role}
                    </span>
                </td>
                <td className="py-4 px-6 text-sm text-gray-900">{user.phone}</td>
                <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                        वडा नं. {user.ward_no}
                    </span>
                </td>
                <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_active
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                        {user.is_active ? 'सक्रिय' : 'निष्क्रिय'}
                    </span>
                </td>
                <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                        <button
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            onClick={() => {
                                setEditMode(false);
                                setViewMode(true);
                                setSelectedUser(user);
                                setModalOpen(true);
                            }}
                            title="विवरण हेर्नुहोस्"
                        >
                            <Eye className="h-4 w-4" />
                        </button>
                        <div className="relative" ref={menuRef}>
                            <button
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                onClick={() => setMenuOpen(!menuOpen)}
                                title="अन्य विकल्प"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 top-10 z-50 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                                        <div className="text-xs text-gray-500">{user.email}</div>
                                    </div>

                                    <button
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors cursor-pointer"
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setEditMode(true);
                                            setViewMode(false);
                                            setModalOpen(true);
                                            setMenuOpen(false);
                                        }}
                                    >
                                        <Edit3 className="h-4 w-4 text-blue-600" />
                                        <span>सम्पादन गर्नुहोस्</span>
                                    </button>
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors cursor-pointer"
                                        onClick={() => {
                                            handleResetPassword(user);
                                            setMenuOpen(false);
                                        }}
                                    >
                                        <Key className="h-4 w-4 text-orange-600" />
                                        <span>पासवर्ड रिसेट गर्नुहोस्</span>
                                    </button>

                                    <button
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors cursor-pointer"
                                        onClick={async () => {
                                            const action = user.is_active ? 'निष्क्रिय' : 'सक्रिय';

                                            const result = await Swal.fire({
                                                title: `${user.full_name} लाई ${action} गर्नुहुन्छ?`,
                                                icon: 'warning',
                                                showCancelButton: true,
                                                confirmButtonColor: '#3085d6',
                                                cancelButtonColor: '#d33',
                                                confirmButtonText: 'हो',
                                                cancelButtonText: 'होइन',
                                            });

                                            if (result.isConfirmed) {
                                                toggleUserStatus(user.id, !user.is_active);
                                            }
                                            setMenuOpen(false);
                                        }}
                                    >
                                        {user.is_active ? (
                                            <UserX className="h-4 w-4 text-red-600" />
                                        ) : (
                                            <UserCheck className="h-4 w-4 text-green-600" />
                                        )}
                                        <span>
                                            {user.is_active ? 'निष्क्रिय गर्नुहोस्' : 'सक्रिय गर्नुहोस्'}
                                        </span>
                                    </button>

                                    <div className="border-t border-gray-100 mt-1 pt-1">
                                        <button
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 flex items-center gap-3 text-red-600 transition-colors cursor-pointer"
                                            onClick={async () => {
                                                const result = await Swal.fire({
                                                    title: `${user.full_name} लाई स्थायी रूपमा मेटाउनुहुन्छ?`,
                                                    text: 'यो कार्य फिर्ता गर्न सकिँदैन।',
                                                    icon: 'warning',
                                                    showCancelButton: true,
                                                    confirmButtonText: 'मेटाउनुहोस्',
                                                    cancelButtonText: 'रद्द गर्नुहोस्',
                                                });

                                                if (result.isConfirmed) {
                                                    await deleteUser(user.id);
                                                }
                                                setMenuOpen(false);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span>मेटाउनुहोस्</span>
                                        </button>

                                    </div>

                                    <div className="border-t border-gray-100 mt-1 pt-1">
                                        <button
                                            className="w-full text-center px-4 py-2 text-xs text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            रद्द गर्नुहोस्
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </td>
            </tr>
        );
    };

const getLoggedInUser = () => {
    try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch {
        return null;
    }
};


const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [filterRole, setFilterRole] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const loggedInUser = getLoggedInUser();
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('access_token');
            if (!token) {
                navigate('/login');
                return;
            }
            console.log(viewMode)

            const response = await axios.get('http://43.205.239.123/api/users/', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                console.warn('Unexpected response:', response.data);
                setUsers([]);
            }
        } catch (error: any) {
            console.error('Error fetching users:', error);
            setUsers([]);
            if (error.response?.status === 401) {
                localStorage.removeItem('access_token');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleUserStatus = async (userId: number, newStatus: boolean) => {
        try {
            const token = localStorage.getItem('access_token');
            await axios.patch(
                `http://43.205.239.123/api/users/${userId}/`,
                { is_active: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchUsers();
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    };

    const deleteUser = async (userId: number) => {
        try {
            const token = localStorage.getItem('access_token');
            await axios.delete(`http://43.205.239.123/api/users/${userId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleResetPassword = (user: User) => {
        setResetPasswordUser({
            ...user,
            isSelf: loggedInUser && user.user_id === loggedInUser.user_id
        });
        setShowPasswordModal(true);
    };

    // const resetPassword = async () => {
    //     if (!resetPasswordUser) return;

    //     try {

    //         const token = localStorage.getItem('access_token');
    //         console.log("reset user:", resetPasswordUser)

    //         const url = resetPasswordUser.isSelf
    //             ? `http://43.205.239.123/api/auth/reset-password/`
    //             : `http://43.205.239.123/api/auth/reset-password/${resetPasswordUser.id}/`;

    //         await axios.post(
    //             url,
    //             { new_password: newPassword },
    //             { headers: { Authorization: `Bearer ${token}` } }
    //         );

    //         toast.success('Password reset successfully!');
    //     } catch (error) {
    //         console.error('Error resetting password:', error);
    //         toast.error('Error resetting password');
    //     } finally {
    //         setShowPasswordModal(false);
    //         setNewPassword('');
    //         setResetPasswordUser(null);
    //     }
    // };

    const resetPassword = async () => {
        if (!resetPasswordUser) return;

        try {
            const token = localStorage.getItem('access_token');
            const url = resetPasswordUser.isSelf
                ? `http://43.205.239.123/api/auth/reset-password/`
                : `http://43.205.239.123/api/auth/reset-password/${resetPasswordUser.id}/`;

            await axios.post(
                url,
                { new_password: newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success('Password reset successfully!');
        } catch (error) {
            console.error('Error resetting password:', error);
            toast.error('Error resetting password');
        } finally {
            setShowPasswordModal(false);
            setNewPassword('');
            setResetPasswordUser(null);
        }
    };


    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter((user) => {
        const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'active' && user.is_active) ||
            (filterStatus === 'inactive' && !user.is_active);

        return matchesSearch && matchesRole && matchesStatus;
    });

    const getRoleColor = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'engineer':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'supervisor':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const uniqueRoles = [...new Set(users.map(user => user.role))];

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">प्रयोगकर्ता सुची</h1>
                                <p className="text-gray-500 mt-1">
                                    कुल {users.length} जना प्रयोगकर्ता मध्ये {filteredUsers.length} जना देखाइएको
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={fetchUsers}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors  cursor-pointer"
                                title="Refresh"
                            >
                                <RefreshCw className="h-5 w-5" />
                            </button>
                            <button
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                title="Export"
                            >
                                <Download className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters and Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="नाम वा इमेल खोज्नुहोस्..."
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Role Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <select
                                className="appearance-none pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[150px]"
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                            >
                                <option value="all">सबै भूमिका</option>
                                {uniqueRoles.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <select
                                className="appearance-none px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[120px]"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">सबै स्थिति</option>
                                <option value="active">सक्रिय</option>
                                <option value="inactive">निष्क्रिय</option>
                            </select>
                        </div>

                        {/* Add User Button */}
                        <button
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 cursor-pointer text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all shadow-sm hover:shadow-md"
                            onClick={() => {
                                setEditMode(false);
                                setViewMode(false);
                                setSelectedUser(null);
                                setModalOpen(true);
                            }}
                        >
                            <Plus className="h-4 w-4" />
                            प्रयोगकर्ता थप्नुहोस्
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">क्र.स.</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">प्रयोगकर्ता</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">भूमिका</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">सम्पर्क</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">वडा</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">स्थिति</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">कार्य</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredUsers.map((user, index) => (
                                        <UserRow
                                            key={user.user_id}
                                            user={user}
                                            index={index}
                                            setSelectedUser={setSelectedUser}
                                            setModalOpen={setModalOpen}
                                            setEditMode={setEditMode}
                                            setViewMode={setViewMode}
                                            setResetPasswordUser={setResetPasswordUser}
                                            setShowPasswordModal={setShowPasswordModal}
                                            toggleUserStatus={toggleUserStatus}
                                            deleteUser={deleteUser}
                                            getRoleColor={getRoleColor}
                                            handleResetPassword={handleResetPassword}

                                        />
                                    ))}
                                </tbody>
                            </table>

                            {filteredUsers.length === 0 && (
                                <div className="text-center py-12">
                                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">कुनै प्रयोगकर्ता फेला परेन</h3>
                                    <p className="text-gray-500">
                                        {searchTerm || filterRole !== 'all' || filterStatus !== 'all'
                                            ? 'फिल्टर मापदण्ड परिवर्तन गर्नुहोस् वा नयाँ प्रयोगकर्ता थप्नुहोस्।'
                                            : 'नयाँ प्रयोगकर्ता थप्न माथिको बटन प्रयोग गर्नुहोस्।'
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <UserFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                editMode={editMode}
                viewOnly={!editMode && selectedUser !== null}
                user={selectedUser}
                onSuccess={fetchUsers}
            />
            {showPasswordModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm">
                        <h2 className="text-lg font-semibold mb-4">Reset Password for {resetPasswordUser?.full_name}</h2>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowPasswordModal(false);
                                    setNewPassword('');
                                    setResetPasswordUser(null);
                                }}
                                className="px-4 py-2 text-sm text-gray-700 hover:underline cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={resetPassword}
                                disabled={!newPassword}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                            >
                                Confirm Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;