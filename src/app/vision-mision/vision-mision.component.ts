import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vision-mision',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vision-mision.component.html',
  styleUrls: ['./vision-mision.component.css']
})
export class VisionMisionComponent implements OnInit {
  visionMision: string | undefined;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerVisionMision();
  }

  obtenerVisionMision() {
    this.http.get<any>('https://apielixir.onrender.com/api/vision-mision')
      .subscribe(
        data => {
          console.log('Datos obtenidos:', data);
          this.visionMision = data.Contenido;
        },
        error => {
          console.error('Error al obtener Visión y Misión:', error);
        }
      );
  }
}
