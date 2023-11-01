document.addEventListener('alpine:init', () => {
    Alpine.store("header", {
        cartItemsObject: Alpine.$persist({}),
        get cartItems() {
            return Object.values(this.cartItemsObject)
                .reduce((accum, next) => accum + parseInt(next.quantity), 0)
        },
    });

    Alpine.data("toast", () => ({
        visible: false,
        delay: 5000,
        percent: 0,
        interval: null,
        timeout: null,
        message: null,
        close() {
            // debugger
            this.visible = false;
            clearInterval(this.interval);
            // clearTimeout(this.timeout);
            // console.log('Closing toast');
            // this.$nextTick(() => {
            //     this.visible = false;
            // });
        },
        show(message) {
            this.visible = true;
            this.message = message;

            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
            this.timeout = setTimeout(() => {
                this.visible = false;
                this.timeout = null;
            }, this.delay);
            const startDate = Date.now();
            const futureDate = Date.now() + this.delay;
            this.interval = setInterval(() => {
                const date = Date.now();
                this.percent = ((date - startDate) * 100) / (futureDate - startDate);
                if (this.percent >= 100) {
                    clearInterval(this.interval);
                    this.interval = null;
                }
            }, 30);
        }
    }));


    Alpine.data('productItem', (product) => {
        return {
            id: product.id,
            product,
            quantity: 1,
            addToCart(id, quantity = 1) {
                this.$store.header.cartItemsObject[id] = this.$store.header.cartItemsObject[id] || { ...product, quantity: 0 };
                this.$store.header.cartItemsObject[id].quantity = parseInt(this.$store.header.cartItemsObject[id].quantity) + parseInt(quantity);
                this.$dispatch('notify', {
                    message: "Produk anda ditambahkan ke keranjang"
                })
            },
            removeItemFromCart() {
                delete this.$store.header.cartItemsObject[this.id]
                this.$dispatch('notify', {
                    message: "Produk anda dihapus dari keranjang"
                })
            }
        }
    });

});