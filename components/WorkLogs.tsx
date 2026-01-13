
import React, { useState, useRef } from 'react';
import { WorkLog, User } from '../types';
import { Camera, Send, Image as ImageIcon, X } from 'lucide-react';

interface WorkLogsProps {
  user: User;
  logs: WorkLog[];
  onAddLog: (l: WorkLog) => void;
}

const WorkLogs: React.FC<WorkLogsProps> = ({ user, logs, onAddLog }) => {
  const [content, setContent] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotos(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && photos.length === 0) return;

    const newLog: WorkLog = {
      id: Date.now().toString(),
      content,
      date: new Date().toISOString(),
      authorId: user.id,
      photos
    };

    onAddLog(newLog);
    setContent('');
    setPhotos([]);
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Diário de Acompanhamento</h2>
      </div>

      {user.role === 'CONTRACTOR' && (
        <form onSubmit={handleAdd} className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-slate-50 border-0 ring-1 ring-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-600 transition-all min-h-[120px] text-base"
            placeholder="Descreva o progresso de hoje..."
          />
          
          {photos.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {photos.map((photo, i) => (
                <div key={i} className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden group">
                  <img src={photo} alt="Upload" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-slate-600 bg-slate-50 hover:bg-slate-100 transition-all border border-slate-200"
              >
                <Camera className="w-5 h-5" /> 
                <span className="text-sm font-bold uppercase tracking-wide">Foto</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*" 
                multiple 
                capture="environment"
              />
            </div>
            <button 
              type="submit" 
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-100"
            >
              Publicar <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {logs.map((log) => (
          <div key={log.id} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                {log.authorId === 'contractor-1' ? 'E' : 'C'}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {log.authorId === 'contractor-1' ? 'Empreiteiro' : 'Contratante'}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {new Date(log.date).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
            
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed mb-6 text-base">
              {log.content}
            </p>

            {log.photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                {log.photos.map((photo, i) => (
                  <img 
                    key={i} 
                    src={photo} 
                    alt="Progresso" 
                    className="w-full h-32 sm:h-48 object-cover rounded-2xl shadow-sm hover:opacity-90 transition-opacity cursor-pointer" 
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkLogs;
