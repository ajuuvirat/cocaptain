import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  /*{
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },*/
  {
    path: '',
    loadChildren: () => import('./authentication/user/login/login.module').then(m => m.LoginPageModule)
   },
  {
    path: 'home',
    loadChildren: () => import('./tabs/tabs.module').then(m=> m .TabsPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./authentication/user/register/register.module').then(m => m.RegisterPageModule)
  },

  { path: 'approval',
  loadChildren: () => import('./token-gate/approval/approval.module').then(m => m.ApprovalPageModule)
},
  {
    path: 'approval/:restaurantId/:tableId',
    loadChildren: () => import('./token-gate/approval/approval.module').then(m => m.ApprovalPageModule)
  },
  {
    path: 'qr-login/:restaurantId/:tableId',
    loadChildren: () => import('./authentication/user/qr-login/qr-login.module').then(m => m.QrLoginPageModule)
  },
  { path: 'feedback',
  loadChildren: () => import('./token-gate/feedback/feedback.module').then(m => m.FeedbackPageModule)
},
  { path: 'needs-list',
  loadChildren: () => import('./token-gate/needs-list/needs-list.module').then(m => m.NeedsListPageModule)
},
{ path: 'sharning',
  loadChildren: () => import('./token-gate/sharing/sharing.module').then(m => m.SharingModule)
},
  { path: 'error-massage/:message',
  loadChildren: () => import('./token-gate/error-massage/error-massage.module').then(m => m.ErrorMassagePageModule)
},
{ path: 'home/tabs/approval/:restaurantId/:tableId',
loadChildren: () => import('./token-gate/error-massage/error-massage.module').then(m => m.ErrorMassagePageModule)
},
  {
    path: 'list-bulk',
    loadChildren: () => import('./token-gate/list-bulk/list-bulk.module').then( m => m.ListBulkPageModule)
  },
  {
    path: 'bulk-order',
    loadChildren: () => import('./../app/token-gate/list-bulk/bulk-order/bulk-order.module').then( m => m.BulkOrderPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {useHash: true})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
