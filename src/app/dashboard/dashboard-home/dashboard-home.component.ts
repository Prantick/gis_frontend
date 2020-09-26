import { Component, OnInit } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
	selector: 'app-dashboard-home',
	templateUrl: './dashboard-home.component.html',
	styleUrls: [ './dashboard-home.component.css' ]
})
export class DashboardHomeComponent implements OnInit {
	toggle: boolean;
	title: any;
	loading: boolean;
	constructor(private breakpointObserver: BreakpointObserver) {}

	ngOnInit(): void {
		this.loading = true;
		this.title = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
			map(({ matches }) => {
				if (matches) {
					return 'MDAS';
				}
				return 'Monitoring Data Analytics System';
			})
		);
	}
	onToggleClick() {
		this.toggle = !this.toggle;
	}
	changeLoadingStatus(status:boolean){
		this.loading= status;
	}
}
