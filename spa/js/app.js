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
        
        if(tabName === 'performance' && !performanceChart) {
            initPerformanceChart();
        } else if (tabName === 'performance' && performanceChart) {
            // Ensure chart is updated if data changed while tab was hidden
             const selector = document.getElementById('benchmark-selector');
             updatePerformanceChart(selector.value);
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
        const model = llmData.models.find(m => m.id === modelId);
        if (!model) return;

        const modalContainer = document.getElementById('modal-container');
        modalContainer.innerHTML = `
            <div class="modal-backdrop">
                <div class="modal-content" id="modal-content-inner">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-2xl font-bold text-gray-900">${model.name}</h2>
                        <button id="close-modal" class="text-2xl text-gray-400 hover:text-gray-600">&times;</button>
                    </div>
                    <div class="text-sm text-gray-500 mb-4">
                        <span><strong>發布公司：</strong> ${model.company}</span> | 
                        <span><strong>類型：</strong> ${model.type}</span> | 
                        <span><strong>發布日期：</strong> ${model.releaseDate}</span>
                    </div>
                    <p class="mb-6 text-gray-700">${model.summary}</p>
                    <div class="space-y-4">
                        ${Object.entries(model.details).map(([key, value]) => `
                            <div>
                                <h4 class="font-semibold text-gray-800">${key.replace(/_/g, ' ')}</h4>
                                <p class="text-gray-600 whitespace-pre-wrap">${value.startsWith('http') ? `<a href="${value}" target="_blank" class="text-indigo-600 hover:underline break-all">${value}</a>` : value}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        modalContainer.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; 
        
        document.getElementById('close-modal').addEventListener('click', closeModal);
        modalContainer.querySelector('.modal-backdrop').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) {
                closeModal();
            }
        });
    }

    function closeModal() {
        document.getElementById('modal-container').classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    function initPerformanceChart() {
        const selector = document.getElementById('benchmark-selector');
        selector.innerHTML = Object.entries(llmData.benchmarks).map(([key, value]) => 
            `<option value="${key}">${value.label}</option>`
        ).join('');
        
        selector.addEventListener('change', (e) => updatePerformanceChart(e.target.value));
        
        const ctx = document.getElementById('performance-chart').getContext('2d');
        performanceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: '',
                    data: [],
                    backgroundColor: 'rgba(79, 70, 229, 0.6)',
                    borderColor: 'rgba(79, 70, 229, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#374151' },
                        grid: { color: '#E5E7EB' }
                    },
                    x: {
                        ticks: { 
                            autoSkip: false,
                            maxRotation: 45,
                            minRotation: 45,
                            color: '#374151',
                            callback: function(value) {
                                const label = this.getLabelForValue(value);
                                if (label.length > 16) {
                                    return label.substring(0, 16) + '...';
                                }
                                return label;
                            }
                        },
                        grid: { display: false }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        titleFont: { weight: 'bold' },
                        bodyFont: { size: 12 },
                        footerFont: { style: 'italic' },
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        titleColor: '#FFFFFF',
                        bodyColor: '#FFFFFF',
                        footerColor: '#CCCCCC',
                        callbacks: {
                            footer: function(tooltipItems) {
                               const benchmarkKey = document.getElementById('benchmark-selector').value;
                               return llmData.benchmarks[benchmarkKey].note;
                            }
                        }
                    },
                     title: {
                        display: true,
                        text: '',
                        font: { size: 16, weight: 'bold'},
                        color: '#1F2937'
                    }
                }
            }
        });

        updatePerformanceChart(selector.value);
    }
    
    function updatePerformanceChart(benchmarkKey) {
        if (!performanceChart || !llmData.benchmarks[benchmarkKey]) {
             console.warn("Chart or benchmark data not ready for key:", benchmarkKey);
             return;
        }
        const benchmarkData = llmData.benchmarks[benchmarkKey];
        
        const isRank = benchmarkData.type === 'rank';
        performanceChart.options.scales.y.reverse = isRank;
        performanceChart.options.plugins.title.text = benchmarkData.label;

        performanceChart.data.labels = benchmarkData.data.map(d => d.model);
        performanceChart.data.datasets[0].data = benchmarkData.data.map(d => d.score);
        performanceChart.update();
    }

    // This function is called after DOMContentLoaded in spa/index.html
    initAppComponents();
} 