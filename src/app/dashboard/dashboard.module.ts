import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RequiredMaterialModule } from './material.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { MapComponent } from './map/map.component';
import { SearchComponent } from './search/search.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { AvailableMapsComponent } from './available-maps/available-maps.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { FilterComponent } from './filter/filter.component';

import { DashboardService } from './dashboard.service';
import { MapDirective } from './map/map.directive';

@NgModule({
	declarations: [
		MapComponent,
		SearchComponent,
		DashboardHomeComponent,
		MapDirective,
		AvailableMapsComponent,
		SidenavComponent,
		FilterComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		RequiredMaterialModule,
		DashboardRoutingModule,
		LeafletModule
	],
	providers: [ DashboardService ],
	exports: []
})
export class DashboardModule {}
