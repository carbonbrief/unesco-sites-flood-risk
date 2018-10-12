// ADD BASEMAP

var map = new mapboxgl.Map({
    container: 'map',
    style: {
        "version": 8,
        "sources": {
            "simple-tiles": {
                "type": "raster",
                // point to our third-party tiles. Note that some examples
                // show a "url" property. This only applies to tilesets with
                // corresponding TileJSON (such as mapbox tiles). 
                "tiles": [
                   "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                ],
                "tileSize": 256,
                attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
            }
        },
        "layers": [{
            "id": "simple-tiles",
            "type": "raster",
            "source": "simple-tiles",
            "minzoom": 0,
            "maxzoom": 22
        }]
    },
    center: [15, 40],
    zoom: 3.5,
    maxZoom: 8
});

// ADD DATA LAYER

// var filterRCP = ['==', ['string', ['get', 'scenario']], 'RCP2.6'];
// var filterYear = ['==', ['string', ['get', 'year']], '2000'];

map.on('load', function() {

    map.addLayer({
        id: 'operating',
        type: 'circle',
        source: {
          type: 'geojson',
          data: './data/sites.geojson'
        },
        paint: {
            'circle-radius': 8,
            'circle-color': {
                property: 'index',
                type: 'exponential', // base defaults to 1
                stops: [
                    [0, '#F0F73F'],
                    [1, '#F5DE3E'],
                    [2, '#FBC53D'],
                    [3, '#F9AD43'],
                    [4, '#F79649'],
                    [5, '#E66F5D'],
                    [6, '#CA4A78'],
                    [7, '#AA2D93'],
                    [8, '#802BA4'],
                    [9, '#4B269F'],
                    [10, '#0F1D85']
                ]
            },
            'circle-opacity': 0.7,
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 0.5,
            'circle-stroke-opacity': 0.8
        }
        //'filter': ['all', filterRCP, filterYear]    // filter for start and end year AND make sure that start year is less than 2018 (filterYear5)
    });

});