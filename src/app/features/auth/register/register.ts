import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  authService = inject(AuthService);
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor() {
    this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required])
    });
  }

  // Método para verificar si un campo tiene un error específico
  hasError(controlName: string, errorType: string): boolean {
    const control = this.registerForm.get(controlName);
    return control ? control.hasError(errorType) && (control.dirty || control.touched) : false;
  }

  // Método para verificar si un campo es inválido y ha sido tocado
  isFieldInvalid(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  async onRegister() {
    this.errorMessage = ''; // Limpiar errores previos

    if (this.registerForm.valid) {
      const { username, email, password, confirmPassword } = this.registerForm.value;
      const result = await this.authService.register(username, email, password, confirmPassword);

      if (result.success) {
        console.log('✅', result.message);
        this.registerForm.reset();
        // Aquí podrías redirigir al login
        // this.router.navigate(['/auth/login']);
      } else {
        this.errorMessage = result.message;
      }
    } else {
      this.errorMessage = 'Por favor completa todos los campos correctamente';
      this.registerForm.markAllAsTouched();
    }
  }
}