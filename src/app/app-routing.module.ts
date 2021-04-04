import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardHomeComponent } from './dashboard/dashboard-home/dashboard-home.component';

const routes: Routes = [
	{
		path: '',
		component:DashboardHomeComponent
	},
	{
		path:'**',
		redirectTo:'/',
		pathMatch:'full'
	}
];

@NgModule({
	imports: [ RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
