// Environment Configuration
// This file stores webhook and API endpoints
// Location: config/env.js

const CONFIG = {
    // Webhook URL for invoice submission
    // Using n8n webhook endpoint
    INVOICE_WEBHOOK_URL: 'https://n8n.srv1100696.hstgr.cloud/webhook/1e1dba85-750e-4cc6-8ed6-8af646e84665',
    
    // API method (POST, PUT, etc.)
    API_METHOD: 'POST',
    
    // Timeout for API requests (in milliseconds)
    REQUEST_TIMEOUT: 30000,
    
    // Debug mode
    DEBUG: true
};

// Function to update webhook URL dynamically
function setWebhookUrl(url) {
    CONFIG.INVOICE_WEBHOOK_URL = url;
    localStorage.setItem('invoiceWebhookUrl', url);
    console.log('Webhook URL updated:', url);
}

// Function to get current webhook URL
function getWebhookUrl() {
    return CONFIG.INVOICE_WEBHOOK_URL;
}

// Debug logging helper
function debugLog(message, data = null) {
    if (CONFIG.DEBUG) {
        console.log('[Invoice Debug]', message);
        if (data) console.log(data);
    }
}

debugLog('Configuration loaded from config/env.js');
