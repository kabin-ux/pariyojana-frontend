import { Edit, Copy, FileText } from 'lucide-react';

interface Project {
  id: number;
  plan_name: string;
  thematic_area: string;
  sub_area: string;
  source: string;
  expenditure_center: string;
  budget: string;
  ward_no: string;
  status: string;
  priority_no: number;
}

interface MunicipalOfficeTableProps {
  activeTab: string;
  data: any[];
  onRecommend: (id: number) => void;
}

const MunicipalOfficeTable: React.FC<MunicipalOfficeTableProps> = ({ activeTab, data, onRecommend }) => {
  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {[
                'क्र.स',
                'योजना तथा कार्यक्रम',
                'क्षेत्र',
                'उप-क्षेत्र',
                'स्रोत',
                'खर्च केन्द्र',
                'बजेट',
                'वडा नं.',
                'स्थिति',
                'प्राथमिकता नम्बर',
                'अन्य',
              ].map((header, idx) => (
                <th
                  key={idx}
                  className="text-left px-4 py-3 text-sm font-semibold text-gray-700 whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{item.id}</td>
                  <td className="py-3 px-4 text-gray-900">{item.plan_name}</td>
                  <td className="py-3 px-4 text-gray-900">{item.thematic_area}</td>
                  <td className="py-3 px-4 text-gray-900">{item.sub_area}</td>
                  <td className="py-3 px-4 text-gray-900">{item.source}</td>
                  <td className="py-3 px-4 text-gray-900">{item.expenditure_center}</td>
                  <td className="py-3 px-4 text-gray-900">रु {item.budget}</td>
                  <td className="py-3 px-4 text-gray-900">{item.ward_no}</td>
                  <td className="py-3 px-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-900">{item.priority_no}</td>
                  <td className="py-3 px-4">
                    {activeTab === 'नगर सभामा पेश गर्नु अघिको परियोजना' && (
                      <button
                        onClick={() => onRecommend(item.id)}
                        className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 cursor-pointer"
                      >
                        नगर सभामा पेश गर्नुहोस्
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <NoDataRow />
            )}
          </tbody>
        </table>
      </div>
      <Pagination />
    </>
  );
};


const NoDataRow = () => (
  <tr>
    <td colSpan={11} className="py-12 text-center">
      <div className="flex flex-col items-center justify-center text-gray-500">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-lg font-medium">No data</p>
      </div>
    </td>
  </tr>
);

const Pagination = () => (
  <div className="flex items-center justify-center mt-6">
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">1</span>
    </div>
  </div>
);

export default MunicipalOfficeTable;