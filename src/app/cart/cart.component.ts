import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { loadScript, PayPalScriptOptions } from '@paypal/paypal-js';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: any[] = [];
  total: number = 0;
  isModalOpen: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCart();
    this.initializePaypalButton();
  }

  loadCart(): void {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        this.cart = JSON.parse(storedCart);
        this.calculateTotal();
      } catch (error) {
        console.error('Error parsing cart data from localStorage', error);
        this.cart = [];
      }
    } else {
      this.cart = [];
    }
  }

  calculateTotal(): void {
    this.total = this.cart.reduce((acc, item) => {
      const price = parseFloat(item.Precio.replace('$', '').trim());
      return acc + (price * item.quantity);
    }, 0);
  }

  clearCart(): void {
    localStorage.removeItem('cart');
    this.cart = [];
    this.total = 0;
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  async initializePaypalButton(): Promise<void> {
    try {
      const paypalLoadResult = await loadScript({
        clientId: 'AducIMkN-H5XGrOI2q-gLL75tybs2ArsJ7B6DiexyPWn2U-MC_qrBosdeLSdJEp8gtJRnYYbukJ3w599'
      } as PayPalScriptOptions);

      if (paypalLoadResult && paypalLoadResult.Buttons) {
        paypalLoadResult.Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              intent: 'CAPTURE',
              purchase_units: [{
                amount: {
                  currency_code: 'USD',
                  value: (this.total / 20).toFixed(2) // Assuming 1 USD = 20 MXN
                }
              }]
            });
          },
          onApprove: async (data: any, actions: any) => {
            if (!actions.order) {
              console.error('Order action is undefined');
              return;
            }
            const details = await actions.order.capture();
            if (details.payer && details.payer.name) {
              alert('Transaction completed by ' + details.payer.name.given_name);
            } else {
              console.warn('Payer details are missing');
            }
            await this.saveOrder();
            this.clearCart();
          },
          onError: (err: any) => {
            console.error('Error during the transaction', err);
          }
        }).render('#paypal-button-container');
      } else {
        console.error('PayPal SDK failed to load.');
      }
    } catch (error) {
      console.error('Error initializing PayPal button', error);
    }
  }

  async saveOrder(): Promise<void> {
    const user = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const orderData = {
      correo: user.correo,
      cart: this.cart.map(item => ({
        productId: item._id,
        Nombre: item.Nombre,
        imagen: item.imagen,
        quantity: item.quantity,
        Precio: item.Precio
      })),
      total: this.total,
      direccion: {
        calle: user.calle,
        numero: user.numero,
        colonia: user.colonia,
        estado: user.estado,
        phone: user.phone
      }
    };

    try {
      const response = await this.http.post('https://apielixir.onrender.com/api/pedidos', orderData).toPromise();
      console.log('Pedido guardado exitosamente:', response);
    } catch (error) {
      console.error('Error al guardar el pedido:', error);
    }
  }
}
