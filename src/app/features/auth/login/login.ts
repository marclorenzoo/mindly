import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authService = inject(AuthService);
  loginForm: FormGroup;
  errorMessage: string = '';
  private router = inject(Router);


  constructor() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  async onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const result = await this.authService.login(email, password);
      if (result.success) {
        console.log('✅', result.message);
        this.loginForm.reset();
        this.router.navigate(['/home/dashboard']);
      } else {
        this.errorMessage = result.message;
      }
    } else {
      this.errorMessage = 'Por favor completa todos los campos correctamente';
      this.loginForm.markAllAsTouched();
    }
  }
}
