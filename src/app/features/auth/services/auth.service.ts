import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() { }

  private getAllUsers(): User[] {
    return JSON.parse(localStorage.getItem('users') || '[]');
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
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
  }

  async register(username: string, email: string, password: string, confirmPassword: string) {
    if (this.emailExists(email)) {
      return {
        success: false,
        message: `El correo ${email} ya esta en uso`
      }
    }

    if (password !== confirmPassword) {
      return {
        success: false,
        message: 'Las contraseñas no coinciden'
      }
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
      message: `Usuario ${user.username} registrado correctamente`
    };
  }
}
