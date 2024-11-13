document.addEventListener('DOMContentLoaded', function() {
    // Verificação de usuário autenticado
    const user = JSON.parse(localStorage.getItem('loggedUser'));
    if (!user || !['admin', 'salesperson', 'shipper'].includes(user.role)) {
        window.location.href = 'login.html';
        return;
    }

    const usernameElement = document.getElementById('username');
    const roleElement = document.getElementById('role');
    const productList = document.getElementById('product-list').getElementsByTagName('tbody')[0];
    const searchBar = document.getElementById('search-bar');
    const paginationControls = document.getElementById('pagination-controls');
    const prevButton = document.getElementById('prev-btn');
    const nextButton = document.getElementById('next-btn');
    const resetButton = document.getElementById('reset-btn');
    const logoutButton = document.getElementById('logout-btn');
    const addProductButton = document.getElementById('add-product-btn');
    
    let currentPage = 1;
    const itemsPerPage = 10;
    
    // Mock products (in a real app, you'd fetch this from an API)
    let products = JSON.parse(localStorage.getItem('products')) || [];
    const sortOrder = { name: 'asc', brand: 'asc', category: 'asc', id: 'asc' };

    usernameElement.textContent = user.username;
    roleElement.textContent = user.role;

    // Logout functionality
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('loggedUser');
        window.location.href = 'login.html';
    });

    // Pagination function
    function paginateProducts() {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const visibleProducts = products.slice(start, end);

        productList.innerHTML = '';
        visibleProducts.forEach(product => {
            const row = productList.insertRow();
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.brand}</td>
                <td>${product.category}</td>
                <td>${product.id}</td>
                <td>
                    <button onclick="viewDetails('${product.id}')">View</button>
                    <button onclick="deleteProduct('${product.id}')">Delete</button>
                </td>
            `;
        });

        document.getElementById('page-number').textContent = `Page ${currentPage}`;
    }

    // Sort products by column
    function sortProducts(column) {
        const direction = sortOrder[column] === 'asc' ? 1 : -1;
        products.sort((a, b) => {
            if (a[column] < b[column]) return -direction;
            if (a[column] > b[column]) return direction;
            return 0;
        });

        sortOrder[column] = sortOrder[column] === 'asc' ? 'desc' : 'asc';
        paginateProducts();
    }

    // Search products by any field
    searchBar.addEventListener('input', function() {
        const query = searchBar.value.toLowerCase();
        products = products.filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.shortDescription.toLowerCase().includes(query) ||
            product.fullDescription.toLowerCase().includes(query) ||
            product.brand.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
        paginateProducts();
    });

    // Reset product list to the initial state
    resetButton.addEventListener('click', function() {
        localStorage.setItem('products', JSON.stringify(initialProducts)); // Replace with initial products
        products = [...initialProducts];
        paginateProducts();
    });

    // Product list initial population
    paginateProducts();

    // Pagination buttons
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            paginateProducts();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < Math.ceil(products.length / itemsPerPage)) {
            currentPage++;
            paginateProducts();
        }
    })})
