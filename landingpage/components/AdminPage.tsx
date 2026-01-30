
import React, { useState, useEffect } from 'react';
import { getLiveLink, setLiveLink, getWebinarInfo, setWebinarInfo } from '../services/configService';
import { getStoredFirebaseConfig, fetchAllRegistrations } from '../services/firebaseService';
import { ADMIN_PASSWORD, STORAGE_KEY_FIREBASE_CONFIG } from '../constants';
import { FirebaseSettings, UserRegistration } from '../types';

interface AdminPageProps {
  onBack: () => void;
}

type TabType = 'url' | 'firebase' | 'list';

const AdminPage: React.FC<AdminPageProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('list');
  
  // Webinar Info
  const [url, setUrl] = useState('');
  const [topic, setTopic] = useState({ title: '', description: '', imageUrl: '', schedule: '', speaker: '' });
  
  // Firebase Config
  const [fbConfig, setFbConfig] = useState<FirebaseSettings>({
    apiKey: '', authDomain: '', projectId: '', storageBucket: '',
    messagingSenderId: '', appId: '', measurementId: ''
  });

  // Registrations Data
  const [registrations, setRegistrations] = useState<UserRegistration[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  useEffect(() => {
    setUrl(getLiveLink());
    setTopic(getWebinarInfo());
    setFbConfig(getStoredFirebaseConfig());
    if (isAuthenticated) {
      loadRegistrations();
    }
  }, [isAuthenticated]);

  const loadRegistrations = async () => {
    setIsFetching(true);
    const data = await fetchAllRegistrations();
    setRegistrations(data);
    setIsFetching(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 올바르지 않습니다.');
    }
  };

  const toggleSort = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    const sorted = [...registrations].sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return newOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });
    setRegistrations(sorted);
  };

  const downloadCSV = () => {
    if (registrations.length === 0) return;
    const headers = ['소속', '사번', '성함', '직책', '참여시간'];
    const rows = registrations.map(r => [
      r.affiliation,
      r.employeeId,
      r.name,
      r.position,
      new Date(r.timestamp).toLocaleString('ko-KR')
    ]);
    const BOM = '\uFEFF';
    const csvContent = BOM + [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `xClass_NOW_참가자명단_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWebinarSave = () => {
    setSaveStatus('saving');
    setLiveLink(url);
    setWebinarInfo(topic.title, topic.description, topic.imageUrl, topic.schedule, topic.speaker);
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  const handleFbSave = () => {
    setSaveStatus('saving');
    localStorage.setItem(STORAGE_KEY_FIREBASE_CONFIG, JSON.stringify(fbConfig));
    setTimeout(() => {
      setSaveStatus('success');
      alert('설정이 저장되었습니다. 페이지가 새로고침됩니다.');
      window.location.reload();
    }, 500);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="glass-effect p-8 rounded-2xl w-full max-w-sm border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors">
              로그인
            </button>
            <button type="button" onClick={onBack} className="w-full text-slate-500 text-sm hover:text-white transition-colors">
              돌아가기
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="glass-effect rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="flex bg-slate-900/50 border-b border-white/5">
          <button onClick={() => setActiveTab('list')} className={`flex-1 py-4 font-bold ${activeTab === 'list' ? 'bg-white/5 text-blue-400 border-b-2 border-blue-400' : 'text-slate-500'}`}>참가자 명단</button>
          <button onClick={() => setActiveTab('url')} className={`flex-1 py-4 font-bold ${activeTab === 'url' ? 'bg-white/5 text-blue-400 border-b-2 border-blue-400' : 'text-slate-500'}`}>웨비나 정보 설정</button>
          <button onClick={() => setActiveTab('firebase')} className={`flex-1 py-4 font-bold ${activeTab === 'firebase' ? 'bg-white/5 text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-500'}`}>DB 설정</button>
        </div>

        <div className="p-8">
          {activeTab === 'list' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">참가자 명단 ({registrations.length})</h2>
                <div className="flex gap-2">
                  <button onClick={loadRegistrations} className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm">새로고침</button>
                  <button onClick={downloadCSV} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm">CSV 다운로드</button>
                </div>
              </div>
              <div className="overflow-x-auto rounded-xl border border-white/5">
                <table className="w-full text-left">
                  <thead className="bg-slate-800/50 text-slate-300 text-sm">
                    <tr>
                      <th className="px-6 py-4">소속</th>
                      <th className="px-6 py-4">사번</th>
                      <th className="px-6 py-4">성함</th>
                      <th className="px-6 py-4">직책</th>
                      <th className="px-6 py-4 cursor-pointer" onClick={toggleSort}>참여 시간 {sortOrder === 'asc' ? '↑' : '↓'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {registrations.map((reg, idx) => (
                      <tr key={idx} className="hover:bg-white/5">
                        <td className="px-6 py-4">{reg.affiliation}</td>
                        <td className="px-6 py-4">{reg.employeeId}</td>
                        <td className="px-6 py-4 text-white">{reg.name}</td>
                        <td className="px-6 py-4">{reg.position}</td>
                        <td className="px-6 py-4 text-sm">{new Date(reg.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'url' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-2xl font-bold text-white">콘텐츠 상세 설정</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">유튜브 라이브 링크</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" value={url} onChange={(e) => setUrl(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">웨비나 메인 주제</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" value={topic.title} onChange={(e) => setTopic({...topic, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">상세 설명</label>
                  <textarea className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white h-24" value={topic.description} onChange={(e) => setTopic({...topic, description: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">세션 일정 (한 줄씩 입력)</label>
                  <textarea className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white h-24" value={topic.schedule} onChange={(e) => setTopic({...topic, schedule: e.target.value})} placeholder="14:00 - 오프닝" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">연사 정보 (첫 줄은 이름, 둘째 줄은 이력)</label>
                  <textarea className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white h-24" value={topic.speaker} onChange={(e) => setTopic({...topic, speaker: e.target.value})} placeholder="홍길동 소장 (OO연구소)" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">메인 이미지 URL</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" value={topic.imageUrl} onChange={(e) => setTopic({...topic, imageUrl: e.target.value})} />
                </div>
              </div>
              <button onClick={handleWebinarSave} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold">
                {saveStatus === 'success' ? '저장 완료!' : '정보 업데이트'}
              </button>
            </div>
          )}

          {activeTab === 'firebase' && (
             <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">DB 설정</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['apiKey', 'projectId', 'authDomain', 'appId', 'storageBucket', 'measurementId'].map((f) => (
                  <div key={f}>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">{f}</label>
                    <input type="text" value={(fbConfig as any)[f]} onChange={(e) => setFbConfig({...fbConfig, [f]: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" />
                  </div>
                ))}
              </div>
              <button onClick={handleFbSave} className="w-full bg-emerald-600 text-white py-4 rounded-lg font-bold">Firebase 설정 저장 및 새로고침</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
