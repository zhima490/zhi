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

module.exports = router;
