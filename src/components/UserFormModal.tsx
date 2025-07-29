import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';

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

export interface User {
  id?: number;
  full_name: string;
  last_name?: string;
  email: string;
  phone: string;
  role: (typeof roles)[number];
  ward_no: string;
  position?: string;
  mahashakha?: string;
  shakha?: string;
  ra_pr_stah?: string;
}

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
  name: keyof User;
  type?: string;
  required?: boolean;
};

const inputFields: InputField[] = [
  { label: 'नाम *', name: 'full_name', required: true },
  { label: 'थर', name: 'last_name' },
  { label: 'इमेल *', name: 'email', type: 'email', required: true },
  { label: 'फोन नम्बर *', name: 'phone', required: true },
  { label: 'पद', name: 'position' },
  { label: 'महाशाखा', name: 'mahashakha' },
  { label: 'शाखा', name: 'shakha' },
  { label: 'रा.प्र.स्था.', name: 'ra_pr_stah' },
];

const UserFormModal: React.FC<UserFormModalProps> = ({
  open,
  onClose,
  editMode,
  viewOnly = false,
  user,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<User>({
    full_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: '' as User['role'],
    ward_no: '',
    position: '',
    mahashakha: '',
    shakha: '',
    ra_pr_stah: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name ?? '',
        last_name: user.last_name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        role: user.role ?? '' as User['role'],
        ward_no: user.ward_no ?? '',
        position: user.position ?? '',
        mahashakha: user.mahashakha ?? '',
        shakha: user.shakha ?? '',
        ra_pr_stah: user.ra_pr_stah ?? '',
      });
    } else {
      setFormData({
        full_name: '',
        last_name: '',
        email: '',
        phone: '',
        role: '' as User['role'],
        ward_no: '',
        position: '',
        mahashakha: '',
        shakha: '',
        ra_pr_stah: '',
      });
    }
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      let url = 'http://213.199.53.33:8000/api/users/';
      let method: 'post' | 'put' = 'post';

      if (editMode && user?.id) {
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
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert('Error: ' + JSON.stringify(errorData));
        return;
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      alert('Submission error: ' + error.message);
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
