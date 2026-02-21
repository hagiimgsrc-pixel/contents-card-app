import { Search, HardDrive, Clock, Star, Share2, MoreVertical, FileText, Music, Video } from 'lucide-react';

export default function MyPage() {
  const items = [
    { name: 'FamilyMart_Demo.mp3', type: 'music', date: 'Feb 21' },
    { name: 'Behind_The_Scenes.mp4', type: 'video', date: 'Feb 20' },
    { name: 'Liner_Notes.pdf', type: 'file', date: 'Feb 19' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20 font-sans text-black">
      {/* 検索ヘッダー */}
      <div className="p-4 bg-white border-b flex items-center gap-3 sticky top-0 z-10">
        <div className="flex-1 bg-gray-100 rounded-full flex items-center px-4 py-2 gap-2 text-gray-500">
          <Search size={18} />
          <input className="bg-transparent text-sm outline-none w-full" placeholder="Search in Drive" />
        </div>
        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">Y</div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4">
        <h2 className="text-sm font-semibold text-gray-500 mb-4">Suggested</h2>
        <div className="grid grid-cols-2 gap-4">
          {items.map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                {item.type === 'music' ? <Music className="text-blue-500" /> : item.type === 'video' ? <Video className="text-red-500" /> : <FileText className="text-green-500" />}
                <MoreVertical size={16} className="text-gray-400" />
              </div>
              <p className="text-xs font-medium truncate">{item.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 下部ナビゲーション */}
      <div className="fixed bottom-0 w-full bg-white border-t flex justify-around p-3 text-gray-400">
        <div className="flex flex-col items-center gap-1 text-blue-600"><HardDrive size={20} /><span className="text-[10px]">Home</span></div>
        <div className="flex flex-col items-center gap-1"><Star size={20} /><span className="text-[10px]">Starred</span></div>
        <div className="flex flex-col items-center gap-1"><Share2 size={20} /><span className="text-[10px]">Shared</span></div>
        <div className="flex flex-col items-center gap-1"><Clock size={20} /><span className="text-[10px]">Files</span></div>
      </div>
    </div>
  );
}
