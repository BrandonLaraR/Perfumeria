import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  producto: any;

  productos = [
    { id: 0, nombre: 'Elixir Alma Indomable (Inspirado en Tom Ford-Oud Wood Eau de P.)', precio: '$10.00', descripcion: 'Descripción del producto 1', stock: 20 },
    { id: 1, nombre: 'Elixir Atractivo Infinito (Inspirado en Dior-Fahrenheit)', precio: '$10.00', descripcion: 'Descripción del producto 2', stock: 15 },
    { id: 2, nombre: 'Elixir Aura de Grandeza (Inspirado en Xerjoff-Erba Pura)', precio: '$10.00', descripcion: 'Descripción del producto 3', stock: 10 },
    { id: 3, nombre: 'Elixir Bestia Oculta (Inspirado en Louis Vuitton-Ombre Nomade)', precio: '$10.00', descripcion: 'Descripción del producto 4', stock: 5 },
    { id: 4, nombre: 'Elixir Conquistador Imperial (Inspirado en Creed-Millesime Imperial)', precio: '$10.00', descripcion: 'Descripción del producto 5', stock: 8 },
    { id: 5, nombre: 'Elixir de Poder (Inspirado en Creed-Aventus)', precio: '$10.00', descripcion: 'Descripción del producto 6', stock: 12 },
    { id: 6, nombre: 'Elixir de Sabiduria y Poder (inspirado en Parfums de Marly Pegasus)', precio: '$10.00', descripcion: 'Descripción del producto 7', stock: 6 },
    { id: 7, nombre: 'Elixir Divina Atraccion (Inspirado en Armani-Acqua Di Gió)', precio: '$10.00', descripcion: 'Descripción del producto 8', stock: 14 },
    { id: 8, nombre: 'Elixir Dominio Supremo (Inspirado en Gucci Guilty Black)', precio: '$10.00', descripcion: 'Descripción del producto 9', stock: 9 }
  ];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.producto = this.productos.find(p => p.id === id);
  }
}
