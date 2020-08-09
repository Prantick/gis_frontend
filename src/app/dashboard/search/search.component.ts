import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DashboardService } from '../dashboard.service';

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: [ './search.component.css' ]
})
export class SearchComponent implements OnInit {
	searchByName: FormGroup;
	options: string[] = [];
	combinedValues: Map<string, Array<string>>;
	filteredOptions: Observable<string[]>;

	constructor(private formBuilder: FormBuilder, private indexService: DashboardService) {}

	ngOnInit(): void {
		this.manageIndexing();
		this.initializeForms();
		this.filteredOptions = this.searchByName
			.get('enteredName')
			.valueChanges.pipe(startWith(''), map((value) => this._filter(value)));
	}
	initializeForms() {
		this.searchByName = this.formBuilder.group({
			enteredName: [ '' ]
		});
	}
	manageIndexing() {
		let search = localStorage.getItem('search');
		if (!search) {
			this.indexService.indexedSearch().subscribe(
				(data) => {
					this.combinedValues = new Map(data);
					localStorage.setItem('search', JSON.stringify(data));
				},
				(err) => console.log(err)
			);
		} else {
			this.combinedValues = new Map(JSON.parse(search));
		}
	}
	searchOption(value) {
		console.log(value);
	}
	private _filter(value: string): string[] {
		if (Array.isArray(value)) {
			return;
		}
		if (value === '') {
			this.options = [];
			return this.options;
		} else if (value.length === 1 && this.options.length === 0) {
			this.options = this.combinedValues.get(value.toUpperCase());
			return this.options;
		}
		return this.options.filter((option) => option[1].toLowerCase().startsWith(value.toLowerCase()));
	}
}
