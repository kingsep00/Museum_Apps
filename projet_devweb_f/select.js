var e = document.getElementById("type-select");
var value = e.value;

const el = e.addEventListener("change",function(){console.log(e.value);
    
    
    if(e.value == "wax-museum")
    {
        carte.eachLayer((layer) => {
            if(layer['_latlng']!=undefined)
                layer.remove();
        });

        carte.removeLayer(marqueurs);
        carte.removeLayer(marqueurs_s);
        carte.removeLayer(marqueurs_h);

makeSPARQLQuery_w( endpointUrl, sparqlQuery_wax, function( data_select_wax ) {
    //$( 'body' ).append( $( '<pre>' ).text( JSON.stringify( data ) ) );
    console.log(sparqlQuery_wax)
    console.log( data_select_wax);
    debut_select_wax(data_select_wax);
}
);
    }
    else if (e.value == "historical-museum")
    {
        carte.removeLayer(marqueurs);
        carte.removeLayer(marqueurs_s);
        
        carte.eachLayer((layer) => {
            if(layer['_latlng']!=undefined)
                layer.remove();
        });

        carte.addLayer(marqueurs_h);


    }
    else if (e.value == "art-museum"){
        carte.removeLayer(marqueurs);
        carte.removeLayer(marqueurs_h);
        carte.removeLayer(marqueurs_s);
        carte.eachLayer((layer) => {
            if(layer['_latlng']!=undefined)
                layer.remove();
        });

        carte.addLayer(marqueurs);
       
        
    }
    else if(e.value == "science-museum")
    {
        carte.removeLayer(marqueurs);
        carte.removeLayer(marqueurs_h);
        carte.eachLayer((layer) => {
            if(layer['_latlng']!=undefined)
                layer.remove();
        });

        carte.addLayer(marqueurs_s);

       



    }
    else if(e.value == "sport-museum")
    {
        carte.eachLayer((layer) => {
            if(layer['_latlng']!=undefined)
                layer.remove();
        });

        carte.removeLayer(marqueurs);
        carte.removeLayer(marqueurs_s);
        carte.removeLayer(marqueurs_h);
        
        
        makeSPARQLQuery_sp( endpointUrl, sparqlQuery_sport, function( data_select_sport ) {
            //$( 'body' ).append( $( '<pre>' ).text( JSON.stringify( data ) ) );
        
            debut_select_sport(data_select_sport);
        
        });
    }
    else //all museum
    {
        carte.eachLayer((layer) => {
            if(layer['_latlng']!=undefined)
                layer.remove();
        });

        carte.removeLayer(marqueurs);
        carte.removeLayer(marqueurs_s);
        carte.removeLayer(marqueurs_h);

        ///DISPLAY ALL

        //WAX ONES
        makeSPARQLQuery_w( endpointUrl, sparqlQuery_wax, function( data_select_wax ) {
            //$( 'body' ).append( $( '<pre>' ).text( JSON.stringify( data ) ) );
            console.log(sparqlQuery_wax)
            console.log( data_select_wax);
            debut_select_wax(data_select_wax);
        
        });

        //HISTORICAL ONES

        carte.addLayer(marqueurs_h);


        //ART ONES

        carte.addLayer(marqueurs);


        //SCIENCE ONES

        carte.addLayer(marqueurs_s);

        //SPORT ONES

        makeSPARQLQuery_sp( endpointUrl, sparqlQuery_sport, function( data_select_sport ) {
            //$( 'body' ).append( $( '<pre>' ).text( JSON.stringify( data ) ) );
        
            debut_select_sport(data_select_sport);
        
        });

    }
},false);


function makeSPARQLQuery_w( endpointUrl, sparqlQuery_wax, doneCallback ) {
    var settings = {
        headers: { Accept: 'application/sparql-results+json' },
        data: { query: sparqlQuery_wax }
    };
    return $.ajax( endpointUrl, settings ).then( doneCallback );
}

function makeSPARQLQuery_h( endpointUrl, sparqlQuery_history, doneCallback ) {
    var settings = {
        headers: { Accept: 'application/sparql-results+json' },
        data: { query: sparqlQuery_history }
    };
    return $.ajax( endpointUrl, settings ).then( doneCallback );
}

function makeSPARQLQuery_s( endpointUrl, sparqlQuery_science, doneCallback ) {
    var settings = {
        headers: { Accept: 'application/sparql-results+json' },
        data: { query: sparqlQuery_science }
    };
    return $.ajax( endpointUrl, settings ).then( doneCallback );
}

function debut_select_wax(data_select_wax){

     var marqueurs_to_delete = [];
     

 const result_w = data_select_wax.results.bindings.map(place => (
 {
     type: place.item.value,
     website: place.website.value,
     pic: place.pic.value,
     location: place.location.value,
     label: place.itemLabel.value
 }
 )).filter((place, index, self) => self.findIndex(p => p.label === place.label) === index);


for (let i = 0; i < result_w.length ; i++)
     {
       var point = result_w[i].location

       var start = point.indexOf('(')+1;
       var middle1 = point.indexOf(' ')-1;
       var middle2 = point.indexOf(' ')+1;
       var end = point.indexOf(')');
       var lat = point.substring(middle2, end);
       var lon = point.substring(start, middle1);

       var markerPoint = L.marker([lat, lon],{icon : icone_wax}).addTo(carte);  
         marqueurs_to_delete.push(markerPoint);
       markerPoint.bindPopup("<h3>"+ result_w[i].label + 
         '</h3><br><img class="popupimg" src="' + result_w[i].pic +'"><br>'+
         '<a href=">' + result_w[i].website + '"target="_blank">Lien du site</a>'
         );
    }

    console.log(e)
    //carte.removeLayer(marqueurs)

    
};

