import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metodos-pago',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metodos-pago.component.html',
  styleUrls: ['./metodos-pago.component.css']
})
export class MetodosPagoComponent implements OnInit {
  metodosPago: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerMetodosPago();
  }

  obtenerMetodosPago() {
    this.http.get<any>('https://api-perfum-kf75.vercel.app/api/metodos-pago')
      .subscribe(
        data => {
          console.log('Datos obtenidos:', data);
          this.metodosPago = data.Contenido.split('|');
        },
        error => {
          console.error('Error al obtener Métodos de Pago:', error);
        }
      );
  }
}
