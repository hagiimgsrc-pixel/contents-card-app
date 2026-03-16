import React from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp } from 'lucide-react';

export default function EchoesPage() {
  const earnings = [
    { date: '2026/03/16', amount: 17, from: '購入者A (4次流通分)', work: 'SUNDANCE' },
    { date: '2026/03/10', amount: 331, from: '購入者B (3次流通分)', work: '悠久のアルカナ' },
    { date: '2026/02/28', amount: 172, from: '購入者C (3次流通分)', work: 'Business Class' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="flex items-center p-4 bg-white border-b border-gray-100">
        <Link href="/profile">
          <ArrowLeft className="text-gray-600 mr-4 cursor-pointer" />
        </Link>
        <h1 className="text-lg font-bold">Echoes (収益履歴)</h1>
      </div>

      <div className="p-4">
        {/* Total Stats Card */}
        <div className="bg-black text-white p-6 rounded-2xl mb-6 flex justify-between items-center shadow-xl">
          <div>
            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Total Earnings</p>
            <p className="text-3xl font-bold">520 <span className="text-sm font-normal text-gray-300 ml-1">pt</span></p>
          </div>
          <div className="bg-white/10 p-3 rounded-full">
            <TrendingUp size={28} className="text-green-400" />
          </div>
        </div>

        {/* List Title */}
        <h3 className="text-xs font-bold text-gray-400 mb-4 px-1 uppercase tracking-widest">Recent Activity</h3>
        
        {/* Earnings List */}
        <div className="space-y-3">
          {earnings.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-50 flex justify-between items-center active:scale-[0.98] transition-transform">
              <div>
                <p className="font-bold text-sm text-gray-800">{item.work}</p>
                <p className="text-[10px] text-gray-400 font-medium">{item.from}</p>
                <p className="text-[9px] text-gray-300 mt-1">{item.date}</p>
              </div>
              <div className="text-right">
                <p className="text-blue-600 font-bold text-sm">+{item.amount} pt</p>
                <p className="text-[8px] text-gray-300">Success</p>
              </div>
            </div>
          ))}
        </div>

        {/* Insight Message */}
        <p className="text-center text-[10px] text-gray-400 mt-8 leading-relaxed">
          これらの収益は、コンテンツカードの二次流通により<br/>
          スマートコントラクトを通じて自動分配されました。
        </p>
      </div>
    </div>
  );
}
