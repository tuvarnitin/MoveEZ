import User from '../user/user.model.js';

export const register = async (name, email, password) => {
    const user = await User.create({
        name, email, password
    })
    const token = await user.generateToken()
    return { user, token };
}
