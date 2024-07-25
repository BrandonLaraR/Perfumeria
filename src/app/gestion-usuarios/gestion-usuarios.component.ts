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

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadProductos();
  }

  loadUsers(): void {
    this.http.get<any[]>('https://apielixir.onrender.com/api/usuarios')
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
    this.http.get<any[]>('https://apielixir.onrender.com/api/productos')
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
      this.http.delete(`https://apielixir.onrender.com/api/usuarios/${user._id}`)
        .subscribe(
          () => {
            this.users = this.users.filter(u => u._id !== user._id);
            alert('Usuario eliminado exitosamente');
          },
          error => {
            console.error('Error al eliminar usuario:', error);
          }
        );
    }
  }

  toggleAdmin(user: any): void {
    const url = `https://apielixir.onrender.com/api/usuarios/${user._id}/${user.isAdmin ? 'removeAdmin' : 'makeAdmin'}`;
    this.http.put(url, { isAdmin: !user.isAdmin })
      .subscribe(
        () => {
          user.isAdmin = !user.isAdmin;
          alert('Permisos de administrador actualizados exitosamente');
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

  updateProduct(): void {
    const url = `https://apielixir.onrender.com/api/productos/${this.currentProduct._id}`;
    this.http.put(url, this.currentProduct)
      .subscribe(
        () => {
          this.loadProductos();
          alert('Producto actualizado exitosamente');
          this.cancelEdit();
        },
        error => {
          console.error('Error al actualizar producto:', error);
        }
      );
  }

  deleteProduct(productId: string): void {
    const url = `https://apielixir.onrender.com/api/productos/${productId}`;
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.http.delete(url)
        .subscribe(
          () => {
            this.loadProductos();
            this.selectedProduct = null;
            alert('Producto eliminado exitosamente');
          },
          error => {
            console.error('Error al eliminar producto:', error);
          }
        );
    }
  }
}
