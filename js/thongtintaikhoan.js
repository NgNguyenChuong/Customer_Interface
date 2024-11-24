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

function toggleEdit(field) {
    const span = document.getElementById(field);
    const input = document.getElementById(`${field}Input`) || document.getElementById(`${field}Select`);
    const button = event.target;
    
    if (button.textContent === 'Sửa') {
        // Chuyển sang chế độ chỉnh sửa
        span.style.display = 'none';
        input.style.display = 'inline-block';
        input.value = span.textContent !== 'Chưa cập nhật' ? span.textContent : '';
        button.textContent = 'Lưu';
        button.classList.add('save');
    } else {
        // Lưu thông tin
        const newValue = input.value.trim();
        
        if (field === 'email') {
            // Kiểm tra định dạng email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newValue)) {
                alert('Email không hợp lệ!');
                return;
            }
            
            // Kiểm tra xem email đã tồn tại chưa
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (users.some(u => u.email === newValue && u.email !== currentUser.email)) {
                alert('Email này đã được sử dụng!');
                return;
            }
        }

        if (newValue) {
            // Cập nhật giao diện
            span.textContent = newValue;
            
            // Cập nhật localStorage
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const users = JSON.parse(localStorage.getItem('users'));
            
            // Lưu email cũ để tìm user cần cập nhật
            const oldEmail = currentUser.email;
            
            // Cập nhật thông tin người dùng hiện tại
            currentUser[field] = newValue;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Cập nhật trong danh sách users
            const userIndex = users.findIndex(u => u.email === oldEmail);
            if (userIndex !== -1) {
                users[userIndex][field] = newValue;
                localStorage.setItem('users', JSON.stringify(users));
            }
            
            // Cập nhật nút đăng nhập nếu thay đổi tên
            if (field === 'fullName') {
                updateLoginButton(currentUser);
                // Cập nhật tên trong sidebar
                const userGreeting = document.querySelector('.user-info p');
                if (userGreeting) {
                    userGreeting.textContent = `Hi, ${newValue}`;
                }
            }
            
            alert('Cập nhật thành công!');
        }
        
        // Chuyển về chế độ hiển thị
        span.style.display = 'inline-block';
        input.style.display = 'none';
        button.textContent = 'Sửa';
        button.classList.remove('save');
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
