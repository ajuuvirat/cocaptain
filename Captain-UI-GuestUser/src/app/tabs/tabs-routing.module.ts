import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

/*
const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];*/


const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
     
      {
        path: 'list/:orderId',
        children: [
          {
            path: '',
            loadChildren: () => import('./../token-gate/list-product/list-product.module').then(m => m.ListProductPageModule )
          }
        ]
      },
      {
        path: 'list/:orderId?/:tableId?',
        children: [
          {
            path: '',
            loadChildren: () => import('./../token-gate/list-product/list-product.module').then(m => m.ListProductPageModule )
          }
        ]
      },
      {
        path: 'details/:orderId/:id',
        children: [
          {
            path: '',
            loadChildren: () => import('../token-gate/detail-product/detail-product.module').then(m => m.DetailProductPageModule )
          }
        ]
      },
      
      {
        path: 'order-list',
        children: [
          { 
            path: '',
            loadChildren: () => import('../token-gate/order-list/order-list.module').then(m => m.OrderListPageModule )
          },
        ]
      },
      {
        path: 'order-list/:orderId',
        children: [
          { 
            path: '',
            loadChildren: () => import('../token-gate/order-list/order-list.module').then(m => m.OrderListPageModule )
          },
        ]
      },
      {
        path: 'needs-list',
        children: [
          { 
            path: '',
            loadChildren: () => import('../token-gate/needs-list/needs-list.module').then(m => m.NeedsListPageModule ) 
          },
        ]
      },
      {
        path: 'sharing',
        children: [
          { 
            path: '',
            loadChildren: () => import('../token-gate/sharing/sharing.module').then(m => m.SharingModule ) 
          },
        ]
      },
      {
        path: 'tab3',
        children: [
          {
            path: '',
            loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule )
          }
        ]
      },

    ]
  },
  {
    path: '',
    redirectTo: '/tabs/list/:orderId',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
