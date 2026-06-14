'use client';

import { useState, useRef, useCallback } from 'react';

type UploadedImage = {
  name: string;
  size: number;
  url: string;
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UltrasoundPage() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback((files: FileList | File[]) => {
    setError('');
    const arr = Array.from(files);
    const allowed = ['image/png', 'image/jpeg'];
    const invalid = arr.filter(f => !allowed.includes(f.type));

    if (invalid.length > 0) {
      setError('PNG, JPG 파일만 업로드 가능합니다.');
      return;
    }

    const oversized = arr.filter(f => f.size > 20 * 1024 * 1024);
    if (oversized.length > 0) {
      setError('파일 크기는 20MB 이하여야 합니다.');
      return;
    }

    arr.forEach(file => {
      const url = URL.createObjectURL(file);
      setImages(prev => [...prev, { name: file.name, size: file.size, url }]);
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) processFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
  };

  const handleRemove = (index: number) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-mute text-xs font-semibold uppercase tracking-widest mb-1">영상 분석</p>
        <h1 className="font-display font-black text-ink text-[32px] leading-tight">초음파 영상</h1>
        <p className="text-body text-sm mt-1">초음파 이미지를 업로드하면 AI 분석에 활용됩니다.</p>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-[24px] p-12 flex flex-col items-center justify-center cursor-pointer transition-all ${
          dragging
            ? 'border-primary bg-primary-pale scale-[1.01]'
            : images.length > 0
            ? 'border-canvas-soft bg-canvas hover:border-primary hover:bg-primary-pale/20'
            : 'border-canvas-soft bg-canvas hover:border-primary hover:bg-primary-pale/20'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${dragging ? 'bg-primary' : 'bg-canvas-soft'}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={dragging ? 'text-on-primary' : 'text-mute'}>
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>

        <p className="font-semibold text-ink text-base">
          {dragging ? '여기에 놓으세요' : '이미지를 드래그하거나 클릭하여 업로드'}
        </p>
        <p className="text-mute text-sm mt-1.5">PNG, JPG · 여러 파일 동시 업로드 가능 · 최대 20MB</p>

        {images.length === 0 && (
          <div className="mt-6 flex items-center gap-3">
            <span className="bg-canvas-soft text-mute text-xs font-semibold px-3 py-1.5 rounded-full">PNG</span>
            <span className="bg-canvas-soft text-mute text-xs font-semibold px-3 py-1.5 rounded-full">JPG</span>
            <span className="bg-canvas-soft text-mute text-xs font-semibold px-3 py-1.5 rounded-full">JPEG</span>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-3 flex items-center gap-2 bg-[#320707] rounded-[14px] px-4 py-3">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="shrink-0 text-negative">
            <circle cx="7" cy="7" r="6" />
            <line x1="7" y1="4.5" x2="7" y2="7.5" />
            <circle cx="7" cy="9.5" r="0.75" fill="currentColor" stroke="none" />
          </svg>
          <p className="text-negative text-xs font-semibold">{error}</p>
        </div>
      )}

      {/* Image previews */}
      {images.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <p className="font-bold text-ink">업로드된 이미지 <span className="text-mute font-normal text-sm">({images.length}장)</span></p>
            <button
              onClick={e => { e.stopPropagation(); setImages(prev => { prev.forEach(i => URL.revokeObjectURL(i.url)); return []; }); }}
              className="text-xs text-mute hover:text-negative transition-colors font-semibold"
            >
              전체 삭제
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img, i) => (
              <div key={i} className="bg-canvas rounded-[20px] border border-canvas-soft overflow-hidden group">
                {/* Image */}
                <div className="relative aspect-square bg-[#0a0f18] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-full object-contain"
                  />
                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(i)}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[#0e0f0c]/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-negative"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-white">
                      <line x1="2" y1="2" x2="10" y2="10" />
                      <line x1="10" y1="2" x2="2" y2="10" />
                    </svg>
                  </button>
                </div>

                {/* Info */}
                <div className="px-4 py-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-ink text-sm font-semibold truncate">{img.name}</p>
                    <p className="text-mute text-xs mt-0.5">{formatBytes(img.size)}</p>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-canvas-soft text-mute">
                    {img.name.split('.').pop()}
                  </span>
                </div>
              </div>
            ))}

            {/* Add more */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-canvas rounded-[20px] border-2 border-dashed border-canvas-soft aspect-square flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary-pale/20 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-canvas-soft flex items-center justify-center group-hover:bg-primary transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-mute group-hover:text-on-primary transition-colors">
                  <line x1="8" y1="2" x2="8" y2="14" />
                  <line x1="2" y1="8" x2="14" y2="8" />
                </svg>
              </div>
              <p className="text-mute text-xs font-semibold group-hover:text-ink transition-colors">추가 업로드</p>
            </button>
          </div>
        </div>
      )}

      {/* AI 분석 placeholder */}
      {images.length > 0 && (
        <div className="mt-6 bg-canvas rounded-[20px] border border-canvas-soft p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-canvas-soft flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-mute">
                <circle cx="9" cy="9" r="7" />
                <circle cx="9" cy="9" r="2" />
                <line x1="9" y1="2" x2="9" y2="7" />
                <line x1="9" y1="11" x2="9" y2="16" />
                <line x1="2" y1="9" x2="7" y2="9" />
                <line x1="11" y1="9" x2="16" y2="9" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-ink text-sm">AI 분석 준비 중</p>
              <p className="text-mute text-xs mt-0.5">초음파 AI 분석 기능은 추후 연동 예정입니다.</p>
            </div>
          </div>
          <span className="shrink-0 text-xs font-semibold text-mute bg-canvas-soft px-3 py-1.5 rounded-full">Coming Soon</span>
        </div>
      )}
    </div>
  );
}
