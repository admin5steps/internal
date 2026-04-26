// Lazy load external libraries on demand

// Load Chart.js library
function loadChartJS() {
    if (window.Chart) return Promise.resolve();
    
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Load XLSX library
function loadXLSX() {
    if (window.XLSX) return Promise.resolve();
    
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Load multiple libraries
function loadLibraries(...libs) {
    return Promise.all(libs.map(lib => {
        switch(lib) {
            case 'chart': return loadChartJS();
            case 'xlsx': return loadXLSX();
            default: return Promise.resolve();
        }
    }));
}
