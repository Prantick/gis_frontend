import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { latLng, geoJSON, point, Map, Layer, Control, DomUtil } from 'leaflet';
import { LeafletDirective } from '@asymmetrik/ngx-leaflet';
import { DashboardService } from '../dashboard.service';
import { ResponseModel } from '../../../models/responseModel';
import { CategoryModel } from 'src/models/categoryModel';
import { SubCategoryModel } from 'src/models/subCategoryModel';
@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: [ './map.component.css' ]
})
export class MapComponent implements OnInit {
	@ViewChild(LeafletDirective) leafletDirective: LeafletDirective;
	fitBounds: any;
	displayMap: boolean;

	geojson: any;
	responses: ResponseModel[];

	currentResponse: ResponseModel;
	displayValues: number[][];

	options: any;
	layers: Layer[];

	displayName: string;
	timeRangeStart: number;
	timeRangeEnd: number;
	category: CategoryModel;
	subcategory: SubCategoryModel;
	selectedCategory: string;
	selectedSubCategory: string;

	quickInfo: string;

	constructor(private zone: NgZone, private getGeonService: DashboardService) {}

	ngOnInit(): void {
		this.displayMap = false;
		this.displayName = 'Government Of Assam, India';
		this.options = {
			zoom: 7,
			center: latLng(92, 24)
		};
		this.layers = [];
		this.responses = [];
		this.getDataAndSetView();
	}
	getDataAndSetView() {
		this.getGeonService.fetchGeoJSON().subscribe(
			(response: ResponseModel) => {
				this.responses.push(response);
				this.currentResponse = response;
				this.geojson = geoJSON(this.currentResponse.layerInfo.layer as any, {
					style: (feature) => this.mapStyle(feature),
					onEachFeature: (feature, layer: any) => this.layerEvents(feature, layer)
				});
				this.displayName = this.currentResponse.name;
				this.category = this.currentResponse.category;
				this.selectedCategory = this.currentResponse.selectedCategory;
				this.selectedSubCategory = this.currentResponse.selectedSubCategory;
				this.timeRangeEnd = this.currentResponse.timelineEnd;
				this.timeRangeStart = this.currentResponse.timelineStart;
				// this.mergeTimeLine();
				this.displayMap = true;
				// this.quickInfo = `Code:${response.id} Type:${response.type} Category:${response.category[
				// 	response.selectedCategory
				// ]} Subcategory:${response.subcategory[response.selectedCategory][
				// 	response.selectedSubCategory
				// ]} Timeline:${response.timelineStart}-${response.timelineStart}`;

				this.layers.push(this.geojson);
			},
			(error) => console.log(error)
		);
	}
	mergeTimeLine() {}
	mapStyle(feature) {
		//use feature to fetch id and use that id to fetch properties then set color
		return {
			fillColor: this.getColor(parseInt(feature.properties['PERIMETER']) / 1000),
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7
		};
	}
	layerEvents(feature, layer) {
		layer.on('mouseover', () => {
			this.zone.run(() => {
				layer.setStyle({
					weight: 5,
					color: '#666',
					dashArray: '',
					fillOpacity: 0.7
				});
				this.displayName = feature.properties['BLOCK_NAME'].toString();
				layer.bringToFront();
			});
		});
		layer.on('mouseout', () => {
			this.zone.run(() => {
				this.geojson.resetStyle();
				this.displayName = this.currentResponse.name;
			});
		});
		layer.on('click', () => {
			this.zone.run(() => {
				this.leafletDirective.getMap().fitBounds(layer.getBounds());
			});
		});
	}
	displayLegend(map) {
		this.zone.run(() => {
			const legend = new (Control.extend({
				options: { position: 'bottomright' }
			}))();
			const self = this;
			legend.onAdd = ()=>{
				let div = DomUtil.create('div');
				let grades = [ 0, 10, 20, 50, 100, 200, 500, 1000 ];
				for (var i = 0; i < grades.length; i++) {
					div.innerHTML +=
						'<div style="width: 18px; height: 18px; float: left; margin-right: 8px; opacity: 0.7; background:' +
						self.getColor(grades[i] + 1) +
						'"></div> ' +
						grades[i] +
						(grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
				}

				return div;
			};
			legend.addTo(map);
		});
	}
	onMapReady(map: Map) {
		map.fitBounds(this.geojson.getBounds(), {
			padding: point(24, 24),
			maxZoom: 12,
			animate: true
		});
		this.displayLegend(map);
	}
	getColor(d: number): string {
		return d > 1000
			? '#800026'
			: d > 500
				? '#BD0026'
				: d > 200
					? '#E31A1C'
					: d > 100 ? '#FC4E2A' : d > 50 ? '#FD8D3C' : d > 20 ? '#FEB24C' : d > 10 ? '#FED976' : '#FFEDA0';
	}
}
