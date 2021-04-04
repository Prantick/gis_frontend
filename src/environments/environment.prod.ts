const HOSTNAME: string = 'localhost';
const PORT_NUMBER: number = 5000;
const APPLICATION_NAME: string = 'gis-server';
export const environment = {
  production: true,
  getCategoryAPIUrl: `http://${HOSTNAME}:${PORT_NUMBER}/${APPLICATION_NAME}/api/category`,
  getValuesAPIUrl:`http://${HOSTNAME}:${PORT_NUMBER}/${APPLICATION_NAME}/api/getValues`,
  getTimelineAPIUrl:`http://${HOSTNAME}:${PORT_NUMBER}/${APPLICATION_NAME}/api/getTimeline`
};
