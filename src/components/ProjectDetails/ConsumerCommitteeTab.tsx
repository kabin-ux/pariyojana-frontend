import React, { useState } from 'react';
import { Plus, Edit, Upload, DownloadCloud, FileMinusIcon, Trash2 } from 'lucide-react';
import { toNepaliNumber } from '../../utils/formatters';
import ConsumerCommitteeDialog from '../../modals/ConsumerCommitteeDialog';
import Modal from '../../modals/AddOfficialDetailandMonitoringModal';
import EmptyState from './EmptyState';
import * as BS from 'bikram-sambat-js';

interface FormRow {
  id: number;
  post: string;
  full_name: string;
  gender: string;
  address: string;
  citizenship_no: string;
  contact_no: string;
  citizenshipCopy: string;
  citizenship_front?: File | null;
  citizenship_back?: File | null;
}

interface ConsumerCommitteeTabProps {
  project: any;
  committeeDetail: any;
  officialDetails: any[];
  monitoringCommittee: any[];
  onSave: (data: any) => void;
  onSavePosition: (rows: FormRow[]) => void;
  onSaveResearch: (rows: FormRow[]) => void;
  onDelete: (id: number, type: 'official' | 'monitoring' | 'document') => void;
  onDownload: (itemSerialNo: number, projectSerialNo: number) => void;
}

const CONSUMER_COMMITTEE_TITLES = [
  { "serial_no": 1, "title": "योजना संचालन पुस्तिका विवरण पृष्ट" },
  { "serial_no": 2, "title": "उपभोक्ता समिति गठन विधि एवं प्रकृया" },
  { "serial_no": 3, "title": "उपभोत्ता समिति गठन गर्ने सम्बन्धी सुचना" },
  { "serial_no": 4, "title": "उपभोत्ता समितिको काम कर्तव्य र अधिकारको विवरण" },
  { "serial_no": 5, "title": "आम भेलाको माईनियुट (उपभोक्ता समिति गठन गर्दा छलफल तथा भेलाका विषयबस्तुहरु)" },
  { "serial_no": 6, "title": "उपभोक्ता समिति गठन गरि पठाइएको बारे (प्रतीनिधीले वडा कार्यालयलाई पेस गर्ने निवेदन )" },
];

