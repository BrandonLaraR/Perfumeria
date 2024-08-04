import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { ColorChromeModule } from 'ngx-color/chrome';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, ColorChromeModule]
})
export class PerfilComponent implements OnInit {
  public userProfile: any = null;
  public isEditingField = false;
  public currentField: string = '';
  public tempFieldValue: any = {};
  public adminItems = [
    { key: 'logo', label: 'Logo' },
    { key: 'images', label: 'Imágenes' },
    { key: 'colors', label: 'Colores' },
    { key: 'terms', label: 'Términos y Condiciones' },
    { key: 'contact', label: 'Contacto' },
    { key: 'policies', label: 'Políticas' },
    { key: 'about', label: 'Quiénes Somos' },
    { key: 'vision', label: 'Visión y Misión' }
  ];
  public adminConfig: any = {
    logo: '',
    images: ['', '', ''],
    colors: {
      primary: '#110d03',
      header: '#000000'
    },
    terms: '',
    contact: '',
    policies: '',
    about: '',
    vision: ''
  };
  public isEditing = false;
  public currentItem: any = null;
  public showAdminModal = false;
  public showHeaderColorModal = false;
  public showFooterColorModal = false;
  public logoSize: string = '';
  public showAlert = false;
  public alertMessage = '';
  public newProducto = { Nombre: '', Precio: '', imagen: '' };

  constructor(public authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.userProfile = this.authService.getProfile();
    this.loadAdminConfig();
    this.loadPolicies();
    this.loadAbout();
    this.loadVisionMission();
    this.loadTerms();
    this.loadUserOrders();
  }

  editField(field: string): void {
    this.currentField = field;
    this.tempFieldValue = {
      calle: this.userProfile.calle || '',
      numero: this.userProfile.numero || '',
      colonia: this.userProfile.colonia || '',
      estado: this.userProfile.estado || '',
      phone: this.userProfile.phone || ''
    };
    this.isEditingField = true;
  }

  saveField(): void {
    this.userProfile.calle = this.tempFieldValue.calle;
    this.userProfile.numero = this.tempFieldValue.numero;
    this.userProfile.colonia = this.tempFieldValue.colonia;
    this.userProfile.estado = this.tempFieldValue.estado;
    this.userProfile.phone = this.tempFieldValue.phone;

    const updatedData = {
      nombre: this.userProfile.nombre,
      calle: this.userProfile.calle,
      numero: this.userProfile.numero,
      colonia: this.userProfile.colonia,
      estado: this.userProfile.estado,
      phone: this.userProfile.phone
    };

    this.http.post('https://api-perfum-kf75.vercel.app/api/usuarios/updateProfile', updatedData)
      .subscribe(
        (response: any) => {
          this.userProfile = response;
          localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
          this.showAlertMessage('Información actualizada exitosamente');
          this.closeFieldModal();
          this.closeAdminModal();
        },
        error => {
          console.error('Error al actualizar la información:', error);
          this.showAlertMessage('Hubo un error al actualizar la información');
        }
      );
  }

  closeFieldModal(): void {
    this.isEditingField = false;
    this.currentField = '';
    this.tempFieldValue = {};
  }

  editItem(key: string): void {
    this.currentItem = this.adminItems.find(item => item.key === key);
    if (key === 'colors') {
      this.showHeaderColorModal = true;
    } else {
      this.isEditing = true;
    }
  }

  closeModal(): void {
    this.isEditing = false;
    this.currentItem = null;
  }

  closeAdminModal(): void {
    this.showAdminModal = false;
    this.closeModal(); // Close the nested modal as well
  }

  closeHeaderColorModal(): void {
    this.showHeaderColorModal = false;
  }

  closeFooterColorModal(): void {
    this.showFooterColorModal = false;
  }

  saveConfig(): void {
    const configData = {
      ...this.adminConfig,
      logoSize: this.logoSize
    };

    this.http.post('https://api-perfum-kf75.vercel.app/api/adminConfig', this.adminItems.map(item => ({
      Titulo: item.label,
      Contenido: configData[item.key]
    })))
      .subscribe(
        response => {
          console.log('Configuración guardada exitosamente:', response);
          this.showAlertMessage('Configuración guardada exitosamente');
          this.closeAdminModal();
          this.applyColorChange();  // Ensure the color changes are applied after saving
        },
        error => {
          console.error('Error al guardar configuración:', error);
          this.showAlertMessage('Hubo un error al guardar la configuración');
        }
      );
  }

