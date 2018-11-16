new Vue({
  el: "#app",
  data: {
    total: 0,
    items: [],
    results: [],
    cart: [],
    search: "Sex",
    found: 0,
    lastSearch: "",
    loading: false,
    noResults: false,
    errMessage: false
  },

  methods: {
    appendItems: function () {
      if (this.items.length < this.results.length) {
        var append = this.results.slice(this.items.length, this.items.length + 10);
        this.items = this.items.concat(append);
      }
    },

    onSubmit: function () {
      if (this.search.length) {
        this.items = [];
        this.loading = true;
        this.$http.get('/search/'.concat(this.search))
            .then(function (res) {
              this.lastSearch = this.search;
              this.results = res.data;
              //this.items = res.data;
              this.found = this.results.length;
              this.appendItems();
              this.loading = false;

              if (this.items.length === 0) {
                this.noResults = true;
              }
            });
      } else {
        this.errMessage = true;
      }
    },

    addItem: function (index) {
      var item = this.items[index];
      this.total += item.downs;
      var found = false;

      for (var i = 0; i < this.cart.length; i++) {
        if (this.cart[i].id === item.id) {
          found = true;
          this.cart[i].qty++;
          break;
        }
      }


      if (!found) {
        this.cart.push({
          id: item.id,
          name: item.title,
          price: item.downs,
          qty: 1
        });
      }

    },

    inc: function (item) {
      item.qty++;
      this.total += item.price;
    },

    dec: function (item) {
      item.qty--;
      this.total -= item.price;

      if (item.qty <= 0) {
        for (var i = 0; i < this.cart.length; i++) {
          if (this.cart[i].id === item.id) {
            this.cart.splice(i, 1);
            break;
          }
        }

      }
    }
  },

  filters: {
    currency: function (price) {
      return "$".concat(price);
    }
  },

  computed: {
    noMoreItems: function () {
      return this.items.length === this.results.length;
    }
  },

  mounted: function () {
    this.onSubmit();

    var vueInstance = this;
    var elem = document.getElementById("product-list-bottom");
    var watcher = scrollMonitor.create(elem);
    watcher.enterViewport(function() {
      vueInstance.appendItems();
    });
  }
});