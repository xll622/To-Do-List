
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  List, 
  Trash2, 
  Edit3, 
  Save, 
  FileText, 
  LogOut, 
  LayoutDashboard,
  Terminal,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { Task, Priority, SortCriteria } from './types';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import CodeViewer from './components/CodeViewer';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [view, setView] = useState<'dashboard' | 'code'>('dashboard');
  const [sortBy, setSortBy] = useState<SortCriteria>('date');
  const [error, setError] = useState<string | null>(null);

  // Load tasks from "file" (localStorage) on mount
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('pythonic_tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (err) {
      console.error("Dosya okuma hatası:", err);
      setError("Görevler yüklenirken bir hata oluştu.");
    }
  }, []);

  // Save tasks to "file" (localStorage) whenever tasks change
  useEffect(() => {
    try {
      localStorage.setItem('pythonic_tasks', JSON.stringify(tasks));
    } catch (err) {
      console.error("Dosya yazma hatası:", err);
      setError("Değişiklikler kaydedilirken bir hata oluştu.");
    }
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (!taskData.text.trim()) {
      setError("Boş görev eklenemez!");
      return;
    }
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };
    setTasks(prev => [...prev, newTask]);
    setIsFormOpen(false);
    setError(null);
  };

  const updateTask = (id: string, updatedData: Partial<Task>) => {
    if (updatedData.text !== undefined && !updatedData.text.trim()) {
      setError("Boş görev metni girilemez!");
      return;
    }
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
    setEditingTask(null);
    setIsFormOpen(false);
    setError(null);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleStatus = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { 'Yüksek': 0, 'Orta': 1, 'Düşük': 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (sortBy === 'status') {
      return Number(a.isCompleted) - Number(b.isCompleted);
    }
    if (sortBy === 'text') {
      return a.text.localeCompare(b.text);
    }
    return b.createdAt - a.createdAt;
  });

  const handleAISuggest = async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Bana yapılacaklar listesi için 3 tane yaratıcı ve üretkenlik odaklı görev önerisi yaz. Sadece görev başlıklarını içeren kısa bir liste olsun.`,
      });
      alert("AI Önerileri:\n" + response.text);
    } catch (err) {
      console.error("AI Hatası:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      {/* Sidebar / Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Terminal className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">Pythonic Task Manager</h1>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">v1.0.4 - Modüler Yapı</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setView('dashboard')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${view === 'dashboard' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <LayoutDashboard size={16} />
            <span className="hidden sm:inline">Panel</span>
          </button>
          <button 
            onClick={() => setView('code')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${view === 'code' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <FileText size={16} />
            <span className="hidden sm:inline">Kod Görünümü</span>
          </button>
          <div className="w-px h-6 bg-slate-800 mx-2" />
          <button 
            onClick={() => window.location.reload()}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-md transition-all"
            title="Çıkış"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="pt-24 pb-12 max-w-5xl mx-auto px-6">
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <div className="p-1 bg-rose-500 rounded-full text-white">
              <Plus className="w-3 h-3 rotate-45" />
            </div>
            {error}
            <button onClick={() => setError(null)} className="ml-auto text-xs font-bold hover:underline">KAPAT</button>
          </div>
        )}

        {view === 'dashboard' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Form & Stats */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Plus className="text-indigo-400" /> Yeni Görev
                </h2>
                <TaskForm 
                  onSubmit={editingTask ? (data) => updateTask(editingTask.id, data) : addTask}
                  initialData={editingTask || undefined}
                  buttonLabel={editingTask ? "Güncelle" : "Ekle"}
                  onCancel={editingTask ? () => { setEditingTask(null); setIsFormOpen(false); } : undefined}
                />
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">İstatistikler</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Toplam Görev</span>
                    <span className="text-xl font-bold">{tasks.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Tamamlanan</span>
                    <span className="text-xl font-bold text-emerald-400">
                      {tasks.filter(t => t.isCompleted).length}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-500 h-full transition-all duration-500" 
                      style={{ width: `${tasks.length ? (tasks.filter(t => t.isCompleted).length / tasks.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleAISuggest}
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              >
                <Sparkles size={18} />
                Gemini'den Öneri Al
              </button>
            </div>

            {/* Right Column: List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <List className="text-indigo-400" /> Görev Listesi
                </h2>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-lg">
                  <span className="text-xs font-semibold text-slate-500 px-2 uppercase">Sırala:</span>
                  {(['date', 'priority', 'status'] as const).map((criteria) => (
                    <button
                      key={criteria}
                      onClick={() => setSortBy(criteria)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${sortBy === criteria ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'}`}
                    >
                      {criteria === 'date' ? 'Tarih' : criteria === 'priority' ? 'Öncelik' : 'Durum'}
                    </button>
                  ))}
                </div>
              </div>

              {tasks.length === 0 ? (
                <div className="bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-3xl p-12 text-center">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <List className="text-slate-600" />
                  </div>
                  <p className="text-slate-500 font-medium">Henüz görev eklenmemiş.</p>
                  <p className="text-sm text-slate-600 mt-1">Hemen bir şeyler ekleyerek başla!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedTasks.map((task, index) => (
                    <div 
                      key={task.id} 
                      className="group animate-in fade-in slide-in-from-bottom-4 duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TaskList 
                        task={task} 
                        index={index + 1}
                        onDelete={() => deleteTask(task.id)}
                        onToggle={() => toggleStatus(task.id)}
                        onEdit={() => setEditingTask(task)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <CodeViewer tasks={tasks} />
        )}
      </main>
    </div>
  );
};

export default App;
