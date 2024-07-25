import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PedidosComponent implements OnInit {
  public pedidos: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadPedidos();
  }

  loadPedidos(): void {
    this.http.get<any[]>('https://apielixir.onrender.com/api/pedidos')
      .subscribe(
        data => {
          console.log('Pedidos cargados:', data); // Verifica los datos recibidos
          if (data && data.length > 0) {
            this.pedidos = data;
          } else {
            console.warn('No se encontraron pedidos');
          }
        },
        error => {
          console.error('Error al cargar pedidos:', error);
        }
      );
  }
}
