import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
	constructor(private http: HttpClient) {}
	indexedSearch(): Observable<any> {
		const url = `${environment.indexAPIUrl}/search`;
		return this.http.get(url, { headers: this.headers }).pipe(catchError(this.handleError));
	}
	fetchGeoJSON(): Observable<Object>{
		const url= `${environment.geoJSONUrl}`;
		return this.http.get<Object>(url, {headers: this.headers}).pipe(catchError(this.handleError));
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
