function signIn() {
  var username = document.querySelector(".form-signin input[name='username']").value.trim();
  var password = document.querySelector(".form-signin input[name='password']").value.trim();

  if (!username && !password) {
    alert("Vui lòng nhập tên đăng nhập và mật khẩu!");
    return false;
  }
  
  if (!username) {
    alert("Vui lòng nhập tên đăng nhập!");
    return false;
  }
  
  if (!password) {
    alert("Vui lòng nhập mật khẩu!");
    return false;
  }

  if (username.length < 3) {
    alert("Tên đăng nhập phải có ít nhất 3 ký tự!");
    return false;
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    alert("Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới!");
    return false;
  }

  if (password.length < 6) {
    alert("Mật khẩu phải có ít nhất 6 ký tự!");
    return false;
  }

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    alert("Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một số!");
    return false;
  }

  var user = {
    username: username,
    password: password,
  };
  var json = JSON.stringify(user);
  localStorage.setItem(username, json);
  localStorage.setItem("isLogin", true);
  localStorage.setItem("currentUser", username);
  console.log("User saved:", user);

  const successMessage = document.createElement('div');
  successMessage.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(255, 255, 255, 0.9);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    text-align: center;
    z-index: 1000;
  `;

  const checkmark = document.createElement('div');
  checkmark.innerHTML = `
    <svg width="50" height="50" viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="23" fill="none" stroke="#4CAF50" stroke-width="4"/>
      <path d="M14 27l7 7 16-16" fill="none" stroke="#4CAF50" stroke-width="4"/>
    </svg>
  `;

  const text = document.createElement('p');
  text.textContent = 'Đăng nhập thành công!';
  text.style.marginTop = '10px';
  text.style.color = '#4CAF50';
  text.style.fontWeight = 'bold';

  successMessage.appendChild(checkmark);
  successMessage.appendChild(text);
  document.body.appendChild(successMessage);

  const circle = checkmark.querySelector('circle');
  const path = checkmark.querySelector('path');
  
  circle.style.strokeDasharray = '151';
  circle.style.strokeDashoffset = '151';
  path.style.strokeDasharray = '45';
  path.style.strokeDashoffset = '45';

  circle.style.animation = 'circle 0.5s ease-in-out forwards';
  path.style.animation = 'check 0.5s ease-in-out 0.5s forwards';

  const style = document.createElement('style');
  style.textContent = `
    @keyframes circle {
      from { stroke-dashoffset: 151; }
      to { stroke-dashoffset: 0; }
    }
    @keyframes check {
      from { stroke-dashoffset: 45; }
      to { stroke-dashoffset: 0; }
    }
  `;
  document.head.appendChild(style);

  setTimeout(() => {
    window.location.href = 'homePage.html';
  }, 2000);

  return true;
}

document.addEventListener("DOMContentLoaded", function () {
    var isLogin = JSON.parse(localStorage.getItem("isLogin")) || false;
    var currentUser = localStorage.getItem("currentUser");

    if (isLogin === true) {
        // Ẩn nút đăng nhập
        var loginElement = document.getElementById('login');
        if (loginElement) {
            loginElement.style.display = "none";
        }
        
        // Xử lý các nút trong login-2
        var login2Element = document.getElementById('login-2');
        if (login2Element) {
            // Tìm tất cả các nút đăng nhập và đăng ký trong login-2
            var loginButtons = login2Element.querySelectorAll('.custom-item');
            loginButtons.forEach(function(button) {
                button.onclick = function(e) {
                    e.preventDefault();
                    alert("Vui lòng đăng xuất trước khi thực hiện thao tác này!");
                    return false;
                };
            });
        }

        document.getElementById('login-now').innerHTML = `Xin chào, ${localStorage.getItem("currentUser")}`;
    } else {
        // Nếu chưa đăng nhập, hiển thị nút đăng nhập và ẩn tên người dùng
        var loginElement = document.getElementById('login');
        if (loginElement) {
            loginElement.style.display = "block";
        }
        var loginElement2 = document.getElementById('login-2');
        if (loginElement2) {
            loginElement2.style.display = "none";
        }

        var loginNowElement = document.getElementById('login-now');
        if (loginNowElement) {
            loginNowElement.style.display = "none";
        }
    }
});

$(document).ready(function() {
  $(".btn").click(function() {
      $(".form-signin").toggleClass("form-signin-left");
      $(".form-signup").toggleClass("form-signup-left");
      $(".frame").toggleClass("frame-long");
      $(".signup-inactive").toggleClass("signup-active");
      $(".signin-active").toggleClass("signin-inactive");
      $(".forgot").toggleClass("forgot-left");   
      $(this).removeClass("idle").addClass("active");
  });
});

$(function() {
  $(".btn-signup").click(function() {
      $(".nav").toggleClass("nav-up");
      $(".form-signup-left").toggleClass("form-signup-down");
      $(".success").toggleClass("success-left"); 
      $(".frame").toggleClass("frame-short");
  });
});

$(function() {
  $(".btn-signin").click(function() {
      $(".btn-animate").toggleClass("btn-animate-grow");
      $(".welcome").toggleClass("welcome-left");
      $(".cover-photo").toggleClass("cover-photo-down");
      $(".frame").toggleClass("frame-short");
      $(".profile-photo").toggleClass("profile-photo-down");
      $(".btn-goback").toggleClass("btn-goback-up");
      $(".forgot").toggleClass("forgot-fade");
  });
});

$(document).ready(function() {
  $(".btn-login-now").click(function() {
      window.location.reload();
  });
});
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.links li');
    
    links.forEach(link => {
        link.addEventListener('click', function() {
            links.forEach(l => {
                l.classList.remove('signin-active', 'signup-active');
                l.classList.add(l === this ? 
                    (this.classList.contains('signin-inactive') ? 'signin-active' : 'signup-active') : 
                    (l.classList.contains('signin-active') ? 'signin-inactive' : 'signup-inactive'));
            });

            document.querySelector('.form-signin').classList.toggle('form-signin-left');
            document.querySelector('.form-signup').classList.toggle('form-signup-left');
        });
    });
});
function confirmSignOut() {
    console.log("Đang thực hiện đăng xuất...");
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
        console.log("Người dùng đã xác nhận đăng xuất");
        localStorage.removeItem("isLogin");
        localStorage.removeItem("currentUser");
        console.log("Đã xóa thông tin đăng nhập");
        
        // Log đường dẫn hiện tại
        console.log("Current path:", window.location.pathname);
        
        window.location.href = './index/login.html';
        return false;
    }
    console.log("Người dùng đã hủy đăng xuất");
    return false;
}

document.addEventListener('DOMContentLoaded', function() {
    // Lấy các elements cần thiết
    const signinLink = document.querySelector('.signin-active');
    const signupLink = document.querySelector('.signup-inactive');
    const signinForm = document.querySelector('.form-signin');
    const signupForm = document.querySelector('.form-signup');
    const frame = document.querySelector('.frame');

    // Xử lý click vào nút đăng ký
    signupLink.addEventListener('click', function(e) {
        e.preventDefault();
        signinForm.classList.add('form-signin-left');
        signupForm.classList.add('form-signup-left');
        frame.classList.add('frame-long');
        signinLink.classList.remove('signin-active');
        signinLink.classList.add('signin-inactive');
        signupLink.classList.remove('signup-inactive');
        signupLink.classList.add('signup-active');
    });

    // Xử lý click vào nút đăng nhập
    signinLink.addEventListener('click', function(e) {
        e.preventDefault();
        signinForm.classList.remove('form-signin-left');
        signupForm.classList.remove('form-signup-left');
        frame.classList.remove('frame-long');
        signupLink.classList.remove('signup-active');
        signupLink.classList.add('signup-inactive');
        signinLink.classList.remove('signin-inactive');
        signinLink.classList.add('signin-active');
    });
});

document.addEventListener('DOMContentLoaded', function() {

    const urlParams = new URLSearchParams(window.location.search);
    const formType = urlParams.get('form');
    
    if (formType === 'signup') {

        const signupLink = document.querySelector('.signup-inactive');
        if (signupLink) {
            signupLink.click();
        }
    }
});

$(document).ready(function() {
    try {
        // Code jQuery hiện tại
        console.log("jQuery loaded successfully");
    } catch (error) {
        console.error("jQuery error:", error);
    }
});

console.log("Document ready");
$(document).ready(function() {
    console.log("jQuery ready");
    
    // Log khi click vào các nút
    $(".links li").click(function() {
        console.log("Link clicked:", $(this).text());
    });
    
    // Log trạng thái form
    function logFormState() {
        console.log("Form signin visible:", $(".form-signin").is(":visible"));
        console.log("Form signup visible:", $(".form-signup").is(":visible"));
    }
    
    // Log mỗi 2 giây
    setInterval(logFormState, 2000);
});