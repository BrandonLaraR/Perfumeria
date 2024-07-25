import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('productoItems', { static: true }) productoItems!: ElementRef<HTMLDivElement>;
  productos: any[] = [];
  filteredProductos: any[] = [];
  selectedProducto: any = null;
  quantity: number = 1;
  searchTerm: string = '';
  showSuccessModal: boolean = false;
  private observer!: IntersectionObserver;
  private initialized: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any[]>('https://apielixir.onrender.com/api/productos')
      .subscribe(data => {
        console.log('Productos recibidos:', data);
        this.productos = data;
        this.filteredProductos = data; // Inicializar los productos filtrados con todos los productos
      }, error => {
        console.error('Error fetching productos:', error);
      });
  }

  ngAfterViewInit(): void {
    this.initializeObserver();
  }

  ngAfterViewChecked(): void {
    if (!this.initialized && this.productos.length > 0) {
      this.observeElements();
      this.initialized = true;
    }
  }

  private initializeObserver(): void {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
  }

  private observeElements(): void {
    const productoElements = this.productoItems.nativeElement.querySelectorAll('.producto');
    productoElements.forEach((element: Element) => {
      this.observer.observe(element);
    });
  }

  filterProducts(): void {
    const searchTermLowerCase = this.searchTerm.toLowerCase();
    if (searchTermLowerCase.trim() === '') {
      this.filteredProductos = [...this.productos]; // Restablecer a todos los productos cuando el término de búsqueda esté vacío
    } else {
      this.filteredProductos = this.productos.filter(producto => {
        const nombre = producto.Nombre?.toLowerCase() || '';
        const descripcion = producto.Descripcion?.toLowerCase() || '';
        return nombre.includes(searchTermLowerCase) || descripcion.includes(searchTermLowerCase);
      });
    }
    this.observeElements(); // Asegúrate de que se observen los elementos actualizados
  }

  openModal(productId: string): void {
    this.http.get(`https://apielixir.onrender.com/api/productos/${productId}`).subscribe(
      (producto) => {
        this.selectedProducto = producto;
        this.quantity = 1;  // Restablecer cantidad al abrir un nuevo producto
      },
      (error) => {
        console.error('Error fetching product details:', error);
      }
    );
  }

  closeModal(): void {
    this.selectedProducto = null;
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const productIndex = cart.findIndex((item: any) => item._id === this.selectedProducto._id);

    if (productIndex > -1) {
      cart[productIndex].quantity += this.quantity;
    } else {
      cart.push({ ...this.selectedProducto, quantity: this.quantity });
    }

    console.log('Cart after adding product:', cart);

    localStorage.setItem('cart', JSON.stringify(cart));
    this.showSuccessModal = true;
    this.closeModal();
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }
}
