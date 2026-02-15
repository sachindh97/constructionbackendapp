const db = require('../common/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secretkey';

async function registerUser(data) {
  const { shop_name,email, mobile, password } = data;

  const existingUser = await db('users')
    .where({ mobile })
    .first();

  if (existingUser) {
    throw new Error('Mobile already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [id] = await db('users').insert({
    shop_name,
    email,
    mobile,
    password: hashedPassword
  });

  return { message: 'Registered Successfully', userId: id };
}

async function loginUser(data) {
  const { mobile, password } = data;

  const user = await db('users')
    .where({ mobile })
    .first();

  if (!user) {
    throw new Error('User not found');
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign(
    { id: user.id },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  return { token };
}

module.exports = {
  registerUser,
  loginUser
};
