// Hàm khởi tạo giỏ hàng
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromLocalStorage();
    setupEventListeners();
    updateTotalPrice();
    updateCartCount();
});

// Hàm thêm sản phẩm vào giỏ hàng
function addToCart(button) {
    const product = {
        id: button.dataset.id,
        name: button.dataset.name,
        price: parseInt(button.dataset.price.replace(/[^\d]/g, '')),
        image: button.dataset.image,
        quantity: 1
    };

    // Tạo hiệu ứng bay vào giỏ hàng
    createFlyingImage(button, product.image);

    // Thêm sản phẩm vào giỏ hàng sau khi animation hoàn thành
    setTimeout(() => {
        addProductToCart(product);
        saveCartToLocalStorage();
        showNotification('Đã thêm sản phẩm vào giỏ hàng');
        updateCartCount();
    }, 1000);
}

// Hàm thêm sản phẩm vào giao diện giỏ hàng
function addProductToCart(product) {
    const cartItems = document.querySelector('.cart-items');
    const existingItem = findExistingCartItem(product.id);
    
    if (existingItem) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng
        const quantityInput = existingItem.querySelector('.quantity-input');
        quantityInput.value = parseInt(quantityInput.value) + 1;
        updateTotalPrice();
    } else {
        // Template HTML mới nhỏ gọn hơn cho sản phẩm
        const productHTML = `
            <div class="cart-item" data-id="${product.id}">
                <div class="item-checkbox">
                    <label class="checkbox-label">
                        <input type="checkbox" class="select-item" checked>
                        <span class="checkbox-custom"></span>
                    </label>
                </div>
                <div class="item-content">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="item-details">
                        <div class="item-info">
                            <h3 class="item-name">${product.name}</h3>
                            <div class="price">${formatCurrency(product.price)}</div>
                        </div>
                        <div class="item-controls">
                            <div class="quantity-control">
                                <button class="decrease">-</button>
                                <input type="number" value="${product.quantity}" class="quantity-input" min="1">
                                <button class="increase">+</button>
                            </div>
                            <button class="remove-button">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Xóa thông báo giỏ hàng trống nếu có
        const emptyMessage = cartItems.querySelector('.empty-cart-message');
        if (emptyMessage) {
            emptyMessage.remove();
        }

        cartItems.insertAdjacentHTML('beforeend', productHTML);
    }
    
    setupEventListeners();
    updateTotalPrice();
}

// Hàm tìm sản phẩm đã tồn tại trong giỏ hàng
function findExistingCartItem(productId) {
    return document.querySelector(`.cart-item[data-id="${productId}"]`);
}

// Hàm lưu giỏ hàng vào localStorage
function saveCartToLocalStorage() {
    const cartItems = [];
    document.querySelectorAll('.cart-item').forEach(item => {
        cartItems.push({
            id: item.dataset.id,
            name: item.querySelector('.item-name').textContent,
            price: parseInt(item.querySelector('.price').textContent.replace(/[^\d]/g, '')),
            image: item.querySelector('.product-image').src,
            quantity: parseInt(item.querySelector('.quantity-input').value)
        });
    });
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Hàm load giỏ hàng từ localStorage
function loadCartFromLocalStorage() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartContainer = document.querySelector('.cart-items');
    
    if (cartItems.length > 0) {
        cartContainer.innerHTML = '';
        cartItems.forEach(item => {
            const productHTML = `
                <div class="cart-item" data-id="${item.id}">
                    <div class="item-checkbox">
                        <label class="checkbox-label">
                            <input type="checkbox" class="select-item" checked>
                            <span class="checkbox-custom"></span>
                        </label>
                    </div>
                    <div class="item-content">
                        <img src="${item.image}" alt="${item.name}" class="product-image">
                        <div class="item-details">
                            <div class="item-info">
                                <h3 class="item-name">${item.name}</h3>
                                <div class="price">${formatCurrency(item.price)}</div>
                            </div>
                            <div class="item-controls">
                                <div class="quantity-control">
                                    <button class="decrease">-</button>
                                    <input type="number" value="${item.quantity}" class="quantity-input" min="1">
                                    <button class="increase">+</button>
                                </div>
                                <button class="remove-button">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            cartContainer.insertAdjacentHTML('beforeend', productHTML);
        });
    } else {
        showEmptyCartMessage();
    }
}

