import { Component, OnInit } from '@angular/core';
import { materialImports } from '../../core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppState } from '../../store';
import { Store } from '@ngrx/store';
import { AuthActions } from '../store';
import { RegisterDto } from '../../models/auth';

@Component({
  selector: 'app-register',
  imports: [...materialImports, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password_hash: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone: ['', Validators.required],
    });
  }

  register() {
    if (this.form.valid) {
      this.store.dispatch(AuthActions.register( { register: this.form.value as RegisterDto }))
      this.goToLogin();
    }
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
