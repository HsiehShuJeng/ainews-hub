import { llmData } from './data.js';

let performanceChart;
let activeFilters = {
    company: [],
    type: [],
    tags: []
};
let currentSearchTerm = '';

export function initApp() {
    const tabs = document.querySelectorAll('.nav-tab');
    const contentTabs = document.querySelectorAll('.content-tab');
    const trendCards = document.querySelectorAll('.trend-card');
    const modelSearchInput = document.getElementById('model-search-input');
    
    function switchTab(tabName) {
        tabs.forEach(tab => {
            const isActive = tab.dataset.tab === tabName;
            tab.classList.toggle('tab-active', isActive);
            tab.classList.toggle('tab-inactive', !isActive);
        });
        contentTabs.forEach(content => {
            content.classList.toggle('hidden', content.id !== tabName);
        });
        
        if (tabName === 'performance') {
            const selector = document.getElementById('benchmark-selector');
            if (!performanceChart && selector) { // Check selector exists before init
                initPerformanceChart(); // Sets up selector & basic chart shell
            }
            
            if (selector) { 
                let benchmarkToLoad = selector.value;
                // If no value is selected, and benchmarks exist, pick the first one as default
                if (!benchmarkToLoad && llmData.benchmarks && Object.keys(llmData.benchmarks).length > 0) {
                    benchmarkToLoad = Object.keys(llmData.benchmarks)[0];
                    selector.value = benchmarkToLoad; // Update selector to reflect the default
                }

                if (benchmarkToLoad) {
                    updatePerformanceChart(benchmarkToLoad);
                } else if (llmData.benchmarks && Object.keys(llmData.benchmarks).length === 0) {
                    // Handle case where there are no benchmarks at all
                     const ctx = document.getElementById('performance-chart').getContext('2d');
                     if (performanceChart) performanceChart.destroy();
                     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                     ctx.font = "16px 'Noto Sans TC', sans-serif";
                     ctx.fillStyle = "#6b7280";
                     ctx.textAlign = "center";
                     ctx.fillText("無可用基準測試數據。", ctx.canvas.width / 2, ctx.canvas.height / 2);
                } else {
                    console.warn("Performance tab: No benchmark selected and no default could be determined, or selector not ready.");
                }
            } else {
                console.error("Benchmark selector not found when switching to performance tab.");
            }
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    trendCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const tag = e.currentTarget.dataset.filterTag;
            resetFilters();
            activeFilters.tags.push(tag);
            switchTab('explorer');
            renderModelExplorer(); 
        });
    });

    if (modelSearchInput) {
        modelSearchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value.trim().toLowerCase();
            if (currentSearchTerm) {
                activeFilters = { company: [], type: [], tags: [] };
                 document.querySelectorAll('.filter-btn').forEach(b => {
                    b.classList.remove('active');
                    b.classList.remove('bg-indigo-500', 'text-white');
                    b.classList.add('bg-gray-200', 'text-gray-700');
                 });
                 const allBtn = document.querySelector('[data-filter-type="all"]');
                 if (allBtn) {
                    allBtn.classList.add('active');
                    allBtn.classList.add('bg-indigo-500', 'text-white');
                    allBtn.classList.remove('bg-gray-200', 'text-gray-700');
                 }
            }
            renderModelExplorer();
        });
    }

    function initAppComponents() {
        switchTab('dashboard');
        renderTimeline();
        renderFilters();
        renderModelExplorer();
    }

    function renderTimeline() {
        console.log('[renderTimeline] Called');
        const timelineContainer = document.getElementById('timeline');
        
        if (!timelineContainer) {
            console.error("[renderTimeline] CRITICAL: Timeline container (<div id='timeline'>) not found in HTML.");
            return;
        }
        console.log('[renderTimeline] Timeline container found:', timelineContainer);

        if (!llmData || !llmData.models || llmData.models.length === 0) {
            console.warn('[renderTimeline] WARNING: llmData.models is undefined, null, or empty. Cannot render timeline items.');
            timelineContainer.innerHTML = '<p class="text-center text-gray-500">Timeline data is currently unavailable.</p>';
            return;
        }
        console.log('[renderTimeline] llmData.models count:', llmData.models.length, llmData.models);

        try {
            const sortedModels = [...llmData.models].sort((a, b) => {
                const dateA = new Date(String(a.releaseDate).replace('月初', '-01').replace('月中', '-15').replace('月底', '-28'));
                const dateB = new Date(String(b.releaseDate).replace('月初', '-01').replace('月中', '-15').replace('月底', '-28'));
                if (isNaN(dateA.getTime())) console.warn(`[renderTimeline] Invalid date for model A: ${a.name}, date: ${a.releaseDate}`);
                if (isNaN(dateB.getTime())) console.warn(`[renderTimeline] Invalid date for model B: ${b.name}, date: ${b.releaseDate}`);
                return dateA - dateB;
            });
            console.log('[renderTimeline] Sorted models count:', sortedModels.length, sortedModels);

            const timelineHTML = sortedModels.map(model => `
                <div class="mb-8 ml-4">
                    <div class="absolute w-3 h-3 bg-indigo-500 rounded-full -left-1.5 border border-white"></div>
                    <time class="mb-1 text-sm font-normal leading-none text-gray-500">${model.releaseDate}</time>
                    <h3 class="text-lg font-semibold text-gray-900">${model.name}</h3>
                    <p class="text-base font-normal text-gray-600">${model.summary}</p>
                    <button class="view-details-btn mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium" data-model-id="${model.id}">查看詳情 →</button>
                </div>
            `).join('');
            
            timelineContainer.innerHTML = timelineHTML;
            console.log('[renderTimeline] Timeline HTML generated and injected. Length:', timelineHTML.length);
            if (timelineHTML.length === 0 && llmData.models.length > 0) {
                console.warn("[renderTimeline] WARNING: Timeline HTML is empty, but there were models. Check mapping logic.");
            }

        } catch (error) {
            console.error('[renderTimeline] CRITICAL: Error during timeline rendering:', error);
            timelineContainer.innerHTML = '<p class="text-center text-red-500">An error occurred while rendering the timeline.</p>';
        }
        
        // Re-attach event listeners for view-details-btn if any were rendered
        // This was originally outside the try-catch, but should be conditional on timelineHTML actually having buttons
        if (timelineContainer.querySelectorAll('.view-details-btn').length > 0) {
             document.querySelectorAll('#timeline .view-details-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const modelId = e.currentTarget.dataset.modelId;
                    showModal(modelId);
                });
            });
            console.log('[renderTimeline] Event listeners for view-details-btn re-attached.');
        } else {
            console.log('[renderTimeline] No view-details-btn found to attach listeners to.');
        }
    }

    function renderFilters() {
        const filtersContainer = document.getElementById('filters');
        const companies = [...new Set(llmData.models.map(m => m.company))].sort();
        const types = [...new Set(llmData.models.map(m => m.type))].sort();
        let allTags = [];
        llmData.models.forEach(m => {
            if(m.tags) allTags.push(...m.tags);
        });
        const uniqueTags = [...new Set(allTags)].sort();

        let html = '<div class="w-full mb-4"><span class="font-semibold text-gray-700">篩選條件:</span> <button class="filter-btn active ml-2" data-filter-type="all" data-filter-value="all">全部重置</button></div>';
        
        html += '<div class="w-full mb-3"><strong class="text-sm text-gray-600">依公司:</strong> ';
        html += companies.map(c => `<button class="filter-btn" data-filter-type="company" data-filter-value="${c}">${c}</button>`).join('');
        html += '</div>';

        html += '<div class="w-full mb-3"><strong class="text-sm text-gray-600">依類型:</strong> ';
        html += types.map(t => `<button class="filter-btn" data-filter-type="type" data-filter-value="${t}">${t}</button>`).join('');
        html += '</div>';
        
        html += '<div class="w-full"><strong class="text-sm text-gray-600">依標籤:</strong> ';
        html += uniqueTags.map(t => `<button class="filter-btn" data-filter-type="tags" data-filter-value="${t}">${t}</button>`).join('');
        html += '</div>';

        filtersContainer.innerHTML = html;
        document.querySelectorAll('.filter-btn').forEach(btn => btn.addEventListener('click', handleFilterClick));
    }
    
    function handleFilterClick(e) {
        const btn = e.currentTarget;
        const type = btn.dataset.filterType;
        const value = btn.dataset.filterValue;

        currentSearchTerm = '';
        if (document.getElementById('model-search-input')) {
            document.getElementById('model-search-input').value = '';
        }

        if (type === 'all') {
            resetFilters();
        } else {
            const index = activeFilters[type].indexOf(value);
            if (index > -1) {
                activeFilters[type].splice(index, 1);
                btn.classList.remove('active');
                btn.classList.remove('bg-indigo-500', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            } else {
                activeFilters[type].push(value);
                btn.classList.add('active');
                btn.classList.add('bg-indigo-500', 'text-white');
                btn.classList.remove('bg-gray-200', 'text-gray-700');
            }
            document.querySelector('[data-filter-type="all"]').classList.remove('active');
             document.querySelector('[data-filter-type="all"]').classList.remove('bg-indigo-500', 'text-white');
            document.querySelector('[data-filter-type="all"]').classList.add('bg-gray-200', 'text-gray-700');

            if (activeFilters.company.length === 0 && activeFilters.type.length === 0 && activeFilters.tags.length === 0) {
                 document.querySelector('[data-filter-type="all"]').classList.add('active');
                 document.querySelector('[data-filter-type="all"]').classList.add('bg-indigo-500', 'text-white');
                 document.querySelector('[data-filter-type="all"]').classList.remove('bg-gray-200', 'text-gray-700');
            }
        }
        renderModelExplorer();
    }

    function resetFilters() {
         activeFilters = { company: [], type: [], tags: [] };
         currentSearchTerm = '';
         if (document.getElementById('model-search-input')) {
            document.getElementById('model-search-input').value = '';
         }
         document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('active');
            b.classList.remove('bg-indigo-500', 'text-white');
            b.classList.add('bg-gray-200', 'text-gray-700');
         });
         const allBtn = document.querySelector('[data-filter-type="all"]');
         allBtn.classList.add('active');
         allBtn.classList.add('bg-indigo-500', 'text-white');
         allBtn.classList.remove('bg-gray-200', 'text-gray-700');
    }
    
    function styleFilterButtons() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.add('px-3', 'py-1', 'text-xs', 'rounded-full', 'mr-1', 'mb-1', 'transition-colors', 'duration-150');
            if (btn.classList.contains('active')) {
                btn.classList.add('bg-indigo-500', 'text-white');
                btn.classList.remove('bg-gray-200', 'text-gray-700');
            } else {
                btn.classList.add('bg-gray-200', 'text-gray-700');
                btn.classList.remove('bg-indigo-500', 'text-white');
            }
        });
    }

    function renderModelExplorer() {
        const grid = document.getElementById('model-grid');
        const noResults = document.getElementById('no-results');
        
        let filteredModels = llmData.models;

        if (currentSearchTerm) {
            filteredModels = filteredModels.filter(model => {
                const nameMatch = model.name.toLowerCase().includes(currentSearchTerm);
                const summaryMatch = model.summary.toLowerCase().includes(currentSearchTerm);
                const companyMatch = model.company.toLowerCase().includes(currentSearchTerm);
                return nameMatch || summaryMatch || companyMatch;
            });
        } else {
            filteredModels = filteredModels.filter(model => {
                const companyMatch = activeFilters.company.length === 0 || activeFilters.company.includes(model.company);
                const typeMatch = activeFilters.type.length === 0 || activeFilters.type.includes(model.type);
                const tagMatch = activeFilters.tags.length === 0 || (model.tags && activeFilters.tags.every(t => model.tags.includes(t)));
                return companyMatch && typeMatch && tagMatch;
            });
        }

        if (filteredModels.length === 0) {
            grid.innerHTML = '';
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
            grid.innerHTML = filteredModels.map(model => `
                <div class="border border-gray-200 rounded-lg p-5 bg-white trend-card cursor-pointer" data-model-id="${model.id}">
                    <div class="flex justify-between items-start pr-2">
                        <h3 class="text-lg font-bold text-gray-800 mr-2">${model.name}</h3>
                        <span class="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${model.type === '開源' ? 'bg-green-100 text-green-800' : (model.type === '閉源' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800')}">${model.type}</span>
                    </div>
                    <p class="text-sm text-gray-500 mt-1">${model.company}</p>
                    <p class="text-sm text-gray-600 mt-3 h-20 overflow-hidden">${model.summary}</p>
                    <div class="mt-4 flex flex-wrap gap-1">
                        ${model.tags && model.tags.map(tag => `<span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">${tag}</span>`).join('')}
                    </div>
                </div>
            `).join('');
        }

        document.querySelectorAll('#model-grid .trend-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const modelId = e.currentTarget.dataset.modelId;
                showModal(modelId);
            });
        });
        
        styleFilterButtons();
    }

    function showModal(modelId) {
        console.log(`[showModal] Called with modelId: ${modelId}`);
        const model = llmData.models.find(m => String(m.id) === String(modelId));
        const modalContainer = document.getElementById('modal-container');

        if (model) {
            console.log(`[showModal] Found model: ${model.name}`);
        } else {
            console.error(`[showModal] Model not found for ID: ${modelId}. Modal will not be shown.`);
            return;
        }

        if (!modalContainer) {
            console.error('[showModal] Critical: modal-container element not found in DOM!');
            return;
        }

        let detailsHtml = Object.entries(model.details)
            .filter(([key]) => key !== 'official_source' && key !== 'demoVideos') // Exclude sources and demo videos from this section
            .map(([key, value]) => {
                let formattedValue = value;
                if (typeof value === 'string') {
                    formattedValue = value.replace(/\n/g, '<br>');
                }
                return `<div class="mb-3"><strong class="font-semibold text-gray-700">${key}:</strong> <span class="text-gray-600">${formattedValue}</span></div>`;
            })
            .join('');

        if (model.details.official_source && model.details.official_source.length > 0) {
            detailsHtml += `<div class="mt-4"><strong class="font-semibold text-gray-700">官方來源:</strong><ul class="list-disc list-inside mt-1 text-sm">`;
            model.details.official_source.forEach(source => {
                detailsHtml += `<li><a href="${source.url}" target="_blank" class="text-indigo-600 hover:text-indigo-800">${source.title} (${source.organisation}, ${source.year})</a></li>`;
            });
            detailsHtml += `</ul></div>`;
        }

        // Add Demo Videos Section
        if (model.details.demoVideos && model.details.demoVideos.length > 0) {
            detailsHtml += `<div class="mt-6"><strong class="font-semibold text-gray-700 mb-2 block">示範影片:</strong>`;
            detailsHtml += `<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">`;
            model.details.demoVideos.forEach((video, index) => {
                detailsHtml += `
                    <div class="cursor-pointer group relative" data-video-url="${video.videoUrl}" onclick="playDemoVideo('${video.videoUrl}', '${video.name}')">
                        <img src="${video.thumbnailUrl}" alt="${video.name}" class="w-full h-24 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200">
                        <div class="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 flex items-center justify-center rounded-lg transition-opacity duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white opacity-80 group-hover:opacity-100" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <p class="text-xs text-center mt-1 text-gray-600 group-hover:text-indigo-600">${video.name}</p>
                    </div>`;
            });
            detailsHtml += `</div></div>`;
        }

        const modalContent = `
            <div id="model-detail-modal" class="modal-custom-backdrop fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center p-4 z-50">
                <div class="modal-custom-content relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto p-6 max-h-[90vh] overflow-y-auto">
                    <div class="flex justify-between items-start mb-4">
                        <h2 class="text-2xl font-bold text-gray-800">${model.name}</h2>
                        <button id="close-modal-btn" class="text-gray-400 hover:text-gray-600 transition duration-150">
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div class="text-sm text-gray-500 mb-1"><strong>公司:</strong> ${model.company} | <strong>類型:</strong> ${model.type} | <strong>發布日期:</strong> ${model.releaseDate}</div>
                    <div class="mb-4">
                        ${model.tags.map(tag => `<span class="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">${tag}</span>`).join('')}
                    </div>
                    <p class="text-gray-700 mb-4">${model.summary}</p>
                    <div class="border-t border-gray-200 pt-4">
                        ${detailsHtml}
                    </div>
                </div>
            </div>
        `;
        modalContainer.innerHTML = modalContent;
        modalContainer.classList.remove('hidden');
        document.body.classList.add('overflow-hidden'); 
        document.getElementById('close-modal-btn').addEventListener('click', closeModal);
        console.log('[showModal] Modal displayed for', model.name);
    }

    function closeModal() {
        const modalContainer = document.getElementById('modal-container');
        modalContainer.innerHTML = ''; 
        modalContainer.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }

    function getReleaseDateFromModelString(modelName) {
        if (!modelName || typeof modelName !== 'string') {
            // console.warn('getReleaseDateFromModelString: Invalid modelName input:', modelName);
            return null;
        }
        try {
            let match;

            // Order: YYYYMMDD, YYYY-MM-DD (in parens), YYYY-MM-DD (direct), MM-DD (preview/release/exp)
            
            // Regex for YYYYMMDD in parentheses, e.g., "(20250514)"
            match = modelName.match(/\((\d{4})(\d{2})(\d{2})\)/);
            if (match && match[1] && match[2] && match[3]) {
                const year = parseInt(match[1], 10);
                const month = parseInt(match[2], 10) - 1; 
                const day = parseInt(match[3], 10);
                if (!isNaN(year) && !isNaN(month) && !isNaN(day) && month >= 0 && month <= 11 && day >= 1 && day <= 31) {
                    return new Date(year, month, day);
                }
            }

            // Regex for YYYY-MM-DD in parentheses, e.g., "(2025-05-14)"
            match = modelName.match(/\((\d{4})-(\d{2})-(\d{2})\)/);
            if (match && match[1] && match[2] && match[3]) {
                const year = parseInt(match[1], 10);
                const month = parseInt(match[2], 10) - 1;
                const day = parseInt(match[3], 10);
                 if (!isNaN(year) && !isNaN(month) && !isNaN(day) && month >= 0 && month <= 11 && day >= 1 && day <= 31) {
                    return new Date(year, month, day);
                }
            }
            
            // Regex for YYYY-MM-DD directly in name, e.g., "GPT-4.1-2025-04-14"
            match = modelName.match(/(\d{4})-(\d{2})-(\d{2})/);
            if (match && match[1] && match[2] && match[3]) {
                const year = parseInt(match[1], 10);
                const month = parseInt(match[2], 10) - 1;
                const day = parseInt(match[3], 10);
                if (!isNaN(year) && !isNaN(month) && !isNaN(day) && month >= 0 && month <= 11 && day >= 1 && day <= 31) {
                    return new Date(year, month, day);
                }
            }

            const mmDdPattern = /(\d{2})-(\d{2})/; 
            const modelNameLower = modelName.toLowerCase();
            
            if (modelNameLower.includes("preview") || modelNameLower.includes("release") || modelNameLower.includes("exp") || modelNameLower.includes("mini")) {
                match = modelName.match(mmDdPattern);
                if (match && match[1] && match[2]) {
                    const year = 2025; 
                    const month = parseInt(match[1], 10) - 1;
                    const day = parseInt(match[2], 10);
                    if (!isNaN(month) && !isNaN(day) && month >= 0 && month <= 11 && day >= 1 && day <= 31) {
                         return new Date(year, month, day);
                    }
                }
            }
        } catch (e) {
            console.error(`Error parsing date from model name "${modelName}":`, e);
            return null;
        }
        // console.warn('getReleaseDateFromModelString: No date pattern matched for:', modelName);
        return null;
    }

    function renderWebDevArenaChart(ctx, benchmarkData, benchmarkKey) {
        const may2025Models = benchmarkData.data.filter(item => {
            const releaseDate = getReleaseDateFromModelString(item.model);
            // Ensure releaseDate is a valid Date object before calling getFullYear/getMonth
            return releaseDate instanceof Date && !isNaN(releaseDate) &&
                   releaseDate.getFullYear() === 2025 && 
                   releaseDate.getMonth() === 4; // 4 for May
        });

        if (may2025Models.length === 0) {
            if (performanceChart) performanceChart.destroy();
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.font = "16px 'Noto Sans TC', sans-serif";
            ctx.fillStyle = "#6b7280";
            ctx.textAlign = "center";
            ctx.fillText("無符合條件 (2025年5月發布) 的 WebDev Arena 模型數據。", ctx.canvas.width / 2, ctx.canvas.height / 2);
            return;
        }

        may2025Models.sort((a, b) => {
            if (a.rank !== b.rank) {
                return a.rank - b.rank; // Sort by rank ascending
            }
            return b.score - a.score; // Then by score descending
        });

        const labels = may2025Models.map(item => item.model);
        const scores = may2025Models.map(item => item.score);

        performanceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: benchmarkData.label + ' (Elo Score - Higher is Better)',
                    data: scores,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: true, // Or a more dynamic min based on data
                        title: {
                            display: true,
                            text: 'Elo Score'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Model (Filtered for May 2025 Releases)'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: benchmarkData.label
                    },
                    subtitle: {
                        display: true,
                        text: benchmarkData.note + ' | 僅顯示 2025 年 5 月的發佈，並依排名和分數排序。.'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const item = may2025Models[context.dataIndex];
                                let tooltipLabel = [];
                                tooltipLabel.push(`Model: ${item.model}`);
                                tooltipLabel.push(`Elo Score: ${item.score}`);
                                tooltipLabel.push(`Rank: ${item.rank}`);
                                if (item.ci) {
                                    tooltipLabel.push(`CI: ±${((item.ci.plus + item.ci.minus) / 2).toFixed(2)} (approx)`);
                                }
                                tooltipLabel.push(`Votes: ${item.votes || 'N/A'}`);
                                tooltipLabel.push(`Organization: ${item.organization || 'N/A'}`);
                                tooltipLabel.push(`License: ${item.license || 'N/A'}`);
                                return tooltipLabel;
                            }
                        }
                    }
                }
            }
        });
    }

    function renderBenchmarkSuiteRadarChart(ctx, benchmarkData, benchmarkKey) {
        const labels = benchmarkData.data.map(item => {
            const match = item.model.match(/\(([^)]+)\)$/); 
            return (match && match[1]) ? match[1] : item.model;
        });
        const scores = benchmarkData.data.map(item => item.score);

        performanceChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: benchmarkData.label,
                    data: scores,
                    fill: true,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgb(54, 162, 235)',
                    pointBackgroundColor: 'rgb(54, 162, 235)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(54, 162, 235)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: benchmarkData.label
                    },
                    subtitle: {
                        display: true,
                        text: benchmarkData.note
                    },
                },
                elements: {
                    line: {
                        borderWidth: 3
                    }
                },
                scales: {
                    r: {
                        angleLines: { display: true },
                        suggestedMin: 0, 
                        // suggestedMax: 100 (can be set if scores are % based)
                         pointLabels: {
                            font: {
                                size: 10 // Adjust as needed
                            }
                        }
                    }
                }
            }
        });
    }

    function renderDefaultBarChart(ctx, benchmarkData, benchmarkKey) {
        // Default assumption: higher score is better. If a benchmark has lower = better, it might need special handling here.
        const sortedData = [...benchmarkData.data].sort((a, b) => b.score - a.score);
        
        const labels = sortedData.map(item => item.model);
        const scores = sortedData.map(item => item.score);

        performanceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: benchmarkData.label,
                    data: scores,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'x', // Vertical bars
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                         title: {
                            display: true,
                            text: 'Score'
                        }
                    },
                     x: {
                        title: {
                            display: true,
                            text: 'Model'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: benchmarkData.label
                    },
                    subtitle: {
                        display: true,
                        text: benchmarkData.note
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += context.parsed.y;
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    function initPerformanceChart() {
        const selector = document.getElementById('benchmark-selector');
        if (!selector) {
            console.error("CRITICAL: Performance benchmark selector not found in DOM during initPerformanceChart.");
            return; // Stop if selector doesn't exist
        }

        // Populate selector only if it's empty, to avoid re-populating if already done
        if (selector.options.length === 0 && llmData.benchmarks && Object.keys(llmData.benchmarks).length > 0) {
            selector.innerHTML = Object.entries(llmData.benchmarks).map(([key, value]) => 
                `<option value="${key}">${value.label}</option>`
            ).join('');
        } else if (selector.options.length === 0) {
             console.warn("No benchmarks available to populate selector.");
        }
        
        // Remove existing listener before adding a new one to prevent duplicates
        // This requires storing the listener function if we want to remove it by reference,
        // or simply re-assigning onchange if it's simple enough.
        // For now, let's assume addEventListener handles duplicates gracefully or this init is truly once.
        // A more robust way is to have a flag or remove the specific listener.
        // However, given this is init, it should ideally run once.
        // Let's ensure it can be called multiple times without adding multiple listeners if `performanceChart` check in `switchTab` fails.
        // A simple way:
        if (!selector.hasPerformanceChartListener) {
            selector.addEventListener('change', (e) => {
                // Check if the performance tab is active before updating
                const performanceTab = document.getElementById('performance');
                if (performanceTab && !performanceTab.classList.contains('hidden')) {
                     updatePerformanceChart(e.target.value);
                }
            });
            selector.hasPerformanceChartListener = true; // Mark that listener is attached
        }
        
        const ctx = document.getElementById('performance-chart').getContext('2d');
        if (performanceChart) {
            performanceChart.destroy();
        }
        // Create a very simple, empty chart shell.
        performanceChart = new Chart(ctx, { 
            type: 'bar', 
            data: { labels: [], datasets: [] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: { 
                        display: true, 
                        text: '請從上方選擇一個基準測試 (Please select a benchmark from above)' 
                    },
                    legend: { display: false }
                },
                scales: { 
                    x: { display: false }, 
                    y: { display: false }
                }
            }
        });
        // The actual data loading and chart rendering is deferred to updatePerformanceChart,
        // which is called by switchTab when the performance tab becomes active.
    }
    
    function updatePerformanceChart(benchmarkKey) {
        if (performanceChart) {
            performanceChart.destroy();
        }

        const benchmarkData = llmData.benchmarks[benchmarkKey];
        const ctx = document.getElementById('performance-chart').getContext('2d');

        if (!benchmarkData || !benchmarkData.data || benchmarkData.data.length === 0) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.font = "16px 'Noto Sans TC', sans-serif";
            ctx.fillStyle = "#6b7280"; // gray-500
            ctx.textAlign = "center";
            ctx.fillText("此基準測試無可用數據。", ctx.canvas.width / 2, ctx.canvas.height / 2);
            return;
        }
        
        if (benchmarkKey === 'WebDev Arena') {
            renderWebDevArenaChart(ctx, benchmarkData, benchmarkKey);
        } else if (benchmarkKey === 'Phi4_Reasoning_Benchmarks' || benchmarkKey === 'Mistral_Medium3_Additional') {
            renderBenchmarkSuiteRadarChart(ctx, benchmarkData, benchmarkKey);
        } else {
            renderDefaultBarChart(ctx, benchmarkData, benchmarkKey);
        }
    }

    // This function is called after DOMContentLoaded in spa/index.html
    initAppComponents();
}

