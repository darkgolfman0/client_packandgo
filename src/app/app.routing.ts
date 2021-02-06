import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
// import { Dashboard1Component } from './dashboards/dashboard1/dashboard1.component';
import { AuthGuard } from './auth.guard';
import { DashboardOrderListComponent } from './orders/dashboard-order-list.compoment';
import { CustomerListComponent } from './customers/customer-list/customer-list.component';
import { CustomerNewComponent } from './customers/customer-new/customer-new.component';
import { CustomerDetailComponent } from './customers/customer-detail/customer-detail.component';
import { OrderListComponent } from './orders/order-list/order-list.component';
import { OrderNewComponent } from './orders/order-new/order-new.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';
import { ProductListComponent } from './monthly-report/products/product-list/product-list.component';
import { NoauthComponent } from './noauth/noauth.component';
import { SessionExpiredComponent } from './session-expired/session-expired.component';
import { StockMovementComponent } from './stock/stock-movement/stock-movement.component';
import { ChangpasswordComponent } from './changpassword/changpassword.component';
import { PaymentComponent } from './payment/payment.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: FullComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'dashboards', loadChildren: './dashboards/dashboards.module#DashboardsModule' },
      { path: 'tracking', component: DashboardOrderListComponent, canActivate: [AuthGuard] },
      { path: 'clist', component: CustomerListComponent, canActivate: [AuthGuard] },
      { path: 'cnew', component: CustomerNewComponent, canActivate: [AuthGuard] },
      { path: 'cdetail/:code', component: CustomerDetailComponent, canActivate: [AuthGuard] },
      // { path: 'ilist', component: ProductListComponent, canActivate: [AuthGuard] },
      { path: 'smovement/:code', component: StockMovementComponent, canActivate: [AuthGuard] },
      { path: 'olist', component: OrderListComponent, canActivate: [AuthGuard] },
      { path: 'onew/:code', component: OrderNewComponent, canActivate: [AuthGuard] },
      { path: 'odetail/:code', component: OrderDetailComponent, canActivate: [AuthGuard] },
      { path: 'changpassword', component: ChangpasswordComponent, canActivate: [AuthGuard] },
      {
        path: 'payment',
        loadChildren: './payment/payment.module#PaymentModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'report',
        loadChildren: './monthly-report/monthly-report.module#MonthlyReportModule',
        canActivate: [AuthGuard],
      },
      { path: 'noauth', component: NoauthComponent, },
      { path: 'sessionexpired', component: SessionExpiredComponent, },
    ]
  },
  // { path: '', component: Dashboard1Component, },
  { path: 'dashboards', redirectTo: '/dashboards/dashbaord1', pathMatch: 'full', },
  { path: 'login', component: LoginComponent, },
  { path: 'logout', component: LogoutComponent, },
];
