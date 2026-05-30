// src/pages/admin/WorkflowManagement.tsx
import { Plus, Edit2 } from 'lucide-react';

const WorkflowManagement = () => {
  const workflows = [
    { id: 1, name: "Xin nghỉ phép", type: "Leave Request", steps: 4, status: "Active" },
    { id: 2, name: "Xin kinh phí", type: "Funding Request", steps: 3, status: "Active" },
    { id: 3, name: "Đăng ký làm thêm giờ", type: "OT Request", steps: 3, status: "Draft" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Quy trình Phê duyệt</h1>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-700 transition">
          <Plus size={20} />
          Tạo Workflow Mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {workflows.map((wf) => (
          <div key={wf.id} className="bg-white border border-gray-200 rounded-3xl p-6 hover:shadow-lg transition">
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold">{wf.name}</h3>
              <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                wf.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {wf.status}
              </span>
            </div>

            <p className="text-gray-500 mt-2">{wf.type}</p>
            <p className="mt-4 text-sm">Số bước phê duyệt: <strong>{wf.steps}</strong></p>

            <div className="mt-6 flex gap-3">
              <button className="flex-1 py-3 border border-gray-300 rounded-2xl hover:bg-gray-50 flex items-center justify-center gap-2">
                <Edit2 size={18} /> Chỉnh sửa
              </button>
              <button className="flex-1 py-3 text-red-600 hover:bg-red-50 rounded-2xl">
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowManagement;