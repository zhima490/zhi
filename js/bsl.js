function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        toggleIcon.className = 'fas fa-eye';
    }
}

function checkLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const errorMessage = document.getElementById('error-message');

    if (!username || !password) {
        errorMessage.textContent = '請填寫所有欄位';
        errorMessage.style.display = 'block';
        return;
    }

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, rememberMe }),
        credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/backstage-test'; // 修改重定向路徑
        } else {
            errorMessage.style.display = 'block';
            errorMessage.textContent = '登入失敗，請檢查您的用戶名和密碼。'; // 更具體的錯誤信息
            document.getElementById('password').value = '';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        errorMessage.textContent = '系統錯誤，請稍後再試';
        errorMessage.style.display = 'block';
    });
}

// Enter 鍵觸發登入
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkLogin();
    }
});

// 當頁面載入時，聚焦到用戶名輸入框
window.onload = function() {
    document.getElementById('username').focus();
};

// 清除錯誤訊息
function clearError() {
    const errorMessage = document.getElementById('error-message');
    errorMessage.style.display = 'none';
}

// 當輸入框獲得焦點時清除錯誤訊息
document.getElementById('username').addEventListener('focus', clearError);
document.getElementById('password').addEventListener('focus', clearError); 
