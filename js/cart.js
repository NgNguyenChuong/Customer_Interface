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
        name: button.dataset.name,
        price: button.dataset.price,
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
    }, 1000);
}

// Hàm thêm sản phẩm vào giao diện giỏ hàng
function addProductToCart(product) {
    const cartItems = document.querySelector('.cart-items');
    
    // Xóa thông báo giỏ hàng trống nếu có
    const emptyMessage = cartItems.querySelector('.empty-cart-message');
    if (emptyMessage) {
        emptyMessage.remove();
    }

    // Tạo HTML cho sản phẩm mới - đã bỏ checkbox
    const productHTML = `
        <div class="cart-item">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="item-details">
                <h3>${product.name}</h3>
                <p class="price">${product.price}</p>
                <div class="quantity-control">
                    <button class="decrease">-</button>
                    <input type="number" value="${product.quantity}" class="quantity-input" min="1">
                    <button class="increase">+</button>
                </div>
            </div>
            <button class="remove-button">Xóa</button>
        </div>
    `;

    cartItems.insertAdjacentHTML('beforeend', productHTML);
    setupEventListeners();
    updateTotalPrice();
}

// Hàm load giỏ hàng từ localStorage
function loadCartFromLocalStorage() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartContainer = document.querySelector('.cart-items');
    
    if (cartItems.length > 0) {
        cartContainer.innerHTML = '';
        cartItems.forEach(item => {
            const productHTML = `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="product-image">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p class="price">${item.price}</p>
                        <div class="quantity-control">
                            <button class="decrease">-</button>
                            <input type="number" value="${item.quantity}" class="quantity-input" min="1">
                            <button class="increase">+</button>
                        </div>
                    </div>
                    <button class="remove-button">Xóa</button>
                </div>
            `;
            cartContainer.insertAdjacentHTML('beforeend', productHTML);
        });
        setupEventListeners();
        updateTotalPrice();
    }
}

// Hàm lưu giỏ hàng vào localStorage
function saveCartToLocalStorage() {
    const cartItems = [];
    let totalAmount = 0;
    
    document.querySelectorAll('.cart-item').forEach(item => {
        const price = parseInt(item.querySelector('.price').textContent.replace(/\D/g, ''));
        const quantity = parseInt(item.querySelector('.quantity-input').value);
        const itemTotal = price * quantity;
        totalAmount += itemTotal;

        cartItems.push({
            name: item.querySelector('h3').textContent,
            price: item.querySelector('.price').textContent,
            image: item.querySelector('.product-image').src,
            quantity: quantity,
            itemTotal: itemTotal
        });
    });

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('totalAmount', totalAmount);
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
    const cartItems = document.querySelectorAll('.cart-item');
    let total = 0;
    
    cartItems.forEach(item => {
        const price = parseInt(item.querySelector('.price').textContent.replace(/\D/g, ''));
        const quantity = parseInt(item.querySelector('.quantity-input').value);
        total += price * quantity;
    });
    
    const totalPriceElement = document.querySelector('.total-price');
    if (totalPriceElement) {
        totalPriceElement.textContent = formatCurrency(total) + 'đ';
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

// Hàm format tiền tệ
function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Hàm cập nhật số lượng trên icon giỏ hàng
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartCount = document.querySelector('.cart-count');
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
  