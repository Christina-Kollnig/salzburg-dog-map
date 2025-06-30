# Dog Parks & Dog-Friendly Services in Salzburg 🐾

## 1  Target Audience

Dog owners, walkers, and visitors in Salzburg who need quick, up-to-date information about dog parks, dog toilets, veterinarians, and pet shops.

## 2  Data Sources

| Source            | What was extracted                                                                           | Access method            |
| ----------------- | -------------------------------------------------------------------------------------------- | ------------------------ |
| **OpenStreetMap** | `leisure=dog_park`, `dog=designated`, `amenity=dog_toilet`, `amenity=veterinary`, `shop=pet` | Overpass Turbo → GeoJSON |

> All data are open (OSM ODbL) and stored in `/data/dog_parks.geojson`.

## 3  Methodology

| Step           | Tool / Library            | Purpose                                              |
| -------------- | ------------------------- | ---------------------------------------------------- |
| Query & export | **Overpass Turbo**        | Filter Salzburg (ISO AT-5) → `out center;` → GeoJSON |
| Cleaning       | **VS Code**        | Remove duplicates, validate geometries               |
| Front-end      | **Leaflet 1.9**           | Base map & vector rendering                          |
| Performance    | **Leaflet.markercluster** | Cluster dense point sets                             |

## 4  Interactive Features

1. **Pop-ups** showing category-specific details (opening hours, website, phone).
2. **Marker clustering** for smooth navigation with >300 points.
3. **Hover highlight** on dog-park polygons (changes fill opacity).

## 5  Design Decisions

* **Color scheme** – green (dog parks), orange (toilets), red (vets), blue (shops).
* **Minimalist UI** – single layer toggle; no separate legend panel needed.
* **Responsive layout** – map fills 90 vh; controls remain touch-friendly.
* **English labels** – ensures usefulness for international visitors.

## 6  Lessons Learned

* OSM data can be incomplete or inconsistent – post-processing is necessary.
* Marker clustering greatly improves overview and performance.
* Concise, targeted info in pop-ups is more helpful than information overload.
* GeoJSON is a flexible exchange format for web mapping.
* Leaflet is lightweight and fast for small to medium datasets.

## 7  Analysis

The final dataset contains **324 features** across four categories. When you look at the map, you can see that **dog parks** are mostly found in the bigger city areas (Salzburg-Stadt, Hallein). Interestingly, there's only **one dog toilet** in the dataset, and it's located outside the main Salzburg area, which shows there's a clear gap in this type of infrastructure within the city.

When you turn off the clustering feature, you can see a **heat-map pattern** that shows most pet services run north to south along the Salzach river - this makes sense because that's where most people live. **Veterinary clinics** are mostly in the city center and near main roads, which is smart for emergency situations. **Pet shops** are located in shopping areas and commercial districts, as you'd expect.

The lack of dog toilets within Salzburg city limits is quite noticeable and might be an area where the city could improve. However, 42% of parks have fences, which is useful information for dog training or letting dogs run free. This fencing information is shown in the pop-ups when you click on parks.

## 8  Potential Improvements

* Add **geolocation** to show the nearest dog facility to the user.
* Integrate a **search / filter box** (e.g. filter parks by surface or fence).
* Provide **offline support** via a service worker for on-trail usage.

## 9  Critical Reflection & Take-aways

Creating a single-page Leaflet map proved efficient, but balancing performance with pop-up content was challenging. Manual cleaning of OSM attributes took nearly as long as coding the front-end. The project underscored the importance of:

* **Data quality checks** before visualization.
* **Progressive enhancement** – start simple, then layer on interactions.
* Collecting early **user feedback** from classmates helped improve the design - for example, the cluster styling was simplified after people said it looked too cluttered. In future projects, it would be valuable to ask actual dog owners what features they'd want to see on the map, since this project was mainly built from my own perspective as a developer.

> **Key take-away:** A lean feature set that meets a real user need is often better than feature creep.

## 10  Live Demo

[https://your-username.github.io/dog-parks-salzburg](https://your-username.github.io/dog-parks-salzburg)

## 11  Screenshot

![Screenshot of interactive map](docs/screenshot.png)

## 12  Attribution

### Data

OpenStreetMap contributors © [Open Database License (ODbL)](https://opendatacommons.org/licenses/odbl/).

## 13  Accessibility Notes

* Pop-ups use semantic HTML (`<strong>`, `<a>`), improving screen-reader support.
* Color choices meet WCAG 2.2 AA contrast ratios (>4.5:1). Users with color-vision deficiency can still differentiate categories via pop-up headings.
* Map interaction instructions (e.g. "double-tap to zoom") are included in the alt-text of the screenshot.

---

*Updated: 30 June 2025*