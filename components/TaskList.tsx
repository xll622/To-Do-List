
import React from 'react';
import { CheckCircle2, Circle, Trash2, Edit3, Clock } from 'lucide-react';
import { Task } from '../types';
import { PRIORITY_COLORS } from '../constants';

interface TaskListProps {
  task: Task;
  index: number;
  onDelete: () => void;
  onToggle: () => void;
  onEdit: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ task, index, onDelete, onToggle, onEdit }) => {
  const isPastDue = new Date(task.dueDate) < new Date() && !task.isCompleted;

  return (
    <div className={`flex items-center gap-4 p-4 bg-slate-900 border ${task.isCompleted ? 'border-slate-800/50' : 'border-slate-800'} rounded-2xl hover:border-indigo-500/50 transition-all group/item shadow-lg`}>
      <button 
        onClick={onToggle}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.isCompleted ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700 text-transparent hover:border-indigo-500 hover:text-indigo-500/50'}`}
      >
        {task.isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono font-bold text-indigo-500/70">{index.toString().padStart(2, '0')}</span>
          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter rounded border ${PRIORITY_COLORS[task.priority]}`}>
            {task.priority}
          </span>
          {isPastDue && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded">
              Gecikmiş
            </span>
          )}
        </div>
        <p className={`text-sm md:text-base font-medium truncate transition-all ${task.isCompleted ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
          {task.text}
        </p>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {new Date(task.dueDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
        <button 
          onClick={onEdit}
          className="p-2 text-slate-500 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-all"
          title="Düzenle"
        >
          <Edit3 size={18} />
        </button>
        <button 
          onClick={onDelete}
          className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
          title="Sil"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TaskList;
