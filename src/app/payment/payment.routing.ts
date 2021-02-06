import { Routes } from '@angular/router';
import { PaymentSummaryComponent } from './payment-summary/payment-summary.component';
import { PaymentComponent } from './payment.component';
import { PaymentTransectionComponent } from './payment-transection/payment-transection.component';


export const PaymentRoutes: Routes = [
    { path: '', component: PaymentComponent },
    { path: 'paymentsum', component: PaymentSummaryComponent },
    { path: 'paymenttran', component: PaymentTransectionComponent },
];
