function calculate() {
    // Get input values and validate
    const basic_salary_raw = document.getElementById('basic_salary').value;
    const overtime_raw = document.getElementById('overtime').value;
    const allowance_raw = document.getElementById('allowance').value;
    const epf_raw = document.getElementById('epf_deduction').value;

    const basic_salary = parseFloat(basic_salary_raw);
    const overtime = parseFloat(overtime_raw || 0);
    const allowance = parseFloat(allowance_raw || 0);
    const epf_deduction = parseFloat(epf_raw);

    // Validation
    if (Number.isNaN(basic_salary) || basic_salary <= 0) {
        alert('Please enter a valid basic salary');
        return;
    }

    if (Number.isNaN(overtime) || overtime < 0) {
        alert('Please enter a valid overtime value');
        return;
    }

    if (Number.isNaN(allowance) || allowance < 0) {
        alert('Please enter a valid allowance value');
        return;
    }

    // Get working days from monthly section (default to 26 if not available)
    let workingDays = 26;
    const workingDaysElement = document.getElementById('monthly_working_days');
    if (workingDaysElement) {
        const wdValue = parseInt(workingDaysElement.value);
        if (!Number.isNaN(wdValue) && wdValue > 0) {
            workingDays = wdValue;
        }
    }

    // Calculate wage components
    const wage = basic_salary + allowance;
    
    // Calculate hourly and daily rates based on working days
    const salaryPerDay = basic_salary / workingDays;
    const hourlyRate = basic_salary / (workingDays * 8); // 8 hours per day
    const otRate = hourlyRate * 1.5; // Overtime rate is 1.5x hourly rate
    
    // Calculate overtime pay
    const net_overtime = overtime * otRate;
    
    // Calculate deductions
    let epf_rate = 0;
    if (!Number.isNaN(epf_deduction)) {
        if (epf_deduction === 9) epf_rate = 0.09;
        else if (epf_deduction === 11) epf_rate = 0.11;
    }

    // Calculate all components
    const gross_wage = basic_salary + net_overtime + allowance;
    const epf = gross_wage * epf_rate;
    const socso = gross_wage * 0.0049; // SOCSO rate
    const eis = gross_wage * 0.002; // EIS rate
    const net_wage = gross_wage - epf - socso - eis;

    // Display results (guard null elements)
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    setText('gross_wage', `Gross Wage : RM ${gross_wage.toFixed(2)}`);
    setText('net_overtime', `Overtime Pay : RM ${net_overtime.toFixed(2)}`);
    setText('epf', `EPF Deduction (${(epf_rate * 100).toFixed(0)}%) : RM ${epf.toFixed(2)}`);
    setText('socso', `SOCSO (0.49%) : RM ${socso.toFixed(2)}`);
    setText('eis', `EIS (0.2%) : RM ${eis.toFixed(2)}`);
    setText('result', `Net Wage : RM ${net_wage.toFixed(2)}`);

    // Prepare data for backend
    const formData = new FormData();
    formData.append('basic_salary', gross_wage.toFixed(2));
    formData.append('epf', epf.toFixed(2));
    formData.append('socso', socso.toFixed(2));
    formData.append('eis', eis.toFixed(2));
    formData.append('result', net_wage.toFixed(2));

    // Send data to backend using fetch
    fetch('../connection/insert_data.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {})
    .catch(error => {});
}

// Export calculation results to Excel
function exportToExcel() {
    // Check if XLSX library is loaded
    if (typeof XLSX === 'undefined') {
        alert('Excel export library is loading. Please wait a moment and try again, or refresh the page.');
        return;
    }
    
    // Get values from Quick Salary Calculator
    const basic_salary = parseFloat(document.getElementById('basic_salary').value) || 0;
    const overtime = parseFloat(document.getElementById('overtime').value) || 0;
    const allowance = parseFloat(document.getElementById('allowance').value) || 0;
    const epf_deduction = parseFloat(document.getElementById('epf_deduction').value) || 0;
    
    // Get working days from monthly section
    let workingDays = 26;
    const workingDaysElement = document.getElementById('monthly_working_days');
    if (workingDaysElement) {
        const wdValue = parseInt(workingDaysElement.value);
        if (!Number.isNaN(wdValue) && wdValue > 0) {
            workingDays = wdValue;
        }
    }
    
    // Calculate derived values
    const salaryPerDay = basic_salary > 0 ? basic_salary / workingDays : 0;
    const hourlyRate = basic_salary > 0 ? basic_salary / (workingDays * 8) : 0;
    const otRate = hourlyRate * 1.5;
    
    // Get display values (calculated results)
    const gross_wage_text = document.getElementById('gross_wage').textContent || '';
    const net_overtime_text = document.getElementById('net_overtime').textContent || '';
    const epf_text = document.getElementById('epf').textContent || '';
    const socso_text = document.getElementById('socso').textContent || '';
    const eis_text = document.getElementById('eis').textContent || '';
    const result_text = document.getElementById('result').textContent || '';
    
    // Extract numeric values from display text
    const extractValue = (text) => {
        const match = text.match(/RM\s+([\d.]+)/);
        return match ? parseFloat(match[1]) : 0;
    };
    
    const gross_wage = extractValue(gross_wage_text);
    const net_overtime = extractValue(net_overtime_text);
    const epf = extractValue(epf_text);
    const socso = extractValue(socso_text);
    const eis = extractValue(eis_text);
    const net_wage = extractValue(result_text);
    
    // Validate that calculation was performed
    if (gross_wage === 0 && basic_salary === 0) {
        alert('Please click "Calculate" first to generate the salary calculation results.');
        return;
    }
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Prepare data for Quick Salary Calculator sheet
    const quickCalcData = [
        ['Salary Calculation Report'],
        ['Date:', new Date().toLocaleDateString()],
        [],
        ['Input Values'],
        ['Basic Salary (RM)', basic_salary.toFixed(2)],
        ['Working Days/Month', workingDays],
        ['Salary per Day (RM)', salaryPerDay.toFixed(2)],
        ['Hourly Rate (RM)', hourlyRate.toFixed(2)],
        ['Overtime Rate (RM/hr @ 1.5x)', otRate.toFixed(2)],
        ['Overtime Hours', overtime.toFixed(2)],
        ['Allowance (RM)', allowance.toFixed(2)],
        ['EPF Deduction Rate (%)', epf_deduction.toFixed(0)],
        [],
        ['Calculation Results'],
        ['Gross Wage (RM)', gross_wage.toFixed(2)],
        ['Overtime Pay (RM)', net_overtime.toFixed(2)],
        ['Allowance (RM)', allowance.toFixed(2)],
        ['EPF Deduction (RM)', epf.toFixed(2)],
        ['SOCSO Deduction (RM)', socso.toFixed(2)],
        ['EIS Deduction (RM)', eis.toFixed(2)],
        [],
        ['Net Wage (RM)', net_wage.toFixed(2)]
    ];
    
    const ws1 = XLSX.utils.aoa_to_sheet(quickCalcData);
    ws1['!cols'] = [{wch: 25}, {wch: 15}];
    XLSX.utils.book_append_sheet(wb, ws1, 'Quick Calculator');
    
    // Prepare data for Monthly Time Entries sheet if table exists
    const table = document.getElementById('entriesTable');
    if (table && table.querySelectorAll('tbody tr').length > 0) {
        const monthlyBasic = parseFloat(document.getElementById('monthly_basic_salary').value) || 0;
        const monthlyWD = parseInt(document.getElementById('monthly_working_days').value) || 26;
        const totalRegular = parseFloat(document.getElementById('totalRegular').textContent) || 0;
        const totalOT = parseFloat(document.getElementById('totalOvertime').textContent) || 0;
        const salaryPerDayText = document.getElementById('salaryPerDay').textContent || '0.00';
        const hourlyRateText = document.getElementById('hourlyRate').textContent || '0.00';
        const otRateText = document.getElementById('otRate').textContent || '0.00';
        const otPayText = document.getElementById('otPay').textContent || '0.00';
        const totalPayText = document.getElementById('totalPay').textContent || '0.00';
        
        const monthlyData = [
            ['Monthly Time Entries & Calculation'],
            ['Date:', new Date().toLocaleDateString()],
            [],
            ['Input Parameters'],
            ['Monthly Basic Salary (RM)', monthlyBasic.toFixed(2)],
            ['Working Days/Month', monthlyWD],
            ['Salary per Day (RM)', salaryPerDayText],
            ['Hourly Rate (RM/hr)', hourlyRateText],
            [],
            ['Time Entries']
        ];
        
        // Add table headers
        const headers = ['Date', 'Start Time', 'End Time', 'Hours Worked'];
        monthlyData.push(headers);
        
        // Add table rows
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const date = row.querySelector('td:nth-child(1) input').value || '';
            const start = row.querySelector('td:nth-child(2) input').value || '';
            const end = row.querySelector('td:nth-child(3) input').value || '';
            const hours = row.querySelector('td:nth-child(4)').textContent || '0';
            // Only add rows that have data
            if (date || start || end) {
                monthlyData.push([date, start, end, parseFloat(hours)]);
            }
        });
        
        monthlyData.push(
            [],
            ['Calculation Summary'],
            ['Total Regular Hours', totalRegular.toFixed(2)],
            ['Total Overtime Hours', totalOT.toFixed(2)],
            ['Overtime Rate (RM/hr @ 1.5x)', otRateText],
            ['Overtime Pay (RM)', otPayText],
            ['Total Salary (After Deductions)', totalPayText]
        );
        
        const ws2 = XLSX.utils.aoa_to_sheet(monthlyData);
        ws2['!cols'] = [{wch: 15}, {wch: 12}, {wch: 12}, {wch: 12}];
        XLSX.utils.book_append_sheet(wb, ws2, 'Monthly Entries');
    }
    
    // Generate file name with current date
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const fileName = `Salary_Calculation_${dateStr}.xlsx`;
    
    try {
        // Write file
        XLSX.writeFile(wb, fileName);
        alert('Excel file exported successfully as: ' + fileName);
    } catch (error) {
        console.error('Export error:', error);
        alert('Error exporting to Excel: ' + error.message + '\n\nPlease try refreshing the page and try again.');
    }
}

