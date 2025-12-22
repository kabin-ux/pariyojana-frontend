import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import type { User, UserRole } from '../context/types';
import toast from 'react-hot-toast';
import axios from 'axios';

// Define roles here since it's used in the component
const roles = [
  'admin',
  'planning section',
  'ward/office seceratery',
  'engineer',
  'ward engineer',
  'user committee',
  'Data Entry',
  'Department chief',
] as const;

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  editMode: boolean;
  viewOnly?: boolean;
  user: User | null;
  onSuccess: () => void;
}

type InputField = {
  label: string;
  name: keyof Omit<User, 'id' | 'is_active' | 'isSelf'>; // Exclude non-form fields
  type?: string;
  required?: boolean;
};

const inputFields: InputField[] = [
  { label: 'नाम *', name: 'full_name', required: true },
  { label: 'इमेल *', name: 'email', type: 'email', required: true },
  { label: 'फोन नम्बर *', name: 'phone', required: true },
  { label: 'पद', name: 'position' },
  { label: 'महाशाखा', name: 'department' },
  { label: 'शाखा', name: 'section' },
  { label: 'रा.प्र.स्था.', name: 'administrative_level' },
];

const UserFormModal: React.FC<UserFormModalProps> = ({
  open,
  onClose,
  editMode,
  viewOnly = false,
  user,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<Omit<User, 'id' | 'is_active' | 'isSelf'>>({
    full_name: '',
    email: '',
    phone: '',
    role: '' as UserRole,
    ward_no: '',
    position: '',
    department: '',
    section: '',
    administrative_level: '',
  });
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        role: user.role ?? '' as UserRole,
        ward_no: user.ward_no ?? '',
        position: user.position ?? '',
        department: user.department ?? '',
        section: user.section ?? '',
        administrative_level: user.administrative_level ?? '',
      });
    } else {
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        role: '' as UserRole,
        ward_no: '',
        position: '',
        department: '',
        section: '',
        administrative_level: '',
      });
    }
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let url = "http://213.199.53.33:81/api/users/";
      let method: "post" | "put" = "post";

      if (editMode && user?.id) {
        url += `${user.id}/`;
        method = "put";
      }

      const token = localStorage.getItem("access_token");

      await axios({
        url,
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          ...formData,
          ...(editMode && user?.id && { id: user.id }),
        },
      });

      toast.success(editMode ? "प्रयोगकर्ता अपडेट भयो" : "नयाँ प्रयोगकर्ता थपियो");
      onSuccess();
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        role: '' as UserRole,
        ward_no: '',
        position: '',
        department: '',
        section: '',
        administrative_level: '',
      })
      onClose();
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        toast.error(
          "Error: " +
          (error.response?.data
            ? JSON.stringify(error.response.data)
            : error.message)
        );
      } else {
        toast.error("Submission error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };



  if (!open) return null;

  return (
    open && (
      <div
        className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b px-6 py-4">
            <h2 className="text-lg font-semibold">
              {viewOnly ? 'प्रयोगकर्ता विवरण' : editMode ? 'प्रयोगकर्ता सम्पादन' : 'नयाँ प्रयोगकर्ता थप्नुहोस्'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            {inputFields.map(({ label, name, required, type = 'text' }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={formData[name] ?? ''}
                  onChange={handleChange}
                  required={required}
                  disabled={viewOnly}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
            ))}

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">प्रयोगकर्ता भूमिका *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                disabled={viewOnly}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">-- भूमिका छान्नुहोस् --</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Ward */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">वडा नंं. *</label>
              <input
                type="number"
                name="ward_no"
                value={formData.ward_no}
                onChange={handleChange}
                required
                min={1}
                disabled={viewOnly}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-2 border-t pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                रद्द गर्नुहोस्
              </button>
              {!viewOnly && (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {loading ? 'पर्खनुहोस्...' : editMode ? 'अपडेट गर्नुहोस्' : 'सेभ गर्नुहोस्'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    )
  );

};

export default UserFormModal;