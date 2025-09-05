import {polygon} from '@turf/turf';

export const RNM_ISRAEL_POLYGON = [
  {latitude: 31.4159371, longitude: 34.179993},
  {latitude: 30.4084454, longitude: 34.5375127},
  {latitude: 29.9041673, longitude: 34.7543693},
  {latitude: 29.6652335, longitude: 34.8309731},
  {latitude: 29.5560904, longitude: 34.8704995},
  {latitude: 29.4897335, longitude: 34.9008123},
  {latitude: 29.5303614, longitude: 34.976656},
  {latitude: 29.7494841, longitude: 35.0553198},
  {latitude: 30.1612612, longitude: 35.1790407},
  {latitude: 30.5850251, longitude: 35.2395876},
  {latitude: 30.9816023, longitude: 35.4327442},
  {latitude: 31.1278228, longitude: 35.47723},
  {latitude: 31.2669829, longitude: 35.4392391},
  {latitude: 31.4344305, longitude: 35.4933125},
  {latitude: 31.8133675, longitude: 35.5729754},
  {latitude: 32.3970664, longitude: 35.6122953},
  {latitude: 32.6301682, longitude: 35.6360865},
  {latitude: 32.7561244, longitude: 35.8040464},
  {latitude: 32.9076045, longitude: 35.9012818},
  {latitude: 33.3422077, longitude: 35.8225912},
  {latitude: 33.3323905, longitude: 35.6965542},
  {latitude: 33.2865965, longitude: 35.548519},
  {latitude: 33.1016756, longitude: 35.4946791},
  {latitude: 33.1257635, longitude: 35.0811803},
  {latitude: 32.9486574, longitude: 35.0568742},
  {latitude: 32.843148, longitude: 35.0334062},
  {latitude: 32.8419536, longitude: 34.9555323},
  {latitude: 32.7207934, longitude: 34.8896384},
  {latitude: 32.0956637, longitude: 34.6813488},
  {latitude: 31.6891933, longitude: 34.502306},
  {latitude: 31.4159371, longitude: 34.179993},
];

export const ISRAEL_POLYGON_GEOJSON = polygon([
  (() => {
    const ring = RNM_ISRAEL_POLYGON.map(p => [p.longitude, p.latitude]);
    const first = ring[0];
    const last = ring[ring.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) ring.push(first);
    return ring;
  })(),
]);
