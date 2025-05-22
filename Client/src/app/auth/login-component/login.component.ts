import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { materialImports } from '../../core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { AuthActions } from '../store';
import { LoginDto } from '../../models/auth';
import { NotificationService } from '../../services';

@Component({
  selector: 'app-login',
  imports: [...materialImports, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  form!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private store: Store<AppState>, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    this.store.dispatch(AuthActions.login({ login: this.form.value as LoginDto }));
  }

  register() {
    this.router.navigate(['/register']);
  }

  forgotPassword() {
    alert('So you have problem!');
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
