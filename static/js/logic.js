function createMap(earthQuakes) {

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: attribution,
      id: "mapbox.light",
      accessToken: API_KEY
    });
  
    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      "Light Map": lightmap
    };
  
    // Create an overlayMaps object to hold the earthQuakes layer
    var overlayMaps = {
      "Earthquakes": earthQuakes
    };
  
    // Create the map object with options
    var map = L.map("map", {
      center: [38.301151, -105.420235],
      zoom: 3.5,
      layers: [lightmap, earthQuakes]
    });
    
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(map);
  }
  
  function markerSize(mag) {
    return mag*25000;
  }
  
  function createMarkers(response) {
  
    // Pull the "quakess" property off of response.data
    var usgs_data = response.features;
  
    // Initialize an array to hold bike markers
    var quakeMarkers = [];
  
    // Loop through the usgs_data array
    for (var index = 0; index < usgs_data.length; index++) {
      var quakes = usgs_data[index];
    
    // Set Color scheme for quake size
    let color = "red";
      if (quakes.properties.mag > 4) {
        color = "yellow"; 
      }
      else if (quakes.properties.mag > 3) {
        color = "blue"; 
      }
      else if (quakes.properties.mag > 2) {
        color = "green"; 
      }

      // For each quakes, create a marker and bind a popup with the quakes's name
      var quakeMarker = L.circle([quakes.geometry.coordinates[1], quakes.geometry.coordinates[0]], {
        fillOpacity: 0.5,
        color: "white",
        fillColor: color,
        radius: markerSize(quakes.properties.mag)
      })
        .bindPopup("<h3>" + quakes.properties.place + "<h3>");
  
      // Add the marker to the bikeMarkers array
      quakeMarkers.push(quakeMarker);
    }
  
    // Create a layer group made from the bike markers array, pass it into the createMap function
    createMap(L.layerGroup(quakeMarkers));
  }
  
  
//   Perform an API call to the Citi Bike API to get quakes information. Call createMarkers when complete
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);
  