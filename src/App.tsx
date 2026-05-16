import { useState } from 'react'
import './index.css'
import { idolGroups, idols } from './data'

function App() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [analyzed, setAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('gemini-3.1-flash-lite');
  const [viewMode, setViewMode] = useState<'tile' | 'list'>('tile');
  
  const [aiAnalysis, setAiAnalysis] = useState<{
    analysis: string;
    recommendation_name: string;
    recommendation_reason: string;
  } | null>(null);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  }

  const handleAnalyze = async () => {
    if (selectedIds.length === 0) return;
    
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setErrorMsg("VITE_GEMINI_API_KEY が .env.local に設定されていません。GeminiのAPIキーを入力してください。");
      return;
    }

    // 名前から (C) などの記号を削除してAIに渡す
    const selectedNames = idols.filter(i => selectedIds.includes(i.id)).map(i => i.name.replace(/ \(.+\)/, ''));
    
    setIsAnalyzing(true);
    setErrorMsg(null);
    
    try {
      const prompt = `ユーザーはアイドルマスターの以下のキャラクターが好きです：${selectedNames.join(', ')}。
この情報をもとに、以下の3点を出力してください。
1. ユーザーが好むキャラクターの性格や外見の傾向の深い分析（3〜4文の日本語）
2. リストにはない、他のおすすめのアイドルマスターのキャラクター1名（フルネーム）
3. そのキャラクターをおすすめする理由（2〜3文の日本語）

必ず以下のJSONフォーマットのみで出力してください。Markdownのバッククォートなどは含めず、純粋なJSON文字列だけにしてください。
{
  "analysis": "分析結果",
  "recommendation_name": "おすすめのキャラクター名",
  "recommendation_reason": "おすすめ理由"
}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          }
        })
      });

      if (!response.ok) {
        throw new Error("APIリクエストに失敗しました");
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      const result = JSON.parse(text);
      
      setAiAnalysis(result);
      setAnalyzed(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("AI分析中にエラーが発生しました。再度お試しください。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>PersonalityM@ster</h1>
        <p className="subtitle">Select your favorite idols and let AI discover your preferences!</p>
      </header>

      <div className="view-toggle">
        <button 
          className={`view-btn ${viewMode === 'tile' ? 'active' : ''}`} 
          onClick={() => setViewMode('tile')}
        >
          ▦ Tile
        </button>
        <button 
          className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} 
          onClick={() => setViewMode('list')}
        >
          ☰ List
        </button>
      </div>

      <div className="idol-sections">
        {idolGroups.map(group => (
          <section className="idol-section" key={group.project}>
            <div className="section-header">
              <h2>{group.project}</h2>
              <span>{group.idols.length} idols</span>
            </div>
            <div className={viewMode === 'tile' ? 'idol-grid' : 'idol-list'}>
              {group.idols.map(idol => (
                <div 
                  key={idol.id} 
                  className={`idol-card ${selectedIds.includes(idol.id) ? 'selected' : ''}`}
                  onClick={() => toggleSelect(idol.id)}
                >
                  <img src={idol.image} alt={idol.name} className="idol-image" />
                  <div className="idol-info">
                    <div className="idol-name">{idol.name}</div>
                    <div className={`idol-type type-${idol.type}`}>{idol.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {errorMsg && <div style={{color: '#ff758c', textAlign: 'center', marginBottom: '1rem', fontWeight: 'bold'}}>{errorMsg}</div>}

      {!analyzed ? (
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ marginRight: '0.5rem', color: 'var(--text-muted)' }}>AI Model:</label>
            <select 
              value={selectedModel} 
              onChange={(e) => setSelectedModel(e.target.value)}
              style={{ 
                padding: '0.5rem 1rem', 
                borderRadius: '8px', 
                background: 'var(--bg-card)', 
                color: 'white', 
                border: '1px solid var(--border-light)',
                outline: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '1rem'
              }}
            >
              <option value="gemini-3.1-pro" style={{background: '#0f172a'}}>✨ Gemini 3.1 Pro (最高精度・深い分析)</option>
              <option value="gemini-3.1-flash-lite" style={{background: '#0f172a'}}>⚡ Gemini 3.1 Flash-Lite (高速・一般提供最新)</option>
              <option value="gemini-2.5-flash" style={{background: '#0f172a'}}>⚖️ Gemini 2.5 Flash (安定版)</option>
            </select>
          </div>
          <button 
            className="analyze-btn" 
            onClick={handleAnalyze}
            disabled={selectedIds.length === 0 || isAnalyzing}
          >
            {isAnalyzing ? 'AI is Analyzing...' : selectedIds.length === 0 ? 'Select at least 1 idol' : 'Analyze Preferences'}
          </button>
        </div>
      ) : (
        <div className="results-section">
          <h2 style={{background: 'var(--cute-grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem'}}>
            AI Preference Analysis
          </h2>
          
          <div style={{background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', lineHeight: '1.6'}}>
            <p>{aiAnalysis?.analysis}</p>
          </div>
          
          <h3 style={{color: 'var(--passion-color)', marginBottom: '1rem'}}>AI Recommendation</h3>
          <div style={{background: 'linear-gradient(to right, rgba(246, 211, 101, 0.1), rgba(253, 160, 133, 0.1))', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(246, 211, 101, 0.3)'}}>
            <h4 style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>{aiAnalysis?.recommendation_name}</h4>
            <p style={{lineHeight: '1.6'}}>{aiAnalysis?.recommendation_reason}</p>
          </div>
          
          <button 
            className="analyze-btn" 
            style={{marginTop: '2.5rem'}}
            onClick={() => {setAnalyzed(false); setSelectedIds([]); setAiAnalysis(null);}}
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  )
}

export default App
