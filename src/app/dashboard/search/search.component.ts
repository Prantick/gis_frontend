import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
	@Output() sendValue: EventEmitter<Object> = new EventEmitter<Object>();
	searchByName: FormGroup;
	options: string[] = [];
	combinedValues: Map<string, Array<string>>;
	mapValues;
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
		this.makeSearchEasy(this.combinedValues.values());
	}
	makeSearchEasy(arr) {
		let a = [ ...arr ];
		this.mapValues = new Map(a.reduce((acc, val) => acc.concat(val), []));
	}
	searchOption(value: string[]) {
		let obj = {};

		if (value[0] === '1') {
			obj['type']='0';
			obj['NAME']="Assam";
			obj['map_id']="1";
			obj['ID']='1';
		} else {
			let arr = value[0].split('.');
			obj['DIST_NAME'] = this.mapValues.get(arr[0]);
			obj['DIST_ID'] = arr[0];
			obj['type'] = '1';
			obj['map_id'] = arr[0];
			if (arr[1]) {
				obj['BLOCK_NAME'] = this.mapValues.get(`${arr[0]}.${arr[1]}`);
				obj['BLOCK_ID'] = arr[1];
				obj['type'] = '2';
				obj['map_id'] = `${arr[0]}.${arr[1]}`;
			}
			if (arr[2]) {
				obj['GP_NAME'] = this.mapValues.get(`${arr[0]}.${arr[1]}.${arr[2]}`);
				obj['GP_ID'] = arr[2];
				obj['type'] = '3';
				obj['map_id'] = `${arr[0]}.${arr[1]}`;
			}
		}

		this.sendValue.emit(obj);
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
