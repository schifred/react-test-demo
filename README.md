# react-openlayers

地图渲染。

## ✨ Features

- 瓦片图
- 矢量图
- 覆盖物
- 标记
- WKT、GeoJson
- 绘图

## 📦 Install

```
npm i react-openlayers --save
```

## 🔨 Usage

```
import React, { Fragment } from 'react';
import { Map, TileLayer, latLng } from 'react-openlayers';

const ACCESS_TOKEN =
  'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
const MB_ATTR =
  'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
  'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
const MB_URL =
  'https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token=' + ACCESS_TOKEN;

export default () => {
  return (
    <Fragment>
      <Map center={latLng(37.77396, -122.4366)} zoom={13} style={{ width: '100%', height: 400 }}>
        <TileLayer url={MB_URL} attribution={MB_ATTR} id="light-v9" />
      </Map>
    </Fragment>
  );
};
```

## 🖥 Development

```
$ git clone https://github.com/Alfred-sg/react-openlayers
$ npm install
$ npm run docs
```

打开浏览器访问 http://127.0.0.1:8000。

## 参考

- [leaflet](https://leafletjs.com)
- [leaflet.draw](https://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html)
- [react-leaflet](https://react-leaflet.js.org)
- [mapbox.js](https://docs.mapbox.com/mapbox.js)
- [wicket](https://github.com/arthur-e/Wicket)

## LICENSE

MIT
