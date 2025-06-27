import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule], // ✅ Make sure ReactiveFormsModule is here
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'], // ✅ make sure this is correct
})
export class RegisterComponent {
  registerForm: FormGroup;
  serverMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient,private userService: UserService,private router: Router ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      gender: [''],
      bio: [''],
      profileImg: ['']
    });
    
  }



  goToLogin(): void {
  this.router.navigate(['/login']);
}

onSubmit(): void {
  if (this.registerForm.invalid) return;

  this.userService.register(this.registerForm.value).subscribe({
    next: user => {
      this.serverMessage = 'Registration successful!';
      this.registerForm.reset();
    },
    error: err => {
      this.serverMessage = 'Error: ' + (err?.error?.message || 'Registration failed.');
    }
  });

}


}
