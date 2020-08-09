import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-filter',
	templateUrl: './filter.component.html',
	styleUrls: [ './filter.component.css' ]
})
export class FilterComponent implements OnInit {
	displayPanel: boolean;
	panelOpenState: boolean;

	selectedCategory: string;
	selectedSubCategory: string;

	constructor() {}

	ngOnInit(): void {
    this.displayPanel = true;
		this.panelOpenState = true;
  }
}
