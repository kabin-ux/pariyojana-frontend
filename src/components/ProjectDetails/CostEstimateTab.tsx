import React, { useState } from 'react';
import { Edit, Upload, FileSearch } from 'lucide-react';
import { toNepaliNumber, formatBudget } from '../../utils/formatters';
import AddAuthenticationFileModal from '../../modals/AddAuthenticationFileModal';
import AuthenticationModal from '../../modals/AuthenticationModal';
import CalculateCostEstimateModal from '../../modals/CalculateCostEstimateModal';
import WorkTypeModal from '../../modals/SetWorkTypeModal';
import WorkInProgressModal from '../../modals/WorkInProgressModal';
// import CostEstimateModal from '../../modals/CostEstimateModal';
import * as BS from 'bikram-sambat-js';

interface CostEstimateTabProps {
  project: any;
  costEstimateDetails: any[];
  mapCostEstimate: any[];
  calculateCostEstimateDetails: any[];
  workType: any[];
  workInProgress: any[];
  onFileUpload: (data: any) => void;
  onSendAuthentication: (data: any) => void;
  onGenerateBill: (projectId: number) => void;
  onLoadCostEstimate: () => void;
}

const BUDGET_ESTIMATE_TITLES = [
  { "serial_no": 1, "title": "सम्भव्यता अध्यायन प्रतिवेदन" },
  { "serial_no": 2, "title": "नक्सा" },
  { "serial_no": 3, "title": "लागत अनुमान (लागत इष्टिमेट)" },
  { "serial_no": 4, "title": "प्राविधिक प्रतिवेदन" },
  { "serial_no": 5, "title": "निर्माण कार्य तालिका" },
  { "serial_no": 6, "title": "लागत अनुमान स्विकृती सम्बन्धी टिप्पणी आदेश" },
];

