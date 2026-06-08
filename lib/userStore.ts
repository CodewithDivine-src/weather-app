import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const usersFilePath = path.join(process.cwd(), 'users.json');

// Ensure file exists
if (!fs.existsSync(usersFilePath)) {
  fs.writeFileSync(usersFilePath, JSON.stringify([]));
}

export async function getUsers() {
  const data = fs.readFileSync(usersFilePath, 'utf-8');
  let users = JSON.parse(data);

  let changed = false;
  users = users.map((u: any) => {
    if (!u.name) {
      u.name = u.email.split('@')[0];
      changed = true;
    }
    return u;
  });
  if (changed) await saveUsers(users);
  return users;
}

export async function saveUsers(users: any[]) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

export async function findUserByEmail(email: string) {
  const users = await getUsers();
  return users.find((u: any) => u.email === email);
}

export async function createUser(name: string, email: string, password: string) {
  const users = await getUsers();
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now().toString(), name, email, password: hashedPassword };
  users.push(newUser);
  await saveUsers(users);
  return newUser;
}

export async function validateUser(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const isValid = await bcrypt.compare(password, user.password);
  return isValid ? user : null;
}