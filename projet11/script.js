class StockManager {
    constructor() {
        this.stock = this.loadStock();
        this.init();
    }

    init() {
        this.renderDashboard();
        this.updateSelects();
        this.setupEventListeners();
    }

    // Load stock from localStorage
    loadStock() {
        const stored = localStorage.getItem('stockData');
        return stored ? JSON.parse(stored) : [];
    }

    // Save stock to localStorage
    saveStock() {
        localStorage.setItem('stockData', JSON.stringify(this.stock));
    }

    // Setup event listeners
    setupEventListeners() {
        // Add form
        document.getElementById('add-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addItem();
        });

        // Delete form
        document.getElementById('delete-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.deleteItem();
        });

        // Modify form
        document.getElementById('modify-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.modifyItem();
        });

        // When modify select changes, load item data
        document.getElementById('modify-select').addEventListener('change', (e) => {
            this.loadItemForModify(e.target.value);
        });
    }

    // Add new item
    addItem() {
        const name = document.getElementById('add-name').value.trim();
        const quantity = parseInt(document.getElementById('add-quantity').value) || 0;
        const price = parseFloat(document.getElementById('add-price').value) || 0;
        const category = document.getElementById('add-category').value.trim();

        if (!name) {
            alert('Please enter an item name');
            return;
        }

        const newItem = {
            id: Date.now().toString(),
            name: name,
            quantity: quantity,
            price: price,
            category: category || 'Uncategorized'
        };

        this.stock.push(newItem);
        this.saveStock();
        this.renderDashboard();
        this.updateSelects();
        document.getElementById('add-form').reset();
        alert('Item added successfully!');
    }

    // Delete item
    deleteItem() {
        const select = document.getElementById('delete-select');
        const itemId = select.value;

        if (!itemId) {
            alert('Please select an item to delete');
            return;
        }

        const item = this.stock.find(s => s.id === itemId);
        if (!item) return;

        if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
            this.stock = this.stock.filter(s => s.id !== itemId);
            this.saveStock();
            this.renderDashboard();
            this.updateSelects();
            select.value = '';
            alert('Item deleted successfully!');
        }
    }

    // Load item data for modification
    loadItemForModify(itemId) {
        if (!itemId) {
            document.getElementById('modify-form').reset();
            return;
        }

        const item = this.stock.find(s => s.id === itemId);
        if (!item) return;

        document.getElementById('modify-name').value = item.name || '';
        document.getElementById('modify-quantity').value = item.quantity || 0;
        document.getElementById('modify-price').value = item.price || 0;
        document.getElementById('modify-category').value = item.category || '';
    }

    // Modify item
    modifyItem() {
        const select = document.getElementById('modify-select');
        const itemId = select.value;

        if (!itemId) {
            alert('Please select an item to modify');
            return;
        }

        const name = document.getElementById('modify-name').value.trim();
        const quantity = parseInt(document.getElementById('modify-quantity').value) || 0;
        const price = parseFloat(document.getElementById('modify-price').value) || 0;
        const category = document.getElementById('modify-category').value.trim();

        if (!name) {
            alert('Please enter an item name');
            return;
        }

        const index = this.stock.findIndex(s => s.id === itemId);
        if (index !== -1) {
            this.stock[index] = {
                ...this.stock[index],
                name: name,
                quantity: quantity,
                price: price,
                category: category || 'Uncategorized'
            };
            this.saveStock();
            this.renderDashboard();
            this.updateSelects();
            alert('Item updated successfully!');
        }
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

    // Update select dropdowns
    updateSelects() {
        const deleteSelect = document.getElementById('delete-select');
        const modifySelect = document.getElementById('modify-select');

        // Save current selections
        const deleteValue = deleteSelect.value;
        const modifyValue = modifySelect.value;

        // Clear and rebuild options
        deleteSelect.innerHTML = '<option value="">-- Select Item --</option>';
        modifySelect.innerHTML = '<option value="">-- Select Item --</option>';

        this.stock.forEach(item => {
            // Delete select
            const deleteOption = document.createElement('option');
            deleteOption.value = item.id;
            deleteOption.textContent = `${item.name} (Qty: ${item.quantity})`;
            deleteSelect.appendChild(deleteOption);

            // Modify select
            const modifyOption = document.createElement('option');
            modifyOption.value = item.id;
            modifyOption.textContent = `${item.name} (Qty: ${item.quantity})`;
            modifySelect.appendChild(modifyOption);
        });

        // Restore selections if they still exist
        if (deleteValue && this.stock.find(s => s.id === deleteValue)) {
            deleteSelect.value = deleteValue;
        }
        if (modifyValue && this.stock.find(s => s.id === modifyValue)) {
            modifySelect.value = modifyValue;
            this.loadItemForModify(modifyValue);
        }
    }
    // logout 
   

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new StockManager();
}); 