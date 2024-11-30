document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra đăng nhập
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = 'signIn.html';
        return;
    }
    
    // Hiển thị thông tin người dùng trong trang thông tin tài khoản
    displayUserInfo(currentUser);
    
    // Cập nhật nút đăng nhập thành tên người dùng
    const loginButton = document.querySelector('.login');
    if (loginButton) {
        // Thay đổi nội dung nút thành tên người dùng với icon
        loginButton.innerHTML = `<i class="fa-regular fa-user"></i> ${currentUser.fullName}`;
        
        // Thêm style cho nút
        loginButton.style.backgroundColor = '#35635A';
        loginButton.style.color = 'white';
        loginButton.style.padding = '8px 15px';
        loginButton.style.display = 'flex';
        loginButton.style.alignItems = 'center';
        loginButton.style.gap = '5px';
        loginButton.style.minWidth = 'fit-content';
        
        // Thêm sự kiện click để chuyển đến trang thông tin tài khoản
        loginButton.onclick = function() {
            window.location.href = 'thongtintaikhoan.html';
        };
    }
    
    // Xử lý đăng xuất
    const logoutButton = document.querySelector('.user-info li:last-child');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'signIn.html';
        });
    }

    const searchBar = document.querySelector('.search-bar');
    const priceSelect = document.getElementById('priceRange');
    const searchIcon = document.querySelector('.search-icon');

    // Hàm xử lý tìm kiếm
    function handleSearch() {
        const searchTerm = searchBar.value.toLowerCase();
        const priceRange = priceSelect.value;
        
        // Lấy giá trị min và max từ price range
        let minPrice = 0;
        let maxPrice = Infinity;
        
        if (priceRange) {
            const [min, max] = priceRange.split('-');
            minPrice = parseInt(min);
            maxPrice = max === 'up' ? Infinity : parseInt(max);
        }

        // TODO: Thêm logic tìm kiếm sản phẩm theo từ khóa và khoảng giá
        console.log('Tìm kiếm:', searchTerm);
        console.log('Khoảng giá:', minPrice, '-', maxPrice);
        
        // Ví dụ về logic tìm kiếm:
        // 1. Lọc sản phẩm theo tên
        // 2. Lọc tiếp theo khoảng giá
        // 3. Hiển thị kết quả
    }

    // Sự kiện click vào icon tìm kiếm
    searchIcon.addEventListener('click', handleSearch);

    // Sự kiện Enter trong ô tìm kiếm
    searchBar.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Sự kiện thay đổi khoảng giá
    priceSelect.addEventListener('change', handleSearch);
});

function displayUserInfo(user) {
    // Cập nhật thông tin trong sidebar
    const userGreeting = document.querySelector('.user-info p');
    if (userGreeting) {
        userGreeting.textContent = `Hi, ${user.fullName}`;
    }
    
    // Cập nhật thông tin trong phần account-info
    const infoSpans = document.querySelectorAll('.account-info .info-row span:last-child');
    if (infoSpans.length > 0) {
        infoSpans[0].textContent = user.fullName;
        infoSpans[1].textContent = user.email;
        infoSpans[2].textContent = user.gender || 'Chưa cập nhật';
        infoSpans[3].textContent = user.phone || 'Chưa cập nhật';
        infoSpans[4].textContent = user.address || 'Chưa cập nhật';
    }
}

function toggleEdit(fieldId) {
    const span = document.getElementById(fieldId);
    const input = fieldId === 'gender' ? 
        document.getElementById('genderSelect') : 
        document.getElementById(fieldId + 'Input');
    const button = span.nextElementSibling.nextElementSibling;

    if (input.style.display === 'none') {
        span.style.display = 'none';
        input.style.display = 'inline-block';
        if (fieldId === 'gender') {
            input.value = span.textContent;
        } else {
            input.value = span.textContent;
        }
        button.textContent = 'Xong';
    } else {
        const oldValue = span.textContent;
        span.style.display = 'inline-block';
        input.style.display = 'none';
        span.textContent = input.value;
        button.textContent = 'Sửa';

        // Kiểm tra nếu giá trị đã thay đổi thì hiện thông báo
        if (oldValue !== input.value) {
            showNotification(`Đã cập nhật ${getFieldLabel(fieldId)}`);
        }
    }
}

// Hàm hiển thị thông báo
function showNotification(message) {
    // Tạo element thông báo
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Thêm style cho notification
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#35635A';
    notification.style.color = 'white';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    notification.style.animation = 'slideIn 0.5s ease-out';

    // Thêm vào body
    document.body.appendChild(notification);

    // Tự động ẩn sau 3 giây
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Hàm lấy tên trường hiển thị
function getFieldLabel(fieldId) {
    const labels = {
        'fullName': 'họ tên',
        'email': 'email',
        'gender': 'giới tính',
        'phone': 'số điện thoại',
        'address': 'địa chỉ'
    };
    return labels[fieldId] || fieldId;
}

// Thêm CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

function saveChanges() {
    const userData = {
        fullName: document.getElementById('fullName').textContent,
        email: document.getElementById('email').textContent,
        gender: document.getElementById('gender').textContent,
        phone: document.getElementById('phone').textContent,
        address: document.getElementById('address').textContent
    };

    localStorage.setItem('userData', JSON.stringify(userData));
    showNotification('Đã lưu tất cả thông tin thành công!');
}

window.onload = function() {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
        const userData = JSON.parse(savedData);
        document.getElementById('fullName').textContent = userData.fullName;
        document.getElementById('email').textContent = userData.email;
        document.getElementById('gender').textContent = userData.gender;
        document.getElementById('phone').textContent = userData.phone;
        document.getElementById('address').textContent = userData.address;
    }
}

// Hàm cập nhật nút đăng nhập
function updateLoginButton(user) {
    const loginButton = document.querySelector('.login');
    if (loginButton) {
        loginButton.innerHTML = `<i class="fa-regular fa-user"></i> ${user.fullName}`;
        loginButton.style.backgroundColor = '#35635A';
        loginButton.style.color = 'white';
    }
}
