import { initApp } from './app.js';

// Load HTML partials
async function loadPartial(id, url) {
    try {
    const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to load ${url}`);
        const content = await res.text();
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = content;
        }
    } catch (error) {
        console.error(`Error loading partial ${url}:`, error);
        // Optionally, display an error message in the UI element
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = `<p class="text-red-500 text-center">Error loading content for ${id}.</p>`;
        }
    }
}

// Load all components
async function loadAllComponents() {
    const componentsToLoad = [
        { id: 'dashboard', url: 'components/dashboard.html' },
        { id: 'explorer', url: 'components/explorer.html' },
        { id: 'performance', url: 'components/performance.html' },
        { id: 'trends', url: 'components/trends.html' }
    ];

    // Use Promise.all to load components in parallel for potentially faster loading
    await Promise.all(componentsToLoad.map(component => loadPartial(component.id, component.url)));
}

window.addEventListener('DOMContentLoaded', async () => {
    // Load all components first
    await loadAllComponents();
    
    // Initialize the app
    initApp();
});
