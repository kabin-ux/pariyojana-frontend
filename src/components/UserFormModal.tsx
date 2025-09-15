import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import type { User, UserRole } from '../context/types';
import toast from 'react-hot-toast';

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
    try {
      let url = 'https://www.bardagoriyapms.com/api/users/';
      let method: 'post' | 'put' = 'post';

      if (editMode && user?.id) { // Changed from id to user_id
        url += `${user.id}/`;
        method = 'put';
      }

      const token = localStorage.getItem('access_token');
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          // Include user_id if editing
          ...(editMode && user?.id && { id: user.id })
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error('Error: ' + JSON.stringify(errorData));
        return;
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error('Submission error: ' + error.message);
    }
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          padding: 20,
          borderRadius: 8,
          width: '500px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 0 10px rgba(0,0,0,0.3)',
        }}
      >
        <h2 style={{ marginBottom: 15 }}>
          {viewOnly ? 'प्रयोगकर्ता विवरण' : editMode ? 'प्रयोगकर्ता सम्पादन' : 'नयाँ प्रयोगकर्ता थप्नुहोस्'}
        </h2>

        <form onSubmit={handleSubmit}>
          {inputFields.map(({ label, name, required, type = 'text' }) => (
            <div key={name} className="mb-4">
              <label>
                {label}
                <input
                  type={type}
                  name={name}
                  value={formData[name] ?? ''}
                  onChange={handleChange}
                  required={required}
                  disabled={viewOnly}
                  style={{ width: '100%', padding: 8, marginBottom: 12 }}
                />
              </label>
            </div>
          ))}

          <div className="mb-4">
            <label>
              प्रयोगकर्ता भूमिका *
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                disabled={viewOnly}
                style={{ width: '100%', padding: 8, marginBottom: 12 }}
              >
                <option value="">-- भूमिका छान्नुहोस् --</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mb-4">
            <label>
              वडा नंं. *
              <input
                type="number"
                name="ward_no"
                value={formData.ward_no}
                onChange={handleChange}
                required
                min={1}
                disabled={viewOnly}
                style={{ width: '100%', padding: 8, marginBottom: 12 }}
              />
            </label>
          </div>

          <div className="flex justify-end mt-5 space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition cursor-pointer"
            >
              Cancel
            </button>
            {!viewOnly && (
              <button
                type="submit"
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition cursor-pointer"
              >
                {editMode ? 'Update' : 'Add'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;