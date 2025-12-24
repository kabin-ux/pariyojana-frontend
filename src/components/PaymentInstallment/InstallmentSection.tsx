import React from 'react';
import { Upload, FileCheck, Eye } from 'lucide-react';
import { toNepaliNumber } from '../../utils/formatters';
import * as BS from 'bikram-sambat-js';
import axios from 'axios';
import toast from 'react-hot-toast';

interface InstallmentSectionProps {
  title: string;
  installmentData: any[];
  project: any;
  type: 'first' | 'second' | 'third';
  refetch: () => void;
}

const InstallmentSection: React.FC<InstallmentSectionProps> = ({
  title,
  installmentData,
  project,
  type,
  refetch
}) => {
  const today = new Date();
  const bsDate = BS.ADToBS(today);

  const getFileType = (fileName?: string): 'pdf' | 'image' | null => {
    if (!fileName) return null;
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension === 'pdf' ? 'pdf' : 'image';
  };

  const handleFilePreview = (item: any) => {
    if (!item.file_url && !item.file_uploaded_name) return;

    const url = item.file_url || item.file_uploaded_name;
    const fileType = getFileType(item.file_uploaded_name || item.file_url);

    if (fileType === 'pdf') {
      // Open PDF in new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      // Open image in new tab (or you could add modal preview here)
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleFileUpload = async (file: File, serial_no: number) => {
    try {
      const token = localStorage.getItem('access_token');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('serial_no', serial_no.toString());
      formData.append('project_id', project.serial_number.toString());

      let endpoint = '';
      switch (type) {
        case 'first':
          endpoint = 'first-installment';
          break;
        case 'second':
          endpoint = 'second-installment';
          break;
        case 'third':
          endpoint = 'third-installment';
          break;
      }

      await axios.post(
        `https://www.bardagoriyapms.com/api/projects/${endpoint}/${project.serial_number}/upload/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      refetch();
      toast.success(`${title} अपलोड सफल भयो।`);
    } catch (error) {
      console.error(`${title} upload failed:`, error);
      toast.error(`${title} अपलोड गर्न समस्या भयो।`);
    }
  };

  const handleDownloadPDF = async (serial_no: number) => {
    try {
      let endpoint = '';
      switch (type) {
        case 'first':
          endpoint = 'first-installment';
          break;
        case 'second':
          endpoint = 'second-installment';
          break;
        case 'third':
          endpoint = 'third-installment';
          break;
      }

      const response = await axios.get(
        `https://www.bardagoriyapms.com/api/projects/${endpoint}/generate-pdf/${serial_no}/${project.serial_number}/`,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-installment-${serial_no}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF download failed:', error);
      toast.error('डाउनलोड गर्न समस्या भयो।');
    }
  };

  const hasFileUploaded = (item: any) => {
    return !!(item.file_uploaded_name || item.file_url);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">क्र.स.</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">शीर्षक</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">मिति</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">स्थिति</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">अन्य</th>
            </tr>
          </thead>
          <tbody>
            {installmentData?.map((item) => (
              <tr key={item.serial_no} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900">{toNepaliNumber(item.serial_no)}</td>
                <td className="py-3 px-4 text-gray-900 text-sm">
                  <div>{item.title}</div>
                  <div className="text-gray-600 text-xs mt-1">{item.description}</div>
                </td>
                <td className="py-3 px-4 text-gray-900 text-sm">{toNepaliNumber(bsDate)}</td>
                <td className="py-3 px-4 text-gray-900 text-sm">
                  {hasFileUploaded(item) ? 'फाइल अपलोड गरिएको' : 'बाँकी'}
                </td>
                <td className="py-3 px-4 text-gray-900 text-sm flex space-x-2">
                  <input
                    type="file"
                    id={`file-input-${item.serial_no}`}
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file, item.serial_no);
                      }
                    }}
                  />

                  <button
                    type="button"
                    className="p-1 rounded text-blue-600 hover:text-blue-800 cursor-pointer"
                    onClick={() => document.getElementById(`file-input-${item.serial_no}`)?.click()}
                  >
                    <Upload className="w-4 h-4" />
                  </button>

                  {/* Eye button - only show when file uploaded */}
                  {hasFileUploaded(item) && (
                    <button
                      type="button"
                      className="p-1 rounded text-purple-600 hover:text-purple-800 cursor-pointer"
                      onClick={() => handleFilePreview(item.file_uploaded_name)}
                      title="फाइल हेर्नुहोस्"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    className="p-1 rounded text-blue-600 hover:text-blue-800 cursor-pointer"
                    onClick={() => handleDownloadPDF(item.serial_no)}
                  >
                    <FileCheck className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstallmentSection;
