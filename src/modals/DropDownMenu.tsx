import React, { useState } from 'react';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

interface DropdownMenuProps {
  id: number;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ id, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(id);
    } else {
      console.log('Edit item:', id);
    }
    setIsOpen(false);
  };

  const handleDelete = () => {
    Swal.fire({
      title: 'पक्का हुनुहुन्छ?',
      text: 'के तपाईं यो मेटाउन चाहनुहुन्छ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'हो, मेटाउनुहोस्!',
      cancelButtonText: 'रद्द गर्नुहोस्',
    }).then((result) => {
      if (result.isConfirmed) {
        if (onDelete) {
          onDelete(id);
        } else {
          console.log('Delete item:', id);
        }
        setIsOpen(false);
        Swal.fire('मेटाइयो!', 'तपाईंको डेटा मेटाइयो।', 'success');
      }
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 text-gray-400 hover:text-gray-600"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <button
              onClick={handleEdit}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <Edit className="w-3 h-3" />
              <span>सम्पादन</span>
            </button>
            <button
              onClick={handleDelete}
              className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
            >
              <Trash2 className="w-3 h-3" />
              <span>मेटाउनुहोस्</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DropdownMenu;