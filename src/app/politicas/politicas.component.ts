import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-politicas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './politicas.component.html',
  styleUrls: ['./politicas.component.css']
})
export class PoliticasComponent implements OnInit {
  politicas: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerPoliticas();
  }

  obtenerPoliticas() {
    this.http.get<any>('https://apielixir.onrender.com/api/politicas')
      .subscribe(
        data => {
          console.log('Datos obtenidos:', data);
          this.politicas = data;
        },
        error => {
          console.error('Error al obtener Políticas:', error);
        }
      );
  }

  formatContenido(contenido: string): string {
    // Reemplazar cada sección con un párrafo nuevo
    return contenido.replace(/(\d+\.-)/g, '<br/><br/>$1');
  }
}