const ConsumerCommitteeTab: React.FC<ConsumerCommitteeTabProps> = ({
  project,
  committeeDetail,
  officialDetails,
  monitoringCommittee,
  onSave,
  onSavePosition,
  onSaveResearch,
  onDelete,
  onDownload
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
  const [isResearchModalOpen, setIsResearchModalOpen] = useState(false);

  const today = new Date();
  const bsDate = BS.ADToBS(today);

  const positionDistributionRows: FormRow[] = [
    { id: 31, post: 'अध्यक्ष', full_name: '', gender: '', address: '', citizenship_no: '', contact_no: '', citizenshipCopy: '' },
    { id: 32, post: 'सचिव', full_name: '', gender: '', address: '', citizenship_no: '', contact_no: '', citizenshipCopy: '' },
    { id: 33, post: 'कोषाध्यक्ष', full_name: '', gender: '', address: '', citizenship_no: '', contact_no: '', citizenshipCopy: '' },
    { id: 34, post: 'सदस्य', full_name: '', gender: '', address: '', citizenship_no: '', contact_no: '', citizenshipCopy: '' },
    { id: 35, post: 'सदस्य', full_name: '', gender: '', address: '', citizenship_no: '', contact_no: '', citizenshipCopy: '' },
    { id: 36, post: 'सदस्य', full_name: '', gender: '', address: '', citizenship_no: '', contact_no: '', citizenshipCopy: '' },
    { id: 37, post: 'सदस्य', full_name: '', gender: '', address: '', citizenship_no: '', contact_no: '', citizenshipCopy: '' },
  ];

  const researchCommitteeRows: FormRow[] = [
    { id: 1, post: 'संयोजक', full_name: '', gender: '', address: '', citizenship_no: '', contact_no: '', citizenshipCopy: '' },
    { id: 2, post: 'सदस्य सचिव', full_name: '', gender: '', address: '', citizenship_no: '', contact_no: '', citizenshipCopy: '' },
    { id: 3, post: 'सदस्य', full_name: '', gender: '', address: '', citizenship_no: '', contact_no: '', citizenshipCopy: '' },
  ];

  const transformedOfficialDetails: FormRow[] = officialDetails.map((member) => ({
    id: member.id,
    post: member.post,
    full_name: member.full_name,
    gender: member.gender,
    address: member.address,
    citizenship_no: member.citizenship_no,
    contact_no: member.contact_no,
    citizenshipCopy: member.citizenship_front || member.citizenship_back ? 'अपलोड गरिएको' : '',
    citizenship_front: member.citizenship_front,
    citizenship_back: member.citizenship_back,
  }));

  const transformedMonitoringDetails: FormRow[] = monitoringCommittee.map((member) => ({
    id: member.id,
    post: member.post,
    full_name: member.full_name,
    gender: member.gender,
    address: member.address,
    citizenship_no: member.citizenship_no,
    contact_no: member.contact_no,
    citizenshipCopy: member.citizenship_front || member.citizenship_back ? 'अपलोड गरिएको' : '',
    citizenship_front: member.citizenship_front,
    citizenship_back: member.citizenship_back,
  }));

  const handleAdd = () => {
    setIsDialogOpen(true);
  };

  const handleEdit = () => {
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Consumer Committee Formation */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">उपभोक्ता समिति गठन सम्बन्धमा</h3>
        </div>
        <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-5 font-semibold text-gray-800">क्र.स</th>
                <th className="py-3 px-5 font-semibold text-gray-800">शिर्षक</th>
                <th className="py-3 px-5 font-semibold text-gray-800">मिति</th>
                <th className="py-3 px-5 font-semibold text-gray-800">स्थिती</th>
                <th className="py-3 px-5 font-semibold text-gray-800">अन्य</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {CONSUMER_COMMITTEE_TITLES.map((item) => (
                <tr key={item.serial_no} className="hover:bg-gray-50">
                  <td className="py-3 px-5 text-gray-700">{toNepaliNumber(item.serial_no)}</td>
                  <td className="py-3 px-5 text-gray-700">{item.title}</td>
                  <td className="py-3 px-5 text-gray-700">{toNepaliNumber(bsDate)}</td>
                  <td className="py-3 px-5 text-gray-700">–</td>
                  <td className="py-3 px-5">
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        onClick={() => console.log("Upload clicked")}
                      >
                        <Upload className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        className="text-green-600 hover:text-green-800 cursor-pointer"
                        onClick={() => onDownload(item.serial_no, project.serial_number)}
                      >
                        <DownloadCloud className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Consumer Committee Details */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">उपभोक्ता समितिको विवरण</h3>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
            onClick={committeeDetail ? handleEdit : handleAdd}
          >
            {committeeDetail ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{committeeDetail ? 'सम्पादन गर्नुहोस्' : 'थप गर्नुहोस्'}</span>
          </button>
        </div>

        {committeeDetail ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <p className="text-sm text-gray-600 mb-1">उपभोक्ता समितिको नाम:</p>
              <p className="text-gray-900">{committeeDetail.consumer_committee_name || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">ठेगाना:</p>
              <p className="text-gray-900">{committeeDetail.address || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">उपभोक्ता समिति गठन मिति:</p>
              <p className="text-gray-900">{toNepaliNumber(committeeDetail.formation_date) || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">प्रतिनिधिको नाम:</p>
              <p className="text-gray-900">{committeeDetail.representative_name || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">प्रतिनिधिको पद:</p>
              <p className="text-gray-900">{committeeDetail.representative_position || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">सम्पर्क नं.:</p>
              <p className="text-gray-900">{toNepaliNumber(committeeDetail.contact_no) || '-'}</p>
            </div>
          </div>
        ) : (
          <EmptyState message="उपभोक्ता समिति विवरण उपलब्ध छैन" />
        )}

        {isDialogOpen && (
          <ConsumerCommitteeDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onSave={onSave}
            committeeData={committeeDetail}
            projectId={project.serial_number}
          />
        )}
      </div>

      {/* Committee Members Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">पदाधिकारीको विवरण</h3>
          {officialDetails.length === 0 ? (
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
              onClick={() => setIsPositionModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
              <span>नयाँ सदस्य थप्नुहोस्</span>
            </button>
          ) : (
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
              onClick={() => setIsPositionModalOpen(true)}
            >
              <Edit className="w-4 h-4" />
              <span>सम्पादन गर्नुहोस्</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left font-semibold text-gray-700">क्र.स</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-700">पद</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-700">नाम थर</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-700">ठेगाना</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-700">सम्पर्क नं.</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-700">लिंग</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-700">नागरिकता प्र. नं.</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-700">अन्य</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {officialDetails.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-500">
                    <EmptyState message="अहिले कुनै डाटा उपलब्ध छैन।" />
                  </td>
                </tr>
              ) : (
                officialDetails.map((member, index) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-gray-800">{toNepaliNumber(index + 1)}</td>
                    <td className="px-5 py-3 text-gray-800">{member.post}</td>
                    <td className="px-5 py-3 text-gray-800">{member.full_name}</td>
                    <td className="px-5 py-3 text-gray-800">{member.address}</td>
                    <td className="px-5 py-3 text-gray-800">{toNepaliNumber(member.contact_no)}</td>
                    <td className="px-5 py-3 text-gray-800">{member.gender}</td>
                    <td className="px-5 py-3 text-gray-800">{member.citizenship_no}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-800 transition cursor-pointer"
                          onClick={() => {/* Edit functionality */}}
                        >
                          <FileMinusIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monitoring Committee */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">अनुगमन तथा सहजिकरण समिती :</h3>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
            onClick={() => setIsResearchModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            <span>नयाँ सदस्य थप्नुहोस्</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">क्र.स</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">पद</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">नाम थर</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">ठेगाना</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">सम्पर्क नं.</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">लिंग</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">नागरिकता प्र. नं.</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">कार्यहरू</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {monitoringCommittee.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <EmptyState message="अहिले कुनै डाटा उपलब्ध छैन।" />
                  </td>
                </tr>
              ) : (
                monitoringCommittee.map((member, index) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">{toNepaliNumber(index + 1)}</td>
                    <td className="py-3 px-4 text-gray-900">{member.post}</td>
                    <td className="py-3 px-4 text-gray-900">{member.full_name}</td>
                    <td className="py-3 px-4 text-gray-900">{member.address}</td>
                    <td className="py-3 px-4 text-gray-900">{member.contact_no}</td>
                    <td className="py-3 px-4 text-gray-900">{member.gender}</td>
                    <td className="py-3 px-4 text-gray-900">{member.citizenship_no}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-150 cursor-pointer"
                          onClick={() => {/* Edit functionality */}}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 transition-colors duration-150 cursor-pointer"
                          onClick={() => onDelete(member.id, 'official')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Modal
          isOpen={isPositionModalOpen}
          onClose={() => setIsPositionModalOpen(false)}
          title="पदाधिकारीको विवरण"
          rows={officialDetails.length > 0 ? transformedOfficialDetails : positionDistributionRows}
          onSave={onSavePosition}
        />
        <Modal
          isOpen={isResearchModalOpen}
          onClose={() => setIsResearchModalOpen(false)}
          title="अनुगमन तथा सहजिकरण समिति"
          rows={monitoringCommittee.length > 0 ? transformedMonitoringDetails : researchCommitteeRows}
          onSave={onSaveResearch}
        />
      </div>
    </div>
  );
};

export default ConsumerCommitteeTab;