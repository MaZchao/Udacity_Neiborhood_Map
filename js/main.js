/* global ko, google, document */

let map;

const markers = [];
// my fake datas
const locationData = [
  {
    title: '天府广场',
    location: { lat: 104.065837, lng: 30.657349 },
  },
  {
    title: '武侯祠',
    location: { lat: 104.047994, lng: 30.646094 },
  },
  {
    title: '四川大学',
    location: { lat: 104.083748, lng: 30.630869 },
  },
  {
    title: '杜甫草堂',
    location: { lat: 104.028553, lng: 30.660076 },
  },
  {
    title: '金沙遗址博物馆',
    location: { lat: 104.012659, lng: 30.681726 },
  },
];

/**
 * init google map
 */
function initMap() { // eslint-disable-line
  const chengdu = { lat: 104.065837, lng: 30.657349 };
  // create map
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: chengdu,
  });
  // create markers
  locationData.forEach((data) => {
    markers.push(new google.maps.Marker({
      position: data.location,
      map,
    }));
  });
}

/**
 * init knock out view modal
 */
class ViewModal {
  constructor() {
    this.filterInput = ko.observable(); // value of location filter input
  }
}

ko.applyBindings(new ViewModal());
