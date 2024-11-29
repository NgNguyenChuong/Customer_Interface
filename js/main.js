function signIn(e) {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  
  if (email && password) {
    var user = {
      email: email,
      password: password,
    };
    var json = JSON.stringify(user);
    console.log(json);
    localStorage.setItem(email, json);
    localStorage.setItem("isLogin", true);
    console.log("User saved:", user);
    alert("Đăng nhập thành công!");
  } else {
    alert("Vui lòng nhập đầy đủ email và mật khẩu.");
  }
}

// Kiểm tra trạng thái đăng nhập khi tải trang
document.addEventListener("DOMContentLoaded", function () {
  var isLogin = JSON.parse(localStorage.getItem("isLogin")) || false;

  if (isLogin === true) {
    document.getElementById("logo").style.display = "none";
  } else {
    document.getElementById("logo").style.display = "block";
  }
});

// Hàm click vào giỏ hàng
function clickCart() {
  var isLogin = JSON.parse(localStorage.getItem("isLogin")) || false;

  if (isLogin) {
    window.location.href = "thanh-toan.html";
  } else {
    window.location.href = "user-login.html";
  }
}

// Hàm đăng xuất
function logOut() {
  localStorage.setItem("isLogin", false);
}
