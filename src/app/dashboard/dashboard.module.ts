import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RequiredMaterialModule } from './material.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { MapComponent } from './map/map.component';
import { SearchComponent } from './search/search.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { FilterComponent } from './filter/filter.component';

import { DashboardService } from './dashboard.service';
import { MapDirective } from './map/map.directive';
import { FilterComparePipe } from './filter-compare.pipe';
import { FilterTimelinePipe } from './filter-timeline.pipe';
@NgModule({
	declarations: [
		MapComponent,
		SearchComponent,
		DashboardHomeComponent,
		MapDirective,
		SidenavComponent,
		FilterComponent,
		FilterComparePipe,
		FilterTimelinePipe
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		RequiredMaterialModule,
		LeafletModule
	],
	providers: [ DashboardService ],
	exports: []
})
export class DashboardModule {}
