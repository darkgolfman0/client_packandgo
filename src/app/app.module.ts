import * as $ from 'jquery';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FullComponent } from './layouts/full/full.component';
import { AppHeaderComponent } from './layouts/full/header/header.component';
import { AppSidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './demo-material-module';

import { SharedModule } from './shared/shared.module';
import { SpinnerComponent } from './shared/spinner.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ErrorInterceptor, JwtInterceptor } from './helpers';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';
import { LogoutComponent } from './logout/logout.component';
import { DashboardOrderListComponent } from './orders/dashboard-order-list.compoment';
import { DashboardOrderFilterPipe } from './orders/dashboard-order-filter.pipe';
import { CustomerFilterPipe } from './customers/customer-list/customer-filter.pipe';
import { CustomerListComponent } from './customers/customer-list/customer-list.component';
import { CustomerNewComponent } from './customers/customer-new/customer-new.component';
import { CustomerDetailComponent } from './customers/customer-detail/customer-detail.component';
import { OrderListComponent } from './orders/order-list/order-list.component';
import { OrderNewComponent } from './orders/order-new/order-new.component';
import { OrderDetailComponent, DialogOrderDetailConfirmed, DialogOrderDetailTracking } from './orders/order-detail/order-detail.component';
import { OrderFilterPipe } from './orders/order-list/order-filter.pipe';
import { DialogOrderProduct } from './orders/order-product/order-product.component';
import { ProductListComponent } from './monthly-report/products/product-list/product-list.component';
import { ProductListFilterPipe } from './monthly-report/products/product-list/product-list-filter.pipe';
import { NoauthComponent } from './noauth/noauth.component';
import { SessionExpiredComponent } from './session-expired/session-expired.component';
import { StockMovementComponent } from './stock/stock-movement/stock-movement.component';
import { EncrDecrService } from './services/encr-decr.service';
import { ChangpasswordComponent } from './changpassword/changpassword.component';
import { MonthlyReportComponent } from './monthly-report/monthly-report.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true
};

@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    AppHeaderComponent,
    SpinnerComponent,
    AppSidebarComponent,
    LoginComponent,
    LogoutComponent,
    DashboardOrderListComponent,
    DashboardOrderFilterPipe,
    CustomerListComponent,
    CustomerNewComponent,
    CustomerDetailComponent,
    CustomerFilterPipe,
    // ProductListComponent,
    // ProductListFilterPipe,
    OrderListComponent,
    OrderNewComponent,
    OrderDetailComponent,
    OrderFilterPipe,
    DialogOrderProduct,
    DialogOrderDetailConfirmed,
    DialogOrderDetailTracking,
    NoauthComponent,
    SessionExpiredComponent,
    StockMovementComponent,
    ChangpasswordComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    PerfectScrollbarModule,
    HttpClientModule,
    SharedModule,
    RouterModule.forRoot(AppRoutes)
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
    // EncrDecrService,
    AuthGuard,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogOrderProduct,
    DialogOrderDetailConfirmed,
    DialogOrderDetailTracking,
  ],
})
export class AppModule { }
