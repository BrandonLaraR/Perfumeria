import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { ProductosComponent } from './productos/productos.component';
import { PorGeneroComponent } from './por-genero/por-genero.component';
import { ContactoComponent } from './contacto/contacto.component';
import { TerminosCondicionesComponent } from './terminos-condiciones/terminos-condiciones.component';
import { VisionMisionComponent } from './vision-mision/vision-mision.component';
import { QuienesSomosComponent } from './quienes-somos/quienes-somos.component';
import { PoliticasComponent } from './politicas/politicas.component';
import { MetodosPagoComponent } from './metodos-pago/metodos-pago.component';
import { ListaProductosComponent } from './lista-productos/lista-productos.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CartComponent } from './cart/cart.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ProductoModalComponent } from './producto-modal/producto-modal.component';
import { GestionUsuariosComponent } from './gestion-usuarios/gestion-usuarios.component';
import { PedidosComponent } from './pedidos/pedidos.component';


const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'productos', component: ProductosComponent},
  { path: 'por-genero', component: PorGeneroComponent },
  { path: 'contacto', component: ContactoComponent},
  { path: 'terminos-condiciones', component: TerminosCondicionesComponent},
  { path: 'vision-mision', component:VisionMisionComponent},
  { path: 'quienes-somos', component:QuienesSomosComponent},
  { path: 'politicas', component: PoliticasComponent},
  { path: 'metodos-pago', component:MetodosPagoComponent},
  { path: 'lista-productos', component: ListaProductosComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'cart', component:CartComponent},
  { path: 'product/:id', component: ProductDetailComponent},
  { path: 'perfil', component: PerfilComponent},
  { path: 'producto-modal', component: ProductoModalComponent},
  { path: 'gestion-usuarios', component: GestionUsuariosComponent},
  { path: 'pedidos', component: PedidosComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
