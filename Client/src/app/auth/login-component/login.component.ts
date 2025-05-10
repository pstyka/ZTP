import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { materialImports } from '../../core';

@Component({
  selector: 'app-login',
  imports: [...materialImports, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  form!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    console.log(this.form.value);
  }

  register() {
    this.router.navigate(['/register']);
  }

  forgotPassword() {
    alert('Link do resetu hasła został wysłany!');
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
