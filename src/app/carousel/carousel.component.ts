import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
  standalone: true,
  imports: [CommonModule]  // Añade esta línea
})
export class CarouselComponent {
  slides = [
   
  ];
  currentIndex = 0;

  showSlide(index: number): void {
    if (index >= this.slides.length) {
      this.currentIndex = 0;
    } else if (index < 0) {
      this.currentIndex = this.slides.length - 1;
    } else {
      this.currentIndex = index;
    }
  }

  prevSlide(): void {
    this.showSlide(this.currentIndex - 1);
  }

  nextSlide(): void {
    this.showSlide(this.currentIndex + 1);
  }
}
