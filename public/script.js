new Vue({
    el: "#app",
    data: {
        total: 0,
        items: [],
        cart: [],
        search: "Happy",
        found: 0,
        lastSearch: "",
        loading: false,
        noResults: false
    },

    methods: {
        onSubmit: function () {
            this.loading = true;
            this.noResults = false;
            this.$http.get('/search/'.concat(this.search))
                .then(function (res) {
                    this.items = res.data;
                    this.found = this.items.length;
                    this.lastSearch = this.search;
                    console.log(this.items);
                    this.loading = false;
                    this.noResults = false;

                    if (this.items.length === 0) {
                        this.noResults = true;
                        console.log(this.noResults);
                    }
                });
        },
        addItem: function (index) {
            var item = this.items[index];
            this.total += item.price;
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

    mounted: function () {
        this.onSubmit();
    }
});