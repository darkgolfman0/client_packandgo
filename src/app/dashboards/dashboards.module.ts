import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardsRoutes } from './dashboards.routing';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { Dashboard1Component } from './dashboard1/dashboard1.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';
import { FormsModule } from '@angular/forms';
import { dashboard1tanceFilterPipe } from './dashboard1/dashboard1-distance.filter.pipe';
@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ChartistModule,
    ChartsModule,
    RouterModule.forChild(DashboardsRoutes),
    FormsModule,
    NgxChartsModule
  ],
  declarations: [Dashboard1Component, Dashboard2Component, dashboard1tanceFilterPipe]
})
export class DashboardsModule { }
