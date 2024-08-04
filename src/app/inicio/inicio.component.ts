import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class InicioComponent implements OnInit, OnDestroy {
  public images: string[] = [];
  public currentIndex: number = 0;
  private autoSlideInterval: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadImages();
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  loadImages(): void {
    this.http.get<any[]>('https://api-perfum-kf75.vercel.app/api/adminConfig')
      .subscribe(
        (data: any) => {
          console.log('Datos recibidos:', data);
          const imageConfig = data.find((item: any) => item.Titulo === 'Imágenes');
          console.log('Configuración de imágenes:', imageConfig);
          if (imageConfig && Array.isArray(imageConfig.Contenido)) {
            this.images = imageConfig.Contenido;
          } else {
            console.error('No se encontró la configuración de imágenes o el contenido no es un arreglo.');
          }
        },
        error => {
          console.error('Error al cargar las imágenes:', error);
        }
      );
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex > 0) ? this.currentIndex - 1 : this.images.length - 1;
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex < this.images.length - 1) ? this.currentIndex + 1 : 0;
  }

  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 3000); // Cambia cada 3 segundos
  }

  stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }
}
