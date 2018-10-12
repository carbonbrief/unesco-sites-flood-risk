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
    center: [15.5, 39],
    zoom: 3.7,
    maxZoom: 8
});

// ADD DATA LAYER

var filterRCP = ['==', ['string', ['get', 'scenario']], 'RCP2.6'];
var filterYear = ['==', ['number', ['get', 'year']], 2050];

map.on('load', function() {

    map.addLayer({
        id: 'operating',
        type: 'circle',
        source: {
          type: 'geojson',
          data: './data/sites.geojson'
        },
        paint: {
            'circle-radius': 6,
            'circle-color': {
                property: 'index',
                type: 'exponential', // base defaults to 1
                stops: [
                    [0, '#FFFFD9'],
                    [1, '#F6FBC5'],
                    [2, '#EDF8B1'],
                    [3, '#DAF0B2'],
                    [4, '#C7E9B4'],
                    [5, '#7FCDBB'],
                    [6, '#41B6C4'],
                    [7, '#1D91C0'],
                    [8, '#225EA8'],
                    [9, '#253494'],
                    [10, '#081D58']
                ]
            },
            'circle-opacity': 1,
            'circle-stroke-color': '#999999',
            'circle-stroke-width': 0.8,
            'circle-stroke-opacity': 0.9
        },
        'filter': ['all', filterYear, filterRCP]    // filter for start and end year AND make sure that start year is less than 2018 (filterYear5)
    });

});