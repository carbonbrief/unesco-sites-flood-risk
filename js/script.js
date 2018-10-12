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
    center: [15.5, 40],
    zoom: 3.7,
    maxZoom: 8
});

// ADD DATA LAYER

var filterRCP = ['==', ['string', ['get', 'scenario']], 'RCP2.6'];
var filterYear = ['==', ['number', ['get', 'year']], 2050];

map.on('load', function() {

    map.addLayer({
        id: 'sites',
        type: 'circle',
        source: {
          type: 'geojson',
          data: './data/sites.geojson'
        },
        paint: {
            'circle-radius': 6.5,
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

    document.getElementById('slider').addEventListener('input', function(e) {

        var year = parseInt(e.target.value);

        filterYear = ['==', ['number', ['get', 'year']], year];

        map.setFilter('sites', ['all', filterYear, filterRCP]);

        document.getElementById('active-year').innerText = year;

    });

    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mouseenter', 'sites', function(e) {

        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        var coordinates = e.features[0].geometry.coordinates.slice();
        var name = e.features[0].properties.name;
        var index = e.features[0].properties.index;
        var year = e.features[0].properties.year;
        var scenario = e.features[0].properties.scenario;


        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates)
            .setHTML('<h3 style = "color: #7fcdbb;">' + name 
            + '</h3><p><span class="label-title">Flooding risk index: </span>' + index 
            + '</p><p><span class="label-title">Year: </span>' + year 
            + '</p><p><span class="label-title">Scenario: </span>' + scenario + '</p>')
            .addTo(map);

    });

    // remove popups on mouseleave
    map.on('mouseleave', 'sites', function() {

        map.getCanvas().style.cursor = '';
        popup.remove();

    });

});