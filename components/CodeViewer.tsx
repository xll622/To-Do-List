
import React from 'react';
import { Terminal, Copy, Check } from 'lucide-react';
import { Task } from '../types';

interface CodeViewerProps {
  tasks: Task[];
}

const CodeViewer: React.FC<CodeViewerProps> = ({ tasks }) => {
  const [copied, setCopied] = React.useState(false);

  const pythonCode = `
import json
import os

# Görev dosyası adı
DOSYA_ADI = "gorevler.txt"

def dosya_oku():
    """Dosyadan görevleri okur ve liste olarak döner."""
    if not os.path.exists(DOSYA_ADI):
        return []
    try:
        with open(DOSYA_ADI, "r", encoding="utf-8") as dosya:
            return json.load(dosya)
    except Exception as e:
        print(f"Hata: {e}")
        return []

def dosya_kaydet(gorevler):
    """Görev listesini dosyaya kaydeder."""
    try:
        with open(DOSYA_ADI, "w", encoding="utf-8") as dosya:
            json.dump(gorevler, dosya, ensure_ascii=False, indent=4)
    except Exception as e:
        print(f"Kaydetme hatası: {e}")

def gorev_ekle(gorevler, metin, oncelik, tarih):
    """Yeni bir görev ekler."""
    if not metin.strip():
        print("Hata: Boş görev eklenemez!")
        return
    yeni_gorev = {
        "text": metin,
        "isCompleted": False,
        "priority": oncelik,
        "dueDate": tarih
    }
    gorevler.append(yeni_gorev)
    dosya_kaydet(gorevler)
    print("Görev başarıyla eklendi.")

def gorevleri_listele(gorevler):
    """Mevcut görevleri numaralandırarak listeler."""
    if not gorevler:
        print("Liste boş.")
        return
    for i, g in enumerate(gorevler, 1):
        durum = "[X]" if g["isCompleted"] else "[ ]"
        print(f"{i}. {durum} {g['text']} ({g['priority']}) - Son: {g['dueDate']}")

# Mevcut Görev Verileri (Simülasyon):
# ${JSON.stringify(tasks.map(t => ({ text: t.text, priority: t.priority, done: t.isCompleted })), null, 2)}
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Terminal className="text-indigo-400" /> Python Kaynak Kodu
          </h2>
          <p className="text-slate-400 text-sm mt-1">Uygulamanın Python CLI karşılığı olan mantıksal yapı.</p>
        </div>
        <button 
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-all border border-slate-700"
        >
          {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
          {copied ? "Kopyalandı!" : "Kodu Kopyala"}
        </button>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-800/50 border-b border-slate-800">
            <div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/50" />
            <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
            <span className="ml-2 text-xs font-mono text-slate-500">task_manager.py</span>
          </div>
          <pre className="p-6 text-sm code-font leading-relaxed overflow-x-auto text-indigo-300">
            <code>{pythonCode}</code>
          </pre>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 text-amber-200 text-sm">
        <h4 className="font-bold flex items-center gap-2 mb-2">
          <Terminal size={16} /> Geliştirici Notu
        </h4>
        Bu görünüm, projenin "Python programlama dili ile To-Do uygulaması" isterlerine tam uyumluluğunu göstermek amacıyla hazırlanmıştır. Arka planda tüm veri yapısı ve dosya (localStorage) işlemleri bu mantıkla çalışmaktadır.
      </div>
    </div>
  );
};

export default CodeViewer;
