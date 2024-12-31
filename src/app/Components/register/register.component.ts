import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { UserModel } from '../../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  email: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  user: UserModel = new UserModel();
  confirmPassword: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onRegister(): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.user.password = this.password; // Ensure user.password is set correctly
    const user: UserModel = { username: this.user.username, password: this.user.password, email: this.user.email, role: 'user' };
    this.authService.register(user).subscribe({
      next: (data: any): void => {
        console.log('Response:', data);
        if (data.body.message === 'User registered successfully') {
          this.successMessage = 'User registered successfully';
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = data.body.message || 'Registration failed';
        }
      },
      error: (err: any): void => {
        console.error('Error:', err);
        this.errorMessage = err.error?.message || 'Registration failed';
      }
    });
  }
}