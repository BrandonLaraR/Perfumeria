import { Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { ProductosComponent } from './productos/productos.component';
import { PoliticasComponent } from './politicas/politicas.component';
import { ContactoComponent } from './contacto/contacto.component';
import { TerminosCondicionesComponent } from './terminos-condiciones/terminos-condiciones.component';
import { VisionMisionComponent } from './vision-mision/vision-mision.component';
import { QuienesSomosComponent } from './quienes-somos/quienes-somos.component';
import { MetodosPagoComponent } from './metodos-pago/metodos-pago.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CartComponent } from './cart/cart.component';
import { PerfilComponent } from './perfil/perfil.component';
import { GestionUsuariosComponent } from './gestion-usuarios/gestion-usuarios.component';
import { PedidosComponent } from './pedidos/pedidos.component';


export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'productos', component: ProductosComponent},
  {path: 'politicas', component:PoliticasComponent},
  { path: 'contacto', component: ContactoComponent},
  { path: 'terminos-condiciones', component: TerminosCondicionesComponent},
  { path: 'vision-mision', component:VisionMisionComponent},
  { path: 'quienes-somos', component:QuienesSomosComponent},
  { path: 'metodos-pago', component:MetodosPagoComponent},
  { path: 'login', component:LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'cart', component:CartComponent},
  { path: 'perfil', component: PerfilComponent},
  { path: 'gestion-usuarios', component: GestionUsuariosComponent},
  { path: 'pedidos', component: PedidosComponent}
];
