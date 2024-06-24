const paths = {
	home() {
		return '/';
	},
	checkout() {
		return 'cartPayment/checkout-form';
	},
	paymentCancelled() {
		return 'cartPayment/paymentCancelled';
	},
	paymentSuccess() {
		return 'cartPayment/paymentSuccess';
	},
	brandList(id: string) {
		return `product/brandProduct/${id}`;
	},
	categoryList(id: string) {
		return `/product/categoryProduct/${id}`;
	},
	productDetail() {
		return `/product/productOverview`;
	},
	search() {
		return `/product/search`;
	},
	customerServices() {
		return `/support/customer-services`;
	},
	faq() {
		return `/support/frequent-questions`;
	},
	tcs() {
		return `/support/terms-and -condictions`;
	},
	XtraderBrandList(id: string) {
		return `/xtrader/brand-product/${id}`;
	},
	XTraderCategories(id: string) {
		return `/xtrader/brand-product/${id}`;
	},
	manageBrands() {
		return `/admin/brand`;
	},
	manageCategories() {
		return `/admin/category`;
	},
	manageCountries() {
		return `/admin/countryMaint`;
	},
	uploadCountries() {
		return `/admin/countryUpload`;
	},

	uploadCourier() {
		return `/admin/courierUpload`;
	},
	customerOrders() {
		return `/admin/customerorders`;
	},
	deliveryCharges() {
		return `/admin/deliveryCharge`;
	},
	RemoteLocationCharges() {
		return `/admin/deliveryRemoteLocation`;
	},
	updateOrders() {
		return `/admin/orderupdates`;
	},
	UpdateXtraderProduct() {
		return `/admin/upload-xtrProduct`;
	},
	vendor() {
		return `/admin/vendor`;
	},
	updateXtraderCategories() {
		return `/admin/xtrade-categoryupload`;
	},
	XtraderStockLevel() {
		return `/admin/xtrader-stock-level`;
	},
};
