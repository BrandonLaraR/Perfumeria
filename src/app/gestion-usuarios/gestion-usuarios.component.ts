import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class GestionUsuariosComponent implements OnInit {
  public users: any[] = [];
  public productos: any[] = [];
  public filteredProducts: any[] = [];
  public selectedProduct: any = null;
  public isEditingProduct = false;
  public currentProduct: any = {};
  public productSearchText: string = '';
  public alertMessage: string = '';
  public modalMessage: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadProductos();
  }

  loadUsers(): void {
    this.http.get<any[]>('https://api-perfum-kf75.vercel.app/api/usuarios')
      .subscribe(
        data => {
          this.users = data;
        },
        error => {
          console.error('Error al cargar usuarios:', error);
        }
      );
  }

  loadProductos(): void {
    this.http.get<any[]>('https://api-perfum-kf75.vercel.app/api/productos')
      .subscribe(
        data => {
          this.productos = data;
          this.filteredProducts = data;
        },
        error => {
          console.error('Error al cargar productos:', error);
        }
      );
  }

  filterProducts(): void {
    const searchText = this.productSearchText.toLowerCase();
    this.filteredProducts = this.productos.filter(product =>
      product.Nombre.toLowerCase().includes(searchText)
    );
  }

  selectProduct(product: any): void {
    this.selectedProduct = product;
    this.isEditingProduct = false;
  }

  cancelSelect(): void {
    this.selectedProduct = null;
  }

  deleteUser(user: any): void {
    if (confirm(`¿Estás seguro de que quieres eliminar al usuario ${user.nombre}?`)) {
      this.http.delete(`https://api-perfum-kf75.vercel.app/api/usuarios/${user._id}`)
        .subscribe(
          () => {
            this.users = this.users.filter(u => u._id !== user._id);
            this.showModalMessage('Usuario eliminado exitosamente');
          },
          error => {
            console.error('Error al eliminar usuario:', error);
          }
        );
    }
  }

  toggleAdmin(user: any): void {
    const url = `https://api-perfum-kf75.vercel.app/api/usuarios/${user._id}/${user.isAdmin ? 'removeAdmin' : 'makeAdmin'}`;
    this.http.put(url, { isAdmin: !user.isAdmin })
      .subscribe(
        () => {
          user.isAdmin = !user.isAdmin;
          this.showModalMessage('Permisos de administrador actualizados exitosamente');
        },
        error => {
          console.error('Error al actualizar permisos de administrador:', error);
        }
      );
  }

  editProduct(product: any): void {
    this.currentProduct = { ...product };
    this.isEditingProduct = true;
  }

  cancelEdit(): void {
    this.currentProduct = {};
    this.isEditingProduct = false;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      this.http.post<{ url: string }>('https://api-perfum-kf75.vercel.app/api/upload', formData)
        .subscribe(
          response => {
            this.currentProduct.imagen = response.url;
            this.showModalMessage('Imagen editada exitosamente');
          },
          error => {
            console.error('Error al subir la imagen:', error);
            this.showModalMessage('Hubo un error al subir la imagen');
          }
        );
    }
  }

  updateProduct(): void {
    const url = `https://api-perfum-kf75.vercel.app/api/productos/${this.currentProduct._id}`;
    this.http.put(url, this.currentProduct)
      .subscribe(
        () => {
          this.loadProductos();
          this.showModalMessage('Producto actualizado exitosamente');
          // Reflejar cambios inmediatamente en la sección de detalles del producto
          if (this.selectedProduct && this.selectedProduct._id === this.currentProduct._id) {
            this.selectedProduct = { ...this.currentProduct };
          }
          this.cancelEdit();
        },
        error => {
          console.error('Error al actualizar producto:', error);
        }
      );
  }

  deleteProduct(productId: string): void {
    const url = `https://api-perfum-kf75.vercel.app/api/productos/${productId}`;
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.http.delete(url)
        .subscribe(
          () => {
            this.loadProductos();
            this.selectedProduct = null;
            this.showModalMessage('Producto eliminado exitosamente');
          },
          error => {
            console.error('Error al eliminar producto:', error);
          }
        );
    }
  }

  showAlertMessage(message: string): void {
    this.alertMessage = message;
    setTimeout(() => {
      this.alertMessage = '';
    }, 3000);
  }

  showModalMessage(message: string): void {
    this.modalMessage = message;
    setTimeout(() => {
      this.modalMessage = '';
    }, 3000);
  }

  closeModal(): void {
    this.modalMessage = '';
  }
}
