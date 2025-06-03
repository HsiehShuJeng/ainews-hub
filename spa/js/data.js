export const llmData = {
    models: [
        {
            id: 'gpt4.1', name: 'OpenAI GPT-4.1', company: 'OpenAI', type: '閉源', releaseDate: '2025-05-14',
            tags: ['程式編寫', '指令遵循', '企業應用', '多模態'],
            summary: 'OpenAI 於2025年5月中旬推出的 GPT-4 系列新版模型，在程式編碼與指令遵循能力上有明顯改進，針對企業用戶和開發者優化。',
            details: {
                '模型大小與架構': '具備與GPT-4相當的超大參數量(GPT-4o 推測超過1750億參數), 採用 Transformer 架構。提供標準版和縮小版 GPT-4.1 mini。',
                '訓練資料與方法': '推測基於 GPT-4 基礎上進行強化(可能透過大規模程式碼與指令資料微調)。OpenAI並未公開詳細訓練資料與過程。',
                '模型能力與用途': '程式編碼與指令遵循能力改進，強大對話和多輪推理能力，可用於問答、內容生成、輔助程式開發。支援多模態輸入(圖像、文字)與大上下文窗口。',
                '效能與基準': '官方表示在開發者體驗上更進一步，對程式編寫問題的表現更強。內部測試顯示其在編碼與遵循指令的準確性上優於GPT-4o。TechCrunch報導稱有「顯著提升」。',
                '技術創新': '強調無監督學習規模擴展並提升實用性。專注於模式匹配與大數據知識，而非刻意的逐步思考。企業應用中提供更精細控制。',
                'official_source': [
                    { organisation: 'OpenAI', year: 2025, title: 'OpenAI Blog/Help Center (2025-05-14)', url: 'https://openai.com/blog' },
                    { organisation: 'TechCrunch', year: 2025, title: 'Media Report on GPT-4.1', url: 'https://techcrunch.com/' }
                ]
            }
        },
        {
            id: 'codex', name: 'OpenAI Codex', company: 'OpenAI', type: '閉源', releaseDate: '2025-05-16',
            tags: ['代理能力', '程式編寫'],
            summary: '一個基於雲端的 AI 程式編寫代理，旨在成為開發者的「虛擬同事」，能獨立完成複雜的軟體工程任務。',
            details: {
                '模型大小與架構': '使用特製模型 `codex-1`（源自 o3 架構），在沙盒虛擬環境中運行，支援長達 30 分鐘的擴展會話。',
                '訓練資料與方法': '透過強化學習在真實程式編寫任務中訓練，以產生符合人類風格和偏好的程式碼，並能反覆運行測試直至通過。',
                '模型能力與用途': '解決查詢、修復錯誤、編寫新功能、測試和程式碼庫分析。能將自然語言提示轉換為程式碼，並提出附有驗證日誌的拉取請求。支援多個程式編寫任務並行處理。',
                'official_source': [
                    { organisation: 'OpenAI', year: 2025, title: 'OpenAI News (Introducing Codex)', url: 'https://openai.com/blog' },
                    { organisation: 'Turing.com', year: 2025, title: 'Turing.com Report on Codex', url: 'https://turing.com/' },
                    { organisation: 'Cosmico.org', year: 2025, title: 'Cosmico.org Report on Codex', url: 'https://cosmico.org/' }
                ]
            }
        },
        {
            id: 'operator', name: 'OpenAI Operator (o3)', company: 'OpenAI', type: '閉源', releaseDate: '2025-05-23',
            tags: ['代理能力', '網頁互動'],
            summary: '一個 AI 代理模型（基於o3模型更新），能模擬人類操作與網頁互動，執行填寫表單、預訂旅行等任務。',
            details: {
                '模型大小與架構': '基於強邏輯推理能力的 OpenAI o3 模型，是電腦使用代理（CUA）模型的應用產品。',
                '訓練資料與方法': '經過額外的電腦使用安全資料微調，教導模型確認和拒絕決策邊界。',
                '模型能力與用途': '執行網路任務，如填寫表單、預訂旅行、創建迷因。o3 版本增強了處理登入、彈出視窗和 CAPTCHA 的能力，提升瀏覽互動的持久性與準確性。',
                'official_source': [
                    { organisation: 'OpenAI', year: 2025, title: 'OpenAI News (o3-o4-mini system card addendum)', url: 'https://openai.com/blog' },
                    { organisation: 'OpenAI', year: 2025, title: 'OpenAI Help Center', url: 'https://help.openai.com/' }
                ]
            }
        },
        {
            id: 'gpt4.5', name: 'OpenAI GPT-4.5', company: 'OpenAI', type: '閉源', releaseDate: '2025-05-01',
            tags: ['多模態', '對話'],
            summary: 'OpenAI 曾被認為最大且最適合聊天的模型，具備多模態能力。注意：實際發布於2月，5月為持續討論期，`gpt-4.5-preview` API 已計劃棄用。',
            details: {
                '模型大小與架構': '參數未公開，但前代超過 1750 億。專注於無監督學習，而非思維鏈推理。',
                '訓練資料與方法': '專有，未公開。',
                '模型能力與用途': '卓越的對話、多步驟推理、高效計算和即時互動。可處理圖像和音訊資料。推薦用於需要卓越對話、多步驟推理的業務場景。',
                'official_source': [
                    { organisation: 'Shakudo.io', year: 2025, title: 'Shakudo.io blog', url: 'https://www.shakudo.io/blog/top-9-large-language-models' },
                    { organisation: 'OpenAI', year: 2025, title: 'OpenAI API Deprecations', url: 'https://platform.openai.com/docs/deprecations' }
                ]
            }
        },
        {
            id: 'gemini2.5pro_io', name: 'Gemini 2.5 Pro I/O Edition', company: 'Google', type: '閉源', releaseDate: '2025-05-20',
            tags: ['程式編寫', '多模態', '網頁開發', '影片理解'],
            summary: '專為程式編寫和互動式網頁應用增強的模型，在 WebDev Arena 排行榜上排名第一，並具備頂尖的影片理解能力。上下文視窗擴展至200萬token。',
            details: {
                '模型大小與架構': '專有模型，建立在 Gemini 2.5 Pro 基礎上。上下文視窗從 100 萬 token 擴展至 200 萬。',
                '訓練資料與方法': '未詳細說明。針對程式編寫和互動式網頁應用進行顯著增強。',
                '模型能力與用途': '創建美觀且功能正常的網頁應用、轉換和編輯現有程式碼、開發複雜代理工作流程、基於影片內容創建互動應用。函數呼叫改進。',
                'official_source': [
                    { organisation: 'Google Cloud', year: 2025, title: 'Google Cloud Blog (Expanding Gemini 2.5 Flash and Pro capabilities)', url: 'https://cloud.google.com/blog/products/ai-machine-learning/expanding-gemini-2-5-flash-and-pro-capabilities' }
                ]
            }
        },
         {
            id: 'gemini2.5pro_deepthink', name: 'Gemini 2.5 Pro with "Deep Think"', company: 'Google', type: '閉源', releaseDate: '2025-05-21',
            tags: ['增強推理', '程式編寫', '數學'],
            summary: 'Gemini 2.5 Pro 的增強版，採用「Deep Think」技術（平行思考），在回應前能考慮多種假設，顯著提升複雜問題的推理能力。',
            details: {
                '模型大小與架構': '專有模型，採用新的研究技術，包含平行思考技術。可配置高達 32K token 的思考預算。上下文窗口100萬token。',
                '訓練資料與方法': '未詳細說明。針對複雜推理進行強化。',
                '模型能力與用途': '針對數學和程式編寫等高度複雜的用例，增強推理能力，處理更複雜的問題和任務。內建自我事實檢查機制。',
                'official_source': [
                    { organisation: 'Google Cloud', year: 2025, title: 'Google Cloud Blog', url: 'https://blog.google/technology/google-deepmind/google-gemini-updates-io-2025/' },
                    { organisation: 'Google DeepMind', year: 2025, title: 'Google DeepMind Blog (Gemini model thinking updates)', url: 'https://deepmind.google/models/gemini/pro/' }
                ]
            }
        },
        {
            id: 'gemini_flash', name: 'Gemini 2.5 Flash', company: 'Google', type: '閉源', releaseDate: '2025-05-21',
            tags: ['效率', '成本效益', '多模態'],
            summary: 'Gemini 的更快、更具成本效益的變體，專為需要快速回應和低延遲的應用場景優化。上下文窗口100萬token。',
             details: {
                '模型大小與架構': '專有模型，是 Gemini 的輕量化變體。',
                '訓練資料與方法': '在保持高性能的同時優化模型大小與推理速度。',
                '模型能力與用途': '資料分析代理、對話式 AI。支援原生音訊輸出和影音輸入，顯著降低使用成本和回應時間。',
                'official_source': [
                    { organisation: 'Google Cloud', year: 2025, title: 'Gemini 2.5 Flash and Pro expand on Vertex AI to drive more sophisticated and secure AI innovation', url: 'https://cloud.google.com/blog/products/ai-machine-learning/expanding-gemini-2-5-flash-and-pro-capabilities' }
                ]
            }
        },
        {
            id: 'signgemma', name: 'SignGemma', company: 'Google', type: '開源', releaseDate: '2025-05-21',
            tags: ['專業化', '手語翻譯', '無障礙'],
            summary: '專門用於將手語（特別是美國手語 ASL）翻譯成口語文本的模型，是 AI 包容性的重要一步。',
            details: {
                '模型大小與架構': '屬於 Gemma 模型家族，具體授權條款和架構尚未詳細說明。',
                '訓練資料與方法': '專注於手語資料訓練。',
                '模型能力與用途': '翻譯手語。被譽為迄今為止在這方面「能力最強的模型」。',
                'official_source': [
                    { organisation: 'Google I/O', year: 2025, title: 'Building with AI: highlights for developers at Google I/O', url: 'https://blog.google/technology/developers/google-ai-developer-updates-io-2025/' }
                ]
            }
        },
        {
            id: 'medgemma', name: 'Google MedGemma (4B & 27B)', company: 'Google DeepMind (Google Health AI)', type: '開源', releaseDate: '2025-05-30',
            tags: ['醫療AI', '多模態醫療', '文本理解', '影像分析', '開源'],
            summary: 'Google開源的基於Gemma3架構的醫療領域專用模型系列，包括4B多模態（影像+文本）和27B文本專用版本，旨在輔助醫療文本和影像理解。',
            details: {
                '模型大小與架構': '基於Gemma3。4B參數模型(多模態：醫療圖像+文本，內置影像編碼器)，27B參數模型(文本專用)。上下文長度128K tokens。',
                '訓練資料與方法': '基於Gemma3通用能力，大規模醫療資料預訓練和微調。4B預訓練醫學影像與報告。27B聚焦醫學文檔、論文、對話。指令微調。使用經過去識別化的資料訓練。',
                '模型能力與用途': '輔助醫療文本和影像理解。放射報告生成、臨床筆記轉換總結、分診建議、醫療知識問答。4B看圖說話，27B深入臨床文本理解。',
                '效能與基準': '放射報告生成接近專科醫生。臨床問答(HealthSearchQA)與GPT-4.5-turbo等相當。HealthBench匹敵GPT-4.5級別。4B在MURA骨骼X光分類開源最優。',
                '技術創新': '醫療領域專精與開源。結合多模態學習與長上下文。內建隱私保護設計。選擇性激活和高效推理優化。',
                'official_source': [
                    { organisation: 'Google Deep Mind', year: 2025, title: 'MedGemma', url: 'https://deepmind.google/models/gemma/medgemma/' },
                    { organisation: 'Google Cloud Vertex AI', year: 2025, title: 'MedGemma | Health AI Developer Foundations', url: 'https://console.cloud.google.com/vertex-ai/publishers/google/model-garden/medgemma' },
                    { organisation: 'Hugging Face', year: 2025, title: 'google/medgemma-4b-it', url: 'https://huggingface.co/' }
                ]
            }
        },
         {
            id: 'claude4', name: 'Claude 4 Opus & Sonnet 4', company: 'Anthropic', type: '閉源', releaseDate: '2025-05-23',
            tags: ['程式編寫', '增強推理', '代理能力', '企業應用'],
            summary: 'Claude 系列的最新一代，Opus 4 號稱世界最佳程式編寫模型，Sonnet 4 則為 GitHub Copilot 提供支援。引入「延伸思考」與混合推理模式。',
            details: {
                '模型大小與架構': '專有混合模型，具有近乎即時回應和「延伸思考」(extended thinking) / 混合推理模式、並行工具使用能力和改善的記憶力。上下文視窗 200k token (Opus 4)。',
                '訓練資料與方法': '大規模互聯網文本預訓練，透過憲法式AI原則和人類反饋強化學習。引入混合推理訓練，多輪紅隊測試與安全優化。',
                '模型能力與用途': 'Opus 4 擅長複雜問題解決、長時間任務、AI 代理、研究、寫作、科學發現，編碼能力頂尖。Sonnet 4 平衡效能與效率，具卓越程式編寫和推理能力，支援高併發應用。兩者均支援平行工具使用和增強記憶機制。Claude Code功能與IDE深度整合。',
                'official_source': [
                    { organisation: 'Anthropic', year: 2025, title: 'Introducing Claude 4', url: 'https://www.anthropic.com/news/claude-4' },
                    { organisation: 'Anthropic', year: 2025, title: 'A day with Claude', url: 'https://youtu.be/oqUclC3gqKs?si=DRQc7Y8z9qM5PFZx' }
                ]
            }
        },
        {
            id: 'mistral_agents_api', name: 'Mistral Agents API', company: 'Mistral AI', type: '混合', releaseDate: '2025-05-27',
            tags: ['代理能力', 'API'],
            summary: '一個簡化 AI 代理開發的 API，內建多種工具連接器（程式碼執行、圖像生成、網路搜尋），並支援代理協調以處理複雜問題。',
            details: {
                '模型大小與架構': '結合專有模型 (Medium 3) 和開源模型 (Devstral) 作為代理的「大腦」。',
                '訓練資料與方法': 'N/A (API 產品)',
                '模型能力與用途': '支援程式碼執行、圖像生成、網路搜尋。具備持久記憶體和對話分支功能，旨在降低開發者建構複雜 AI 代理的門檻。',
                'official_source': [
                    { organisation: 'Mistral AI', year: 2025, title: 'Build AI agents with the Mistral Agents API', url: 'https://mistral.ai/news/agents-api' }
                ]
            }
        },
        {
            id: 'codestral_embed', name: 'Codestral Embed', company: 'Mistral AI', type: '混合', releaseDate: '2025-05-28',
            tags: ['專業化', '程式編寫', '嵌入'],
            summary: '專為程式碼設計的嵌入模型，用於增強 RAG、語義程式碼搜尋和程式碼分析等應用的效能。',
            details: {
                '模型大小與架構': '專用嵌入模型，可將程式碼轉換為數值向量表示。最大 token 限制 8k。',
                '訓練資料與方法': '專為程式碼訓練。',
                '模型能力與用途': '檢索增強生成 (RAG)、語義程式碼搜尋、程式碼相似性檢測、重複檢測、語義聚類。聲稱效能優於多個現有模型。',
                'official_source': [
                    { organisation: 'Mistral AI', year: 2025, title: 'Codestral Embed', url: 'https://mistral.ai/news/codestral-embed' }
                ]
            }
        },
        {
            id: 'devstral_small', name: 'Devstral Small (24B)', company: 'Mistral AI & All Hands AI', type: '開源', releaseDate: '2025-05-21',
            tags: ['開源', '代理能力', '程式編寫'],
            summary: '一個 24B 參數的開源程式編寫代理模型，可在消費級 GPU 本地運行，並在 SWE-Bench 上取得開源模型第一的成績。專為軟體工程代理任務訓練。',
             details: {
                '模型大小與架構': '240 億參數，基於 Mistral Small 3.1 架構微調（移除視覺部分）。上下文視窗 128k token。Apache 2.0 授權。',
                '訓練資料與方法': '使用約2.5萬對 GitHub Issue 與對應代碼修改的資料進行微調 (SWE-Bench資料集)。採用 agentic 框架 (OpenHands) 訓練。',
                '模型能力與用途': '使用工具探索程式碼庫、編輯多文件、提出錯誤修復/新功能建議、自動化軟體工程生命週期。可在單卡GPU運行。',
                'official_source': [
                    { organisation: 'Mistral AI', year: 2025, title: 'Devstral', url: 'https://mistral.ai/news/devstral' },
                    { organisation: 'Kaggle', year: 2025, title: 'Devstral-Small-2505 - Mistral AI', url: 'https://www.kaggle.com/models/mistral-ai/devstral-small-2505' },
                    { organisation: 'InfoQ', year: 2025, title: 'Mistral Releases Devstral, an Open-Source LLM for Software Engineering Agents', url: 'https://www.infoq.com/news/2025/05/mistral-devstral-agentic/' }
                ]
            }
        },
        {
            id: 'mistral_medium_3', name: 'Mistral Medium 3', company: 'Mistral AI', type: '閉源', releaseDate: '2025-05-07',
            tags: ['多模態', '企業級', '成本效益'],
            summary: '一個平衡效能與成本的企業級模型，具備高階推理、程式編寫和多模態能力（文本和圖像輸入），提供靈活的部署選項。',
            details: {
                '模型大小與架構': '「中型模型」(數百億級別)，採用經優化的 Transformer 架構。上下文視窗 128k 輸入，4k 輸出。支援多模態輸入。',
                '訓練資料與方法': '預訓練數據規模與大型模型相當，但著重效率。強化程式碼和STEM領域。採用混合雲部署訓練及架構改進。',
                '模型能力與用途': '文件分析、摘要、對話、函數呼叫、代理工作流程。支援程式編寫(80+語言)、數理推理。可本地私有或雲端運行。',
                '效能與基準': 'MMLU (85.6%), GSM8K (91.9%), HumanEval (80.1%), MBPP (82.6%), MMMU (66.1%), DocVQA (95.3%), AI2D (93.7%), ChartQA (82.6%)。聲稱效能達頂尖模型90%以上，成本僅1/8。',
                '技術創新': '高效率架構，以中等規模實現接近巨型模型的性能。易部署性。',
                'official_source': [
                    { organisation: 'Mistral AI', year: 2025, title: 'Medium is the new large.', url: 'https://mistral.ai/news/mistral-medium-3' },
                    { organisation: 'GitHub', year: 2025, title: 'Mistral Medium 3 (25.05) is now generally available', url: 'https://github.com/marketplace/models/azureml-mistral/mistral-medium-2505' },
                    { organisation: 'NVIDIA Build', year: 2025, title: 'mistral-medium-3-instruct Model by Mistral AI', url: 'https://build.nvidia.com/mistralai/mistral-medium-3-instruct/modelcard' }
                ]
            }
        },
        {
            id: 'phi4reasoningplus', name: 'Microsoft Phi-4-Reasoning-Plus', company: 'Microsoft Research', type: '開源', releaseDate: '2025-05-05',
            tags: ['增強推理', '數學', '科學問答', '程式編寫', '可解釋性AI'],
            summary: '微軟發布的14B參數開源研究模型，專精於複雜推理，特色是能輸出透明的鏈式思考過程(<think>...</think>)。',
            details: {
                '模型大小與架構': '140億參數 Transformer 模型，32K tokens 上下文窗口。增加推理頭和雙階段輸出格式。',
                '訓練資料與方法': '混合監督和強化學習。以高品質鏈式思考(CoT)示例資料微調Phi-4，融合合成CoT數據及AIRT紅隊安全訓練。',
                '模型能力與用途': '複雜推理、數學、科學問答、程式編寫。輸出隱含推理過程。內建JSON函數調用結構。',
                '效能與基準': 'AIME: 81.3, GPQA-Diamond: 78.0, LiveCodeBench: 68.9, IFEval: 84.9, ArenaHard: 79.0. 在Toxigen敏感內容基準表現良好。',
                '技術創新': '透明鏈式推理，雙階段輸出格式，高品質CoT資料微調結合強化學習，內建工具調用。',
                'official_source': [
                    { organisation: 'Hugging Face', year: 2025, title: 'One year of Phi: Small language models making big leaps in AI', url: 'https://azure.microsoft.com/en-us/blog/one-year-of-phi-small-language-models-making-big-leaps-in-ai/' },
                    { organisation: 'LinkedIn', year: 2025, title: 'Post by Mahmoud Rabie', url: 'https://www.linkedin.com/posts/mahmoudrabie2004_opensourcellms-didyouknowthat-favikon-activity-7323902965881155584-Kbwd/' }
                ]
            }
        },
        {
            id: 'dream7b', name: 'Dream 7B', company: '香港大學 & 華為諾亞方舟實驗室', type: '開源', releaseDate: '2025-05-15',
            tags: ['擴散模型', '文本生成', '規劃任務', '開源'],
            summary: '由香港大學與華為諾亞方舟實驗室共同開發的7B參數開源擴散式大型語言模型，在規劃任務上展現優勢。',
            details: {
                '模型大小與架構': '70億參數，離散擴散模型。初始化自Qwen2.5-7B權重，透過mask-diffusion訓練。上下文長度8K。',
                '訓練資料與方法': 'Qwen2.5-7B知識起點，掩碼擴散訓練 (5800億token)，180萬條指令追蹤資料微調。',
                '模型能力與用途': '一般問答、數學推理、編程、規劃任務。擴散模型特有的全局約束考慮能力。任意順序生成，可調節擴散步驟。',
                '效能與基準': '整體表現大幅超越先前擴散式文本模型。與LLaMA3-8B、Qwen2.5-7B相當或更好。規劃任務上超越同規模AR模型，甚至擊敗DeepSeek V3。',
                '技術創新': '將擴散模型引入LLM並取得競爭性成果。結合AR與擴散優點。任意順序解碼和可調節步驟。上下文自適應加噪。',
                'official_source': [
                    { organisation: 'HKU NLP Group', year: 2025, title: 'Introducing Dream 7B', url: 'https://hkunlp.github.io/blog/2025/dream/?ref=producthunt' },
                    { organisation: 'GitHub', year: 2025, title: 'Dream-org on GitHub', url: 'https://github.com/HKUNLP/Dream' },
                    { organisation: 'Hugging Face', year: 2025, title: 'Dream 7B on Hugging Face', url: 'https://huggingface.co/Dream-org/Dream-v0-Instruct-7B' }
                ]
            }
        },
        {
            id: 'google_veo_3',
            name: 'Google Veo 3',
            company: 'Google DeepMind',
            type: '閉源',
            releaseDate: '2025-05-20',
            tags: ['多模態', '影片生成', '創意工具', 'AI電影製作'],
            summary: 'Google 最先進的影片生成模型，整合於 Flow AI 電影製作工具，旨在賦予電影製作人和故事創作者強大的創意控制、提示遵循度和真實感，Veo 3 更支援原生音訊生成。',
            details: {
                '模型大小與架構': '最先進的影片生成模型。Veo 3 版本支援高達 4K 解析度輸出與原生音訊生成。透過 Flow 工具提供。',
                '訓練資料與方法': '基於 Google DeepMind 在生成模型上的研究，具體訓練細節未公開。',
                '模型能力與用途': '根據文字、圖像提示生成高品質影片。提供細膩的電影風格控制、角色一致性維持、場景建構、風格轉換、原生音訊（包含音效與對白）生成等功能。主要透過 Flow AI 電影製作工具進行創作。',
                '技術創新': '顯著提升生成影片的真實感、物理模擬準確度與提示理解能力。Veo 3 新增原生音訊生成。Flow 工具提供進階攝影機控制、參考圖像引導生成、影片風格遷移、物件添加/移除、內容擴展繪製 (outpainting) 等專業功能。',
                'demoVideos': [
                    { name: 'Veo 3 Demo 1', thumbnailUrl: 'https://via.placeholder.com/150/CCCCCC/FFFFFF?Text=Video', videoUrl: 'https://ai-news-tokenawsstackid10.s3.amazonaws.com/videos/[2025.06.03][Manus]20250603130300_x_video_20250603130300.mp4' },
                    { name: 'Veo 3 Demo 2', thumbnailUrl: 'https://via.placeholder.com/150/CCCCCC/FFFFFF?Text=Video', videoUrl: 'https://ai-news-tokenawsstackid10.s3.amazonaws.com/videos/[2025.06.03][Manus]20250603130440_x_video_20250603130440.mp4' },
                    { name: 'Veo 3 Demo 3', thumbnailUrl: 'https://via.placeholder.com/150/CCCCCC/FFFFFF?Text=Video', videoUrl: 'https://ai-news-tokenawsstackid10.s3.amazonaws.com/videos/[2025.06.03][Manus]20250603130546_x_video_20250603130546.mp4' },
                    { name: 'Veo 3 Demo 4', thumbnailUrl: 'https://via.placeholder.com/150/CCCCCC/FFFFFF?Text=Video', videoUrl: 'https://ai-news-tokenawsstackid10.s3.amazonaws.com/videos/[2025.06.03][Manus]20250603131003_x_video_20250603131003.mp4' },
                    { name: 'Veo 3 Demo 5', thumbnailUrl: 'https://via.placeholder.com/150/CCCCCC/FFFFFF?Text=Video', videoUrl: 'https://ai-news-tokenawsstackid10.s3.amazonaws.com/videos/[2025.06.03][Manus]20250603131116_x_video_20250603131116.mp4' }
                ],
                'official_source': [
                    { organisation: 'Google DeepMind', year: 2025, title: 'Veo - Our state-of-the-art video generation model', url: 'https://deepmind.google/models/veo/' },
                    { organisation: 'Google Blog', year: 2025, title: 'Meet Flow: AI-powered filmmaking with Veo 3', url: 'https://blog.google/technology/ai/google-flow-veo-ai-filmmaking-tool/' }
                ]
            }
        },
        {
            id: 'kernelllm', name: 'Meta KernelLLM (8B)', company: 'Meta AI', type: '開源', releaseDate: '2025-05-24',
            tags: ['GPU核心生成', '程式碼優化', 'PyTorch', 'Triton', '開源'],
            summary: 'Meta AI 開源的8B參數模型，專為將PyTorch模組自動轉換為高效的Triton GPU kernel而訓練。',
            details: {
                '模型大小與架構': '80億參數 Transformer。基於Llama 3.1 70B指令調優版二次微調/知識萃取。針對GPU Kernel代碼生成任務調整。',
                '訓練資料與方法': '約25K對 PyTorch實現與對應Triton寫法的代碼樣本微調。加入KernelBench測試問題。指導學習從Llama3.1大模型提取知識。',
                '模型能力與用途': '自動將PyTorch程式碼轉換成Triton GPU kernel，優化深度學習模型執行效率。簡化GPU編程。',
                '效能與基準': 'KernelBench-Triton單輪模式下超越GPT-4o和DeepSeek V3。多輪互動超越DeepSeek R1。',
                '技術創新': '首個GPU Kernel生成專用LLM。微調於外部代碼對。引入單元測試驗證。高效壓縮大模型知識的方法。',
                'official_source': [
                    { organisation: 'Hugging Face', year: 2025, title: 'facebook/KernelLLM', url: 'https://huggingface.co/facebook/KernelLLM' },
                    { organisation: 'Meta Engineering Blog', year: 2025, title: 'Meta Engineering Blog on KernelLLM', url: 'https://engineering.fb.com/category/ai-research/' },
                    { organisation: 'LinkedIn', year: 2025, title: 'LinkedIn Report on KernelLLM', url: 'https://www.linkedin.com/' }
                ]
            }
        }
    ],
    benchmarks: {
        'SWE-Bench': {
            label: 'SWE-Bench (程式編寫)',
            data: [
                { model: 'Claude Opus 4', score: 72.5 },
                { model: 'Devstral Small (24B)', score: 46.8 },
                { model: 'Claude Sonnet 4', score: 72.7 },
                { model: 'OpenAI Operator (o3)', score: 69.1 }
            ],
            note: '分數越高越好。衡量模型解決真實世界軟體工程問題的能力。'
        },
         'Terminal-bench': {
            label: 'Terminal-bench (終端操作)',
            data: [
                { model: 'Claude Opus 4', score: 43.2 },
                { model: 'Claude Sonnet 4', score: 35.5 }
            ],
            note: '分數越高越好。衡量在類終端環境中執行編碼任務的能力。'
        },
        'WebDev Arena': {
            label: 'WebDev Arena (網頁開發)',
            data: [
                {
                  model: "Claude Opus 4 (20250514)",
                  score: 1415.82,
                  rank: 1,
                  ci: { plus: 17.16, minus: 15.68 },
                  votes: 1494,
                  organization: "Anthropic",
                  license: "Proprietary"
                },
                {
                  model: "Gemini-2.5-Pro-Preview-05-06",
                  score: 1409.06,
                  rank: 1,
                  ci: { plus: 14.77, minus: 10.38 },
                  votes: 3740,
                  organization: "Google",
                  license: "Proprietary"
                },
                {
                  model: "Claude Sonnet 4 (20250514)",
                  score: 1386.16,
                  rank: 1,
                  ci: { plus: 16.84, minus: 15.48 },
                  votes: 1490,
                  organization: "Anthropic",
                  license: "Proprietary"
                },
                {
                  model: "Claude 3.7 Sonnet (20250219)",
                  score: 1357.09,
                  rank: 4,
                  ci: { plus: 7.91, minus: 7.57 },
                  votes: 7481,
                  organization: "Anthropic",
                  license: "Proprietary"
                },
                {
                  model: "Gemini-2.5-Flash-Preview-05-20",
                  score: 1313.36,
                  rank: 5,
                  ci: { plus: 12.15, minus: 11.34 },
                  votes: 2312,
                  organization: "Google",
                  license: "Proprietary"
                },
                {
                  model: "GPT-4.1-2025-04-14",
                  score: 1256.31,
                  rank: 6,
                  ci: { plus: 9.69, minus: 8.85 },
                  votes: 5278,
                  organization: "OpenAI",
                  license: "Proprietary"
                },
                {
                  model: "Claude 3.5 Sonnet (20241022)",
                  score: 1237.74,
                  rank: 7,
                  ci: { plus: 4.49, minus: 5.69 },
                  votes: 26338,
                  organization: "Anthropic",
                  license: "Proprietary"
                },
                // 以下多個模型并列 Rank 8：
                {
                  model: "DeepSeek-V3-0324",
                  score: 1206.73,
                  rank: 8,
                  ci: { plus: 16.75, minus: 18.20 },
                  votes: 1097,
                  organization: "DeepSeek",
                  license: "MIT"
                },
                {
                  model: "DeepSeek-R1",
                  score: 1198.63,
                  rank: 8,
                  ci: { plus: 9.96, minus: 8.79 },
                  votes: 3760,
                  organization: "DeepSeek",
                  license: "MIT"
                },
                {
                  model: "GPT-4.1-mini-2025-04-14",
                  score: 1185.77,
                  rank: 8,
                  ci: { plus: 9.95, minus: 9.58 },
                  votes: 3417,
                  organization: "OpenAI",
                  license: "Proprietary"
                },
                {
                  model: "o3-2025-04-16",
                  score: 1188.12,
                  rank: 8,
                  ci: { plus: 9.22, minus: 10.53 },
                  votes: 4209,
                  organization: "OpenAI",
                  license: "Proprietary"
                },
                {
                  model: "Qwen3-235B-A22B",
                  score: 1181.76,
                  rank: 8,
                  ci: { plus: 14.53, minus: 14.89 },
                  votes: 2416,
                  organization: "Alibaba",
                  license: "Apache 2.0"
                },
                {
                  model: "o3-mini-high (20250131)",
                  score: 1136.29,
                  rank: 8,
                  ci: { plus: 12.73, minus: 11.46 },
                  votes: 2984,
                  organization: "OpenAI",
                  license: "Proprietary"
                },
                // Rank 10：
                {
                  model: "Mistral Medium 3",
                  score: 1163.82,
                  rank: 10,
                  ci: { plus: 15.56, minus: 14.61 },
                  votes: 1840,
                  organization: "Mistral",
                  license: "Proprietary"
                },
                // Rank 13：（并列）
                {
                  model: "Gemini-2.5-Flash-Preview-04-17",
                  score: 1143.60,
                  rank: 13,
                  ci: { plus: 12.49, minus: 12.55 },
                  votes: 3262,
                  organization: "Google",
                  license: "Proprietary"
                },
                {
                  model: "early-grok-3",
                  score: 1142.79,
                  rank: 13,
                  ci: { plus: 8.19, minus: 7.79 },
                  votes: 6284,
                  organization: "xAI",
                  license: "Proprietary"
                },
                // Rank 14：
                {
                  model: "Claude 3.5 Haiku (20241022)",
                  score: 1132.96,
                  rank: 14,
                  ci: { plus: 4.88, minus: 4.34 },
                  votes: 21639,
                  organization: "Anthropic",
                  license: "Proprietary"
                },
                // Rank 18：（并列多個）
                {
                  model: "o1 (20241217)",
                  score: 1044.91,
                  rank: 18,
                  ci: { plus: 7.04, minus: 7.61 },
                  votes: 9271,
                  organization: "OpenAI",
                  license: "Proprietary"
                },
                {
                  model: "o1-mini (20240912)",
                  score: 1041.86,
                  rank: 18,
                  ci: { plus: 6.63, minus: 7.17 },
                  votes: 13828,
                  organization: "OpenAI",
                  license: "Proprietary"
                },
                {
                  model: "o4-mini (2025-04-16)",
                  score: 1099.90, //—在表中第四行已經出现，但此處稍作校正，保持唯一条目
                  rank: 18,
                  ci: { plus: 10.18, minus: 9.70 },
                  votes: 2911,
                  organization: "OpenAI",
                  license: "Proprietary"
                },
                {
                  model: "o3-mini (20250131)",
                  score: 1091.72,
                  rank: 18,
                  ci: { plus: 9.35, minus: 9.03 },
                  votes: 6391,
                  organization: "OpenAI",
                  license: "Proprietary"
                },
                {
                  model: "Gemini-2.0-Pro-Exp-02-05",
                  score: 1088.87,
                  rank: 18,
                  ci: { plus: 5.57, minus: 5.45 },
                  votes: 11936,
                  organization: "Google",
                  license: "Proprietary"
                },
                // Rank 21：（并列多個）
                {
                  model: "Gemini-2.0-Flash-001",
                  score: 1039.87,
                  rank: 21,
                  ci: { plus: 5.78, minus: 6.52 },
                  votes: 10533,
                  organization: "Google",
                  license: "Proprietary"
                },
                {
                  model: "Gemini-2.0-Flash-Thinking-01-21",
                  score: 1029.63,
                  rank: 21,
                  ci: { plus: 17.99, minus: 22.64 },
                  votes: 1064,
                  organization: "Google",
                  license: "Proprietary"
                },
                {
                  model: "Llama-4-Maverick-17B-128E-Instruct",
                  score: 1025.01,
                  rank: 22,
                  ci: { plus: 10.26, minus: 9.10 },
                  votes: 5164,
                  organization: "Meta",
                  license: "Llama 4"
                },
                {
                  model: "Gemini-2.0-Flash-Exp",
                  score: 980.25,
                  rank: 26,
                  ci: { plus: 6.06, minus: 5.50 },
                  votes: 14485,
                  organization: "Google",
                  license: "Proprietary"
                },
                {
                  model: "Qwen2.5-Max",
                  score: 974.97,
                  rank: 26,
                  ci: { plus: 7.96, minus: 6.73 },
                  votes: 11110,
                  organization: "Alibaba",
                  license: "Proprietary"
                },
                {
                  model: "DeepSeek-V3",
                  score: 959.80,
                  rank: 27,
                  ci: { plus: 7.66, minus: 8.24 },
                  votes: 7717,
                  organization: "DeepSeek",
                  license: "DeepSeek"
                },
                {
                  model: "Qwen2.5-Coder-32B-Instruct",
                  score: 902.28,
                  rank: 30,
                  ci: { plus: 5.46, minus: 6.50 },
                  votes: 16252,
                  organization: "Alibaba",
                  license: "Apache 2.0"
                },
                {
                  model: "Llama-4-Scout-17B-16E-Instruct",
                  score: 899.91,
                  rank: 30,
                  ci: { plus: 25.95, minus: 27.43 },
                  votes: 692,
                  organization: "Meta",
                  license: "Llama 4"
                },
                {
                  model: "Gemini-1.5-Pro-002",
                  score: 892.51,
                  rank: 30,
                  ci: { plus: 5.48, minus: 5.69 },
                  votes: 15201,
                  organization: "Google",
                  license: "Proprietary"
                },
                {
                  model: "Llama-3.1-405B-Instruct",
                  score: 809.70,
                  rank: 33,
                  ci: { plus: 18.48, minus: 17.94 },
                  votes: 1117,
                  organization: "Meta",
                  license: "Llama 3.1"
                }
              ],
            note: '排名越低越好。衡量創建功能性網頁應用的能力。(2025 年 6 月 3 號早上 9 點 22 分截取)'
        },
        'MMLU': {
            label: 'MMLU (通用知識)',
            data: [
                { model: 'Mistral Medium 3', score: 85.6 },
                { model: 'Claude Sonnet 4', score: 83.4 },
                { model: 'OpenAI GPT-4.1', score: 86.4 },
                { model: 'Gemini 2.5 Pro', score: 90.0 }
            ],
            note: '分數越高越好。衡量模型的綜合知識水平。'
        },
        'HumanEval': {
            label: 'HumanEval (程式編寫)',
            data: [
                { model: 'Mistral Medium 3', score: 80.1 },
                { model: 'Claude Sonnet 4', score: 86 },
                { model: 'OpenAI Operator (o3)', score: 80 },
                { model: 'Gemini 2.5 Pro', score: 99 }
            ],
            note: '分數越高越好。'
        },
        'Phi4_Reasoning_Benchmarks': {
            label: 'Phi-4 Reasoning+ 基準綜合',
            data: [
                { model: 'Phi-4 Reasoning+ (AIME)', score: 81.3 },
                { model: 'Phi-4 Reasoning+ (GPQA-Diamond)', score: 78.0 },
                { model: 'Phi-4 Reasoning+ (LiveCodeBench)', score: 68.9 },
                { model: 'Phi-4 Reasoning+ (IFEval)', score: 84.9 },
                { model: 'Phi-4 Reasoning+ (ArenaHard)', score: 79.0 },
            ],
            note: '分數越高越好。Phi-4 Reasoning+ 在多項推理相關基準上的表現。'
        },
         'Mistral_Medium3_Additional': {
            label: 'Mistral Medium 3 附加基準',
            data: [
                { model: 'Mistral Medium 3 (GSM8K)', score: 91.9 },
                { model: 'Mistral Medium 3 (MBPP)', score: 82.6 },
                { model: 'Mistral Medium 3 (MMMU)', score: 66.1 },
                { model: 'Mistral Medium 3 (DocVQA)', score: 95.3 },
                { model: 'Mistral Medium 3 (AI2D)', score: 93.7 },
                { model: 'Mistral Medium 3 (ChartQA)', score: 82.6 },
            ],
            note: '分數越高越好。Mistral Medium 3 在多項數學、程式編寫及多模態基準上的表現。'
        }
    }
}; 