// Existing playDemoVideo function (if any) should be updated or this is a new one.
// Ensure this function is defined in the global scope or exported if app.js is a module and this is called from inline HTML.
window.playDemoVideo = function(videoUrl, videoName) {
    const modalContainer = document.getElementById('modal-container');
    
    // Create a new modal for the video player
    const videoModalContent = `
        <div id="video-player-modal" class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-[60]">
            <div class="relative bg-white rounded-lg shadow-xl max-w-3xl w-full mx-auto p-4">
                <div class="flex justify-between items-center mb-3">
                    <h3 class="text-xl font-semibold text-gray-800">${videoName}</h3>
                    <button id="close-video-player-btn" class="text-gray-500 hover:text-gray-700 transition duration-150">
                        <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div class="aspect-w-16 aspect-h-9"> 
                    <video src="${videoUrl}" controls autoplay class="w-full h-full rounded"></video>
                </div>
                <p class="text-xs text-gray-500 mt-2">正在播放: ${videoName}. 您可能需要允許自動播放或點擊播放按鈕。</p>
            </div>
        </div>
    `;

    // Append to modal container - allows multiple modals if needed, though only one video player at a time is expected.
    const videoPlayerElement = document.createElement('div');
    videoPlayerElement.innerHTML = videoModalContent;
    modalContainer.appendChild(videoPlayerElement.firstChild);
    
    // Ensure the main modal container is visible if it was hidden
    modalContainer.classList.remove('hidden');
    // Optional: Keep body scroll locked if it was already
    // document.body.classList.add('overflow-hidden'); 

    document.getElementById('close-video-player-btn').addEventListener('click', () => {
        const videoPlayerModal = document.getElementById('video-player-modal');
        if (videoPlayerModal) {
            videoPlayerModal.remove();
        }
        // If no other modals are open (e.g. detail modal is closed), then unhide body scroll.
        // This simple check assumes only one detail modal and one video player modal.
        if (modalContainer.children.length === 0) {
            modalContainer.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }
    });
} 