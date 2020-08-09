import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { AvailableMapsComponent } from './available-maps/available-maps.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
const routes: Routes = [
	{
		path: 'home',
		component: DashboardHomeComponent,
		children: [
			{ path: '', redirectTo: 'map', pathMatch: 'full' },
			{ path: 'availableMaps', component: AvailableMapsComponent },
			{ path: 'map', component: MapComponent }
		]
	},
	{
		path:'**',
		redirectTo:'/home/map',
		pathMatch:'full'
	}
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class DashboardRoutingModule {}
