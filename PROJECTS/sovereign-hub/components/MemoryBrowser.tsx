// PROJECTS/sovereign-hub/components/MemoryBrowser.tsx
"use client";

import React, { useEffect, useState } from 'react';

interface MemoryFile {
  name: string;
  path: string;
  last_modified: string;
}

export const MemoryBrowser: React.FC = () => {
  const [files, setFiles] = useState<MemoryFile[]>([]);

  useEffect(() => {
    const fetchMemory = async () => {
      try {
        const res = await fetch('/api/memory');
        const data = await res.json();
        if (data.files) setFiles(data.files);
      } catch (e) {
        console.error("Memory Retrieval Failed", e);
      }
    };
    fetchMemory();
  }, []);

  return (
    <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: 'calc(100vh - 350px)' }}>
      {files.length > 0 ? (
        files.map((file) => (
          <div key={file.path} className="flex justify-between items-center p-5 border border-white/5 bg-black/20 hover:bg-black/40 transition-colors group cursor-pointer">
            <div className="flex items-center gap-6">
              <div className="w-10 h-10 flex items-center justify-center bg-[#A855F7]/10 border border-[#A855F7]/20 rounded-sm">
                <span className="text-xl opacity-40 group-hover:opacity-100 transition-opacity">📓</span>
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-white group-hover:text-[#A855F7] transition-colors uppercase tracking-widest">
                  {file.name}
                </h4>
                <p className="text-[7px] font-mono text-white/20 mt-1 uppercase tracking-tighter">
                  Path: {file.path} // Sync: STABLE
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[8px] font-mono text-white/10 uppercase block mb-1">Modified</span>
              <span className="text-[10px] font-bold text-white/40">{new Date(file.last_modified).toLocaleDateString()}</span>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-20 opacity-10 uppercase tracking-[0.5em] text-xs">
          Connecting_to_Vault...
        </div>
      )}
    </div>
  );
};

export default MemoryBrowser;
