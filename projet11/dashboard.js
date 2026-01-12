class DashboardManager {
    constructor() {
        this.stock = this.loadStock();
        this.init();
    }

    init() {
        this.renderDashboard();
    }

    // Load stock from localStorage
    loadStock() {
        const stored = localStorage.getItem('stockData');
        return stored ? JSON.parse(stored) : [];
    }

    // Render dashboard table
    renderDashboard() {
        const tbody = document.getElementById('stock-table-body');
        const emptyState = document.getElementById('empty-state');

        if (this.stock.length === 0) {
            tbody.innerHTML = '';
            emptyState.classList.remove('hidden');
            this.updateStats();
            return;
        }

        emptyState.classList.add('hidden');
        tbody.innerHTML = this.stock.map(item => `
            <tr>
                <td>${this.escapeHtml(item.name)}</td>
                <td>${item.quantity}</td>
                <td>${item.price > 0 ? '$' + item.price.toFixed(2) : 'N/A'}</td>
                <td>${this.escapeHtml(item.category || 'Uncategorized')}</td>
            </tr>
        `).join('');

        this.updateStats();
    }

    // Update statistics
    updateStats() {
        const totalItems = this.stock.length;
        const totalQuantity = this.stock.reduce((sum, item) => sum + item.quantity, 0);

        document.getElementById('total-items').textContent = totalItems;
        document.getElementById('total-quantity').textContent = totalQuantity;
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Export stock data to JSON file
function exportToJSON() {
    const stock = JSON.parse(localStorage.getItem('stockData') || '[]');
    const jsonString = JSON.stringify(stock, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success message
    const message = document.getElementById('json-message');
    message.textContent = '✅ Stock data exported successfully!';
    message.className = 'json-message success';
    setTimeout(() => {
        message.textContent = '';
        message.className = 'json-message';
    }, 3000);
}

// Import stock data from JSON file
function importFromJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Validate that it's an array
            if (!Array.isArray(importedData)) {
                throw new Error('Invalid JSON format. Expected an array.');
            }

            // Ask for confirmation
            const currentStock = JSON.parse(localStorage.getItem('stockData') || '[]');
            const currentCount = currentStock.length;
            const importedCount = importedData.length;

            let confirmMessage = `Import ${importedCount} item(s)?`;
            if (currentCount > 0) {
                confirmMessage += `\n\nWarning: You currently have ${currentCount} item(s). This will replace all existing data.`;
            }

            if (confirm(confirmMessage)) {
                localStorage.setItem('stockData', JSON.stringify(importedData));
                
                // Show success message
                const message = document.getElementById('json-message');
                message.textContent = `✅ Successfully imported ${importedCount} item(s)!`;
                message.className = 'json-message success';
                
                // Reload the dashboard
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        } catch (error) {
            const message = document.getElementById('json-message');
            message.textContent = `❌ Error: ${error.message}`;
            message.className = 'json-message error';
            setTimeout(() => {
                message.textContent = '';
                message.className = 'json-message';
            }, 5000);
        }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new DashboardManager();
});