import { LeafletLayersModel } from './layerModel';
import { CategoryModel } from './categoryModel';
import { SubCategoryModel } from './subCategoryModel';
export class ResponseModel {
	id: string;
	type: string;
	name: string;
	quickInfo: string;
	layerInfo: LeafletLayersModel;
	category: CategoryModel;
	subcategory: SubCategoryModel;
	selectedCategory?: string;
	selectedSubCategory?: string;
	timelineStart?: number;
	timelineEnd?: number;
	subLayerValues?: Map<string,number>;
}
