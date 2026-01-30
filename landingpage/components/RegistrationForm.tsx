
import React, { useState } from 'react';
import { POSITIONS, AFFILIATIONS, Position, UserRegistration } from '../types';
import { saveRegistration } from '../services/firebaseService';
import { getLiveLink } from '../services/configService';

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<{
    affiliation: string;
    employeeId: string;
    name: string;
    position: Position;
  }>({
    affiliation: AFFILIATIONS[0],
    employeeId: '',
    name: '',
    position: POSITIONS[0]
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.affiliation || !formData.employeeId || !formData.name) {
      setError('모든 항목을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    
    const registration: UserRegistration = {
      ...formData,
      timestamp: new Date().toISOString()
    };

    // Firebase에 데이터 저장 시도
    const success = await saveRegistration(registration);

    if (success) {
      setIsRedirecting(true);
      const targetLink = getLiveLink();
      
      // [해결책] 유튜브 연결 거부 에러 방지 로직
      // 1. 현재 창이 프레임 안에 있을 경우를 대비해 최상위 창(top)의 경로를 변경합니다.
      // 2. 만약의 경우를 대비해 새 탭으로 여는 시도를 병행하거나 확실한 이동을 보장합니다.
      setTimeout(() => {
        try {
          // 최상위 윈도우의 위치를 변경하여 iframe을 탈출합니다.
          if (window.top) {
            window.top.location.href = targetLink;
          } else {
            window.location.href = targetLink;
          }
        } catch (e) {
          // 보안 정책으로 top 접근이 막힌 경우 새 창 열기 시도
          window.open(targetLink, '_blank');
          window.location.href = targetLink;
        }
      }, 500);
    } else {
      setError('데이터 저장에 실패했습니다. (DB 설정 확인 필요)');
      
      const proceed = confirm('데이터 저장에 실패했습니다. 그래도 라이브 페이지로 이동하시겠습니까?');
      if (proceed) {
        const targetLink = getLiveLink();
        if (window.top) {
          window.top.location.href = targetLink;
        } else {
          window.location.href = targetLink;
        }
      } else {
        setIsLoading(false);
      }
    }
  };

  if (isRedirecting) {
    return (
      <div className="max-w-md mx-auto w-full text-center">
        <div className="glass-effect p-12 rounded-2xl border border-white/10 animate-pulse">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-white mb-2">라이브 연결 중...</h2>
          <p className="text-slate-400 text-sm">유튜브 웨비나 페이지로 이동하고 있습니다.</p>
          <button 
            onClick={() => window.open(getLiveLink(), '_blank')}
            className="mt-6 text-blue-400 text-xs underline"
          >
            자동으로 이동하지 않으면 여기를 클릭하세요.
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto w-full">
      <div className="glass-effect p-8 rounded-2xl shadow-2xl border border-white/10">
        <h2 className="text-xl font-bold text-white mb-6 text-center">참가자 등록</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">소속</label>
            <select
              name="affiliation"
              value={formData.affiliation}
              onChange={handleChange}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {AFFILIATIONS.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">사번</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                placeholder="Ex. 123456"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">성함</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="이름 입력"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">직책</label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {POSITIONS.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
              <p className="text-red-400 text-xs text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 rounded-xl shadow-lg transform active:scale-95 transition-all mt-4 flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? '연결 중...' : '참가하기 및 라이브 접속'}
          </button>
        </form>
        
        <p className="text-slate-500 text-[10px] mt-6 text-center">
          본 웨비나는 인가된 인원만 시청 가능합니다.
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;