  saveHeaderColorConfig(): void {
    const configData = {
      ...this.adminConfig,
      logoSize: this.logoSize
    };

    this.http.post('https://api-perfum-kf75.vercel.app/api/adminConfig/colors', {
      primary: this.adminConfig.colors.primary,
      header: this.adminConfig.colors.header
    })
      .subscribe(
        response => {
          console.log('Configuración guardada exitosamente:', response);
          this.showAlertMessage('Color de cabecera guardado exitosamente');
          this.closeHeaderColorModal();
          this.applyColorChange();
        },
        error => {
          console.error('Error al guardar configuración:', error);
          this.showAlertMessage('Hubo un error al guardar el color de cabecera');
        }
      );
  }

  saveFooterColorConfig(): void {
    const configData = {
      ...this.adminConfig,
      logoSize: this.logoSize
    };

    this.http.post('https://api-perfum-kf75.vercel.app/api/adminConfig/colors', {
      primary: this.adminConfig.colors.primary,
      header: this.adminConfig.colors.header
    })
      .subscribe(
        response => {
          console.log('Configuración guardada exitosamente:', response);
          this.showAlertMessage('Color del pie de página guardado exitosamente');
          this.closeFooterColorModal();
          this.applyColorChange();
        },
        error => {
          console.error('Error al guardar configuración:', error);
          this.showAlertMessage('Hubo un error al guardar el color del pie de página');
        }
      );
  }

