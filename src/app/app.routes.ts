// app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { IncidenciaComponent } from './features/incidencia/incidencia.component';
import { IncidenciaFormComponent } from './pages/incidencia-form/incidencia-form.component';
import { IncidenciaDetailComponent } from './features/incidencia/incidencia-detail.component/incidencia-detail.component'; // 👈 ¡Importa el nuevo componente!

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'incidencias', component: IncidenciaComponent },
      { path: 'incidencias/nueva', component: IncidenciaFormComponent },
      { path: 'incidencias/:id/editar', component: IncidenciaFormComponent },
      { path: 'incidencias/:id', component: IncidenciaDetailComponent }, // 👈 ¡Agrega esta línea!
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];