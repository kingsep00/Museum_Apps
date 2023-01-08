function debut(data){

    for (let i = 0; i < data.results.bindings.length ; i++)
    {

    var point = data["results"]["bindings"][i]["loc"]["value"];
        
        var start = point.indexOf('(')+1;
        var middle1 = point.indexOf(' ')-1;
        var middle2 = point.indexOf(' ')+1;
        var end = point.indexOf(')');
        var lat = point.substring(middle2, end);
        var lon = point.substring(start, middle1);

    var markerPoint = L.marker([lat, lon]).addTo(macarte);
    markerPoint.bindPopup(data["results"]["bindings"][i]["cityLabel"]["value"]);
    }
}