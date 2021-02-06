import { Routes } from '@angular/router';
import { MonthlyReportComponent } from './monthly-report.component';
import { SummarySaleReportComponent } from './summary-sale-report/summary-sale-report.component';
import { MonthlyDetailReportComponent } from './monthly-detail-report/monthly-detail-report.component';
import { LogisticListComponent } from './logistic/logistic-list/logistic-list.component';
import { ProductListComponent } from './products/product-list/product-list.component';


export const MonthlyReportRoute: Routes = [
    { path: '', component: MonthlyReportComponent },
    { path: 'summarysalereport', component: SummarySaleReportComponent },
    { path: 'mdetailreport', component: MonthlyDetailReportComponent },
    { path: 'logisticreport', component: LogisticListComponent },
    { path: 'ilist', component: ProductListComponent}
];
