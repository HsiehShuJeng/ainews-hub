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
    }
}

// Load all components
async function loadAllComponents() {
    const components = [
        { id: 'header', url: 'components/header.html' },
        { id: 'footer', url: 'components/footer.html' },
        { id: 'main-content', url: 'components/dashboard.html' },
        { id: 'main-content', url: 'components/explorer.html', append: true },
        { id: 'main-content', url: 'components/performance.html', append: true },
        { id: 'main-content', url: 'components/trends.html', append: true }
    ];

    for (const component of components) {
        if (component.append) {
            // Append to existing content
            const res = await fetch(component.url);
            if (res.ok) {
                const content = await res.text();
                const element = document.getElementById(component.id);
                if (element) {
                    element.innerHTML += content;
                }
            }
        } else {
            await loadPartial(component.id, component.url);
        }
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    // Load all components first
    await loadAllComponents();
    
    // Initialize the app
    initApp();
});
