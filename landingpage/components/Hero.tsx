
import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="text-center pt-24 pb-12">
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6 animate-pulse">
        LIVE SESSION TODAY
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
        시의적절한 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">지정학/기술 이슈</span>를<br />
        다루는 라이브 웨비나
      </h1>
      <p className="text-lg text-slate-400 max-w-2xl mx-auto">
        급변하는 글로벌 정세와 파괴적 기술 혁신의 교차점을 분석합니다.<br />
        참가 정보를 입력하고 바로 실시간 라이브에 접속하세요.
      </p>
    </div>
  );
};

export default Hero;
