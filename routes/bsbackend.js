const express = require('express');
const router = express.Router();

const authenticate = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/bslt');
    }
    req.session.userType = req.session.userType || '管理者';
    next();
};

router.get('/bst', authenticate, (req, res) => {
    res.render('bst', { 
        userType: req.session.userType 
    });
});

router.get('/dashboard', authenticate, (req, res) => {
    res.render('dashboard', { 
        userType: req.session.userType 
    });
});

document.querySelector('.logout-button').addEventListener('click', function() {
    fetch('/logout', {
        method: 'POST',
        credentials: 'include'
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/login';
        } else {
            alert('登出失敗');
        }
    })
    .catch(error => {
        console.error('登出錯誤:', error);
        alert('登出時發生錯誤');
    });
});

module.exports = router;
