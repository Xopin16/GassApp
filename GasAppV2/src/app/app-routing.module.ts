import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GasolListComponent } from './components/gasol-list/gasol-list.component';

const routes: Routes = [
  { path: 'gasol', component: GasolListComponent },
  { path: '', redirectTo: '/gasol', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
