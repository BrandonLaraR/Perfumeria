import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {
  contacto: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerContacto();
  }

  obtenerContacto() {
    this.http.get<any>('https://api-perfum-kf75.vercel.app/api/contacto')
      .subscribe(
        data => {
          console.log('Datos obtenidos:', data);
          this.contacto = data;
        },
        error => {
          console.error('Error al obtener Contacto:', error);
        }
      );
  }
}
