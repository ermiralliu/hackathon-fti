import bcrypt from 'bcrypt';
import prisma from '../prisma';

const SALT_ROUNDS = 10;
const SESSION_EXPIRY_SECONDS = 30 * 24 * 60 * 60; // 30 days

export async function createUser(email: string, username: string, role: 'consumer' | 'farmer', password: string, name?: string) {
	const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
	try {
		const user = await prisma.user.create({
			data: {
				email,
        username,
        role,
				password: hashedPassword,
				name,
			},
		});
		return user;
	} catch (error: any) {
    if (error.code === 'P2002') {
      // Check which unique constraint was violated
      const existingUserByEmail = await prisma.user.findUnique({ where: { email } });
      if (existingUserByEmail) {
        return null; // Email already exists
      }
      const existingUserByUsername = await prisma.user.findUnique({ where: { username } });
      if (existingUserByUsername) {
        return undefined; // Username already exists (you can return a different value if needed)
      }
      // If P2002 but neither email nor username found (shouldn't happen in normal scenarios)
      console.error("Unexpected P2002 error:", error);
      throw error;
    }
    throw error;
  }
}

export async function findUserByEmail(email: string) {
	return await prisma.user.findUnique({ where: { email } });
}

export async function findUserByUsername(username: string) {
  return await prisma.user.findUnique({ where: {username}});
}

export async function verifyPassword(user: { password: string } | null, passwordAttempt: string) {
	if (!user) return false;
	return await bcrypt.compare(passwordAttempt, user.password);
}

export async function createSession(userId: number) {
	const expiresAt = new Date(Date.now() + SESSION_EXPIRY_SECONDS * 1000);
	const session = await prisma.session.create({
		data: {
			userId,
			expiresAt,
		},
	});
	return session.id; // Return the session ID to store in the cookie
}

export async function getUserBySessionId(sessionId: string) {
	const session = await prisma.session.findUnique({
		where: { id: sessionId },
		include: { user: true },
	});

	if (!session || session.expiresAt < new Date()) {
		// Session expired or not found, delete it
		if (session) {
			await prisma.session.delete({ where: { id: sessionId } });
		}
		return null;
	}

	return session.user;
}

export async function deleteSession(sessionId: string) {
	await prisma.session.delete({ where: { id: sessionId } });
}