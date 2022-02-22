import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'tab2',
        children: [
          {
            path:'',
            loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule),
          },
          {
            path: 'mapa/:geo',
            loadChildren: () => import('../mapa/mapa.module').then( m => m.MapaPageModule)
          },
          {
            path: '**',
            redirectTo: ''
          }
        ]
      },
      {
        path: '**',
        redirectTo: 'tab1'
      }
    ]
  },
  {
    path: '**',
    redirectTo : 'home'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }
