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

    Alpine.data('signupForm', () => ({
        defaultClasses: 'focus:ring-baut-color-red-200',
        errorClasses: 'border-red-600 focus:border-red-600 ring-1 ring-red-600 focus:ring-red-600',
        successClasses: 'border-emerald-500 focus:border-emerald-500 ring-1 ring-emerald-500 focus:ring-emerald-500',
        form: {
            name: '',
            email: '',
            password: '',
            password_repeat: '',
        },
        errors: {
            name: '',
            email: '',
            password: '',
            password_repeat: '',
        },
        submit() {
            console.log(this.form)
            this.validateName();
            this.validateEmail();
            this.validatePassword();
            this.validatePasswordRepeat();
        },
        validateName() {
            this.errors.name = '';
            if (!this.form.name) {
                this.errors.name = 'this field is required'
            } else if (this.form.name.length < 2) {
                this.errors.name = 'the name should be at least two characters'
            }
        },
        validateEmail() {
            this.errors.email = '';
            if (!this.form.email) {
                this.errors.email = 'this field is required'
            } else if (!this.validateEmailWithRegex()) {
                this.errors.email = 'this must be a valid email field'
            }
        },
        validateEmailWithRegex() {
            return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                .test(this.form.email);
        },
        validatePassword() {
            this.errors.password = '';
            if (!this.form.password) {
                this.errors.password = 'this field is required'
            }
        },
        validatePasswordRepeat() {
            this.errors.password_repeat = '';
            if (!this.form.password_repeat) {
                this.errors.password_repeat = 'this field is required'
            }
        }
    }))

    Alpine.data('dropdown', () => ({
        clothingMenu: [
            { name: 'Tops' },
            { name: 'Dresses' }
        ],
        accessoriesMenu: [],
        activeMenu: null,
        selectedMenu: null,
        showImage: false,
        tempSelectedAccessory: null, // Menyimpan sementara accessory terpilih


        init() {
            // Initialization code here
            this.accessoriesMenu = this.getRelatedAccessories('Tops'); // Set default accessories menu
        },
        setActiveClothing(item) {
            this.selectedMenu = item;
            this.activeMenu = item.name;
            this.accessoriesMenu = this.getRelatedAccessories(item.name);
            this.showImage = false; // Pastikan gambar tidak ditampilkan ketika clothing diklik
            this.tempSelectedAccessory = null; // Reset accessory terpilih
        },

        setActiveAccessory(item) {
            this.selectedMenu = item; // Set the selected menu item to the clicked accessory
            this.tempSelectedAccessory = item; // Set the temporary selected accessory
            this.showImage = true; // Ensure the image is shown
        },

        getRelatedAccessories(clothingName) {
            // Tentukan accessories terkait di sini berdasarkan logika bisnis Anda
            const relatedAccessories = {
                'Tops': [
                    { name: 'Watches', image: 'https://tailwindui.com/img/ecommerce-images/mega-menu-category-01.jpg' },
                    { name: 'Wallets', image: 'https://tailwindui.com/img/ecommerce-images/mega-menu-category-02.jpg' }
                ],
                'Dresses': [
                    { name: 'Belts', image: 'https://tailwindui.com/img/ecommerce-images/mega-menu-category-03.jpg' },
                    { name: 'Hats', image: 'https://tailwindui.com/img/ecommerce-images/mega-menu-category-04.jpg' }
                ]
            };
            return relatedAccessories[clothingName] || [];
        },

        // Menambahkan fungsi untuk menangani mouse leave event pada menu accessories
        handleMouseLeave() {
            if (this.tempSelectedAccessory) {
                this.selectedMenu = this.tempSelectedAccessory;
                this.showImage = true;
            }
        }
    }));
});