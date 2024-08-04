import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Review {
  nombre: string;
  rating: string; // Change to string to accommodate the new ratings
  descripcion: string;
  imageUrl?: string; // Add imageUrl field
  createdAt: Date;
}

interface Producto {
  _id: string;
  Nombre: string;
  Descripcion: string;
  Precio: number;
  imagen: string;
  reviews?: Review[];
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('productoItems', { static: true }) productoItems!: ElementRef<HTMLDivElement>;
  productos: Producto[] = [];
  filteredProductos: Producto[] = [];
  selectedProducto: Producto | null = null;
  quantity: number = 1;
  searchTerm: string = '';
  showSuccessModal: boolean = false;
  showReviewModal: boolean = false;
  reviewName: string = '';
  reviewRating: string = 'Bueno'; // Default rating
  reviewDescription: string = '';
  reviewImageFile: File | null = null; // Add reviewImageFile field
  private observer!: IntersectionObserver;
  private initialized: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<Producto[]>('https://api-perfum-kf75.vercel.app/api/productos')
      .subscribe(data => {
        console.log('Productos recibidos:', data);
        this.productos = data.map(producto => ({
          ...producto,
          reviews: producto.reviews || [] // Inicializa el array reviews si es undefined
        }));
        this.filteredProductos = this.productos; // Inicializar los productos filtrados con todos los productos
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
    this.http.get<Producto>(`https://api-perfum-kf75.vercel.app/api/productos/${productId}`).subscribe(
      (producto) => {
        this.selectedProducto = {
          ...producto,
          reviews: producto.reviews || [] // Inicializa el array reviews si es undefined
        };
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

  openReviewModal(): void {
    this.showReviewModal = true;
  }

  closeReviewModal(): void {
    this.showReviewModal = false;
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
    if (!this.selectedProducto) {
      return;
    }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const productIndex = cart.findIndex((item: any) => item._id === this.selectedProducto!._id);

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

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.reviewImageFile = input.files[0];
    }
  }

  submitReview(): void {
    if (!this.selectedProducto) {
      return;
    }

    const newReview: Review = {
      nombre: this.reviewName,
      rating: this.reviewRating,
      descripcion: this.reviewDescription,
      createdAt: new Date()
    };

    if (this.reviewImageFile) {
      const formData = new FormData();
      formData.append('file', this.reviewImageFile);
      this.http.post<{ url: string }>('https://api-perfum-kf75.vercel.app/api/upload', formData).subscribe(
        (response) => {
          newReview.imageUrl = response.url;
          this.saveReview(newReview);
        },
        (error) => {
          console.error('Error uploading image:', error);
        }
      );
    } else {
      this.saveReview(newReview);
    }
  }

  saveReview(review: Review): void {
    this.http.post<Review>(`https://api-perfum-kf75.vercel.app/api/productos/${this.selectedProducto!._id}/reviews`, review).subscribe(
      (savedReview) => {
        this.selectedProducto!.reviews!.push(savedReview);
        this.closeReviewModal();
        this.resetReviewForm(); // Reiniciar los valores del formulario
      },
      (error) => {
        console.error('Error submitting review:', error);
      }
    );
  }

  resetReviewForm(): void {
    this.reviewName = '';
    this.reviewRating = '';
    this.reviewDescription = '';
    this.reviewImageFile = null;
  }
}