makeSPARQLQuery_h( endpointUrl, sparqlQuery_history, function( data_select_history ) {
           
    console.log(sparqlQuery_history);
    console.log( data_select_history);
    debut_select_history(data_select_history);

});


makeSPARQLQuery_s( endpointUrl,  sparqlQuery_science, function( data_select_science ) {
           
    console.log(sparqlQuery_science);
    console.log( data_select_science);
    debut_select_science(data_select_science);

});




var marqueurs_s = L.markerClusterGroup();
        function debut_select_science(data_select_science){
            var tabMarqueurs = [];
            
            

            const result_h = data_select_science.results.bindings.map(place => (
            {
                type: place.item.value,
                website: place.website.value,
                pic: place.pic.value,
                location: place.location.value,
                label: place.itemLabel.value
            }
            )).filter((place, index, self) => self.findIndex(p => p.label === place.label) === index);
    
    
           for (let i = 0; i < result_h.length ; i++)
                {
                  var point = result_h[i].location
        
                  var start = point.indexOf('(')+1;
                  var middle1 = point.indexOf(' ')-1;
                  var middle2 = point.indexOf(' ')+1;
                  var end = point.indexOf(')');
                  var lat = point.substring(middle2, end);
                  var lon = point.substring(start, middle1);
    
                  var markerPoint = L.marker([lat, lon],{icon : icone_sci})
                 
                  marqueurs_s.addLayer(markerPoint);
    
                  tabMarqueurs.push(markerPoint)
    
                  markerPoint.bindPopup("<h3>"+ result_h[i].label + 
                    '</h3><br><img class="popupimg" src="' + result_h[i].pic +'"><br>'+
                    + '<a href=">' + result_h[i].website + '"target="_blank">Lien du site</a>'
                    );
               }
               
            var group_s = new L.featureGroup(tabMarqueurs);
               carte.fitBounds(group_s.getBounds());
             
    };


function makeSPARQLQuery_h( endpointUrl, sparqlQuery_history, doneCallback ) {
    var settings = {
        headers: { Accept: 'application/sparql-results+json' },
        data: { query: sparqlQuery_history }
    };
    return $.ajax( endpointUrl, settings ).then( doneCallback );
}


function makeSPARQLQuery_sp( endpointUrl, sparqlQuery_sport, doneCallback ) {
    var settings = {
        headers: { Accept: 'application/sparql-results+json' },
        data: { query: sparqlQuery_sport }
    };
    return $.ajax( endpointUrl, settings ).then( doneCallback );
}




        
var marqueurs_h = L.markerClusterGroup();
        function debut_select_history(data_select_history){
           
            var tabMarqueurs = [];
            
            

        const result_h = data_select_history.results.bindings.map(place => (
        {
            type: place.item.value,
            phone: place.phoneNumber.value,
            website: place.website.value,
            pic: place.pic.value,
            location: place.location.value,
            label: place.itemLabel.value
        }
        )).filter((place, index, self) => self.findIndex(p => p.label === place.label) === index);


       for (let i = 0; i < result_h.length ; i++)
            {
              var point = result_h[i].location
    
              var start = point.indexOf('(')+1;
              var middle1 = point.indexOf(' ')-1;
              var middle2 = point.indexOf(' ')+1;
              var end = point.indexOf(')');
              var lat = point.substring(middle2, end);
              var lon = point.substring(start, middle1);

              var markerPoint = L.marker([lat, lon],{icon : icone_hist})
             
              marqueurs_h.addLayer(markerPoint);

              tabMarqueurs.push(markerPoint)

              markerPoint.bindPopup("<h3>"+ result_h[i].label + 
                '</h3><br><img class="popupimg" src="' + result_h[i].pic +'"><br>'+
                '<p>phone number : '+result_h[i].phone+'</p>'+ 
                '<a href=">' + result_h[i].website + '"target="_blank">Lien du site</a>'
                );
           }
           
        var group_h = new L.featureGroup(tabMarqueurs);
           carte.fitBounds(group_h.getBounds());

};


function debut_select_sport(data_select_sport){
    //var marqueursW= new L.markerClusterGroup();
    
    // var tabMarqueurs_wax = [];
     var marqueurs_to_delete = [];
     

 const result_w = data_select_sport.results.bindings.map(place => (
 {
     type: place.item.value,
     website: place.website.value,
     pic: place.pic.value,
     location: place.location.value,
     label: place.itemLabel.value
 }
 )).filter((place, index, self) => self.findIndex(p => p.label === place.label) === index);


for (let i = 0; i < result_w.length ; i++)
     {
       var point = result_w[i].location

       var start = point.indexOf('(')+1;
       var middle1 = point.indexOf(' ')-1;
       var middle2 = point.indexOf(' ')+1;
       var end = point.indexOf(')');
       var lat = point.substring(middle2, end);
       var lon = point.substring(start, middle1);

       var markerPoint = L.marker([lat, lon],{icon : icone_spo}).addTo(carte);
       //marqueursW.addLayer(markerPoint);
         marqueurs_to_delete.push(markerPoint);
       //tabMarqueurs_wax.push(markerPoint)

      

       markerPoint.bindPopup("<h3>"+ result_w[i].label + 
         '</h3><br><img class="popupimg" src="' + result_w[i].pic +'"><br>'+
         '<a href=">' + result_w[i].website + '"target="_blank">Lien du site</a>'
         );
    }
    
    //var group_w = new L.featureGroup(tabMarqueurs_wax);
    //carte.fitBounds(group_w.getBounds());

    
    console.log(e)
    //carte.removeLayer(marqueurs)

    
};



