import { Component, OnInit, ViewChild, NgZone, Output, EventEmitter } from '@angular/core';
import { latLng, geoJSON, point, Map, Layer } from 'leaflet';
import { LeafletDirective } from '@asymmetrik/ngx-leaflet';
import { DashboardService } from '../dashboard.service';
import { ResponseModel } from '../../../models/responseModel';
import { DataSourceModel } from '../../../models/dataSourceModel';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FilterModel } from 'src/models/filterModel';
@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: [ './map.component.css' ]
})
export class MapComponent implements OnInit {
	@Output() load: EventEmitter<boolean> = new EventEmitter<boolean>();
	@ViewChild(LeafletDirective) leafletDirective: LeafletDirective;
	fitBounds: any;
	displayMap: boolean;
	geojson: any;
	options: any;
	layers: Layer[];

	displayName: string;
	displayId: string;
	displayValue: string;

	preserveName: string;
	preserveId: string;
	preserveValue: string;

	grades: number[];
	values: ResponseModel[];
	compareValues: ResponseModel[];
	errorMessage: string;
	successMessage: string;
	mapId: string;
	state: DataSourceModel;
	filterValue: FilterModel;
	constructor(private zone: NgZone, private allService: DashboardService, private _snackBar: MatSnackBar) {}

	ngOnInit(): void {
		this.load.emit(true);
		this.displayMap = false;
		this.displayName = 'Government Of Assam, India';
		this.options = {
			zoom: 8,
			center: latLng(92, 24)
		};
		this.layers = [];
		this.mapId = '1';
		this.displayId = '1';
		this.setView(this.mapId);
		this.preserveName = 'Assam';
		this.preserveId = '1';
		this.preserveValue = null;
		this.grades = [ 0, 30, 40, 50, 60, 70, 80, 90 ];
	}
	getDataAndSetView(
		mapId: string,
		compareScId: string,
		timeS: string,
		timeE: string,
		catId: string,
		subCatId: string,
		districtId?: string,
		blockId?: string
	): void {
		this.load.emit(true);
		if (districtId && blockId) {
			this.allService.fetchValuesMapViewThree(timeS, timeE, catId, subCatId, districtId, blockId).subscribe(
				(response) => {
					this.allService
						.fetchValuesMapViewThree(timeS, timeE, catId, compareScId, districtId, blockId)
						.subscribe(
							(compareResponse) => {
								this.values = response;
								this.compareValues = compareResponse;
								this.setView(mapId);
							},
							(error) => this.triggerError(JSON.stringify(error))
						);
				},
				(error) => console.log(error)
			);
		} else if (districtId) {
			this.allService.fetchValuesMapViewTwo(timeS, timeE, catId, subCatId, districtId).subscribe(
				(response) => {
					this.allService.fetchValuesMapViewTwo(timeS, timeE, catId, compareScId, districtId).subscribe(
						(compareResponse) => {
							this.values = response;
							this.compareValues = compareResponse;
							this.setView(mapId);
						},
						(error) => this.triggerError(JSON.stringify(error))
					);
				},
				(error) => this.triggerError(JSON.stringify(error))
			);
		} else {
			this.allService.fetchValuesMapViewOne(timeS, timeE, catId, subCatId).subscribe(
				(response) => {
					this.allService.fetchValuesMapViewOne(timeS, timeE, catId, compareScId).subscribe(
						(compareResponse) => {
							this.values = response;
							this.compareValues = compareResponse;
							this.setView(mapId);
						},
						(error) => this.triggerError(JSON.stringify(error))
					);
				},
				(error) => this.triggerError(JSON.stringify(error))
			);
		}
	}
	setView(mapId: string): void {
		this.allService.fetchGeoJSON(mapId).subscribe(
			(response) => {
				this.geojson = geoJSON(response as any, {
					style: (feature) => this.mapStyle(feature),
					onEachFeature: (feature, layer: any) => this.layerEvents(feature, layer)
				}).bindTooltip((layer: Layer) => {
					return (
						layer['feature']['properties']['GP_NAME'] ||
						layer['feature']['properties']['BLOCK_NAME'] ||
						layer['feature']['properties']['DIST_NAME']
					);
				});
				this.displayMap = true;
				this.layers = []; //check this
				this.layers.push(this.geojson);
				if (this.leafletDirective) this.leafletDirective.getMap().fitBounds(this.geojson.getBounds());
			},
			() => this.triggerError('Map not found'),
			() => this.load.emit(false)
		);
	}
	searchValue(obj: Object) {
		let t = obj['type'];
		this.mapId = obj['map_id'];
		this.displayValue = null;
		if(t==='0'){
			this.displayId = obj['ID'];
			this.displayName = obj['NAME'];
		}
		if (t === '1') {
			this.displayId = obj['DIST_ID'];
			this.displayName = obj['DIST_NAME'];
		}
		if (t === '2' || t === '3') {
			this.displayId = obj['BLOCK_ID'];
			this.displayName = obj['BLOCK_NAME'];
		}
		this.preserveId = this.displayId;
		this.preserveName = this.displayName;
		if (this.filterValue) {
			this.applyFilter(this.filterValue);
		} else {
			this.load.emit(true);
			this.setView(this.mapId);
		}
	}
	applyFilter(fValues: FilterModel) {
		this.filterValue = fValues;
		let arr = this.mapId.split('.');
		if (this.mapId === '1') {
			this.getDataAndSetView(
				this.mapId,
				this.filterValue.compareSubCategory,
				this.filterValue.timeS,
				this.filterValue.timeE,
				this.filterValue.selectedCategory,
				this.filterValue.selectedSubCategory
			);
		} else if (arr.length === 1 && this.mapId !== '1') {
			this.getDataAndSetView(
				this.mapId,
				this.filterValue.compareSubCategory,
				this.filterValue.timeS,
				this.filterValue.timeE,
				this.filterValue.selectedCategory,
				this.filterValue.selectedSubCategory,
				arr[0]
			);
		} else {
			this.getDataAndSetView(
				this.mapId,
				this.filterValue.compareSubCategory,
				this.filterValue.timeS,
				this.filterValue.timeE,
				this.filterValue.selectedCategory,
				this.filterValue.selectedSubCategory,
				arr[0],
				arr[1]
			);
		}
	}
	mapStyle(feature) {
		if (this.filterValue) {
			return {
				fillColor: this.getColor(this.getValue(feature)),
				weight: 2,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.7
			};
		} else {
			return {
				fillColor: '#555',
				weight: 2,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.7
			};
		}
	}
	getType(feature): number {
		let isDistrict = feature.properties['DIST_ID'] && !feature.properties['BLOCK_ID'];
		let isBlock = feature.properties['BLOCK_ID'] && !feature.properties['GP_ID'];
		let isGp = feature.properties['GP_ID'];
		if (isDistrict) return 1;
		else if (isBlock) return 2;
		else if (isGp) return 3;
		else return -3;
	}
	getValue(feature): number {
		const type = this.getType(feature);
		let obj1 = null;
		let obj2 = null;
		
		if (type === 3) {
			obj1 = this.values.find((e) => e.id === feature.properties['GP_ID']);
			obj2 = this.compareValues.find((e) => e.id === feature.properties['GP_ID']);
		} else if (type === 2) {
			obj1 = this.values.find((e) => e.id === feature.properties['BLOCK_ID']);
			obj2 = this.compareValues.find((e) => e.id === feature.properties['BLOCK_ID']);
		} else if (type === 1) {
			obj1 = this.values.find((e) => e.id === feature.properties['DIST_ID']);
			obj2 = this.compareValues.find((e) => e.id === feature.properties['DIST_ID']);
		}
		if (obj1 && obj2) {	
			return this.checkValue(obj1.value, obj2.value);
		}
		return 0;
	}
	checkValue(value1: number, value2: number): number {
		if (value1 && value2) {
			if (value2 != 0) {
				return Math.round(value1 / value2 *100);
			} else if (value2 === 0) {
				this.triggerError('Zero value for comparison: Undetermined value');
				return -0.01;
			}
		} else {
			this.triggerError('Cannot determine Value: ID mismatch or ID not found');
			return -0.02;
		}
	}
	layerEvents(feature, layer) {
		layer.on('mouseover', () => {
			this.zone.run(() => {
				layer.setStyle({
					weight: 5,
					color: '#666',
					dashArray: '3',
					fillOpacity: 0.7
				});
				layer.bringToFront();
				const type = this.getType(feature);
				if (type == 1) {
					this.displayName = feature.properties['DIST_NAME'];
					this.displayId = feature.properties['DIST_ID'];
				} else if (type == 2) {
					this.displayName = feature.properties['BLOCK_NAME'];
					this.displayId = feature.properties['BLOCK_ID'];
				} else if (type == 3) {
					this.displayName = feature.properties['GP_NAME'];
					this.displayId = feature.properties['GP_ID'];
				} else {
					console.log('i am hit');
					this.triggerError('Cannot determine type: ID mismatch');
				}
				if (this.filterValue) this.displayValue = this.getValue(feature).toString() || '';
			});
		});
		layer.on('mouseout', () => {
			this.zone.run(() => {
				this.geojson.resetStyle();
				this.displayName = this.preserveName;
				this.displayId = this.preserveId;
				this.displayValue = this.preserveValue;
			});
		});
		layer.on('click', () => {
			this.zone.run(() => {
				this.leafletDirective.getMap().fitBounds(layer.getBounds());
				const type = this.getType(feature);
				this.preserveName = this.displayName;
				this.preserveId = this.displayId;
				this.preserveValue = this.displayValue;
				if (type === -3) {
					this.triggerError('Cannot determine type: ID mismatch');
				} else if (type === 2) {
					let id = `${feature.properties['DIST_ID']}.${feature.properties['BLOCK_ID']}`;
					this.mapId = id;
					if (this.filterValue) {
						this.getDataAndSetView(
							this.mapId,
							this.filterValue.compareSubCategory,
							this.filterValue.timeS,
							this.filterValue.timeE,
							this.filterValue.selectedCategory,
							this.filterValue.selectedSubCategory,
							feature.properties['DIST_ID'],
							feature.properties['BLOCK_ID']
						);
					} else {
						this.setView(this.mapId);
					}
				} else if (type === 1) {
					let id = `${feature.properties['DIST_ID']}`;
					this.mapId = id;
					if (this.filterValue) {
						this.getDataAndSetView(
							this.mapId,
							this.filterValue.compareSubCategory,
							this.filterValue.timeS,
							this.filterValue.timeE,
							this.filterValue.selectedCategory,
							this.filterValue.selectedSubCategory,
							feature.properties['DIST_ID']
						);
					} else {
						this.setView(this.mapId);
					}
				}
			});
		});
		
	}

	onMapReady(map: Map) {
		map.fitBounds(this.geojson.getBounds(), {
			padding: point(24, 24),
			maxZoom: 12,
			animate: true
		});
	}
	getColor(d: number): string {
		return d > 90
			? '#800026'
			: d > 80
				? '#BD0026'
				: d > 70
					? '#E31A1C'
					: d > 60
						? '#FC4E2A'
						: d > 50
							? '#FD8D3C'
							: d > 40
								? '#FEB24C'
								: d > 30 ? '#FED976' : d >= 0 ? '#FFEDA0' : d == -1 ? '#2b2a2a' : d == -2 ? '#0d0561' : '#FFF';
	}
	openSnackBar(message: string, action: string) {
		this._snackBar.open(message, action, {
			duration: 5000
		});
	}
	triggerSuccess(message: string): void {
		this.successMessage = message;
		this.openSnackBar(this.successMessage, 'Done');
	}
	triggerError(message: string): void {
		this.errorMessage = message;
		this.openSnackBar(this.errorMessage, 'X');
	}
}
