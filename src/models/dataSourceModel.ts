import { ResponseModel } from './responseModel';
import { FilterModel } from './filterModel';
export class DataSourceModel {
	preserveName: string;
	geoJson: any;
	values: ResponseModel[];
	compareValues: ResponseModel[];
	mapId: string;
	filterValues: FilterModel;
}
