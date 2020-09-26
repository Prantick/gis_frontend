// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const HOSTNAME: string = '192.168.29.65';
const PORT_NUMBER: number = 5000;
const APPLICATION_NAME: string = 'gis-server';
export const environment = {
	production: false,
  getCategoryAPIUrl: `http://${HOSTNAME}:${PORT_NUMBER}/${APPLICATION_NAME}/api/category`,
  getValuesAPIUrl:`http://${HOSTNAME}:${PORT_NUMBER}/${APPLICATION_NAME}/api/getValues`,
  getTimelineAPIUrl:`http://${HOSTNAME}:${PORT_NUMBER}/${APPLICATION_NAME}/api/getTimeline`
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
