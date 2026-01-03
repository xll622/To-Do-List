
import React, { useState, useEffect } from 'react';
// Added Plus to the imports from lucide-react
import { Calendar, Flag, Send, X, Plus } from 'lucide-react';
import { Priority, Task } from '../types';

interface TaskFormProps {
  onSubmit: (data: Omit<Task, 'id' | 'createdAt' | 'isCompleted'>) => void;
  initialData?: Task;
  buttonLabel: string;
  onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, initialData, buttonLabel, onCancel }) => {
  const [text, setText] = useState(initialData?.text || '');
  const [priority, setPriority] = useState<Priority>(initialData?.priority || Priority.MEDIUM);
  const [dueDate, setDueDate] = useState(initialData?.dueDate || new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (initialData) {
      setText(initialData.text);
      setPriority(initialData.priority);
      setDueDate(initialData.dueDate);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    onSubmit({
      text,
      priority,
      dueDate
    });

    if (!initialData) {
      setText('');
      setPriority(Priority.MEDIUM);
      setDueDate(new Date().toISOString().split('T')[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Görev Başlığı</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Örn: Python projesini bitir..."
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
          autoFocus
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Öncelik</label>
          <div className="relative">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full appearance-none bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer"
            >
              {Object.values(Priority).map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <Flag className="absolute right-4 top-3.5 text-slate-500 pointer-events-none w-4 h-4" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Son Tarih</label>
          <div className="relative">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer [color-scheme:dark]"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          {initialData ? <Send size={18} /> : <Plus size={18} />}
          {buttonLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
