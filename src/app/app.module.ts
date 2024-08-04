import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { InicioComponent } from './inicio/inicio.component';
import { ProductosComponent } from './productos/productos.component';

import { PoliticasComponent } from './politicas/politicas.component';
import { ContactoComponent } from './contacto/contacto.component';
import { MetodosPagoComponent } from './metodos-pago/metodos-pago.component';
import { QuienesSomosComponent } from './quienes-somos/quienes-somos.component';
import { TerminosCondicionesComponent } from './terminos-condiciones/terminos-condiciones.component';
import { VisionMisionComponent } from './vision-mision/vision-mision.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { PerfilComponent } from './perfil/perfil.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProductDetailComponent,



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,  // Asegúrate de que esto está aquí
    RouterModule,  // Importa RouterModule aquí también
    CommonModule,
    FormsModule,
    HttpClientModule,
    PerfilComponent,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: []  // No necesitamos bootstrap aquí porque estamos usando `bootstrapApplication` en main.ts
})
export class AppModule { }
