// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initDarkMode();
    initSidebarCollapse();
    initRefreshButton();
    initCharts();
});

// ===== DARK MODE =====
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = document.getElementById('darkModeIcon');
    const html = document.documentElement;

    // Load saved preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        html.classList.add('dark-mode');
        updateDarkModeIcon(html, darkModeIcon);
    }

    // Toggle on click
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            html.classList.toggle('dark-mode');
            const isNow = html.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isNow);
            updateDarkModeIcon(html, darkModeIcon);
        });
    }
}

function updateDarkModeIcon(html, icon) {
    if (!icon) return;
    
    const isDark = html.classList.contains('dark-mode');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', 'currentColor');
    icon.setAttribute('stroke-width', '1.8');
    icon.setAttribute('stroke-linecap', 'round');
    icon.setAttribute('stroke-linejoin', 'round');
    
    if (isDark) {
        icon.innerHTML = '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2.2"></path><path d="M12 19.8V22"></path><path d="M4.93 4.93l1.56 1.56"></path><path d="M17.51 17.51l1.56 1.56"></path><path d="M2 12h2.2"></path><path d="M19.8 12H22"></path><path d="M4.93 19.07l1.56-1.56"></path><path d="M17.51 6.49l1.56-1.56"></path>';
    } else {
        icon.innerHTML = '<path d="M20 15.2A8.5 8.5 0 1 1 8.8 4 6.8 6.8 0 0 0 20 15.2z"></path>';
    }
}

// ===== SIDEBAR COLLAPSE =====
function initSidebarCollapse() {
    const collapseBtn = document.getElementById('collapseBtn');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    const mobileOverlay = document.getElementById('mobileOverlay');

    if (!sidebar || !mainContent) return;

    // Always start expanded on desktop for a clearer default layout.
    if (window.innerWidth > 768) {
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('sidebar-collapsed');
    }

    if (collapseBtn) updateCollapseBtnUI(collapseBtn);

    // Desktop collapse button
    if (collapseBtn) {
        collapseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (window.innerWidth > 768) {
                sidebar.classList.toggle('collapsed');
                mainContent.classList.toggle('sidebar-collapsed');
                updateCollapseBtnUI(collapseBtn);
            } else {
                // On mobile, close the menu
                closeMobileMenu();
            }
        });
    }

    // Mobile hamburger button
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openMobileMenu();
        });
    }

    // Mobile overlay to close menu
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', function() {
            closeMobileMenu();
        });
    }

    // Close mobile menu on link click
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });

    // Reset on mobile resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('sidebar-collapsed');
            if (collapseBtn) updateCollapseBtnUI(collapseBtn);
            sidebar.classList.remove('mobile-open');
            if (mobileOverlay) mobileOverlay.classList.remove('active');
        }
    });
}

function openMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    
    if (sidebar) sidebar.classList.add('mobile-open');
    if (mobileOverlay) mobileOverlay.classList.add('active');
}

function closeMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
}

function updateCollapseBtnUI(btn) {
    const sidebar = document.getElementById('sidebar');
    const svg = btn.querySelector('svg');
    const text = btn.querySelector('.collapse-text');
    const isCollapsed = sidebar.classList.contains('collapsed');
    
    if (svg) {
        svg.style.transform = isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)';
    }
    if (text) {
        text.textContent = isCollapsed ? 'Expand' : 'Collapse';
    }
}

// ===== REFRESH BUTTON =====
function initRefreshButton() {
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            location.reload();
        });
    }
}

// ===== UTILITY FUNCTIONS (from calculate.js) =====
function calculate() {
    const basicSalary = parseFloat(document.getElementById('basic_salary').value) || 0;
    const allowance = parseFloat(document.getElementById('allowance').value) || 0;
    const overtimeHours = parseFloat(document.getElementById('overtime').value) || 0;
    const epfRate = parseFloat(document.getElementById('epf_deduction').value) || 9;
    const workingDays = parseFloat(document.getElementById('monthly_working_days').value) || 26;

    const grossWage = basicSalary + allowance;
    const dailyRate = basicSalary / workingDays;
    const hourlyRate = dailyRate / 8;
    const overtimePay = overtimeHours * hourlyRate;
    const totalGross = grossWage + overtimePay;

    const epf = (totalGross * epfRate) / 100;
    const socso = (totalGross * 0.49) / 100;
    const eis = (totalGross * 0.2) / 100;
    const netWage = totalGross - epf - socso - eis;

    document.getElementById('gross_wage').textContent = 'RM ' + grossWage.toFixed(2);
    document.getElementById('net_overtime').textContent = 'RM ' + overtimePay.toFixed(2);
    document.getElementById('epf').textContent = 'RM ' + epf.toFixed(2);
    document.getElementById('socso').textContent = 'RM ' + socso.toFixed(2);
    document.getElementById('eis').textContent = 'RM ' + eis.toFixed(2);
    document.getElementById('result').textContent = 'RM ' + netWage.toFixed(2);
    document.getElementById('epf-label').textContent = 'EPF (' + epfRate + '%):';
    document.getElementById('results').classList.add('show');
}

