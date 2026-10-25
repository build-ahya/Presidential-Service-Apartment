/**
 * Create a staff account, or reset an existing one's password / role.
 *
 *   npm run create-admin -- you@example.com 'a-strong-password' [admin|manager] [--delete]
 */
import bcrypt from 'bcryptjs';
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const [email, password, role = 'admin'] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const remove = process.argv.includes('--delete');
if (!email || (!remove && (!password || password.length < 8))) {
  console.error("Usage: npm run create-admin -- <email> '<password, 8+ chars>' [admin|manager]   (or: <email> --delete)");
  process.exit(1);
}
if (!['admin', 'manager'].includes(role)) throw new Error('role must be admin or manager');

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});
const root = (process.env.ROOT_DATABASE_COLLECTION || 'websites/presidentialserviceapartments.ng').split('#')[0].trim();
const ref = getFirestore().doc(root).collection('users').doc(email.toLowerCase());

(async () => {
  if (remove) {
    await ref.delete();
    return console.log(`Deleted ${email}`);
  }
  const now = new Date().toISOString();
  const existing = await ref.get();
  const hash = await bcrypt.hash(password, 10);
  if (existing.exists) {
    await ref.update({ password: hash, role, active: true, updatedAt: now });
    console.log(`Updated ${email}: role=${role}, password reset`);
  } else {
    await ref.set({
      uid: email.toLowerCase(), email: email.toLowerCase(), name: email.split('@')[0], firstName: email.split('@')[0], lastName: '',
      role, provider: 'password', active: true, password: hash, createdAt: now, updatedAt: now,
    });
    console.log(`Created ${email} as ${role}`);
  }
})();