  onFileSelected(event: any, index: number | string): void {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      this.http.post<{ url: string }>('https://api-perfum-kf75.vercel.app/api/upload', formData)
        .subscribe(
          response => {
            if (typeof index === 'number') {
              this.adminConfig.images[index] = response.url;
            } else if (index === 'logo') {
              this.adminConfig.logo = response.url;
              this.saveLogoConfig(response.url);
            } else if (index === 'product') {
              this.newProducto.imagen = response.url;
            }
            this.saveImagesConfig();
            this.showAlertMessage('Imagen subida exitosamente');
          },
          error => {
            console.error('Error al subir la imagen:', error);
            this.showAlertMessage('Hubo un error al subir la imagen');
          }
        );
    }
  }

  saveLogoConfig(url: string): void {
    this.http.post('https://api-perfum-kf75.vercel.app/api/adminConfig/logo', { logo: url })
      .subscribe(
        response => {
          console.log('Logo guardado exitosamente:', response);
        },
        error => {
          console.error('Error al guardar el logo:', error);
          this.showAlertMessage('Hubo un error al guardar el logo');
        }
      );
  }

  saveImagesConfig(): void {
    const imagesData = {
      images: this.adminConfig.images
    };

    this.http.post('https://api-perfum-kf75.vercel.app/api/adminConfig/images', imagesData)
      .subscribe(
        response => {
          console.log('URLs de imágenes guardadas exitosamente:', response);
        },
        error => {
          console.error('Error al guardar URLs de imágenes:', error);
          this.showAlertMessage('Hubo un error al guardar las URLs de las imágenes');
        }
      );
  }

  applyColorChange(): void {
    document.documentElement.style.setProperty('--primary-color', this.adminConfig.colors.primary);
    document.documentElement.style.setProperty('--header-color', this.adminConfig.colors.header);
  }

  openAdminModal(): void {
    this.showAdminModal = true;
  }

  openFooterColorModal(): void {
    this.showFooterColorModal = true;
  }

  loadAdminConfig(): void {
    this.http.get('https://api-perfum-kf75.vercel.app/api/adminConfig')
      .subscribe(
        (data: any) => {
          data.forEach((item: any) => {
            const key = this.adminItems.find(adminItem => adminItem.label === item.Titulo)?.key;
            if (key) {
              this.adminConfig[key] = item.Contenido;
            }
          });
          this.applyColorChange();
        },
        error => {
          console.error('Error al cargar configuración:', error);
        }
      );
    this.loadLogo();
  }

  loadLogo(): void {
    this.http.get<{ Contenido: string }>('https://api-perfum-kf75.vercel.app/api/adminConfig/logo')
      .subscribe(
        response => {
          this.adminConfig.logo = response.Contenido;
        },
        error => {
          console.error('Error al cargar el logo:', error);
        }
      );
  }

  loadPolicies(): void {
    this.http.get('https://api-perfum-kf75.vercel.app/api/politicas')
      .subscribe(
        (data: any) => {
          this.adminConfig.policies = data.Contenido;
        },
        error => {
          console.error('Error al cargar políticas:', error);
        }
      );
  }

  savePolicies(): void {
    this.http.put('https://api-perfum-kf75.vercel.app/api/politicas', { Contenido: this.adminConfig.policies })
      .subscribe(
        response => {
          this.showAlertMessage('Políticas guardadas exitosamente');
          this.closeAdminModal();
        },
        error => {
          console.error('Error al guardar políticas:', error);
          this.showAlertMessage('Hubo un error al guardar las políticas');
        }
      );
  }

  loadAbout(): void {
    this.http.get('https://api-perfum-kf75.vercel.app/api/quienes-somos')
      .subscribe(
        (data: any) => {
          this.adminConfig.about = data.Contenido;
        },
        error => {
          console.error('Error al cargar quiénes somos:', error);
        }
      );
  }

  saveAbout(): void {
    this.http.put('https://api-perfum-kf75.vercel.app/api/quienes-somos', { Contenido: this.adminConfig.about })
      .subscribe(
        response => {
          this.showAlertMessage('Quiénes Somos guardado exitosamente');
          this.closeAdminModal();
        },
        error => {
          console.error('Error al guardar Quiénes Somos:', error);
          this.showAlertMessage('Hubo un error al guardar Quiénes Somos');
        }
      );
  }

  loadVisionMission(): void {
    this.http.get('https://api-perfum-kf75.vercel.app/api/vision-mision')
      .subscribe(
        (data: any) => {
          this.adminConfig.vision = data.Contenido;
        },
        error => {
          console.error('Error al cargar visión y misión:', error);
        }
      );
  }

  saveVisionMission(): void {
    this.http.put('https://api-perfum-kf75.vercel.app/api/admin/vision-mision', { Contenido: this.adminConfig.vision })
      .subscribe(
        response => {
          this.showAlertMessage('Visión y Misión guardadas exitosamente');
          this.closeAdminModal();
        },
        error => {
          console.error('Error al guardar visión y misión:', error);
          this.showAlertMessage('Hubo un error al guardar visión y misión');
        }
      );
  }

  loadTerms(): void {
    this.http.get('https://api-perfum-kf75.vercel.app/api/terminos-condiciones')
      .subscribe(
        (data: any) => {
          this.adminConfig.terms = data.Contenido;
        },
        error => {
          console.error('Error al cargar términos y condiciones:', error);
        }
      );
  }

  saveTerms(): void {
    this.http.put('https://api-perfum-kf75.vercel.app/api/terminos-condiciones', { Contenido: this.adminConfig.terms })
      .subscribe(
        response => {
          this.showAlertMessage('Términos y Condiciones guardados exitosamente');
          this.closeAdminModal();
        },
        error => {
          console.error('Error al guardar términos y condiciones:', error);
          this.showAlertMessage('Hubo un error al guardar los términos y condiciones');
        }
      );
  }

  showAlertMessage(message: string): void {
    this.alertMessage = message;
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }

  loadUserOrders(): void {
    this.http.get<any[]>('https://api-perfum-kf75.vercel.app/api/pedidos', { params: { correo: this.userProfile?.correo } })
      .subscribe(
        (orders: any[]) => {
          this.userProfile.orders = orders;
        },
        error => {
          console.error('Error al cargar pedidos:', error);
        }
      );
  }

  addProduct(): void {
    const newProduct = {
      Nombre: this.newProducto.Nombre,
      Precio: this.newProducto.Precio,
      imagen: this.newProducto.imagen
    };

    this.http.post('https://api-perfum-kf75.vercel.app/api/agregarProducto', newProduct)
      .subscribe(
        response => {
          this.showAlertMessage('Producto agregado exitosamente');
          this.newProducto = { Nombre: '', Precio: '', imagen: '' };
        },
        error => {
          console.error('Error al agregar producto:', error);
          this.showAlertMessage('Hubo un error al agregar el producto');
        }
      );
  }
}
