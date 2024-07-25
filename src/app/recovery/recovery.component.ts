import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recovery',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css']
})
export class RecoveryComponent implements OnInit {
  recoveryForm!: FormGroup;
  preguntaSecreta: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.recoveryForm = this.fb.group({
      username: ['', Validators.required],
      respuestaSecreta: ['', Validators.required]
    });
  }

  getPreguntaSecreta(username: string): void {
    if (username) {
      this.http.get<any>(`http://localhost:3000/api/usuarios/preguntaSecreta/${username}`).subscribe({
        next: (response) => {
          this.preguntaSecreta = response.pregunta;
        },
        error: (error) => {
          console.error('Error al obtener pregunta secreta:', error);
          alert('No se pudo obtener la pregunta secreta');
        }
      });
    }
  }

  recoverPassword(): void {
    if (this.recoveryForm.invalid) {
      alert('Debes completar todos los campos correctamente.');
      return;
    }

    const recoveryData = {
      username: this.recoveryForm.value.username,
      respuestaSecreta: this.recoveryForm.value.respuestaSecreta
    };

    this.http.post<any>('http://localhost:3000/api/usuarios/recover', recoveryData).subscribe({
      next: (response) => {
        alert(`Tu nueva contraseña es: ${response.newPassword}`);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error al recuperar contraseña:', error);
        alert('Respuesta secreta incorrecta o usuario no encontrado');
      }
    });
  }
}
