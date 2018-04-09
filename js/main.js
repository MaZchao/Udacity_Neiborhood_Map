/* global ko */

class ViewModal {
  constructor() {
    this.locationInput = ko.observable();
  }
}

ko.applyBindings(new ViewModal());
