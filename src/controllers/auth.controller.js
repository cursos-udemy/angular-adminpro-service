const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const config = require('../config/config');
//const handleError = require('../utils/error-util');
const userRepository = require('../repositories/user.repository');

const client = new OAuth2Client(config.GOOGLE_CLIENT_ID);

const login = async (req, res) => {
    const { email, password } = req.body;
    userRepository.authenticate(email, password)
        .then(user => res.json(generateAuthenticateResponse(user)))
        .catch(err => res.status(403).json({ message: 'invalid credentials' }));
};

const loginGoogle = async (req, res) => {
    const { token } = req.body;
    verify(token)
        .then(googleUser => userRepository.checkGoogleAccount(googleUser))
        .then(user => res.json(generateAuthenticateResponse(user)))
        .catch(err => res.status(403).json({ message: 'invalid token', err }));
};

const logout = async (req, res) => {
    res.json('ok');
};

const refreshToken = async (req, res) => {
    const { user } = req;
    //res.json(generateAuthenticateResponse(user));
    res.json('ok');
}

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: config.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
}

function generateToken(user) {
    const payload = { id: user._id, email: user.email, name: user.name, roles: [user.role] };
    return jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRE_IN });
}

function generateAuthenticateResponse(userAuthenticated) {
    return { accessToken: generateToken(userAuthenticated), user: userAuthenticated, menu: getMenuByRole(userAuthenticated.role) };
}

function getMenuByRole(role) {
    let menu = [
        {
            title: 'Principal',
            icon: 'mdi mdi-gauge',
            subMenu: [
                { title: 'Dashboard', url: '/dashboard' },
                { title: 'Progress', url: '/progress' },
                { title: 'Chart', url: '/chart' },
                { title: 'Promises', url: '/promises' },
                { title: 'Rxjs', url: '/rxjs' },
            ]
        },
        {
            title: 'Administration',
            icon: 'mdi mdi-folder-lock-open',
            subMenu: [
                //{title: 'Users', url: '/users'},
                { title: 'Hospitals', url: '/hospitals' },
                { title: 'Doctors', url: '/doctors' },
            ]
        }
    ];

    if (role === 'ROLE_ADMIN') {
        menu[1].subMenu.unshift({ title: 'Users', url: '/users' });
    }

    return menu;
}


module.exports = {
    login,
    loginGoogle,
    logout,
    refreshToken
}