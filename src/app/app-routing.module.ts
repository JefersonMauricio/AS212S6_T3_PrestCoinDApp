import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import { TransaccionComponent } from './transaccion/transaccion.component';

const routes: Routes = [
  { path: '', component: NavigationComponent, pathMatch: 'full' },
  { path: 'navigation', component: NavigationComponent },
  { path: 'transaccion', component: TransaccionComponent }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
