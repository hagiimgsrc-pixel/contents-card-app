import React from 'react';
import Link from 'next/link';
import { User, Settings, HelpCircle, Activity, ChevronRight, ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-100">
        <Link href="/">
          <ArrowLeft className="text-gray-600 mr-4 cursor-pointer" />
        </Link>
        <h1 className="text-lg font-bold">プロフィール</h1>
      </div>

      {/* Profile Image & Name */}
      <div className="flex flex-col items-center py-8">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100 mb-3 shadow-inner">
          <img src="https://github.com/hagiimgsrc-pixel.png" alt="Profile" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-xl font-bold">萩原さん</h2>
        <p className="text-sm text-gray-500 mt-1">累計収益: 520 pt</p>
      </div>

      {/* Menu List */}
      <div className="px-4">
        {[
          { label: 'プロフィール編集', icon: <User size={20} />, href: '#' },
          { label: 'Echoes (収益履歴)', icon: <Activity size={20} />, href: '/echoes' },
          { label: '設定とプライバシー', icon: <Settings size={20} />, href: '#' },
          { label: 'ヘルプセンター', icon: <HelpCircle size={20} />, href: '#' },
        ].map((item, index) => (
          <Link key={index} href={item.href}>
            <div className="flex items-center justify-between py-5 border-b border-gray-50 active:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <span className="text-gray-400">{item.icon}</span>
                <span className="font-medium text-gray-800">{item.label}</span>
              </div>
              <ChevronRight className="text-gray-300" size={20} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
