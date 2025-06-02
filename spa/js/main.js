// Example: load header and footer partials
async function loadPartial(id, url) {
    const res = await fetch(url);
    document.getElementById(id).innerHTML = await res.text();
}

window.addEventListener('DOMContentLoaded', () => {
    loadPartial('header', 'components/header.html');
    loadPartial('footer', 'components/footer.html');
    // Initialize other features here
});
