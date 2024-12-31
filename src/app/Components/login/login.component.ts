import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { UserModel } from '../../../models/user.model';
import { AuthResponse } from '../../models/auth-response.models'; // Corrected import path

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onLogin(): void {
    const user: UserModel = { username: this.username, password: this.password, email: '', role: '' };
    this.authService.login(user).subscribe({
      next: (response: HttpResponse<AuthResponse>): void => {
        console.log('Response:', response);
        if (response.body?.token) {
          this.authService.saveToken(response.body.token);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Login failed';
        }
      },
      error: (err: any): void => {
        console.error('Error:', err);
        this.errorMessage = err.error?.message || 'Login failed';
      }
    });
  }
}