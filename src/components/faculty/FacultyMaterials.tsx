import React, { useState, useEffect } from 'react';
import { Upload, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { FolderFloat } from '../ui/FolderFloat';
import { api } from '../../api/endpoints';
import type { CourseMaterialItem } from '../../types';

export const FacultyMaterials: React.FC = () => {
  const [materials, setMaterials] = useState<CourseMaterialItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [unit, setUnit] = useState(1);

  useEffect(() => {
    api.faculty.getCourseMaterials().then(setMaterials);
  }, []);

  const handleUpload = () => {
    const newItem: CourseMaterialItem = {
      id: `mat-${Date.now()}`,
      title,
      unit_number: Number(unit),
      file_name: `${title.replace(/\s+/g, '_')}.pdf`,
      file_size: '2.4 MB',
      uploaded_at: '2026-10-10',
      download_url: '#',
    };
    setMaterials([newItem, ...materials]);
    setIsModalOpen(false);
    setTitle('');
  };

  const unitFiles = materials.map((m) => ({
    id: m.id,
    name: m.file_name,
    size: m.file_size,
    date: m.uploaded_at,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-bold text-lg text-white">
            Academic Vault & Course Materials
          </h3>
          <p className="text-xs text-[#9E9AA8]">
            3D interactive repository for lecture notes, problem sets, and syllabus distribution
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="text-xs flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Upload Material
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FolderFloat
          title="CS401: Advanced Algorithms Unit Vault"
          category="Lecture Slides & Syllabi"
          files={unitFiles}
          onDownload={(id) => alert(`Downloading document ${id}`)}
        />

        <FolderFloat
          title="Laboratory Practice Manuals"
          category="Code Templates & Guides"
          files={[
            { id: 'lab-1', name: 'Lab-1_MaxFlow_FordFulkerson.py', size: '12 KB', date: '2026-09-18' },
            { id: 'lab-2', name: 'Lab-2_DynamicProgramming_Knapsack.cpp', size: '18 KB', date: '2026-09-25' },
          ]}
          onDownload={(id) => alert(`Downloading code template ${id}`)}
        />
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload Academic Material"
        description="File will be immediately available in the Student Study Vault."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white mb-1.5">Material Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Unit 3: Dynamic Graph Algorithms"
              className="w-full p-2.5 rounded-xl bg-[#130E22] border border-[#2A2240] text-xs text-white placeholder-[#9E9AA8] focus:border-[#00E5FF] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white mb-1.5">Curriculum Unit</label>
            <select
              value={unit}
              onChange={(e) => setUnit(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-[#130E22] border border-[#2A2240] text-xs text-white focus:border-[#00E5FF] focus:outline-none"
            >
              <option value={1}>Unit 1: Fundamentals</option>
              <option value={2}>Unit 2: Graph Theory</option>
              <option value={3}>Unit 3: Distributed Consensus</option>
              <option value={4}>Unit 4: Advanced Paradigms</option>
            </select>
          </div>

          <div className="p-4 rounded-xl border border-dashed border-[#2A2240] bg-[#130E22]/50 text-center space-y-2">
            <Upload className="w-6 h-6 text-[#00E5FF] mx-auto" />
            <p className="text-xs text-white font-medium">Select PDF or Slides</p>
            <p className="text-[10px] text-[#9E9AA8]">Files up to 50MB</p>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpload} disabled={!title}>
              Save to Academic Vault
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
