"use strict";

// Mocha
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};mocha.setup("bdd");

// Chai
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

// Vue Test Utils
var mount = vueTestUtils.mount;
var shallow = vueTestUtils.shallow;

// Vue Grid Example
// register the grid component
var DemoGrid = {
  template: "\n  <table>\n    <thead>\n      <tr>\n        <th v-for=\"key in columns\" @click=\"sortBy(key)\" :class=\"{ active: sortKey == key }\">\n          {{ key | capitalize }}\n          <span class=\"arrow\" :class=\"sortOrders[key] > 0 ? 'asc' : 'dsc'\">\n          </span>\n        </th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr v-for=\"entry in filteredData\">\n        <td v-for=\"key in columns\">\n          {{entry[key]}}\n        </td>\n      </tr>\n    </tbody>\n  </table>\n",



















  props: {
    data: Array,
    columns: Array,
    filterKey: String },

  data: function data() {
    var sortOrders = {};
    this.columns.forEach(function (key) {
      sortOrders[key] = 1;
    });
    return {
      sortKey: "",
      sortOrders: sortOrders };

  },
  computed: {
    filteredData: function filteredData() {
      var sortKey = this.sortKey;
      var filterKey = this.filterKey && this.filterKey.toLowerCase();
      var order = this.sortOrders[sortKey] || 1;
      var data = this.data;
      if (filterKey) {
        data = data.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return (
              String(row[key]).
              toLowerCase().
              indexOf(filterKey) > -1);

          });
        });
      }
      if (sortKey) {
        data = data.slice().sort(function (a, b) {
          a = a[sortKey];
          b = b[sortKey];
          return (a === b ? 0 : a > b ? 1 : -1) * order;
        });
      }
      return data;
    } },

  filters: {
    capitalize: function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    } },

  methods: {
    sortBy: function sortBy(key) {
      this.sortKey = key;
      this.sortOrders[key] = this.sortOrders[key] * -1;
    } } };


Vue.component("demo-grid", DemoGrid);

var demo = new Vue({
  el: "#demo",
  data: {
    searchQuery: "",
    gridColumns: ["name", "power"],
    gridData: [
    { name: "Chuck Norris", power: Infinity },
    { name: "Bruce Lee", power: 9000 },
    { name: "Jackie Chan", power: 7000 },
    { name: "Jet Li", power: 8000 }] } });




// Tests
describe("Chai Setup", function () {
  it("Chai Version: 2.3.0", function () {
    chai.version.should.equal("2.3.0");
  });
  it("chai.should()", function () {
    true.should.equal(true);
  });
  it("chai.expect", function () {
    expect(true).to.equal(true);
  });
  it("chai.assert", function () {
    assert.equal(true, true);
  });
});

describe("Vue Test Utils", function () {
  it("Vue.js Version: 2.5.13", function () {
    Vue.version.should.equal("2.5.13");
  });
  it("mount()", function () {
    (typeof mount === "undefined" ? "undefined" : _typeof(mount)).should.equal("function");
  });
  it("shallow()", function () {
    (typeof shallow === "undefined" ? "undefined" : _typeof(shallow)).should.equal("function");
  });
});

describe("Vue Demo Grid", function () {
  var wrapper = null;
  beforeEach(function () {
    var propsData = {
      data: [
      { name: "Chuck Norris", power: Infinity },
      { name: "Bruce Lee", power: 9000 },
      { name: "Jackie Chan", power: 7000 },
      { name: "Jet Li", power: 8000 }],

      columns: ["name", "power"],
      filterKey: "" };

    wrapper = shallow(DemoGrid, {
      propsData: propsData });

  });
  it("is vue component", function () {
    wrapper.isVueInstance().should.equal(true);
  });
  it("renders table node", function () {
    wrapper.
    find("table").
    is("table").
    should.equal(true);
  });
});

// Runner
mocha.checkLeaks();
mocha.run();