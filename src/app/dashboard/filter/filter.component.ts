import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DashboardService } from '../dashboard.service';
import { CategoryModel } from 'src/models/categoryModel';
import { SubCategoryModel } from 'src/models/subCategoryModel';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FilterModel } from 'src/models/filterModel';

@Component({
	selector: 'app-filter',
	templateUrl: './filter.component.html',
	styleUrls: [ './filter.component.css' ]
})
export class FilterComponent implements OnInit{

	category: CategoryModel[];
	subCategory: SubCategoryModel[];
	filterForm:FormGroup;
	availableStartTimeline:number[];
	availableEndTimeline:number[];
	@Output()
	filterState: EventEmitter<FilterModel> = new EventEmitter<FilterModel>();
	constructor(private allService: DashboardService, private _snackBar: MatSnackBar, private _formBuilder: FormBuilder) {}
	ngOnInit(): void {
		this.prepareForm();
		this.displayCategory();
		this.displayTimeline();
	}
	
	prepareForm(){
		this.filterForm = this._formBuilder.group({
			selectedCategory:['',Validators.required],
			selectedSubCategory : ['',Validators.required],
			compareSubCategory:['', Validators.required],
			timeS:['',Validators.required],
			timeE:['',Validators.required]
		})
	}
	onSubmit(){
		let a = this.filterForm.get('timeS').value;
		let b = this.filterForm.get('timeE').value;
		this.filterForm.get('timeS').setValue(`${a}0101`);
		this.filterForm.get('timeE').setValue(`${b}0101`);
		this.filterState.emit(this.filterForm.value as FilterModel);
		this.filterForm.get('timeS').setValue(`${a}`);
		this.filterForm.get('timeE').setValue(`${b}`);
	}
	onCatChange(value:string){
		this.displaySubCategory(value);
	}
	displayCategory():void{
		this.allService.fetchCategory().subscribe(
			(data) => {
				this.category = data;
			},
			(error) => {
				this.openSnackBar(error, 'X');
			}
		);
	}
	displaySubCategory(catId: string): void {
		this.allService.fetchSubCategory(catId).subscribe(
			(data) => {
				this.subCategory = data;
			},
			(error) => {
				this.openSnackBar(error, 'X');
			}
		);
	}
	displayTimeline():void{
		this.allService.fetchTimeline().subscribe(
			(data)=>{
				this.availableStartTimeline= data['s']
				this.availableEndTimeline= data['e']; 	
			},
			(error)=>{
				this.openSnackBar(error, 'X');
			}
		)	
	}
	openSnackBar(message: string, action: string) {
		this._snackBar.open(message, action, {
			duration: 2000
		});
	}
}
