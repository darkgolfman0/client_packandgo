import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthlyDetailReportComponent } from './monthly-detail-report/monthly-detail-report.component';
import { SummarySaleReportComponent } from './summary-sale-report/summary-sale-report.component';
import { RouterModule } from '@angular/router';
import { DemoMaterialModule } from '../demo-material-module';
import { FormsModule } from '@angular/forms';
import { MonthlyReportRoute } from './monthlyreport.routing';
import { MonthlyReportComponent } from './monthly-report.component';
import { LogisticListComponent } from './logistic/logistic-list/logistic-list.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductListFilterPipe } from './products/product-list/product-list-filter.pipe';



@NgModule({
  declarations: [MonthlyReportComponent, MonthlyDetailReportComponent,
    SummarySaleReportComponent, LogisticListComponent, ProductListComponent,
    ProductListFilterPipe,],
  imports: [
    CommonModule,
    RouterModule.forChild(MonthlyReportRoute),
    DemoMaterialModule,
    FormsModule
  ]
})
export class MonthlyReportModule { }
