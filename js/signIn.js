const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
});

const registerForm = document.querySelector('.sign-up-container form');
registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = this.querySelector('input[placeholder="Tên"]').value;
    const email = this.querySelector('input[placeholder="Email"]').value;
    const password = this.querySelector('input[placeholder="Mật khẩu"]').value;
    
    if (!name || !email || !password) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Email không hợp lệ!');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(user => user.email === email)) {
        alert('Email này đã được đăng ký! Vui lòng sử dụng email khác.');
        return;
    }
    
    const newUser = {
        fullName: name,
        email: email,
        password: password,
        gender: 'Nam',
        phone: '',
        address: ''
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Đăng ký thành công! Vui lòng đăng nhập.');
    container.classList.remove('right-panel-active');
    this.reset();
});

const loginForm = document.querySelector('.sign-in-container form');
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = this.querySelector('input[placeholder="Email"]').value;
    const password = this.querySelector('input[placeholder="Mật khẩu"]').value;
    
    if (!email || !password) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Đăng nhập thành công!');
        window.location.href = 'thongtintaikhoan.html';
    } else {
        alert('Email hoặc mật khẩu không đúng!');
    }
});

document.querySelector('.login').addEventListener('click', function() {
    window.location.href = 'signIn.html';
});