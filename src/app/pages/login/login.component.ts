import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { login } from '../../stores/auth/auth.actions';
import { selectAuthError, selectIsAuthenticated } from '../../stores/auth/auth.selectors';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage$!: Observable<string | null>;

  constructor(private store: Store, private router: Router) {
    // Automatically redirect on login success
    this.store.select(selectIsAuthenticated).pipe(
      tap((isLoggedIn) => {
        if (isLoggedIn) {
          this.router.navigate(['/admin/blogs']);
        }
      })
    ).subscribe();

    // Get login errors
    this.errorMessage$ = this.store.select(selectAuthError);
  }

  onLogin(): void {
    this.store.dispatch(login({ email: this.email, password: this.password }));
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
