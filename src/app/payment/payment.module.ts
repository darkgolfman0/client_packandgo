import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentSummaryComponent } from './payment-summary/payment-summary.component';
import { RouterModule } from '@angular/router';
import { PaymentRoutes } from './payment.routing';
import { PaymentComponent } from './payment.component';
import { DemoMaterialModule } from '../demo-material-module';
import { FormsModule } from '@angular/forms';
import { PaymentTransectionComponent } from './payment-transection/payment-transection.component';
import { PaymentTransactionFilterPipe } from './payment-transection/payment-transaction-fileter.pipe';



@NgModule({
  declarations:
    [
      PaymentSummaryComponent,
      PaymentComponent,
      PaymentTransectionComponent,
      PaymentTransactionFilterPipe
    ],
  imports: [
    CommonModule,
    RouterModule.forChild(PaymentRoutes),
    DemoMaterialModule,
    FormsModule
  ]
})
export class PaymentModule { }
