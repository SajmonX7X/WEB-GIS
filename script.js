require([
    'esri/Map',
    'esri/views/SceneView',
    'esri/layers/FeatureLayer',
    'esri/layers/GraphicsLayer',
    'esri/widgets/Legend',
    'esri/renderers/SimpleRenderer'
], (Map, SceneView,FeatureLayer,GraphicsLayer,Legend, SimpleRenderer, ColorVariable ) => {

    const map1 = new Map({
        basemap: "topo-vector" 
    });

    const f1 = new FeatureLayer({
        url: "https://services.arcgis.com/ue9rwulIoeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0"
    });

    const f2 = new FeatureLayer({
        url: "https://services.arcgis.com/ue9rwulIoeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0"
    });

    let gl = new GraphicsLayer();

    const view = new SceneView({
        map:map1,
        container:"mapDiv",
        zoom:5
    });

    map1.addMany([f2,gl]);

    const legend = new Legend({
        view: view
    });

    view.ui.add(legend, {position: "bottom-right"});

    let query = f1.createQuery();
    query.where = "MAGNITUDE > 4 ";
    query.outFields = ['*'];
    query.returnGeometry = true;

    f1.queryFeatures(query)
    .then(response => {
        console.log(response);
        getResults(response.features);
    })
    .catch(err => {
        console.log(err);
    });

    const getResults = (features) => {
        const symbol = {
            type: "simple-marker",
            color: "blue",
            size: 20
        };

        features.map(elem => {
            elem.symbol = symbol
        });

        gl.addMany(features);
    };

    const simpleRenderer = {
        type: 'simple',
        symbol: {
            type: "point-3d",
            symbolLayers:[
                {
                    type: "object",
                    resource: {
                        primitive: "cylinder"
                    },
                    width: 25000
                }
            ]
        },
        visualVariables: [
            {
                type: "color",
                field: "MAGNITUDE",
                stops: [{
                        value: 0.5,
                        color: "green"
                    },
                    {
                        value: 4.48,
                        color: "red"
                    }
                ]
            },
            {
                type: "size",
                field: "DEPTH",
                stops: [
                    {
                        value: -3.39,
                        size: 10000
                    },
                    {
                        value: 30.97,
                        size: 80000
                    }
                ]
            }
        ]
    };

    f2.renderer=simpleRenderer;
});