import { useState } from 'react'
import './index.css'
import { idolFilters, idolGroups, idols, type IdolFilter } from './data'

function App() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [analyzed, setAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'tile' | 'list'>('tile');
  const [activeFilters, setActiveFilters] = useState<IdolFilter[]>([]);
  
  const [aiAnalysis, setAiAnalysis] = useState<{
    analysis: string;
    recommendation_name: string;
    recommendation_reason: string;
  } | null>(null);

  const modelOptions = [
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', detail: '高速・安定版' },
    { value: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash-Lite', detail: '軽量・低コスト' },
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', detail: '高精度・深い分析' },
  ];

  const selectedModelOption = modelOptions.find(model => model.value === selectedModel) ?? modelOptions[0];

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  }

  const removeSelect = (id: string) => {
    setSelectedIds(current => current.filter(x => x !== id));
  }

  const toggleFilter = (filter: IdolFilter) => {
    setActiveFilters(current => (
      current.includes(filter)
        ? current.filter(item => item !== filter)
        : [...current, filter]
    ));
  }

  const enableAllFilters = () => {
    setActiveFilters(current => current.length === idolFilters.length ? [] : idolFilters);
  }

  const apiBaseUrl = import.meta.env.VITE_API_URL ?? '';

  const handleAnalyze = async () => {
    if (selectedIds.length === 0) return;
    if (!apiBaseUrl) {
      setErrorMsg('API サーバーの URL が設定されていません。VITE_API_URL を確認してください。');
      return;
    }

    // 名前から (C) などの記号を削除してAIに渡す
    const selectedNames = idols.filter(i => selectedIds.includes(i.id)).map(i => i.name.replace(/ \(.+\)/, ''));
    const recommendationCandidates = idols
      .filter(i => !selectedIds.includes(i.id))
      .map(i => i.name.replace(/ \(.+\)/, ''));
    
    setIsAnalyzing(true);
    setErrorMsg(null);
    
    try {
      const prompt = `ユーザーはアイドルマスターの以下のキャラクターが好きです：${selectedNames.join(', ')}。
これはキャラクター紹介ではなく、ユーザーの好みを推定する診断です。
選択キャラクターが1人だけの場合も、そのキャラクターの説明に終始せず、ユーザーが惹かれた可能性のある性格・雰囲気・外見・関係性の好みを抽出してください。
「${selectedNames.join('、')}は〜です」のような紹介文ではなく、「あなたは〜に惹かれやすい」「〜なタイプを好む傾向がある」のようにユーザーの嗜好として書いてください。
おすすめ候補は必ず次の候補リスト内のキャラクターから1名だけ選んでください。
候補リストにないキャラクター名は絶対に出力しないでください。
候補リスト：${recommendationCandidates.join(', ')}

この情報をもとに、以下の3点を出力してください。
1. ユーザーが好むキャラクターの性格や外見の傾向の深い分析（3〜4文の日本語、キャラクター紹介は禁止）
2. 候補リスト内からおすすめのキャラクター1名（候補リストと完全一致する名前）
3. そのキャラクターをおすすめする理由（2〜3文の日本語）

必ず以下のJSONフォーマットのみで出力してください。Markdownのバッククォートなどは含めず、純粋なJSON文字列だけにしてください。
{
  "analysis": "分析結果",
  "recommendation_name": "おすすめのキャラクター名",
  "recommendation_reason": "おすすめ理由"
}`;

      const response = await fetch(`${apiBaseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'APIリクエストに失敗しました');
      }

      const data = await response.json();
      const text = data.text;
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

  const filteredGroups = idolGroups
    .map(group => ({
      ...group,
      idols: activeFilters.length === 0
        ? group.idols
        : group.idols.filter(idol => activeFilters.includes(idol.filter)),
    }))
    .filter(group => group.idols.length > 0);

  const selectedIdols = idols.filter(idol => selectedIds.includes(idol.id));
  const allFiltersEnabled = activeFilters.length === idolFilters.length;
  const recommendedIdol = aiAnalysis?.recommendation_name
    ? idols.find(idol => aiAnalysis.recommendation_name.includes(idol.name) || idol.name.includes(aiAnalysis.recommendation_name))
    : undefined;
  const recommendationReason = aiAnalysis?.recommendation_reason ?? '';
  const recommendationReasonBody = recommendationReason.endsWith('。')
    ? recommendationReason.slice(0, -1)
    : recommendationReason;
  const youtubeSearchName = recommendedIdol?.name ?? aiAnalysis?.recommendation_name ?? '';
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${youtubeSearchName} アイドルマスター`)}`;

  return (
    <div className="app-container">
      <div className="top-panel">
        <header>
          <div className="title-row">
            <h1>PersonalityM@ster</h1>
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
          </div>
          <p className="subtitle">Select your favorite idols and let AI discover your preferences!</p>
        </header>

        <div className="type-tabs" aria-label="Filter by idol type">
          <button
            className={`type-tab all-filter ${allFiltersEnabled ? 'active' : ''}`}
            onClick={enableAllFilters}
          >
            ALL
          </button>
          {idolFilters.map(filter => (
            <button
              key={filter}
              className={`type-tab ${activeFilters.includes(filter) ? 'active' : ''}`}
              onClick={() => toggleFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className={`selected-pool ${selectedIds.length > 0 ? 'has-items' : ''}`}>
          <div className="pool-items">
            {selectedIdols.length === 0 ? (
              <span className="pool-empty">Tap a card to select idols</span>
            ) : (
              selectedIdols.map(idol => (
                <div className="pool-idol" key={idol.id}>
                  <img src={idol.image} alt="" />
                  <span>{idol.name}</span>
                  <button
                    className="pool-remove"
                    type="button"
                    aria-label={`${idol.name}を削除`}
                    onClick={() => removeSelect(idol.id)}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {errorMsg && <div style={{color: '#ff758c', textAlign: 'center', marginBottom: '1rem', fontWeight: 'bold'}}>{errorMsg}</div>}

        {!analyzed && (
          <div className="analyze-panel">
            <div className="analyze-combo">
              <button 
                className="analyze-btn combo-main" 
                onClick={handleAnalyze}
                disabled={selectedIds.length === 0 || isAnalyzing}
              >
                {isAnalyzing
                  ? 'AI is Analyzing...'
                  : selectedIds.length === 0
                    ? 'Select at least 1 idol'
                    : `${selectedModelOption.label}で診断`}
              </button>
              <button
                className="combo-menu-btn"
                type="button"
                aria-label="モデルを選択"
                aria-expanded={isModelMenuOpen}
                onClick={() => setIsModelMenuOpen(open => !open)}
              >
                ▼
              </button>
              {isModelMenuOpen && (
                <div className="model-menu">
                  {modelOptions.map(model => (
                    <button
                      key={model.value}
                      className={`model-menu-item ${selectedModel === model.value ? 'active' : ''}`}
                      type="button"
                      onClick={() => {
                        setSelectedModel(model.value);
                        setIsModelMenuOpen(false);
                      }}
                    >
                      <span>{model.label}</span>
                      <small>{model.detail}</small>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="idol-sections">
        {filteredGroups.map(group => (
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
                  <img src={idol.image} alt={idol.name} className="idol-image" draggable={false} />
                  <div className="idol-info">
                    <div className="idol-name">{idol.name}</div>
                    <div className="idol-type">{idol.filter}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {analyzed && (
        <div className="results-overlay" role="dialog" aria-modal="true" aria-labelledby="result-title">
          <div className="results-section">
            <button
              className="result-close"
              type="button"
              aria-label="診断結果を閉じる"
              onClick={() => setAnalyzed(false)}
            >
              ×
            </button>
            <h2 id="result-title" style={{background: 'var(--cute-grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem'}}>
              AI Preference Analysis
            </h2>
            
            <div style={{background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', lineHeight: '1.6'}}>
              <p>{aiAnalysis?.analysis}</p>
            </div>
            
            <h3 style={{color: 'var(--passion-color)', marginBottom: '1rem'}}>AI Recommendation</h3>
            <div className="recommendation-panel">
              <div className="recommendation-profile">
                {recommendedIdol ? (
                  <div className="recommend-image-panel">
                    <img src={recommendedIdol.image} alt={recommendedIdol.name} />
                  </div>
                ) : (
                  <div className="recommend-image-panel fallback">
                    <span>No Image</span>
                  </div>
                )}
                <h4>{aiAnalysis?.recommendation_name}</h4>
              </div>
              <div className="recommendation-copy">
                <p>
                  {recommendationReasonBody}
                  {youtubeSearchName && (
                    <a
                      className="youtube-search-link"
                      href={youtubeSearchUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${youtubeSearchName}をYouTubeで検索`}
                    >
                      <span className="youtube-icon" aria-hidden="true" />
                    </a>
                  )}
                </p>
              </div>
            </div>
            
            <div className="result-actions">
              <button 
                className="analyze-btn" 
                onClick={() => {setAnalyzed(false); setSelectedIds([]); setAiAnalysis(null);}}
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default App
