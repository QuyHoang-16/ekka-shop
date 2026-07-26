const Api = {
    Auth: {},
    Category: {},
    Product: {},
    Order: {},
    VNpay: {},
    Profile: {}
};
(() => {
    $.ajaxSetup({
        headers: { 
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr('content'),
        },
        crossDomain: true
    });
})();

//Category
(() => {
    Api.Category.GetAll = () => $.ajax({
        url: `/customer/apip/category/get`,
        method: 'GET',
    });
})();

//Product
(() => {
    Api.Product.GetAll = (filter) => $.ajax({
        url: `/customer/apip/product/get-all`,
        method: 'GET',
        dataType: 'json',
        data: {
            keyword: filter.keyword ?? '',
            tag: filter.tag ?? '',
            page: filter.page ?? '',
            pageSize: filter.pageSize ?? '',
            prices: filter.prices ?? '',
            sort: filter.sort ?? '',
            status: filter.status ?? '',
        }
    });
    Api.Product.GetWithCategory = (id) => $.ajax({
        url: `/customer/apip/product/get-with-category/${id}`,
        method: 'GET',
    });
    Api.Product.NewArrivals = () => $.ajax({
        url: `/customer/apip/product/get-new-arrivals`,
        method: 'GET',
    });
    Api.Product.BestSale = () => $.ajax({
        url: `/customer/apip/product/get-best-sale`,
        method: 'GET',
    });
    Api.Product.Trending = () => $.ajax({
        url: `/customer/apip/product/get-trending`,
        method: 'GET',
    });
    Api.Product.GetOne = (id,) => $.ajax({
        url: `/customer/apip/product/get-one/${id}`,
        method: 'GET',
    });
    Api.Product.GetRelated = (id) => $.ajax({
        url: `/customer/apip/product/get-related/${id}`,
        method: 'GET',
    });
    Api.Product.GetOneItem = (id) => $.ajax({
        url: `/customer/apip/product/get-one-cart/${id}`,
        method: 'GET',
    });

})();

//Order
(() => {
    Api.Order.Create = (data) => $.ajax({
        url: `/customer/apip/order/create`,
        method: 'POST',
        data: data,
        contentType: false,
        processData: false,
    });
    Api.Order.GetOrder = (id) => $.ajax({
        url: `/customer/apip/order/get/${id}`,
        method: 'GET',
    });
})();


//Profile
(() => {
    Api.Profile.GetProfile = () => $.ajax({
        url: `/customer/apip/profile/get`,
        method: 'GET',
    });
    Api.Profile.UpdateProfile = (data) => $.ajax({
        url: `/customer/apip/profile/update-profile`,
        method: 'POST',
        data: data,
        contentType: false,
        processData: false,
    });
    Api.Profile.GetOrder = () => $.ajax({
        url: `/customer/apip/profile/get-order`,
        method: 'GET',
    });
    Api.Profile.UpdatePassword = (data) => $.ajax({
        url: `/customer/apip/profile/update-password`,
        method: 'POST',
        data: data,
        contentType: false,
        processData: false,
    });
})();

//VNpay
(() => {
    Api.VNpay.Create = (data) => $.ajax({
        url: `/payment`,
        method: 'POST',
        data: data,
        contentType: false,
        processData: false,
    });
})();