// Wages page: monthly time-entry handling
document.addEventListener('DOMContentLoaded', function(){
    if (!document.querySelector('#entriesTable')) return;

    const table = document.getElementById('entriesTable');
    const tableBody = table ? table.querySelector('tbody') : null;
    const addRowBtn = document.getElementById('addRow');
    const clearBtn = document.getElementById('clearRows');
    const calculateBtn = document.getElementById('calculateBtn');

    function addRow(date='', start='', end=''){
        const tr = document.createElement('tr');

        const tdDate = document.createElement('td');
        const inpDate = document.createElement('input');
        inpDate.type = 'date'; inpDate.className = 'form-control form-control-sm'; inpDate.value = date;
        inpDate.name = 'entry_date[]'; inpDate.autocomplete = 'off';
        tdDate.appendChild(inpDate);

        const tdStart = document.createElement('td');
        const inpStart = document.createElement('input');
        inpStart.type = 'time'; inpStart.className = 'form-control form-control-sm'; inpStart.value = start;
        inpStart.name = 'entry_start[]'; tdStart.appendChild(inpStart);

        const tdEnd = document.createElement('td');
        const inpEnd = document.createElement('input');
        inpEnd.type = 'time'; inpEnd.className = 'form-control form-control-sm'; inpEnd.value = end;
        inpEnd.name = 'entry_end[]'; tdEnd.appendChild(inpEnd);

        const tdHours = document.createElement('td');
        tdHours.className = 'hours'; tdHours.textContent = '0.00';

        const tdAction = document.createElement('td');
        const remBtn = document.createElement('button');
        remBtn.type = 'button'; remBtn.className = 'btn btn-sm btn-danger remove'; remBtn.textContent = 'Remove';
        tdAction.appendChild(remBtn);

        tr.appendChild(tdDate);
        tr.appendChild(tdStart);
        tr.appendChild(tdEnd);
        tr.appendChild(tdHours);
        tr.appendChild(tdAction);

        if (tableBody) tableBody.appendChild(tr);

        // events
        [inpDate, inpStart, inpEnd].forEach(inp => inp.addEventListener('change', updateRowHours));
        remBtn.addEventListener('click', () => { tr.remove(); updateTotals(); });
    }

    function updateRowHours(e){
        const tr = e.target.closest('tr');
        const start = tr.querySelector('td:nth-child(2) input').value;
        const end = tr.querySelector('td:nth-child(3) input').value;
        if(!start || !end){ tr.querySelector('.hours').textContent = '0.00'; updateTotals(); return; }

        const startParts = start.split(':').map(Number);
        const endParts = end.split(':').map(Number);
        let startMinutes = startParts[0]*60 + (startParts[1]||0);
        let endMinutes = endParts[0]*60 + (endParts[1]||0);
        if(endMinutes < startMinutes) endMinutes += 24*60;
        const hours = (endMinutes - startMinutes)/60;
        tr.querySelector('.hours').textContent = hours.toFixed(2);
        updateTotals();
    }

    function updateTotals(){
        const rows = tableBody ? Array.from(tableBody.querySelectorAll('tr')) : [];
        let totalReg = 0, totalOt = 0;
        rows.forEach(r => {
            const h = parseFloat(r.querySelector('.hours').textContent) || 0;
            const reg = Math.min(8, h);
            const ot = Math.max(0, h - 8);
            totalReg += reg; totalOt += ot;
        });
        const elReg = document.getElementById('totalRegular');
        const elOt = document.getElementById('totalOvertime');
        if (elReg) elReg.textContent = totalReg.toFixed(2);
        if (elOt) elOt.textContent = totalOt.toFixed(2);
    }

    function calculateMonth(){
        // Get input values
        const basic = parseFloat(document.getElementById('monthly_basic_salary').value) || 0;
        const workingDays = parseInt(document.getElementById('monthly_working_days').value) || 26;
        
        // Validation
        if (basic <= 0) {
            alert('Please enter a valid basic salary');
            return;
        }
        
        if (workingDays <= 0) {
            alert('Please enter valid working days');
            return;
        }
        
        // Calculate key rates
        const salaryPerDay = basic / workingDays;
        const hourlyRate = basic / (workingDays * 8); // 8 hours per day
        const otMultiplier = 1.5;
        const otRate = hourlyRate * otMultiplier;
        
        // Get work hours data
        const totalRegular = parseFloat(document.getElementById('totalRegular').textContent) || 0;
        const totalOt = parseFloat(document.getElementById('totalOvertime').textContent) || 0;
        
        // Calculate pay components
        const regularPay = hourlyRate * totalRegular;
        const otPay = otRate * totalOt;
        const grossPay = basic + otPay; // Base salary + overtime
        
        // Calculate deductions (using standard Malaysia rates)
        const epfRate = 0.11; // 11% standard employee contribution
        const socsoRate = 0.0049; // SOCSO contribution
        const eisRate = 0.002; // EIS contribution
        
        const epfDeduction = grossPay * epfRate;
        const socsoDeduction = grossPay * socsoRate;
        const eisDeduction = grossPay * eisRate;
        
        // Calculate net salary
        const netSalary = grossPay - epfDeduction - socsoDeduction - eisDeduction;
        
        // Display results
        const setText = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        };
        
        setText('salaryPerDay', salaryPerDay.toFixed(2));
        setText('hourlyRate', hourlyRate.toFixed(2));
        setText('otRate', otRate.toFixed(2));
        setText('otPay', otPay.toFixed(2));
        setText('totalPay', netSalary.toFixed(2));
        
        console.log('Monthly Calculation Summary:', {
            basicSalary: basic,
            workingDays: workingDays,
            salaryPerDay: salaryPerDay.toFixed(2),
            hourlyRate: hourlyRate.toFixed(2),
            totalRegular: totalRegular,
            totalOvertime: totalOt,
            regularPay: regularPay.toFixed(2),
            otRate: otRate.toFixed(2),
            otPay: otPay.toFixed(2),
            grossPay: grossPay.toFixed(2),
            epfDeduction: epfDeduction.toFixed(2),
            socsoDeduction: socsoDeduction.toFixed(2),
            eisDeduction: eisDeduction.toFixed(2),
            netSalary: netSalary.toFixed(2)
        });
    }

    if (addRowBtn) addRowBtn.addEventListener('click', ()=> addRow());
    if (clearBtn) clearBtn.addEventListener('click', ()=>{ if (tableBody) tableBody.innerHTML=''; updateTotals(); });
    if (calculateBtn) calculateBtn.addEventListener('click', calculateMonth);

    // start with 0 empty rows (keep only the 3 default HTML rows)
    for(let i=0;i<0;i++) addRow();
});