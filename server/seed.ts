import * as bcryptjs from 'bcryptjs';
import * as dotenv from 'dotenv';
import mongoose, { connection } from 'mongoose';

import { UserSchema } from './src/user/schemas/user.schema';

dotenv.config({ path: '../.env' });

const User = mongoose.model('users', UserSchema);

async function seedUsers() {
  console.log('Start seed users');

  const numberOfUsers = await User.countDocuments();

  if (numberOfUsers > 100) {
    console.log(`Number of users ${numberOfUsers} - finish seed users`);
    return;
  }

  const data = [];

  for (let i = 0; i < 100; i++) {
    data.push({
      email: `mail-${i}@mail.com'`,
      name: `User-${i}`,
      password: bcryptjs.hashSync(
        `qwrety-${i}`,
        +process.env.PASSWORD_SALT || 2,
      ),
    });
  }

  await User.insertMany(data);

  console.log('Seed 100 users');
}

async function seed() {
  await mongoose.connect(process.env.DB_CONNECT);

  console.log('Connect to database');

  await seedUsers();

  await connection.close();

  console.log('Finish seed');
}

seed();
