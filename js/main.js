/* global ko */

class ViewModal {
  constructor() {
    this.filterInput = ko.observable(); // value of location filter input
  }
}

ko.applyBindings(new ViewModal());
