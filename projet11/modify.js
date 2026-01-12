class ModifyManager {
    constructor() {
        this.stock = this.loadStock();
        this.init();
    }

    init() {
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

    // Load item data for modification
    loadItemForModify(itemId) {
        if (!itemId) {
            document.getElementById('modify-form').querySelectorAll('input').forEach(input => {
                if (input.id !== 'modify-select') {
                    input.value = '';
                }
            });
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
            this.updateSelects();
            alert('Item updated successfully!');
        }
    }

    // Update select dropdowns
    updateSelects() {
        const modifySelect = document.getElementById('modify-select');

        // Save current selection
        const modifyValue = modifySelect.value;

        // Clear and rebuild options
        modifySelect.innerHTML = '<option value="">-- Select Item --</option>';

        this.stock.forEach(item => {
            const modifyOption = document.createElement('option');
            modifyOption.value = item.id;
            modifyOption.textContent = `${item.name} (Qty: ${item.quantity})`;
            modifySelect.appendChild(modifyOption);
        });

        // Restore selection if it still exists
        if (modifyValue && this.stock.find(s => s.id === modifyValue)) {
            modifySelect.value = modifyValue;
            this.loadItemForModify(modifyValue);
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ModifyManager();
});



