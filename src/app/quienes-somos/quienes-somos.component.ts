import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quienes-somos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quienes-somos.component.html',
  styleUrls: ['./quienes-somos.component.css']
})
export class QuienesSomosComponent implements OnInit {
  quienesSomos: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerQuienesSomos();
  }

  obtenerQuienesSomos() {
    this.http.get<any>('https://apielixir.onrender.com/api/quienes-somos')
      .subscribe(
        data => {
          console.log('Datos obtenidos:', data);
          this.quienesSomos = data;
        },
        error => {
          console.error('Error al obtener Quienes Somos:', error);
        }
      );
  }

  formatContenido(contenido: string): string {
    // Reemplazar cada sección con un párrafo nuevo
    return contenido.replace(/(\d+\.-)/g, '<br/><br/>$1');
  }
}
