import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare var mapboxgl: any

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, AfterViewInit {

  //Variables para las coordenadas de los mapas
  lat: number;
  lng: number;

  //Para poder acceder al parametro de la ruta tenemos que importar el servicio de rutas Activadas de Angular
  constructor(private router: ActivatedRoute) { }

  ngOnInit() {

    let geo: any = this.router.snapshot.paramMap.get('geo');

    geo = geo.substring(4); //Quitamos la primera parte de la url (geo:)
    geo = geo.split(',');//dividimos el resto de las coordenadas

    this.lat = Number(geo[0]);
    this.lng = Number(geo[1]);

    console.log(this.lat, this.lng);
  }

  //Despues que la vista se haya iniciado
  ngAfterViewInit() {
    mapboxgl.accessToken = 'pk.eyJ1IjoicmFuZ2VydmV0ZXJhbm8iLCJhIjoiY2t5c2p0cm10MG5mdjJ4czBzbDNtZWhneiJ9.1Yt-M7AVF6qpmGlUsG4S2Q';
    const map = new mapboxgl.Map({
      style: 'mapbox://styles/mapbox/light-v10',
      center: [this.lng, this.lat], //lng lat
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      container: 'mapa',
      antialias: true
    });

    map.on('load', () => {

      map.resize();

      new mapboxgl.Marker()
        .setLngLat([this.lng, this.lat])
        .addTo(map);

      // Insert the layer beneath any symbol layer.
      const layers = map.getStyle().layers;
      const labelLayerId = layers.find(
        (layer) => layer.type === 'symbol' && layer.layout['text-field']
      ).id;

      // The 'building' layer in the Mapbox Streets
      // vector tileset contains building height data
      // from OpenStreetMap.
      map.addLayer(
        {
          'id': 'add-3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 15,
          'paint': {
            'fill-extrusion-color': '#aaa',

            // Use an 'interpolate' expression to
            // add a smooth transition effect to
            // the buildings as the user zooms in.
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
          }
        },
        labelLayerId
      );
    });
  }

}
