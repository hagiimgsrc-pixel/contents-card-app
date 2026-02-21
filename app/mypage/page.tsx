'use client';
import { Search, HardDrive, Clock, Star, Share2, MoreVertical, FileText, Music, Video, Grid, List } from 'lucide-react';
import Image from 'next/image';

export default function MyPage() {
  const items = [
    { name: 'FamilyMart_Session.mp3', type: 'music', date: '2 hours ago', url: '/FamilyMart_Session.mp3' },
    { name: 'Exclusive_Video.mp4', type: 'video', date: 'Yesterday', url: '/Exclusive_Video.mp4' },
    // ここを変更！ typeを'image'に、名前とURLを'jacket.jpg'に変更
    { name: 'jacket.jpg', type: 'image', date: 'Feb 18', url: '/jacket.jpg' },
    { name: 'Tour_Photo.jpg', type: 'image', date: 'Feb 15', url: '/Tour_Photo.jpg' },
  ];

  // アイコンまたは画像を表示する関数
  const renderIcon = (item: any, isGrid: boolean) => {
    if (item.type === 'image') {
      return (
        <div className={`relative overflow-hidden rounded-lg ${isGrid ? 'w-full h-24 mb-2' : 'w-10 h-10'}`}>
          <Image
            src={item.url}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>
      );
    }
    const iconClass = isGrid ? "" : "";
    const iconSize = isGrid ? 24 : 20;

    switch (item.type) {
      case 'music': return <Music className="text-blue-500" size={iconSize} />;
      case 'video': return <Video className="text-red-500" size={iconSize} />;
      default: return <FileText className="text-green-500" size={iconSize} />;
    }
  };


  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
      {/* Search Header */}
      <div className="p-4 bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="bg-[#EDF2FC] rounded-full flex items-center px-4 py-3 gap-3 text-gray-600 shadow-sm">
          <Search size={20} />
          <input className="bg-transparent flex-1 text-sm outline-none" placeholder="Search in Contents" />
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">Y</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 px-4 pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-gray-600 font-medium text-sm">Suggested</h2>
          <Grid size={18} className="text-gray-500" />
        </div>

        {/* Suggested Grid */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          {items.slice(0, 2).map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4 active:scale-95 transition-transform"
            >
              <div className="flex justify-between items-start">
                {renderIcon(item, true)}
                <MoreVertical size={16} className="text-gray-400" />
              </div>
              <p className="text-[11px] font-bold truncate text-gray-700">{item.name}</p>
            </a>
          ))}
        </div>

        <h2 className="text-gray-600 font-medium text-sm mb-4">Files</h2>
        <div className="space-y-1">
          {items.map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-3 bg-white border-b border-gray-50 active:bg-gray-100 transition-colors"
            >
              <div className={`p-2 rounded-lg ${item.type !== 'image' ? 'bg-gray-50' : ''} text-gray-500`}>
                {renderIcon(item, false)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                <p className="text-[10px] text-gray-400">{item.date}</p>
              </div>
              <MoreVertical size={18} className="text-gray-400" />
            </a>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-100 flex justify-around p-3">
        <div className="flex flex-col items-center gap-1 text-blue-600"><HardDrive size={22} /><span className="text-[10px] font-medium">Home</span></div>
        <div className="flex flex-col items-center gap-1 text-gray-400"><Star size={22} /><span className="text-[10px] font-medium">Starred</span></div>
        <div className="flex flex-col items-center gap-1 text-gray-400"><Share2 size={22} /><span className="text-[10px] font-medium">Shared</span></div>
        <div className="flex flex-col items-center gap-1 text-gray-400"><Clock size={22} /><span className="text-[10px] font-medium">Files</span></div>
      </div>
    </div>
  );
}
