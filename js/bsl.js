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
    const errorMessage = document.getElementById('error-message');

    if (!username || !password) {
        errorMessage.textContent = '請填寫所有欄位';
        errorMessage.style.display = 'block';
        return;
    }

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) { 
            window.location.href = '/bs'; 
        } else {
            alert('帳號或密碼錯誤'); 
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('登入失敗，請稍後再試');
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
