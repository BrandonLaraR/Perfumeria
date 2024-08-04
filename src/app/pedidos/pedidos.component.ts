import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PedidosComponent implements OnInit {
  public pedidos: any[] = [];
  public selectedPedido: any = null;
  public trackingNumber: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadPedidos();
  }

  loadPedidos(): void {
    this.http.get<any[]>('https://api-perfum-kf75.vercel.app/api/pedidos')
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

  openModal(pedido: any): void {
    this.selectedPedido = pedido;
  }

  closeModal(): void {
    this.selectedPedido = null;
    this.trackingNumber = '';
  }

  confirmarPedido(): void {
    if (this.trackingNumber.trim() === '') {
      alert('Por favor, ingrese un número de guía.');
      return;
    }

    const emailData = {
      to: this.selectedPedido.correo,
      subject: 'Número de Guía de tu Pedido',
      text: `Hola somos la página de Elixir Perfum, hacemos este aviso para proporcionarte el número de guía sobre los productos que compraste. Número de guía: ${this.trackingNumber}`
    };

    this.http.post('https://api-perfum-kf75.vercel.app/api/send-email', emailData)
      .subscribe(
        response => {
          alert('Correo enviado exitosamente.');
          this.selectedPedido.completado = true;
          this.updatePedidoCompletado(this.selectedPedido._id);
          this.closeModal();
        },
        error => {
          console.error('Error al enviar el correo:', error);
          alert('Hubo un error al enviar el correo.');
        }
      );
  }

  updatePedidoCompletado(pedidoId: string): void {
    this.http.put(`https://api-perfum-kf75.vercel.app/api/pedidos/completar/${pedidoId}`, {})
      .subscribe(
        response => {
          console.log('Pedido completado actualizado en la base de datos.');
        },
        error => {
          console.error('Error al actualizar el pedido como completado:', error);
        }
      );
  }
}
