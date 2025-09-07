//load users db/MODEL


async function login(username, password) {
    const user = await User.findOne({ where: { username, password } });
    if (user) {
        return user;
    }
    throw new Error('Invalid username or password');
}

module.exports = User;
