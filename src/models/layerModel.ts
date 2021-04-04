import { Layer } from 'leaflet';

export interface LeafletLayersModel {
	enabled: boolean;
	layer: Layer;
}