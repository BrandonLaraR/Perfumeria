import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private profile: any = null;

  constructor() {
    this.loadProfile();
  }

  isLoggedIn(): boolean {
    return this.profile !== null;
  }

  getProfile(): any {
    return this.profile;
  }

  setProfile(profile: any): void {
    this.profile = profile;
    localStorage.setItem('userProfile', JSON.stringify(this.profile));
  }

  updateProfile(updatedProfile: any): void {
    this.profile = { ...this.profile, ...updatedProfile };
    localStorage.setItem('userProfile', JSON.stringify(this.profile));
  }

  logout(): void {
    localStorage.removeItem('userProfile');
    this.profile = null;
  }

  isAdmin(): boolean {
    return this.profile && this.profile.isAdmin;
  }

  private loadProfile(): void {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      this.profile = JSON.parse(storedProfile);
    }
  }
}
