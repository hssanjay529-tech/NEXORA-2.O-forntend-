import React from 'react';
import { Folder, FileText, Download } from 'lucide-react';

export interface FolderFileItem {
  id: string;
  name: string;
  size: string;
  date: string;
  type?: string;
  downloadUrl?: string;
}

export interface FolderFloatProps {
  title: string;
  category: string;
  files: FolderFileItem[];
  onDownload?: (fileId: string) => void;
}

export const FolderFloat: React.FC<FolderFloatProps> = ({
  title,
  category,
  files,
  onDownload,
}) => {
  return (
    <div className="group relative rounded-2xl bg-gradient-to-br from-[#16102B] to-[#0F0B1C] border border-[#2A2240] hover:border-[#00E5FF]/40 p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.5)]">
      {/* Folder Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2A2240] mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 border border-[#7C3AED]/30 flex items-center justify-center text-[#C4B5FD] group-hover:text-[#00E5FF] group-hover:border-[#00E5FF]/40 transition-colors">
            <Folder className="w-5 h-5 fill-current/20" />
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm text-white">{title}</h4>
            <span className="text-[11px] text-[#9E9AA8]">{category} • {files.length} documents</span>
          </div>
        </div>
      </div>

      {/* Files List */}
      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-2.5 rounded-xl bg-[#130E22]/90 hover:bg-[#1C1533] border border-[#2A2240]/60 hover:border-[#00E5FF]/30 transition-all text-xs group/file"
          >
            <div className="flex items-center gap-2.5 overflow-hidden pr-2">
              <FileText className="w-4 h-4 text-[#00E5FF] shrink-0" />
              <div className="truncate">
                <p className="font-medium text-white truncate">{file.name}</p>
                <p className="text-[10px] text-[#9E9AA8]">{file.size} • {file.date}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onDownload?.(file.id)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-[#00E5FF]/20 text-[#9E9AA8] hover:text-[#00E5FF] transition-colors"
              title="Download file"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
