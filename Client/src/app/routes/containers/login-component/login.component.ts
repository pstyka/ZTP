import { Component, OnInit } from '@angular/core';
import { materialImports } from '../../../core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
      username: [''],
      password: [''],
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
}
