import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { toNepaliNumber } from '../../utils/formatters';
import OperationSiteUploadModal from '../../modals/UploadSiteModal';

interface OperationLocationTabProps {
  project: any;
  operationLocation: any[];
  onLoadOperationDetails: () => void;
}

const OperationLocationTab: React.FC<OperationLocationTabProps> = ({
  project,
  operationLocation,
  onLoadOperationDetails
}) => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedSerialNo, setSelectedSerialNo] = useState<number | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">योजना संचालन स्थलको फोटो</h3>
        <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">क्र.स.</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">शीर्षक</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">फोटोहरु</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">अन्य</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {operationLocation.map((item, index) => (
                <tr key={item.serial_no} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-800">{toNepaliNumber(index + 1)}</td>
                  <td className="py-3 px-4 text-gray-800">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-800">
                    {item.photo ? (
                      <img
                        src={item.photo}
                        alt={item.title || 'uploaded photo'}
                        className="h-16 w-24 object-cover rounded-md border border-gray-300"
                      />
                    ) : (
                      <span className="text-gray-500 italic">फोटो उपलब्ध छैन</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-800 flex space-x-2">
                    <button
                      type="button"
                      className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition cursor-pointer"
                      onClick={() => {
                        setSelectedSerialNo(item.serial_no);
                        setShowLocationModal(true);
                      }}
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showLocationModal && selectedSerialNo && (
          <OperationSiteUploadModal
            onClose={() => {
              setShowLocationModal(false);
              onLoadOperationDetails();
            }}
            projectId={project.serial_number}
            serialNo={selectedSerialNo}
          />
        )}
      </div>
    </div>
  );
};

export default OperationLocationTab;