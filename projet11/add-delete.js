class AddDeleteManager {
    saveItem(name, quantity, price, category, photo) {
    const newItem = {
        id: Date.now().toString(),
        name,
        quantity,
        price,
        category: category || 'Uncategorized',
        photo
    };

    this.stock.push(newItem);
    this.saveStock();
    this.updateSelects();
    this.renderItems();

    document.getElementById('add-form').reset();
    alert('Item added successfully!');
}
renderItems() {
    const container = document.getElementById('items-container');
    container.innerHTML = '';

    this.stock.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-card';

        div.innerHTML = `
    <div class="card-img">
        ${item.photo ? `<img src="${item.photo}">` : `<div class="no-img">No Image</div>`}
    </div>

    <div class="card-body">
        <h3>${item.name}</h3>

        <div class="meta">
            <span>Qty: ${item.quantity}</span>
            <span>$${item.price}</span>
        </div>

        <p class="category">${item.category}</p>
    </div>
`;


        container.appendChild(div);
    });
}


    constructor() {
        this.stock = this.loadStock();
        this.init();
    }

    init() {
    this.updateSelects();
    this.renderItems();
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
    }

    // Add new item
    addItem() {
    const name = document.getElementById('add-name').value.trim();
    const quantity = parseInt(document.getElementById('add-quantity').value) || 0;
    const price = parseFloat(document.getElementById('add-price').value) || 0;
    const category = document.getElementById('add-category').value.trim();
    const photoInput = document.getElementById('add-photo');
    const photoFile = photoInput.files[0];

    if (!name) {
        alert('Please enter an item name');
        return;
    }

    if (photoFile) {
        const reader = new FileReader();
        reader.onload = () => {
            this.saveItem(name, quantity, price, category, reader.result);
        };
        reader.readAsDataURL(photoFile);
    } else {
        this.saveItem(name, quantity, price, category, null);
    }
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
            this.updateSelects();
            select.value = '';
            alert('Item deleted successfully!');
        }
    }

    // Update select dropdowns
    updateSelects() {
        const deleteSelect = document.getElementById('delete-select');

        // Save current selection
        const deleteValue = deleteSelect.value;

        // Clear and rebuild options
        deleteSelect.innerHTML = '<option value="">-- Select Item --</option>';

        this.stock.forEach(item => {
            const deleteOption = document.createElement('option');
            deleteOption.value = item.id;
            deleteOption.textContent = `${item.name} (Qty: ${item.quantity})`;
            deleteSelect.appendChild(deleteOption);
        });

        // Restore selection if it still exists
        if (deleteValue && this.stock.find(s => s.id === deleteValue)) {
            deleteSelect.value = deleteValue;
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new AddDeleteManager();});
