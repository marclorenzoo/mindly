import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  private getAllUsers(): User[] {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }

  private getUserByEmail(email: string): User | undefined {
    return this.getAllUsers().find((user) => user.email === email);
  }

  private saveUser(user: User): void {
    localStorage.setItem(
      'users',
      JSON.stringify([...this.getAllUsers(), user])
    );
  }

  private generateId(): number {
    const users = this.getAllUsers();
    if (users.length === 0) return 1;

    const maxId = Math.max(...users.map((user) => user.id));
    return maxId + 1;
  }

  private emailExists(email: string): boolean {
    return this.getAllUsers().some((user) => user.email === email);
  }

  private async hashPassword(password: string): Promise<string> {
    // 1. Convertir el string a bytes
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    // 2. Generar el hash SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // 3. Convertir el buffer a un array de bytes
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // 4. Convertir cada byte a hexadecimal y concatenar
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    return hashHex;
  }

  private generateToken(): string {
    return crypto.randomUUID();
  }

  private setSession(user: User, token: string): void {
    localStorage.setItem(
      'currentUser',
      JSON.stringify({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
        },
        token: token,
        loggedAt: new Date().toISOString(),
      })
    );
  }

  getSession(): {
    user: Omit<User, 'password'>;
    token: string;
    loggedAt: string;
  } | null {
    const sessionData = localStorage.getItem('currentUser');

    if (!sessionData) {
      return null;
    }

    return JSON.parse(sessionData);
  }

  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  async register(
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) {
    if (this.emailExists(email)) {
      return {
        success: false,
        message: `El correo ${email} ya esta en uso`,
      };
    }

    if (password !== confirmPassword) {
      return {
        success: false,
        message: 'Las contraseñas no coinciden',
      };
    }

    const hashedPassword = await this.hashPassword(password);

    const user: User = {
      id: this.generateId(),
      username: username,
      email: email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    this.saveUser(user);

    return {
      success: true,
      message: `Usuario ${user.username} registrado correctamente`,
    };
  }

  async login(email: string, password: string): Promise<{
    success: boolean;
    message: string;
    token?: string;
    user?: Omit<User, 'password'>;
  }> {
    // 1. Validar que no estén vacíos
    if (!email || !password) {
      return {
        success: false,
        message: 'Email y contraseña son obligatorios',
      };
    }

    // 2. Normalizar el email
    const normalizedEmail = email.trim().toLowerCase();

    // 3. Buscar usuario por email
    const user = this.getUserByEmail(normalizedEmail);

    // 4. Si no existe el usuario
    if (!user) {
      return {
        success: false,
        message: 'Usuario no encontrado',
      };
    }

    // 5. Hashear la contraseña ingresada
    const hashedPassword = await this.hashPassword(password);

    // 6. Comparar con la contraseña guardada
    if (user.password !== hashedPassword) {
      return {
        success: false,
        message: 'Contraseña incorrecta',
      };
    }

    // 7. ✅ Login exitoso: generar token y guardar sesión
    const token = this.generateToken();
    this.setSession(user, token);

    // 8. Devolver respuesta exitosa (sin password)
    return {
      success: true,
      message: 'Login exitoso',
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }
}
