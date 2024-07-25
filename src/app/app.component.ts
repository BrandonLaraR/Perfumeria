import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
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
  static loginEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor(private authService: AuthService) {
    AppComponent.loginEvent.subscribe(() => this.updateUserProfile());
  }

  ngOnInit(): void {
    this.updateUserProfile();
  }

  updateUserProfile(): void {
    const userProfile = this.authService.getProfile();
    if (userProfile) {
      this.loggedIn = true;
      this.userName = userProfile.nombre;
      this.isAdmin = userProfile.isAdmin;
    }
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