const CostEstimateTab: React.FC<CostEstimateTabProps> = ({
  project,
  // costEstimateDetails,
  mapCostEstimate,
  calculateCostEstimateDetails,
  workType,
  workInProgress,
  onFileUpload,
  onSendAuthentication,
  // onGenerateBill,
  onLoadCostEstimate
}) => {
  const [isAuthenticationFileModalOpen, setAuthenticationFileModalOpen] = useState(false);
  const [isAuthenticationModalOpen, setAuthenticationModalOpen] = useState(false);
  const [isCostEstimateModalOpen, setIsCostEstimateModalOpen] = useState(false);
  const [isSetWorkTypeModalOpen, setIsSetWorkTypeModalOpen] = useState(false);
  const [isSetWorkInProgressOpen, setIsSetWorkInProgressOpen] = useState(false);
  // const [isCostModalOpen, setIsCostModalOpen] = useState(false);
  const [selectedMapCostItem, setSelectedMapCostItem] = useState<any>(null);
  const [editMapCostId, setEditMapCostId] = useState<number | null>(null);

  const today = new Date();
  const bsDate = BS.ADToBS(today);

  // const costDetail = costEstimateDetails.find(item => item.project === project?.id);
  const calculatedEstimate = calculateCostEstimateDetails.length > 0 ? calculateCostEstimateDetails[0] : null;
  const workTypeDets = workType.length > 0 ? workType[0] : null;
  const workInProgressDets = workInProgress.length > 0 ? workInProgress[0] : null;

  return (
    <div className="space-y-8">
      {/* Cost Estimate Documents */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">नक्सा तथा लागत अनुमान</h3>
        <div className="space-y-4">


          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">क्र.स.</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">शीर्षक</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">मिति</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">स्थिति</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">कार्यहरू</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {BUDGET_ESTIMATE_TITLES.map((item) => {
                  const mapCostItem = mapCostEstimate.find(mapItem => mapItem.serial_no === item.serial_no);
                  return (
                    <tr key={item.serial_no} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">{toNepaliNumber(item.serial_no)}</td>
                      <td className="py-3 px-4 text-gray-900 text-sm">{item.title}</td>
                      <td className="py-3 px-4 text-gray-900 text-sm">{toNepaliNumber(bsDate)}</td>
                      <td className="py-3 px-4 text-gray-900 text-sm">
                        {mapCostItem?.status === 'pending' ? 'अपलोड गरिएको' : mapCostItem?.status}
                      </td>
                      <td className="py-3 px-4 text-sm flex items-center space-x-4">
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => {
                            setSelectedMapCostItem(item);
                            setEditMapCostId(mapCostItem?.id || null);
                            setAuthenticationFileModalOpen(true);
                          }}
                        >
                          <Upload className="w-5 h-5" />
                        </button>

                        <div className="relative group">
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => {
                              setSelectedMapCostItem(mapCostItem);
                              setEditMapCostId(mapCostItem?.id || null);
                              setAuthenticationModalOpen(true);
                            }}
                          >
                            <FileSearch className="w-5 h-5" />
                          </button>
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-200">
                            प्रमाणिकरण
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {isAuthenticationFileModalOpen && (
          <AddAuthenticationFileModal
            onSave={onFileUpload}
            onClose={() => {
              setAuthenticationFileModalOpen(false);
              setSelectedMapCostItem(null);
              setEditMapCostId(null);
            }}
            documentData={selectedMapCostItem}
            projectId={project.serial_number}
          />
        )}

        {isAuthenticationModalOpen && (
          <AuthenticationModal
            // onSave={onFileUpload}
            onClose={() => {
              setAuthenticationModalOpen(false);
              setSelectedMapCostItem(null);
            }}
            documentData={selectedMapCostItem}
            projectIdNum={project.serial_number}
            editMapCostId={editMapCostId}
            onAuthenticationSent={onSendAuthentication}
          />
        )}
      </div>

      {/* Cost Calculation */}
      <div className='bg-gray-50 rounded-lg p-6'>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            लागत अनुमान गणना र विवरण
          </h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
            onClick={() => setIsCostEstimateModalOpen(true)}
          >
            <Edit className="w-4 h-4" />
            <span>लागत अनुमान गणना गर्नुहोस्</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">प्रदेश सरकारबाट बजेट:</p>
            <p className="text-lg font-semibold">
              {toNepaliNumber(formatBudget(calculatedEstimate?.provincial_budget))}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">स्थानीय तहबाट बजेट:</p>
            <p className="text-lg font-semibold">
              {toNepaliNumber(formatBudget(calculatedEstimate?.local_budget))}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">भ्याट प्रतिशत:</p>
            <p className="text-lg font-semibold">
              {toNepaliNumber(calculatedEstimate?.vat_percent)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">भ्याट रकम:</p>
            <p className="text-lg font-semibold">
              {toNepaliNumber(formatBudget(calculatedEstimate?.vat_amount))}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">कन्टिन्जेन्सी प्रतिशत:</p>
            <p className="text-lg font-semibold">
              {toNepaliNumber(calculatedEstimate?.contingency_percent)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">कन्टिन्जेन्सी रकम:</p>
            <p className="text-lg font-semibold">
              {toNepaliNumber(formatBudget(calculatedEstimate?.contingency_amount))}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">भ्याट बिना लागत:</p>
            <p className="text-lg font-semibold">
              {toNepaliNumber(formatBudget(calculatedEstimate?.total_without_vat))}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">कुल लागत (without PS Amount) :</p>
            <p className="text-lg font-semibold">
              {toNepaliNumber(formatBudget(calculatedEstimate?.grand_total_without_ps))}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">कुल लागत (भ्याट + कन्टिन्जेन्सी सहित):</p>
            <p className="text-lg font-semibold">
              {toNepaliNumber(formatBudget(calculatedEstimate?.grand_total))}
            </p>
          </div>
        </div>

        {isCostEstimateModalOpen && (
          <CalculateCostEstimateModal
            isOpen={isCostEstimateModalOpen}
            onClose={() => setIsCostEstimateModalOpen(false)}
            costData={calculateCostEstimateDetails}
            onSave={() => {
              onLoadCostEstimate();
              setIsCostEstimateModalOpen(false);
            }}
            projectId={project.serial_number}
          />
        )}
      </div>

      {/* Work Type Set */}
      <div className='bg-gray-50 rounded-lg p-6'>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            परियोजनाको कामको प्रकार सेट गर्नुहोस्
          </h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
            onClick={() => setIsSetWorkTypeModalOpen(true)}
          >
            <Edit className="w-4 h-4" />
            <span>कामको प्रकार सेट गर्नुहोस्</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">परियोजनाको नाम</p>
            <p className="text-lg font-semibold">
              {workTypeDets?.project_name}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">कामको प्रकार</p>
            <p className="text-lg font-semibold">
              {workTypeDets?.name}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">एकाइ</p>
            <p className="text-lg font-semibold">
              {workTypeDets?.unit_name}
            </p>
          </div>
        </div>

        {isSetWorkTypeModalOpen && (
          <WorkTypeModal
            isOpen={isSetWorkTypeModalOpen}
            onClose={() => setIsSetWorkTypeModalOpen(false)}
            workTypeData={workTypeDets}
            onSave={() => {
              onLoadCostEstimate();
              setIsSetWorkTypeModalOpen(false);
            }}
            projectId={project.serial_number}
          />
        )}
      </div>

      {/* Work in Progress */}
      <div className='bg-gray-50 rounded-lg p-6'>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            प्रगतिमा रहेका कार्यको विवरण
          </h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
            onClick={() => setIsSetWorkInProgressOpen(true)}
          >
            <Edit className="w-4 h-4" />
            <span>प्रगतिमा काम</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">परियोजनाको नाम</p>
            <p className="text-lg font-semibold">
              {workInProgressDets?.project_name}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">आर्थिक वर्ष</p>
            <p className="text-lg font-semibold">
              {toNepaliNumber(workInProgressDets?.fiscal_year_display)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">कामको प्रकार</p>
            <p className="text-lg font-semibold">
              {workInProgressDets?.work_type?.name}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">मात्रा</p>
            <p className="text-lg font-semibold">
              {toNepaliNumber(workInProgressDets?.quantity)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">टिप्पणीहरू</p>
            <p className="text-lg font-semibold">
              {workInProgressDets?.remarks}
            </p>
          </div>
        </div>


        {isSetWorkInProgressOpen && (
          <WorkInProgressModal
            isOpen={isSetWorkInProgressOpen}
            onClose={() => setIsSetWorkInProgressOpen(false)}
            workInProgressData={workInProgressDets}
            onSave={() => {
              onLoadCostEstimate();
              setIsSetWorkInProgressOpen(false);
            }}
            projectId={project.serial_number}
          />
        )}
      </div>

      {/* Cost Summary */}
      {/* <div className="bg-gray-50 rounded-lg p-6"> */}
        {/* <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">लागत अनुमान तथा अन्य विवरण:</h3>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
            onClick={() => setIsCostModalOpen(true)}
          >
            <Edit className="w-4 h-4" />
            <span>सम्पादन गर्नुहोस्</span>
          </button>
        </div> */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">लागत अनुमान:</p>
            <p className="text-lg font-semibold">{toNepaliNumber(formatBudget(costDetail?.estimated_cost))}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">कन्टिन्जेन्सी प्रतिशत:</p>
            <p className="text-lg font-semibold">{toNepaliNumber(costDetail?.contingency_percent) || '0'}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">कन्टिन्जेन्सी रकम:</p>
            <p className="text-lg font-semibold">{toNepaliNumber(formatBudget(costDetail?.contingency_amount))}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">कुल लागत अनुमान:</p>
            <p className="text-lg font-semibold">{toNepaliNumber(formatBudget(costDetail?.total_estimated_cost))}</p>
          </div>
        </div> */}
        {/* Actions */}
        {/* <div className="mt-6 flex justify-end">
          <button
            onClick={() => onGenerateBill(project.serial_number)}
            disabled={
              !costDetail?.estimated_cost ||
              !costDetail?.contingency_percent ||
              !costDetail?.contingency_amount ||
              !costDetail?.total_estimated_cost
            }
            className={`flex items-center gap-2 px-5 py-2 rounded-lg transition cursor-pointer
        ${!costDetail?.estimated_cost ||
                !costDetail?.contingency_percent ||
                !costDetail?.contingency_amount ||
                !costDetail?.total_estimated_cost
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
              }`}
          >
            <FileText className="w-4 h-4" />
            <span>बिल उत्पन्न गर्नुहोस्</span>
          </button>
        </div> */}

        {/* {isCostModalOpen && (
          <CostEstimateModal
            isOpen={isCostModalOpen}
            onClose={() => setIsCostModalOpen(false)}
            costData={costEstimateDetails}
            onSave={() => {
              onLoadCostEstimate();
              setIsCostModalOpen(false);
            }}
            projectId={project.serial_number}
          />
        )} */}
      {/* </div> */}
    </div>
  );
};

export default CostEstimateTab;