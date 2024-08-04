// app.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'perfumeria';
  loggedIn = false;
  userName: string = '';
  isAdmin = false;
  logoUrl: string | null = null;
  static loginEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor(private authService: AuthService, private http: HttpClient) {
    AppComponent.loginEvent.subscribe(() => this.updateUserProfile());
  }

  ngOnInit(): void {
    this.updateUserProfile();
    this.loadLogo();
  }

  updateUserProfile(): void {
    const userProfile = this.authService.getProfile();
    if (userProfile) {
      this.loggedIn = true;
      this.userName = userProfile.nombre;
      this.isAdmin = userProfile.isAdmin;
    }
  }

  loadLogo(): void {
    this.http.get<{ Contenido: string }>('https://api-perfum-kf75.vercel.app/api/adminConfig/logo')
      .subscribe(
        (data: any) => {
          this.logoUrl = data.Contenido;
        },
        error => {
          console.error('Error al cargar el logo:', error);
        }
      );
  }

  logout(): void {
    this.authService.logout();
    this.loggedIn = false;
    this.userName = '';
    this.isAdmin = false;
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }
}
