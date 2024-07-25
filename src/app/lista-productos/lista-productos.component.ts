import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.component.html',
  styleUrls: ['./lista-productos.component.css']
})
export class ListaProductosComponent {
  productos = [
    { id: 1, nombre: 'Producto 1', descripcion: 'Descripción del Producto 1', precio: '$10.00', imagen: 'assets/images/producto1.jpeg' },
    { id: 2, nombre: 'Producto 2', descripcion: 'Descripción del Producto 2', precio: '$15.00', imagen: 'assets/images/producto2.jpeg' },
    { id: 3, nombre: 'Producto 3', descripcion: 'Descripción del Producto 3', precio: '$20.00', imagen: 'assets/images/producto3.jpeg' }
  ];

  constructor(private router: Router) {}

  verDetalle(id: number) {
    this.router.navigate(['/productos', id]);
  }
}
