import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terminos-condiciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terminos-condiciones.component.html',
  styleUrls: ['./terminos-condiciones.component.css']
})
export class TerminosCondicionesComponent implements OnInit {
  terminosCondiciones: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerTerminosCondiciones();
  }

  obtenerTerminosCondiciones() {
    this.http.get<any>('https://api-perfum-kf75.vercel.app/api/terminos-condiciones')
      .subscribe(
        data => {
          console.log('Datos obtenidos:', data);
          this.terminosCondiciones = data;
        },
        error => {
          console.error('Error al obtener Términos y Condiciones:', error);
        }
      );
  }

  formatContenido(contenido: string): string {
    // Reemplazar cada número seguido de un punto y un guión con un párrafo nuevo
    return contenido.replace(/(\d+\.-)/g, '<br/><br/>$1');
  }
}
