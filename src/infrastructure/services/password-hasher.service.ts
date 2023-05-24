import bcrypt from 'bcryptjs';
import { IPasswordHasher } from 'src/domain/ports/password-hasher.interface';

export class PasswordHasherService implements IPasswordHasher {
  async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    return isPasswordValid;
  }
}
