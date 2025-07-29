// export const EditModal = ({
//   open,
//   onClose,
//   item,
//   activeTab,
// }: {
//   open: boolean;
//   onClose: () => void;
//   item: SettingsData | null;
//   activeTab: string;
// }) => {
//   if (!open || !item) return null;

//   return (
//     <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
//         <h3 className="text-lg font-semibold mb-4">Edit - {activeTab}</h3>
//         <p className="text-gray-700 mb-2">Name: {item.name}</p>
//         {item.committee && <p className="text-gray-700 mb-2">Committee: {item.committee}</p>}
//         {item.groupName && <p className="text-gray-700 mb-2">Group: {item.groupName}</p>}
//         <p className="text-gray-700 mb-4">Status: {item.status ? 'Active' : 'Inactive'}</p>

//         {/* Placeholder for form fields */}
//         <input
//           type="text"
//           placeholder="Update name..."
//           className="w-full px-3 py-2 border rounded mb-4"
//         />

//         <div className="flex justify-end gap-2">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() => {
//               // TODO: Handle submit
//               alert('Save changes logic here');
//               onClose();
//             }}
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Save
//           </button>
//         </div>

//         {/* Close button (top-right) */}
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
//         >
//           ×
//         </button>
//       </div>
//     </div>
//   );
// };
