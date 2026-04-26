# H-Automate Invoice Webhook Setup Guide

This guide explains how to configure and use the H-Automate invoice webhook submission feature to integrate with your automation backend or CRM.

**Location:** `docs/INVOICE_WEBHOOK_SETUP.md`

## Quick Start

### 1. Get a Webhook URL

For **testing**, use [webhook.site](https://webhook.site/):
- Go to https://webhook.site/
- Copy your unique URL (example: `https://webhook.site/abc123def456`)
- This URL will display all requests sent to it in real-time

For **production**, use your own API endpoint:
- Use your automation backend, CRM, or n8n webhook endpoint
- Example: `https://n8n.yourdomain.com/webhook/invoices` or `https://api.yourdomain.com/invoices/submit`

### 2. Configure Webhook URL

**Option A: Using config/env.js (Recommended)**
```javascript
// In your browser console, run:
setWebhookUrl('https://webhook.site/your-unique-id');

// Or in invoice.html, you can call it directly:
// Add this before the form loads:
setWebhookUrl('https://webhook.site/your-unique-id');
```

**Option B: Hard-code in config/env.js**
Edit `config/env.js` and change:
```javascript
INVOICE_WEBHOOK_URL: 'https://your-webhook-url-here'
```

### 3. Test the Form

1. Fill out the invoice form with test automation service details
2. Click "Submit Invoice" button
3. You should see a success notification
4. Check your webhook URL to see the received JSON data

## Integration with Automation Tools

### Integrate with n8n
1. Create a new workflow in n8n
2. Add a Webhook Trigger node
3. Copy the webhook URL from n8n
4. Paste it into H-Automate's invoice config
5. Test by submitting an invoice from the dashboard

### Integrate with Zapier
1. Create a Zapier Zap
2. Use Webhooks by Zapier as the trigger
3. Copy the webhook URL
4. Configure it in H-Automate's `config/env.js`
5. Map the invoice data to your downstream apps

### Integrate with Your CRM
1. Set up a custom webhook endpoint on your CRM or backend
2. Configure the endpoint URL in H-Automate
3. Your system will automatically receive invoice submissions

## Data Format

When you submit an invoice, this JSON data is sent to your webhook:

```json
{
  "invoiceNumber": "INV-001",
  "invoiceDate": "2024-04-20",
  "dueDate": "2024-05-20",
  "company": {
    "name": "Your Company",
    "street": "123 Business St",
    "city": "Kuala Lumpur"
  },
  "client": {
    "name": "Client Name",
    "street": "456 Client Ave",
    "city": "Selangor"
  },
  "items": [
    {
      "description": "Product/Service Name",
      "quantity": 1,
      "price": 100.00,
      "amount": 100.00
    }
  ],
  "taxRate": 6,
  "subtotal": 100.00,
  "taxAmount": 6.00,
  "total": 106.00,
  "notes": "Thank you for your business",
  "submittedAt": "2024-04-20T10:30:00.000Z"
}
```

## Features

✅ **Form Validation** - Validates required fields before submission
✅ **Error Handling** - Shows clear error messages if submission fails
✅ **Loading State** - Button shows "⏳ Submitting..." during request
✅ **Timeout Protection** - Requests timeout after 30 seconds
✅ **Debug Logging** - Enable with `CONFIG.DEBUG = true` for console logs
✅ **Notifications** - Success/error messages display on screen
✅ **Local Storage** - Webhook URL is saved for next session

## Troubleshooting

### "Please configure your webhook URL"
- Your webhook URL is not set
- Call `setWebhookUrl('your-url')` in browser console
- Or edit `config/env.js` directly

### "Error submitting invoice: HTTP Error 405"
- Your endpoint doesn't accept POST requests
- Check that your webhook/API accepts POST method

### "Error submitting invoice: Request timeout"
- Your server took too long to respond (>30 seconds)
- Check your server health
- Increase timeout in `CONFIG.REQUEST_TIMEOUT` if needed

### CORS Error in browser console
- Your webhook server doesn't allow cross-origin requests
- For webhook.site, this works automatically
- For custom APIs, configure CORS headers:
  ```
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: POST, OPTIONS
  Access-Control-Allow-Headers: Content-Type
  ```

## API Endpoint Requirements

Your backend webhook should:

1. **Accept POST requests** with JSON body
2. **Return valid JSON** response (even if empty: `{}`)
3. **Return HTTP 200** on success
4. **(Optional) Configure CORS** if called from different domain
5. **(Optional) Validate** the received data

### Example Backend (Node.js Express)

```javascript
app.post('/invoice/submit', (req, res) => {
  const invoiceData = req.body;
  console.log('Received invoice:', invoiceData);
  
  // Save to database, send email, etc.
  
  res.json({ 
    success: true, 
    message: 'Invoice received',
    invoiceId: '12345' 
  });
});
```

### Example Backend (Python Flask)

```python
@app.route('/invoice/submit', methods=['POST'])
def submit_invoice():
    invoice_data = request.json
    print('Received invoice:', invoice_data)
    
    # Save to database, send email, etc.
    
    return jsonify({
        'success': True,
        'message': 'Invoice received',
        'invoiceId': '12345'
    })
```

## Monitoring

### Using webhook.site
1. Go to your webhook.site URL
2. Click "Redirect to new URL" for a new unique URL
3. Copy the URL and update it in the form
4. Submit invoices and watch them appear in real-time

### Using Browser DevTools
1. Open DevTools (F12)
2. Go to Network tab
3. Submit an invoice
4. Click the POST request to see details
5. Check Request/Response tabs for data

### Debug Logging
Enable verbose logging:
```javascript
// In browser console:
CONFIG.DEBUG = true;
```

Then check console output for detailed submission information.

## Project Structure

```
5stepads/
├── config/
│   └── env.js                          # Environment configuration (webhook settings)
├── docs/
│   ├── INVOICE_WEBHOOK_SETUP.md        # This guide
│   └── .env.example                    # Configuration template
├── css/
│   ├── admin-auth.css
│   ├── dashboard.css
│   ├── invoice.css
│   └── training.css
├── js/
│   ├── admin-auth.js
│   ├── calculate.js
│   ├── dashboard.js
│   ├── invoice.js                      # Invoice form with webhook submission
│   ├── lib-loader.js
│   └── training.js
├── menu/
│   ├── admin.html
│   ├── invoice.html                    # Invoice form page
│   └── training.html
├── media/
│   └── training-content.html
└── index.html                          # Main dashboard page
```

## Next Steps

1. Test with webhook.site
2. Implement your backend endpoint
3. Update webhook URL to your production API
4. Deploy to production

## Support

For issues or questions:
- Check browser console for errors (F12)
- Enable DEBUG mode to see detailed logs
- Verify webhook URL is correct
- Test with webhook.site first
- Check network tab in DevTools
