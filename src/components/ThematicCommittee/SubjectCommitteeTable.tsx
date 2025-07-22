import { SubjectCommitteeTableRow } from './SubjectCommitteeTableRow';

interface SubjectCommitteeTableProps {
  activeTab: string;
  data: any[];
  onPrioritizeThematicWard: (id: number) => void;
  onPrioritize: (id: number) => void;
  onRecommend: (id: number) => void;
}

export const SubjectCommitteeTable = ({ activeTab, data, onPrioritizeThematicWard, onPrioritize, onRecommend }: SubjectCommitteeTableProps) => (
  <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-100 text-sm text-gray-700">
        <tr>
          <th className="text-left py-3 px-4 font-semibold">क्र.स</th>
          <th className="text-left py-3 px-4 font-semibold">योजना तथा कार्यक्रम</th>
          <th className="text-left py-3 px-4 font-semibold">क्षेत्र</th>
          <th className="text-left py-3 px-4 font-semibold">उप-क्षेत्र</th>
          <th className="text-left py-3 px-4 font-semibold">स्रोत</th>
          <th className="text-left py-3 px-4 font-semibold">खर्च केन्द्र</th>
          <th className="text-left py-3 px-4 font-semibold">बजेट</th>
          <th className="text-left py-3 px-4 font-semibold">वडा नं.</th>
          <th className="text-left py-3 px-4 font-semibold">स्थिति</th>
          <th className="text-left py-3 px-4 font-semibold">प्राथमिकता नम्बर</th>
          <th className="text-center py-3 px-4 font-semibold">अन्य</th>
        </tr>
      </thead>
      <tbody className="text-sm text-gray-900 divide-y divide-gray-100">
        {data.length > 0 ? (
          data.map((item, index) => (
            <SubjectCommitteeTableRow
              key={item.id}
              item={item}
              index={index}
              activeTab={activeTab}
              onPrioritizeThematicWard={onPrioritizeThematicWard}
              onPrioritize={onPrioritize}
              onRecommend={onRecommend}
            />
          ))
        ) : (
          <tr>
            <td colSpan={11} className="py-12 text-center text-gray-500 italic">
              हाल कुनै योजना फेला परेन।
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);