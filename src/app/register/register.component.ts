import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  secretQuestions: string[] = [];
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      secretQuestion: ['', Validators.required],
      secretAnswer: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

    this.loadSecretQuestions();
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  loadSecretQuestions(): void {
    this.http.get<string[]>('https://apielixir.onrender.com/api/preguntasSecretas').subscribe({
      next: (questions) => {
        this.secretQuestions = questions;
      },
      error: (error) => {
        console.error('Error al cargar las preguntas secretas:', error);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  register(): void {
    if (this.registerForm.invalid) {
      alert('Debes completar todos los campos correctamente.');
      return;
    }

    const user = {
      nombre: this.registerForm.value.username,
      correo: this.registerForm.value.email,
      password: this.registerForm.value.password,
      preguntaSecreta: this.registerForm.value.secretQuestion,
      respuestaSecreta: this.registerForm.value.secretAnswer
    };

    this.http.post('https://apielixir.onrender.com/api/usuarios/register', user).subscribe({
      next: (response) => {
        alert('Usuario registrado exitosamente');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        if (error.status === 400) {
          alert('Correo o nombre de usuario ya registrado');
        } else {
          console.error('Error al registrar usuario:', error);
          alert('Hubo un error al registrar el usuario');
        }
      }
    });
  }
}
