import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  showRecoveryMethodModal: boolean = false;
  showSecretQuestionModal: boolean = false;
  showEmailRecoveryModal: boolean = false;
  showEnterCodeModal: boolean = false;
  showChangePasswordModal: boolean = false;
  recoveryEmail: string = '';
  recoverySecretQuestion: string = '';
  recoverySecretAnswer: string = '';
  recoveryCode: string = '';
  secretQuestions: string[] = [];
  newPassword: string = '';
  confirmNewPassword: string = '';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadSecretQuestions();
  }

  onSubmit(): void {
    const loginData = { correo: this.email, password: this.password };

    this.http.post<any>('https://apielixir.onrender.com/api/usuarios/loginCorreo', loginData).subscribe({
      next: (response) => {
        if (response) {
          this.authService.setProfile(response);
          this.router.navigate(['/']);
          // Emitir evento para actualizar la vista principal
          AppComponent.loginEvent.emit();
        } else {
          alert('Credenciales incorrectas');
        }
      },
      error: (error) => {
        console.error('Error al iniciar sesión:', error);
        alert('Credenciales incorrectas');
      }
    });
  }

  openRecoveryMethodModal(): void {
    this.showRecoveryMethodModal = true;
  }

  selectRecoveryMethod(method: string): void {
    this.showRecoveryMethodModal = false;
    if (method === 'secret') {
      this.showSecretQuestionModal = true;
    } else if (method === 'email') {
      this.showEmailRecoveryModal = true;
    }
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

  recoverPassword(): void {
    const recoveryData = {
      correo: this.recoveryEmail,
      preguntaSecreta: this.recoverySecretQuestion,
      respuestaSecreta: this.recoverySecretAnswer
    };

    this.http.post('https://apielixir.onrender.com/api/usuarios/recuperarPassword', recoveryData).subscribe({
      next: (response) => {
        alert('Respuesta secreta correcta. Por favor, cambie su contraseña.');
        this.showSecretQuestionModal = false;
        this.showChangePasswordModal = true;
      },
      error: (error) => {
        console.error('Error al recuperar contraseña:', error);
        alert('Error al recuperar contraseña. Verifica tus datos.');
      }
    });
  }

  sendRecoveryCode(): void {
    this.http.post('https://apielixir.onrender.com/api/usuarios/enviarCodigoRecuperacion', { correo: this.recoveryEmail }).subscribe({
      next: (response) => {
        alert('Código de recuperación enviado a su correo electrónico.');
        this.showEmailRecoveryModal = false;
        this.showEnterCodeModal = true;
      },
      error: (error) => {
        console.error('Error al enviar el código de recuperación:', error);
        alert('Error al enviar el código de recuperación. Verifica tu correo electrónico.');
      }
    });
  }

  verifyRecoveryCode(): void {
    const codeData = { correo: this.recoveryEmail, codigo: this.recoveryCode };

    this.http.post('https://apielixir.onrender.com/api/usuarios/verificarCodigoRecuperacion', codeData).subscribe({
      next: (response) => {
        alert('Código verificado. Por favor, cambie su contraseña.');
        this.showEnterCodeModal = false;
        this.showChangePasswordModal = true;
      },
      error: (error) => {
        console.error('Error al verificar el código de recuperación:', error);
        alert('Error al verificar el código de recuperación. Verifica tu código.');
      }
    });
  }

  closeModals(): void {
    this.showRecoveryMethodModal = false;
    this.showSecretQuestionModal = false;
    this.showEmailRecoveryModal = false;
    this.showEnterCodeModal = false;
    this.showChangePasswordModal = false;
  }

  changePassword(): void {
    if (this.newPassword !== this.confirmNewPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const changePasswordData = {
      correo: this.recoveryEmail,
      nuevaPassword: this.newPassword
    };

    this.http.post('https://apielixir.onrender.com/api/usuarios/cambiarPassword', changePasswordData).subscribe({
      next: (response) => {
        alert('Contraseña cambiada exitosamente.');
        this.showChangePasswordModal = false;
      },
      error: (error) => {
        console.error('Error al cambiar la contraseña:', error);
        alert('Error al cambiar la contraseña.');
      }
    });
  }
}
