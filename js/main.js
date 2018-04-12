/* global ko, google, document, mapStyle, locationData, getLocationDetail, wikiDetailUrl */

let map;

const markers = [];

// customize marker appearance
let normalMarkerImage;
let highlightMarkerImage;

let infoWindow;

/**
 * init google map
 */
function initMap() {
  // eslint-disable-line
  const chengdu = { lat: 104.065837, lng: 30.657349 };
  // create map
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: chengdu,
    styles: mapStyle,
  });
  normalMarkerImage = makeMarkerWithColor('62efff');
  highlightMarkerImage = makeMarkerWithColor('008ba3');
  // create infowindow
  infoWindow = new google.maps.InfoWindow();

  // clean infowindow on close
  infoWindow.addListener('closeclick', () => {
    infoWindow.marker.setIcon(normalMarkerImage);
    infoWindow.marker = null;
  });

  // create bounds
  const bounds = new google.maps.LatLngBounds();

  // add marker shadow
  const pinShadow = new google.maps.MarkerImage(
    'http://chart.apis.google.com/chart?chst=d_map_pin_shadow',
    new google.maps.Size(40, 37),
    new google.maps.Point(0, 0),
    new google.maps.Point(12, 35),
  );

  // create markers
  locationData.forEach((data, index) => {
    const marker = new google.maps.Marker({
      position: data.location,
      map,
      title: data.wikiKeyword,
      animation: google.maps.Animation.DROP,
      id: index,
      icon: normalMarkerImage,
      shadow: pinShadow,
    });
    bounds.extend(marker.position);
    // click marker to open info window.
    marker.addListener('click', () => {
      populateInfoWindow(marker);
    });
    markers.push(marker);
  });

  map.fitBounds(bounds);
}

/**
 * get marker icon with given color
 * @param {String} color color string (no '#')
 */
function makeMarkerWithColor(color) {
  const pinImage = new google.maps.MarkerImage(
    `http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${color}`,
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
  );
  return pinImage;
}

/**
 * Show the info window after clicking a marker
 * @param {*} marker marker being clicked
 * @param {*} infoWindow info window instance
 */
function populateInfoWindow(marker) {
  if (infoWindow.marker !== marker) {
    // if clicked on a new marker
    if (infoWindow.marker) {
      infoWindow.marker.setIcon(normalMarkerImage);
    }
    infoWindow.marker = marker; // eslint-disable-line
    marker.setIcon(highlightMarkerImage);
    // show loading indicator
    infoWindow.setContent('<div class="infowindow-wrapper"><div class="loading"></div></div>');
    infoWindow.open(map, marker);
    // get location detail from wiki api
    getLocationDetail(marker.title)
      .then(res => res.json())
      .then((data) => {
        const detail = data.query.search[0];
        infoWindow.setContent(`<div class="infowindow-wrapper"><div>${detail.snippet} ... <a class="infowindow-detail-link" target="_blank" href="${wikiDetailUrl}${
          detail.pageid
        }">more</a></div></div>`);
      }).catch(() => {
        // fetch error handle
        infoWindow.setContent('<div class="infowindow.wrapper"><p style="text-align: center;">Connection error.</p><p>Please check yout internet connection and try again.</p></div>');
      });
  } else {
    // if clicked on a marker that's already open
    google.maps.event.trigger(infoWindow, 'closeclick');
    infoWindow.close();
  }
}

/**
 * init knock out view modal
 */
class ViewModal {
  constructor() {
    this.filterInput = ko.observable(); // value of location filter input
    this.listItems = ko.observableArray(locationData.slice());
  }

  // User filter input event
  onFilterChanged() {
    // Assign a new array based on the filter.
    this.listItems.removeAll();
    const bounds = new google.maps.LatLngBounds();
    locationData.forEach((location, index) => {
      // get the marker related to this location
      const marker = markers[index];
      if (location.title.includes(this.filterInput())) {
        // If the filter matches this location
        this.listItems.push(location);
        // set the specific marker to show
        marker.setMap(map);
        bounds.extend(marker.position);
      } else {
        // hide the marker
        marker.setMap(null);
      }
    });
    // replace the map so that all filtered markers are shown.
    map.fitBounds(bounds);
  }

  onItemClicked(title) {
    const markerFinder = m => m.title === title;
    const marker = markers.find(markerFinder);
    google.maps.event.trigger(marker, 'click');
  }
}

const viewModal = new ViewModal();

ko.applyBindings(viewModal);
