var carte= L.map('Map').setView([51.505,-0.09],5);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom:3,
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(carte);



        function makeSPARQLQuery( endpointUrl, sparqlQuery, doneCallback ) {
    var settings = {
        headers: { Accept: 'application/sparql-results+json' },
        data: { query: sparqlQuery_second }
    };
    return $.ajax( endpointUrl, settings ).then( doneCallback );
}


var endpointUrl = 'https://query.wikidata.org/sparql',

    sparqlQuery_second = "#defaultView:BubbleChart\n" +
    " SELECT distinct ?item ?itemLabel ?pic ?location ?phoneNumber ?website\n"+
      "  WHERE \n"+
        "{ \n"+
          " ?item wdt:P31 wd:Q207694.\n" +
          "?item wdt:P18 ?pic .\n"+
          "?item wdt:P625 ?location .\n"+ 
          "?item wdt:P1329 ?phoneNumber .\n"+
          "?item wdt:P856 ?website \n"+
         "SERVICE wikibase:label { bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],en\" }\n"+
        "}";


        sparqlQuery_wax = "#defaultView:BubbleChart\n" +
        "SELECT distinct ?item ?itemLabel ?pic ?location  ?website \n"+
        "WHERE \n"+ 
        "{ \n" +
        " ?item wdt:P31 wd:Q667018. \n"+
          "?item wdt:P18 ?pic . \n"+
          "?item wdt:P625 ?location . \n"+ 
          "?item wdt:P856 ?website \n"+
         "SERVICE wikibase:label { bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],en\"} \n"+
        "}"


    sparqlQuery_history="#defaultView:BubbleChart \n" + 
    "SELECT distinct ?item ?itemLabel ?pic ?location ?phoneNumber ?website\n"+
    "WHERE \n" +
    "{\n"+
       "?item wdt:P31 wd:Q16735822.\n"+
      "?item wdt:P18 ?pic .\n"+
      "?item wdt:P625 ?location .\n" + 
      "?item wdt:P1329 ?phoneNumber .\n"+
      "?item wdt:P856 ?website \n"+
     "SERVICE wikibase:label { bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],en\"  } \n"+
    "}"

    sparqlQuery_science =`SELECT distinct ?item ?itemLabel ?pic ?location  ?website
    WHERE 
    {
      ?item wdt:P31 wd:Q588140.
      ?item wdt:P18 ?pic .
      ?item wdt:P625 ?location .
      
      ?item wdt:P856 ?website 
     SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en"  } 
    }`;


    sparqlQuery_sport = `SELECT distinct ?item ?itemLabel ?pic ?location  ?website
    WHERE 
    {
      ?item wdt:P31 wd:Q17000324.
      ?item wdt:P18 ?pic .
      ?item wdt:P625 ?location .
      
      ?item wdt:P856 ?website 
     SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en"  } 
    }`;


makeSPARQLQuery( endpointUrl, sparqlQuery_second, function( data ) {
        //$( 'body' ).append( $( '<pre>' ).text( JSON.stringify( data ) ) );
        console.log( data );
        debut(data);
    }
);
//Marqueur de test
 
var marqueurs = L.markerClusterGroup();
        function debut(data){
           
            var tabMarqueurs = [];

            

        const result = data.results.bindings.map(place => (
        {
            type: place.item.value,
            phone: place.phoneNumber.value,
            website: place.website.value,
            pic: place.pic.value,
            location: place.location.value,
            label: place.itemLabel.value
        }
        )).filter((place, index, self) => self.findIndex(p => p.label === place.label) === index);


            



       for (let i = 0; i < result.length ; i++)
            {
              var point = result[i].location
    
              var start = point.indexOf('(')+1;
              var middle1 = point.indexOf(' ')-1;
              var middle2 = point.indexOf(' ')+1;
              var end = point.indexOf(')');
              var lat = point.substring(middle2, end);
              var lon = point.substring(start, middle1);

              var markerPoint = L.marker([lat, lon],{icon : icone})
              marqueurs.addLayer(markerPoint);

              tabMarqueurs.push(markerPoint)

              markerPoint.bindPopup("<h3>"+ result[i].label + 
                '</h3><br><img class="popupimg" src="' + result[i].pic +'"><br>'+
                "<p>"+result[i].phone+"</p>"+
                '<a href=">' + result[i].website + '"target="_blank">Lien du site</a>'
                );
           }
           
           var group = new L.featureGroup(tabMarqueurs);
           carte.fitBounds(group.getBounds());

           carte.addLayer(marqueurs);
           console.log(e)
           

           
};
     

     
