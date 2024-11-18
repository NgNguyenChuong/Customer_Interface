document.addEventListener('DOMContentLoaded', function() {
    let localData = [];

    // Thêm xử lý cho radio buttons
    const deliveryRadios = document.querySelectorAll('input[name="delivery"]');
    const deliveryAddressForm = document.getElementById('deliveryAddressForm');
    const storeAddressForm = document.getElementById('storeAddressForm');

    deliveryRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'delivery') {
                // Khi chọn giao tận nơi
                deliveryAddressForm.classList.remove('hidden');
                storeAddressForm.classList.add('hidden');
                // Bật lại validation cho form giao hàng
                toggleFormValidation(deliveryAddressForm, true);
                toggleFormValidation(storeAddressForm, false);
            } else {
                // Khi chọn nhận tại cửa hàng
                deliveryAddressForm.classList.add('hidden');
                storeAddressForm.classList.remove('hidden');
                // Tắt validation cho form giao hàng
                toggleFormValidation(deliveryAddressForm, false);
                toggleFormValidation(storeAddressForm, true);
            }
        });
    });

    // Hàm bật/tắt validation cho form
    function toggleFormValidation(form, enable) {
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.required = enable;
        });
    }

    // Giữ nguyên code load địa chỉ và giỏ hàng hiện có
    const init = async () => {
        await loadData();
        loadCartItems();
    }

    // Load dữ liệu địa chỉ từ JSON
    const loadData = async () => {
        try {
            console.log('Loading data from JSON...');
            const response = await fetch('../data/local-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            localData = await response.json();
            console.log('Loaded data:', localData);
            loadProvinces();
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    // Load tỉnh/thành phố
    const loadProvinces = () => {
        const citySelect = document.getElementById("city");
        if (!citySelect) {
            console.error('Cannot find city select element');
            return;
        }
        
        citySelect.innerHTML = '<option value="">Chọn tỉnh / thành</option>';
        console.log('Loading provinces:', localData);
        
        if (Array.isArray(localData)) {
            localData.forEach(province => {
                const option = document.createElement("option");
                option.value = province.code;
                option.text = province.name;
                citySelect.add(option);
            });
            console.log('Provinces loaded successfully');
        } else {
            console.error('localData is not an array:', localData);
        }
    }

    // Load quận/huyện khi chọn tỉnh/thành
    const loadDistricts = (provinceCode) => {
        console.log('Loading districts for province:', provinceCode);
        const province = localData.find(p => p.code == provinceCode);
        console.log('Found province:', province);
        
        const districtSelect = document.getElementById("district");
        if (!districtSelect) {
            console.error('Cannot find district select element');
            return;
        }
        
        districtSelect.innerHTML = '<option value="">Chọn quận / huyện</option>';
        
        if (province && province.districts) {
            province.districts.forEach(district => {
                const option = document.createElement("option");
                option.value = district.code;
                option.text = district.name;
                districtSelect.add(option);
            });
        }
    }

    // Load phường/xã khi chọn quận/huyện
    const loadWards = (provinceCode, districtCode) => {
        console.log('Loading wards for district:', districtCode);
        const province = localData.find(p => p.code == provinceCode);
        const district = province?.districts.find(d => d.code == districtCode);
        
        const wardSelect = document.getElementById("ward");
        if (!wardSelect) {
            console.error('Cannot find ward select element');
            return;
        }
        
        wardSelect.innerHTML = '<option value="">Chọn phường / xã</option>';
        
        if (district && district.wards) {
            district.wards.forEach(ward => {
                const option = document.createElement("option");
                option.value = ward.code;
                option.text = ward.name;
                wardSelect.add(option);
            });
        }
    }

    // Load giỏ hàng
    const loadCartItems = () => {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const cartItemsContainer = document.querySelector('.cart-items');
        let totalAmount = 0;

        cartItemsContainer.innerHTML = '';

        cartItems.forEach(item => {
            // Chuyển đổi giá từ chuỗi "123,456đ" thành số
            const price = parseFloat(item.price.replace(/[^\d]/g, ''));
            const itemTotal = price * item.quantity;
            totalAmount += itemTotal;

            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                        <span class="quantity">${item.quantity}</span>
                    </div>
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p>Số lượng: ${item.quantity}</p>
                    </div>
                    <div class="price">${formatCurrency(itemTotal)}</div>
                </div>
            `;
        });

        // Cập nhật hiển thị tổng tiền
        document.querySelector('.subtotal span:last-child').textContent = formatCurrency(totalAmount);
        document.querySelector('.total span:last-child').textContent = formatCurrency(totalAmount);
    }

    // Thêm hàm format tiền tệ
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount).replace('₫', '') + '₫';
    }

    // Event listeners
    document.getElementById("city")?.addEventListener("change", function() {
        const provinceCode = this.value;
        console.log('Selected province code:', provinceCode);
        loadDistricts(provinceCode);
    });

    document.getElementById("district")?.addEventListener("change", function() {
        const provinceCode = document.getElementById("city").value;
        const districtCode = this.value;
        console.log('Selected district code:', districtCode);
        loadWards(provinceCode, districtCode);
    });

    // Form submit handler
    document.querySelector('.shipping-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const city = document.getElementById('city');
        const district = document.getElementById('district');
        const ward = document.getElementById('ward');
        
        if (!city.value || !district.value || !ward.value) {
            alert('Vui lòng chọn đầy đủ địa chỉ');
            return;
        }

        // Xử lý submit form ở đây
        console.log('Form submitted');
    });

    // Khởi tạo
    console.log('Starting initialization...');
    init();
}); 