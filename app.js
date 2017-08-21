"use strict";

// Server API
function buildUrl () {
    return 'http://localhost:3000/api/v1';
}


// Show select attributes
Vue.component('listattributes', {
  props: ['elements', 'name'],
  template: `
    <p>
    <span>Choose {{ name }}</span>
    <select v-model="selected" v-on:click="setSelection">
      <option disabled value="">Please select one</option>
      <option v-for="el in elements">
        {{ el }}
      </option>
    </select>
  </p>
  `,
  data: function () {
      return {
          selected: ""
      };
  },
  methods: {
      setSelection: function () {
          this.$emit('selection', this.selected);
      }
  }
});

// Display the countries filtered by attributes
// NOTE using callingCode as id
Vue.component('countriesTable', {
  props: ['country'],
  template: `
        <li>
          {{ country.name.common }} ({{ country.name.official}})
          <a v-on:click="$emit('countrydetailed', country)">
            <span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span>
          </a>
        </li>
  `
});

// Display details of a country
Vue.component('countryInfo', {
  props: ['country'],
  template: `
  <div class="row">
  <div class="col-md-4">
  <h1>{{ country.name.common }}</h1>
  <h2>Names</h2>
  <div class="table-responsive">
      <table class="table table-bordered">
          <tbody>
              <tr>
                  <th>Common</th>
                  <td class="">{{ country.name.common }}</td>
              </tr>
              <tr>
                  <th>Official</th>
                  <td class="">{{ country.name.official }}</td>
              </tr>
          </tbody>
      </table>
  </div>

  <h2>Codes</h2>
  <div class="table-reponsive">
      <table class="table table-bordered"><tbody>
          <tr>
              <th>ISO 3166-1 alpha-2</th>
              <td class="">{{ country.cca2 }}</td>
          </tr>
          <tr>
              <th>ISO 3166-1 alpha-3</th>
              <td class="">{{ country.cca3 }}</td>
          </tr>
          <tr>
              <th>ISO 3166-1 numeric</th>
              <td class="">{{ country.ccn3 }}</td>
          </tr>
      </tbody></table>
  </div>
  </div>
  </div>
  `
});

// Main
const vm = new Vue({
  el: '#app',
  data: {
    countries: [], // List of all countries
    regionSelected: "", // Region selected
    langSelected: "", // Language selected
    countryDetailed: "" // Country to display more info
  },
  computed: {
    regions: function () {
        var l = [];
        this.countries.forEach(function (element) {
            if (!l.includes(element.region) && element.region != "") {
                l.push(element.region);
            }
        });
        return l;
    },
    languages: function () {
        var l = [];
        this.countries.forEach(function (element) {
            for (var key in element.languages) {
                var e = element.languages[key];
                if (!l.includes(e)) {
                    l.push(e);
                }
            }
        });
        return l;
    },
    countriesSelected: function () {
        return this.countries.filter(function (country) {
            var langFound = false;
            for (var k in country.languages) {
                if (country.languages[k] == this.langSelected) {
                    langFound = true;
                    break;
                }
            }
            return langFound && country.region === this.regionSelected;
        }, this);
    },
    countriesSelectedLimited: function () {
        return this.countriesSelected.slice(0,10);
    }
  },
  mounted () {
      this.getCountries();
  },
  methods: {
    getCountries() {
      let url = buildUrl();
      axios.get(url).then((response) => {
        this.countries = response.data;
      }).catch((error) => { console.log(error); });
    },
    setRegion (value) {
        this.regionSelected = value;
    },
    setLanguage (value) {
        this.langSelected = value;
    },
    selectionsDone () {
        return this.regionSelected != '' && this.langSelected != '';
    },
    setCountryDetailed (c) {
        this.countryDetailed = c;
    },
    resetSelections () {
        this.langSelected = '';
        this.regionSelected = '';
        this.countryDetailed = {};
    },

    // Transition methods
    beforeEnter: function (el) {
        el.style.opacity = 0
        el.style.height = 0
      },
      enter: function (el, done) {
        var delay = el.dataset.index * 150
        setTimeout(function () {
          Velocity(
            el,
            { opacity: 1, height: '1.6em' },
            { complete: done }
          )
        }, delay)
      },
      leave: function (el, done) {
        var delay = el.dataset.index * 150
        setTimeout(function () {
          Velocity(
            el,
            { opacity: 0, height: 0 },
            { complete: done }
          )
        }, delay)
      }
      // end Transition methods
  }
});