function exportToExcel() {
    // Lazy load XLSX if not available
    if (typeof XLSX === 'undefined') {
        if (typeof loadXLSX === 'function') {
            alert('Excel library is loading. Please wait and try again.');
            loadXLSX().then(() => {
                exportToExcel();
            }).catch(() => {
                alert('Failed to load Excel library. Please refresh the page and try again.');
            });
            return;
        } else {
            alert('Excel export library is not available. Please refresh the page.');
            return;
        }
    }

    const basicSalary = document.getElementById('basic_salary').value;
    const allowance = document.getElementById('allowance').value;
    const overtime = document.getElementById('overtime').value;
    const epfRate = document.getElementById('epf_deduction').value;
    const workingDays = document.getElementById('monthly_working_days').value;

    const data = [
        ['Payroll Calculation Report'],
        [],
        ['Input Details'],
        ['Basic Salary', basicSalary],
        ['Allowance', allowance],
        ['Overtime Hours', overtime],
        ['EPF Rate', epfRate + '%'],
        ['Working Days', workingDays],
        [],
        ['Results'],
        ['Gross Wage', document.getElementById('gross_wage').textContent],
        ['Overtime Pay', document.getElementById('net_overtime').textContent],
        ['EPF Deduction', document.getElementById('epf').textContent],
        ['SOCSO', document.getElementById('socso').textContent],
        ['EIS', document.getElementById('eis').textContent],
        ['Total Net Wage', document.getElementById('result').textContent]
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Payroll');
    XLSX.writeFile(wb, 'payroll_calculation.xlsx');
}

function refreshPage() {
    location.reload();
}

// ===== CHARTS INITIALIZATION =====
function initCharts() {
    // Lazy load Chart.js if needed
    if (typeof Chart === 'undefined' && typeof loadChartJS === 'function') {
        loadChartJS().then(() => {
            initFunnelChart();
            initSourcesChart();
            initLeadsChart();
        });
    } else if (typeof Chart !== 'undefined') {
        initFunnelChart();
        initSourcesChart();
        initLeadsChart();
    }
}

function initFunnelChart() {
    const ctx = document.getElementById('funnelChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Clutch', 'Behance', 'Instagram', 'Dribbble'],
            datasets: [{
                label: 'Lead Count',
                data: [3000, 2500, 1000, 500],
                backgroundColor: [
                    'rgba(33, 150, 243, 0.8)',
                    'rgba(66, 165, 245, 0.8)',
                    'rgba(100, 181, 246, 0.8)',
                    'rgba(144, 202, 249, 0.8)'
                ],
                borderColor: [
                    'rgba(33, 150, 243, 1)',
                    'rgba(66, 165, 245, 1)',
                    'rgba(100, 181, 246, 1)',
                    'rgba(144, 202, 249, 1)'
                ],
                borderWidth: 0,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function initSourcesChart() {
    const ctx = document.getElementById('sourcesChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Social Media', 'Direct', 'Email', 'Referral', 'Other'],
            datasets: [{
                data: [35, 25, 20, 15, 5],
                backgroundColor: [
                    'rgba(33, 150, 243, 0.8)',
                    'rgba(76, 175, 80, 0.8)',
                    'rgba(255, 152, 0, 0.8)',
                    'rgba(156, 39, 176, 0.8)',
                    'rgba(244, 67, 54, 0.8)'
                ],
                borderColor: [
                    'rgba(33, 150, 243, 1)',
                    'rgba(76, 175, 80, 1)',
                    'rgba(255, 152, 0, 1)',
                    'rgba(156, 39, 176, 1)',
                    'rgba(244, 67, 54, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 12,
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

function initLeadsChart() {
    const ctx = document.getElementById('leadsChart');
    if (!ctx) return;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Leads Won',
                    data: [65, 89, 75, 92, 110, 130],
                    borderColor: 'rgba(76, 175, 80, 1)',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgba(76, 175, 80, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                },
                {
                    label: 'Leads Lost',
                    data: [15, 11, 20, 8, 10, 7],
                    borderColor: 'rgba(244, 67, 54, 1)',
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgba(244, 67, 54, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    });
}
