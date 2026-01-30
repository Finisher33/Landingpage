
import React, { useEffect, useState } from 'react';
import { getWebinarInfo } from '../services/configService';

const WebinarInfo: React.FC = () => {
  const [info, setInfo] = useState({ title: '', description: '', imageUrl: '', schedule: '', speaker: '' });

  useEffect(() => {
    setInfo(getWebinarInfo());
  }, []);

  return (
    <div className="max-w-4xl mx-auto mb-16 space-y-8">
      <div className="glass-effect rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row items-stretch">
        {/* 이미지 영역 */}
        <div className="md:w-1/2 relative min-h-[300px]">
          <img 
            src={info.imageUrl} 
            alt="Webinar Main" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#1e293b]/30"></div>
        </div>

        {/* 텍스트 영역: 주제 및 설명 */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <div className="flex items-center space-x-2 mb-4">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Today's Topic</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-4">
            {info.title}
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            {info.description}
          </p>
        </div>
      </div>

      {/* 일정 및 연사 정보 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 일정 섹션 */}
        <div className="glass-effect p-8 rounded-2xl border border-white/10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="Wait, let's use a simpler path: M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">세션 타임라인</h3>
          </div>
          <div className="space-y-3">
            {info.schedule.split('\n').map((line, i) => (
              <div key={i} className="flex items-start space-x-3 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700 mt-1.5"></div>
                <p className="text-slate-300 font-medium">{line}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 연사 정보 섹션 */}
        <div className="glass-effect p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">초청 연사</h3>
          </div>
          <div className="space-y-1">
            {info.speaker.split('\n').map((line, i) => (
              <p key={i} className={`${i === 0 ? 'text-white font-bold text-lg' : 'text-slate-400 text-sm mt-2'}`}>
                {line}
              </p>
            ))}
          </div>
          <div className="mt-6 inline-flex items-center px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
            Guest Speaker
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebinarInfo;