function displayCart() {
    let cartContent = "Giỏ hàng:\n";
    let totalPrice = 0;

    cart.forEach(item => {
        const itemPrice = parseFloat(item.price);
        const itemQuantity = parseInt(item.quantity);

        if (!isNaN(itemPrice) && !isNaN(itemQuantity)) {
            const itemTotal = itemPrice * itemQuantity;
            totalPrice += itemTotal;
            cartContent += `${item.name} - ${item.quantity} x ${itemPrice.toLocaleString('vi-VN')}₫ = ${itemTotal.toLocaleString('vi-VN')}₫\n`;
        } else {
            console.error(`Lỗi dữ liệu cho sản phẩm: ${item.name}`);
        }
    });

    cartContent += `Tổng giá tiền: ${totalPrice.toLocaleString('vi-VN')}₫`;
    alert(cartContent || "Giỏ hàng trống");
}
// Hàm hiển thị thông báo
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
function displayCart() {
    let cartContent = "Giỏ hàng:\n";
    let totalPrice = 0;

    cart.forEach(item => {
        const itemPrice = parseFloat(item.price);
        const itemQuantity = parseInt(item.quantity);

        if (!isNaN(itemPrice) && !isNaN(itemQuantity)) {
            const itemTotal = itemPrice * itemQuantity;
            totalPrice += itemTotal;
            cartContent += `${item.name} - ${item.quantity} x ${itemPrice.toLocaleString('vi-VN')}₫ = ${itemTotal.toLocaleString('vi-VN')}₫\n`;
        } else {
            console.error(`Lỗi dữ liệu cho sản phẩm: ${item.name}`);
        }
    });

    cartContent += `Tổng giá tiền: ${totalPrice.toLocaleString('vi-VN')}₫`;
    alert(cartContent || "Giỏ hàng trống");
}
// Thêm function tạo hiệu ứng bay
function createFlyingImage(button, imageUrl) {
    // Lấy vị trí của nút thêm vào giỏ hàng
    const buttonRect = button.getBoundingClientRect();
    // Lấy vị trí của icon giỏ hàng
    const cart = document.querySelector('.cart');
    const cartRect = cart.getBoundingClientRect();

    // Tạo phần tử hình ảnh bay
    const flyingImage = document.createElement('img');
    flyingImage.src = imageUrl;
    flyingImage.className = 'flying-image';
    flyingImage.style.cssText = `
        position: fixed;
        z-index: 1000;
        width: 50px;
        height: 50px;
        object-fit: cover;
        left: ${buttonRect.left}px;
        top: ${buttonRect.top}px;
        pointer-events: none;
        transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    document.body.appendChild(flyingImage);

    // Kích hoạt animation
    setTimeout(() => {
        flyingImage.style.transform = 'scale(0.3)';
        flyingImage.style.left = `${cartRect.left}px`;
        flyingImage.style.top = `${cartRect.top}px`;
        flyingImage.style.opacity = '0.5';
    }, 10);

    // Xóa phần tử sau khi animation hoàn thành
    setTimeout(() => {
        flyingImage.remove();
        // Thêm hiệu ứng rung cho icon giỏ hàng
        cart.classList.add('shake');
        setTimeout(() => cart.classList.remove('shake'), 500);
    }, 1000);
}

// Hàm thiết lập các event listeners
function setupEventListeners() {
    // Xóa tất cả event listeners cũ
    document.querySelectorAll('.decrease, .increase').forEach(button => {
        button.replaceWith(button.cloneNode(true));
    });

    // Thêm event listeners mới cho nút giảm
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.nextElementSibling;
            const currentValue = parseInt(input.value);
            if (currentValue > 1) {
                input.value = currentValue - 1;
                updateTotalPrice();
                saveCartToLocalStorage();
            }
        }, { once: false });
    });

    // Thêm event listeners mới cho nút tăng
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const currentValue = parseInt(input.value);
            input.value = currentValue + 1;
            updateTotalPrice();
            saveCartToLocalStorage();
        }, { once: false });
    });

    // Xử lý khi nhập số lượng trực tiếp
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                value = 1;
            }
            this.value = value;
            updateTotalPrice();
            saveCartToLocalStorage();
        });
    });

    // Xử lý nút xóa sản phẩm
    document.querySelectorAll('.remove-button').forEach(button => {
        button.addEventListener('click', function() {
            removeProduct(this.closest('.cart-item'));
        });
    });
}

// Cập nhật hàm updateTotalPrice - không cần kiểm tra checkbox
function updateTotalPrice() {
    const total = Array.from(document.querySelectorAll('.cart-item')).reduce((sum, item) => {
        const price = parseInt(item.querySelector('.price').textContent.replace(/[^\d]/g, ''));
        const quantity = parseInt(item.querySelector('.quantity-input').value);
        return sum + (price * quantity);
    }, 0);
    
    const totalElement = document.querySelector('.total-price');
    if (totalElement) {
        totalElement.textContent = formatCurrency(total);
    }
}

// Hàm xóa sản phẩm
function removeProduct(cartItem) {
    cartItem.style.opacity = '0';
    cartItem.style.transform = 'translateX(50px)';
    
    setTimeout(() => {
        cartItem.remove();
        updateTotalPrice();
        
        // Kiểm tra nếu giỏ hàng trống
        const cartItems = document.querySelectorAll('.cart-item');
        if (cartItems.length === 0) {
            showEmptyCartMessage();
        }
        
        saveCartToLocalStorage();
        updateCartCount();
    }, 300);
}

// Hàm hiển thị thông báo giỏ hàng trống
function showEmptyCartMessage() {
    const cartContainer = document.querySelector('.cart-items');
    cartContainer.innerHTML = `
        <div class="empty-cart-message">
            <p>Giỏ hàng của bạn đang trống</p>
            <a href="./Sanpham.html" class="continue-shopping">Tiếp tục mua sắm</a>
        </div>
    `;
}

// Hàm định dạng tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(amount);
}

// Hàm cập nhật số lượng trên icon giỏ hàng
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    if (cartCount) {
        cartCount.textContent = cartItems.length;
        cartCount.style.display = cartItems.length > 0 ? 'block' : 'none';
    }
}

// Thêm hàm xử lý chuyển trang thanh toán
function proceedToCheckout() {
    // Kiểm tra xem giỏ hàng có trống không
    const cartItems = document.querySelectorAll('.cart-item');
    if (cartItems.length === 0) {
        alert('Giỏ hàng của bạn đang trống!');
        return;
    }

    // Lưu thông tin giỏ hàng vào localStorage trước khi chuyển trang
    saveCartToLocalStorage();

    // Chuyển đến trang thanh toán
    window.location.href = './thanhtoan.html';
}
  