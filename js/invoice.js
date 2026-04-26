// Invoice Generator Functions

function formatDisplayDate(value) {
    if (!value) return '-';

    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatAddress(street, city) {
    return [street, city].filter(Boolean).join(', ');
}

// Set today's date as default
document.addEventListener('DOMContentLoaded', function() {
    const invoiceDateInput = document.getElementById('invoiceDate');
    if (invoiceDateInput) {
        invoiceDateInput.valueAsDate = new Date();
    }
    calculateInvoice();
});

// Add a new item row to the invoice
function addItem() {
    const table = document.getElementById('itemsTable');
    const newRow = document.createElement('tr');
    newRow.className = 'item-row';
    newRow.innerHTML = `
        <td><input type="text" class="form-control form-control-sm item-description" placeholder="Enter description" required></td>
        <td><input type="number" class="form-control form-control-sm item-quantity" value="1" min="1" step="1" oninput="calculateInvoice()" required></td>
        <td><input type="number" class="form-control form-control-sm item-price" value="0.00" min="0" step="0.01" oninput="calculateInvoice()" required></td>
        <td><input type="text" class="form-control form-control-sm item-amount" value="0.00" readonly></td>
        <td class="cell-center">
            <button type="button" class="btn btn-sm btn-outline-danger invoice-remove-btn" onclick="removeItem(this)" aria-label="Remove item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                </svg>
            </button>
        </td>
    `;
    table.appendChild(newRow);
}

// Remove an item row from the invoice
function removeItem(btn) {
    btn.closest('tr').remove();
    calculateInvoice();
}

// Calculate invoice totals and line amounts
function calculateInvoice() {
    let subtotal = 0;
    const rows = document.querySelectorAll('.item-row');
    
    rows.forEach(row => {
        const qty = parseFloat(row.querySelector('.item-quantity').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        const amount = qty * price;
        row.querySelector('.item-amount').value = amount.toFixed(2);
        subtotal += amount;
    });

    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    const subtotalEl = document.getElementById('subtotal');
    const taxAmountEl = document.getElementById('taxAmount');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = 'RM ' + subtotal.toFixed(2);
    if (taxAmountEl) taxAmountEl.textContent = 'RM ' + taxAmount.toFixed(2);
    if (totalEl) totalEl.textContent = 'RM ' + total.toFixed(2);
}

// Generate invoice preview from form data
function generatePreview() {
    const invoiceNumber = document.getElementById('invoiceNumber').value;
    const invoiceDate = document.getElementById('invoiceDate').value;
    const companyName = document.getElementById('companyName').value;
    const companyStreet = document.getElementById('companyStreet').value;
    const companyCity = document.getElementById('companyCity').value;
    const clientName = document.getElementById('clientName').value;
    const clientStreet = document.getElementById('clientStreet').value;
    const clientCity = document.getElementById('clientCity').value;
    const dueDate = document.getElementById('dueDate').value;
    const notes = document.getElementById('notes').value;

    if (!invoiceNumber || !companyName || !clientName) {
        alert('Please fill in Invoice Number, Company Name, and Client Name');
        return;
    }

    let itemsHTML = '';
    let subtotal = 0;
    const rows = document.querySelectorAll('.item-row');
    
    rows.forEach(row => {
        const description = row.querySelector('.item-description').value;
        const qty = parseFloat(row.querySelector('.item-quantity').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        const amount = qty * price;
        
        if (description) {
            itemsHTML += `
                <tr class="invoice-document-item-row">
                    <td>${escapeHtml(description)}</td>
                    <td class="invoice-document-cell-center">${qty}</td>
                    <td class="invoice-document-cell-right">RM ${price.toFixed(2)}</td>
                    <td class="invoice-document-cell-right">RM ${amount.toFixed(2)}</td>
                </tr>
            `;
            subtotal += amount;
        }
    });

    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    const companyAddressFormatted = formatAddress(companyStreet, companyCity);
    const clientAddressFormatted = formatAddress(clientStreet, clientCity);

    const safeCompanyName = escapeHtml(companyName);
    const safeClientName = escapeHtml(clientName);
    const safeCompanyAddress = escapeHtml(companyAddressFormatted);
    const safeClientAddress = escapeHtml(clientAddressFormatted);
    const safeInvoiceNumber = escapeHtml(invoiceNumber);
    const formattedInvoiceDate = formatDisplayDate(invoiceDate);
    const formattedDueDate = formatDisplayDate(dueDate);
    const safeNotes = escapeHtml(notes);

    if (!itemsHTML) {
        itemsHTML = `
            <tr class="invoice-document-item-row invoice-document-item-row-empty">
                <td colspan="4">Add at least one line item to complete this invoice.</td>
            </tr>
        `;
    }

    const invoiceContent = `
        <article class="invoice-document">
            <header class="invoice-document-header">
                <div class="invoice-document-brand">
                    <span class="invoice-document-kicker">Invoice</span>
                    <h2 class="invoice-document-title">${safeCompanyName}</h2>
                    <p class="invoice-document-address">${safeCompanyAddress || 'Company address not provided'}</p>
                </div>
                <div class="invoice-document-meta">
                    <div class="invoice-document-meta-row">
                        <span>Invoice #</span>
                        <strong>${safeInvoiceNumber}</strong>
                    </div>
                    <div class="invoice-document-meta-row">
                        <span>Issued</span>
                        <strong>${formattedInvoiceDate}</strong>
                    </div>
                    <div class="invoice-document-meta-row">
                        <span>Due</span>
                        <strong>${formattedDueDate}</strong>
                    </div>
                </div>
            </header>

            <section class="invoice-document-parties">
                <div class="invoice-document-party">
                    <span class="invoice-document-label">Bill To</span>
                    <strong>${safeClientName}</strong>
                    <p>${safeClientAddress || 'Client address not provided'}</p>
                </div>
                <div class="invoice-document-party">
                    <span class="invoice-document-label">From</span>
                    <strong>${safeCompanyName}</strong>
                    <p>${safeCompanyAddress || 'Company address not provided'}</p>
                </div>
            </section>

            <section class="invoice-document-items">
                <table class="invoice-document-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th class="invoice-document-cell-center">Quantity</th>
                            <th class="invoice-document-cell-right">Unit Price</th>
                            <th class="invoice-document-cell-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHTML}
                    </tbody>
                </table>
            </section>

            <section class="invoice-document-summary-wrap">
                <div class="invoice-document-summary">
                    <div class="invoice-document-summary-row">
                        <span>Subtotal</span>
                        <strong>RM ${subtotal.toFixed(2)}</strong>
                    </div>
                    <div class="invoice-document-summary-row">
                        <span>Tax (${taxRate}%)</span>
                        <strong>RM ${taxAmount.toFixed(2)}</strong>
                    </div>
                    <div class="invoice-document-summary-row invoice-document-summary-total">
                        <span>Total</span>
                        <strong>RM ${total.toFixed(2)}</strong>
                    </div>
                </div>
            </section>

            ${notes ? `
                <section class="invoice-document-notes">
                    <span class="invoice-document-label">Notes</span>
                    <p>${safeNotes}</p>
                </section>
            ` : ''}

            <footer class="invoice-document-footer">
                <p>This is a computer-generated invoice. No signature is required.</p>
                <p>${safeCompanyName}</p>
            </footer>
        </article>
    `;

    const placeholderEl = document.getElementById('placeholderPreview');
    const contentEl = document.getElementById('invoiceContent');
    const downloadBtnEl = document.getElementById('downloadPdfBtn');
    const previewControlsEl = document.getElementById('previewControls');

    if (placeholderEl) placeholderEl.style.display = 'none';
    if (contentEl) {
        contentEl.style.display = 'block';
        contentEl.innerHTML = invoiceContent;
    }
    if (downloadBtnEl) downloadBtnEl.style.display = 'block';
    if (previewControlsEl) previewControlsEl.style.display = 'block';
}

// Download invoice as PDF
function downloadPdf() {
    const invoiceNumber = document.getElementById('invoiceNumber').value;
    const element = document.getElementById('invoiceContent');
    
    const opt = {
        margin: [8, 8, 8, 8],
        filename: `invoice-${invoiceNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        pagebreak: { mode: ['css', 'legacy'] },
        html2canvas: {
            scale: 2,
            useCORS: true,
            scrollX: 0,
            scrollY: 0,
            windowWidth: element.scrollWidth
        },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(opt).from(element).save();
}

// Collect all form data into a structured object
function collectInvoiceData() {
    const items = [];
    const rows = document.querySelectorAll('.item-row');
    
    rows.forEach(row => {
        const description = row.querySelector('.item-description').value;
        const qty = parseFloat(row.querySelector('.item-quantity').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        const amount = qty * price;
        
        if (description) {
            items.push({
                description: description,
                quantity: qty,
                price: price,
                amount: amount
            });
        }
    });

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    const invoiceData = {
        invoiceNumber: document.getElementById('invoiceNumber').value,
        invoiceDate: document.getElementById('invoiceDate').value,
        dueDate: document.getElementById('dueDate').value,
        company: {
            name: document.getElementById('companyName').value,
            street: document.getElementById('companyStreet').value,
            city: document.getElementById('companyCity').value
        },
        client: {
            name: document.getElementById('clientName').value,
            street: document.getElementById('clientStreet').value,
            city: document.getElementById('clientCity').value
        },
        items: items,
        taxRate: taxRate,
        subtotal: subtotal,
        taxAmount: taxAmount,
        total: total,
        notes: document.getElementById('notes').value,
        submittedAt: new Date().toISOString()
    };

    return invoiceData;
}

// Validate invoice data before submission
function validateInvoiceData(data) {
    const errors = [];
    
    if (!data.invoiceNumber) errors.push('Invoice Number is required');
    if (!data.company.name) errors.push('Company Name is required');
    if (!data.client.name) errors.push('Client Name is required');
    if (data.items.length === 0) errors.push('At least one item is required');
    
    return errors;
}

// Submit invoice data to webhook
async function submitInvoiceToWebhook(invoiceData) {
    const webhookUrl = CONFIG.INVOICE_WEBHOOK_URL;
    
    if (!webhookUrl || webhookUrl === 'https://webhook.site/your-unique-id') {
        alert('Please configure your webhook URL in env.js before submitting. Go to webhook.site to get a URL.');
        return false;
    }

    const submitBtn = document.getElementById('submitInvoiceBtn');
    const originalText = submitBtn ? submitBtn.textContent : 'Submit';
    
    try {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
        }

        debugLog('Sending invoice data to webhook', invoiceData);

        const response = await Promise.race([
            fetch(webhookUrl, {
                method: CONFIG.API_METHOD,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(invoiceData)
            }),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timeout')), CONFIG.REQUEST_TIMEOUT)
            )
        ]);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json().catch(() => ({}));
        debugLog('Webhook response received', result);

        showNotification('success', 'Invoice submitted successfully.', 3000);
        return true;

    } catch (error) {
        console.error('Webhook submission error:', error);
        showNotification('error', 'Error submitting invoice: ' + error.message, 5000);
        return false;

    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
}

// Handle form submission
function handleInvoiceSubmit(e) {
    e.preventDefault();

    // Generate preview first
    generatePreview();

    // Collect data
    const invoiceData = collectInvoiceData();
    debugLog('Invoice data collected', invoiceData);

    // Validate data
    const errors = validateInvoiceData(invoiceData);
    if (errors.length > 0) {
        showNotification('error', 'Please fix these errors:\n' + errors.join('\n'), 5000);
        return false;
    }

    // Submit to webhook
    submitInvoiceToWebhook(invoiceData);
}

// Show notification messages
function showNotification(type, message, duration = 3000) {
    // Remove existing notification
    const existing = document.getElementById('invoiceNotification');
    if (existing) existing.remove();

    // Create notification element
    const notification = document.createElement('div');
    notification.id = 'invoiceNotification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-weight: 500;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        white-space: pre-wrap;
        word-break: break-word;
    `;

    if (type === 'success') {
        notification.style.background = '#4caf50';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.background = '#f44336';
        notification.style.color = 'white';
    } else {
        notification.style.background = '#2196f3';
        notification.style.color = 'white';
    }

    document.body.appendChild(notification);

    // Auto-remove after duration
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Add animation styles
if (!document.getElementById('invoiceNotificationStyles')) {
    const style = document.createElement('style');
    style.id = 'invoiceNotificationStyles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Set up form submission when document is ready
document.addEventListener('DOMContentLoaded', function() {
    const invoiceForm = document.getElementById('invoiceForm');
    if (invoiceForm) {
        invoiceForm.addEventListener('submit', handleInvoiceSubmit);
    }
});
