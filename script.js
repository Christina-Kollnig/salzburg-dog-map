// Initialize the Leaflet map and center it on Salzburg
const map = L.map("map").setView([47.8095, 13.0550], 11);

// Add the OpenStreetMap base layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

// Define the categories for our map features, including label and color
const categories = {
  dog_park : { label: "Dog Park",      color: "#39e639" },
  dog_wc   : { label: "Dog Toilet",    color: "#e67e22" },
  vet      : { label: "Veterinarian",  color: "#e74c3c" },
  pet_shop : { label: "Pet Shop",      color: "#3498db" }
};

// Prepare a marker cluster group for each category to keep the map tidy
const catLayers = {};
Object.keys(categories).forEach(k => {
  catLayers[k] = L.markerClusterGroup();
});

// Load the GeoJSON data and add each feature to the map
fetch("data/dog_parks.geojson")
  .then(r => r.json())
  .then(geo => {
    geo.features.forEach(f => {
      const p = f.properties || {};

      // Skip center points from Overpass (they have "@geometry": "center")
      if (p["@geometry"] === "center") return;

      // Figure out which category this feature belongs to
      let key = "dog_park";
      if (p.amenity === "dog_toilet")         key = "dog_wc";
      else if (p.amenity === "veterinary")    key = "vet";
      else if (p.shop    === "pet")           key = "pet_shop";
      else if (p.leisure === "dog_park")      key = "dog_park";

      const { color } = categories[key];
      let layer = null;

      // Handle different geometry types: Point, Polygon, MultiPolygon
      if (f.geometry && f.geometry.type === "Point") {
        // For points, create a colored marker
        const [lng, lat] = f.geometry.coordinates;
        const coords = [lat, lng];
        layer = L.marker(coords, {
          icon: L.divIcon({
            className: "dog-marker",
            html: `<div style="
                     width:14px;height:14px;
                     border-radius:50%;
                     background:${color};
                     border:1px solid #2c3e50;"></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7],
            popupAnchor: [0, -7]
          })
        });
      }
      else if (f.geometry && f.geometry.type === "Polygon") {
        // For polygons, draw the area with the category color
        const coords = f.geometry.coordinates[0].map(([lng, lat]) => [lat, lng]);
        layer = L.polygon(coords, {
          color, weight: 2, fillOpacity: 0.25
        });
      }
      else if (f.geometry && f.geometry.type === "MultiPolygon") {
        // For multipolygons, draw all areas
        const polys = f.geometry.coordinates.map(poly =>
          poly[0].map(([lng, lat]) => [lat, lng])
        );
        layer = L.polygon(polys, {
          color, weight: 2, fillOpacity: 0.25
        });
      }

      if (!layer) return;

      // Make polygons react visually when hovered (highlight effect)
      if (layer instanceof L.Polygon) {
        layer.on('mouseover', e => e.target.setStyle({ fillOpacity: 0.5 }));
        layer.on('mouseout',  e => e.target.setStyle({ fillOpacity: 0.25 }));
      }

      // Build the popup content with relevant info for each feature
      let popupHTML = "";

      // Always show the name (or fallback to the category label)
      const name = p.name || categories[key].label;
      popupHTML += `<strong>${name}</strong>`;

      // Add extra info depending on the category
      if (key === "dog_park") {
        if (p.surface)      popupHTML += `<br><strong>Surface:</strong> ${p.surface}`;
        // Only show fence info if it's not just a gate or entrance
        if (p.barrier && !["gate", "lift_gate", "entrance"].includes(p.barrier)) {
          popupHTML += `<br><strong>Fence:</strong> ${p.barrier}`;
          if (p.fence_type) popupHTML += `<br><strong>Fence type:</strong> ${p.fence_type}`;
          if (p.height)     popupHTML += `<br><strong>Fence height:</strong> ${p.height} m`;
        }
        if (p.operator)    popupHTML += `<br><strong>Operator:</strong> ${p.operator}`;
        if (p.wheelchair)  popupHTML += `<br><strong>Wheelchair accessible:</strong> ${p.wheelchair}`;
        if (p.opening_hours) popupHTML += `<br><strong>Opening hours:</strong> ${p.opening_hours}`;
        if (p.website)     popupHTML += `<br><a href="${p.website}" target="_blank">Website</a>`;
        if (p.phone)       popupHTML += `<br>Phone: ${p.phone}`;
        if (p.description) popupHTML += `<br>${p.description}`;
      } else if (key === "dog_wc") {
        if (p.name)        popupHTML += `<br>${p.name}`;
        if (p.description) popupHTML += `<br>${p.description}`;
      } else if (key === "vet") {
        if (p.name)        popupHTML += `<br>${p.name}`;
        if (p.operator)    popupHTML += `<br><strong>Operator:</strong> ${p.operator}`;
        if (p.opening_hours) popupHTML += `<br><strong>Opening hours:</strong> ${p.opening_hours}`;
        if (p.phone)       popupHTML += `<br>Phone: ${p.phone}`;
        if (p.website)     popupHTML += `<br><a href="${p.website}" target="_blank">Website</a>`;
        if (p.description) popupHTML += `<br>${p.description}`;
      } else if (key === "pet_shop") {
        if (p.name)        popupHTML += `<br>${p.name}`;
        if (p.opening_hours) popupHTML += `<br><strong>Opening hours:</strong> ${p.opening_hours}`;
        if (p.phone)       popupHTML += `<br>Phone: ${p.phone}`;
        if (p.website)     popupHTML += `<br><a href="${p.website}" target="_blank">Website</a>`;
        if (p.description) popupHTML += `<br>${p.description}`;
      }

      layer.bindPopup(popupHTML.trim());
      catLayers[key].addLayer(layer);
    });

    // Add all category layers to the map and build a custom legend for the layer control
    const overlays = {};
    Object.entries(categories).forEach(([k, cfg]) => {
      catLayers[k].addTo(map);
      const legendDot =
        `<span style="display:inline-block;width:12px;height:12px;
                      border-radius:50%;margin-right:6px;
                      background:${cfg.color};"></span>${cfg.label}`;
      overlays[legendDot] = catLayers[k];
    });

    // Show the layer control on the map (users can toggle categories)
    L.control.layers({}, overlays, { collapsed: false }).addTo(map);
  })
  .catch(err => console.error("Could not load GeoJSON:", err));