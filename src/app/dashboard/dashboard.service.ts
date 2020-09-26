import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CategoryModel } from 'src/models/categoryModel';
import { SubCategoryModel } from 'src/models/subCategoryModel';
import { ResponseModel } from 'src/models/ResponseModel';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
	constructor(private http: HttpClient) {}
	indexedSearch(): Observable<any> {
		const url = '../../assets/searchIndex.json';
		return this.http.get(url, { headers: this.headers }).pipe(catchError(this.handleError));
	}
	fetchGeoJSON(id:string): Observable<Object>{
		const url= `../../assets/geojson/${id}.geojson`;
		return this.http.get<Object>(url, {headers: this.headers}).pipe(catchError(this.handleError));
	}
	fetchCategory(): Observable<CategoryModel[]>{
		const url = environment.getCategoryAPIUrl;
		return this.http.get<CategoryModel[]>(url,{headers: this.headers}).pipe(catchError(this.handleError));
	}
	fetchSubCategory(id:string): Observable<SubCategoryModel[]>{
		const url = `${environment.getCategoryAPIUrl}/${id}`;
		return this.http.get<SubCategoryModel[]>(url,{headers: this.headers}).pipe(catchError(this.handleError));
	}
	fetchTimeline(): Observable<any>{
		const url = `${environment.getTimelineAPIUrl}`;
		return this.http.get(url,{headers: this.headers}).pipe(catchError(this.handleError));
	}
	fetchValuesMapViewOne(timeStart:string, timeEnd:string, categoryId:string, subcategoryId:string): Observable<ResponseModel[]>{
		const url = `${environment.getValuesAPIUrl}/${timeStart}/${timeEnd}/${categoryId}/${subcategoryId}`;
		return this.http.get<ResponseModel[]>(url,{headers: this.headers}).pipe(catchError(this.handleError));
	}
	fetchValuesMapViewTwo(timeStart:string, timeEnd:string, categoryId:string, subcategoryId:string, districtId:string): Observable<ResponseModel[]>{
		const url = `${environment.getValuesAPIUrl}/${timeStart}/${timeEnd}/${categoryId}/${subcategoryId}/${districtId}`;
		return this.http.get<ResponseModel[]>(url,{headers: this.headers}).pipe(catchError(this.handleError));
	}
	fetchValuesMapViewThree(timeStart:string, timeEnd:string, categoryId:string, subcategoryId:string, districtId:string, blockId:string): Observable<ResponseModel[]>{
		const url = `${environment.getValuesAPIUrl}/${timeStart}/${timeEnd}/${categoryId}/${subcategoryId}/${districtId}/${blockId}`;
		return this.http.get<ResponseModel[]>(url,{headers: this.headers}).pipe(catchError(this.handleError));
	}
	private handleError(err: HttpErrorResponse) {
		let errMsg: string = '';
		if (err.error instanceof Error) {
			errMsg = err.error.message;
		} else if (typeof err.error === 'string') {
			errMsg = JSON.parse(err.error).message;
		} else {
			if (err.status == 0) {
				errMsg = 'A connection to back end can not be established.';
			} else {
				errMsg = err.error.message;
			}
		}
		return throwError(errMsg);
	}
}
