require([
    'esri/Map',
    'esri/views/SceneView',
    'esri/layers/FeatureLayer',
    'esri/layers/GraphicsLayer',
    'esri/widgets/Legend'
], (Map, SceneView,FeatureLayer,GraphicsLayer,Legend) => {

    const map1 = new Map({
        basemap: "topo-vector" 
    });

    const f1 = new FeatureLayer({
        url: "https://services.arcgis.com/ue9rwulIoeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0"
    });

    let gl = new GraphicsLayer();

    const f2 = new FeatureLayer({
        url: "https://services.arcgis.com/ue9rwulIoeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0"
    })

    const view = new SceneView({
        map:map1,
        container:"mapDiv",
        zoom:5
    });

    map1.addMany([f1,f2,gl]);

    const legend = new Legend({
        view: view
    });

    view.ui.add(legend, {position: "bottom-right"});

    let query = f1.createQuery();
    query.where = "MAGNITUDE > '4' ";
    query.outFields = ['*'];
    query.returnGeometry = true;

    f1.queryFeatures(query)
    .then(response => {
        console.log(response);
        getResults(response.FID);
    })
    .catch(err => {
        console.log(err);
    });

    const getResults = (FID) => {
    const symbol = {
        type: "simple-marker",
        color: "blue",
        size: 7
    };

    FID.map(elem => {
    elem.symbol = symbol
    });

    gl.addMany(FID);
    }
});