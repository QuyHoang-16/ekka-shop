const View = {
    Product: {
        renderNew(data){
            data.map(v => {
                var image           = v.images.split(",")[0];
                var size = JSON.parse(v.metadata).size.map(v => `<li><a href="#" class="ec-opt-sz">${v}</a></li>`).join("")
                var color = JSON.parse(v.metadata).color.map(v => `<li><a href="#" class="ec-opt-clr-img" ><span style="background-color: ${v};"></span></a></li>`).join("")
                var discount = v.discount == 0 ? "" : `<span class="percentage">${v.discount}%</span><span class="flags"> <span class="sale">Sale</span> </span>`
                var real_prices     = View.formatNumber(v.discount == 0 ? v.prices : v.prices - (v.prices*v.discount/100));
                var discount_value = v.discount == 0 ? "" : `<span class="old-price">${View.formatNumber(v.prices)} đ</span>`
                $(".new-product").append(`
                    <div class="col-lg-3 col-md-6 col-sm-6 col-xs-6 mb-6  ec-product-content" data-animation="fadeIn">
                        <div class="ec-product-inner">
                            <div class="ec-pro-image-outer">
                                <div class="ec-pro-image">
                                    <a href="/product?id=${v.id}" class="image">
                                        <img class="main-image" src="${image}" alt="Product" />
                                    </a>
                                    ${discount}
                                </div>
                            </div>
                            <div class="ec-pro-content">
                                <h5 class="ec-pro-title"><a href="/product?id=${v.id}">${v.name}</a></h5>
                                <span class="ec-price">
                                    ${discount_value}
                                    <span class="new-price">${real_prices} đ</span>
                                </span>
                                <div class="ec-pro-option">
                                    <div class="ec-pro-color">
                                        <span class="ec-pro-opt-label">Color</span>
                                        <ul class="ec-opt-swatch ec-change-img">
                                            ${color}
                                        </ul>
                                    </div>
                                    <div class="ec-pro-size">
                                        <span class="ec-pro-opt-label">Size</span>
                                        <ul class="ec-opt-size">
                                            ${size}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`)
            })
            $(".new-product").append(`<div class="col-sm-12 shop-all-btn"><a href="/category?sort=1">Xem thêm</a></div>`)
        },
    },
    Item: localStorage.getItem("card"),
    Quantity: localStorage.getItem("quantity"),
    TotalPrices: localStorage.getItem("total_prices"),
    Cart: {
        render(data, key){
            var image           = data.images.split(",")[0];
            var discount        = data.prices*data.discount/100;
            var real_prices     = data.discount == 0 ? data.prices : data.prices - discount;
            var size = JSON.parse(data.metadata).size.map(v => `<li><a href="#" class="ec-opt-sz">${v}</a></li>`).join("")
            var color = JSON.parse(data.metadata).color.map(v => `<li><a href="#" class="ec-opt-clr-img" ><span style="background-color: ${v};"></span></a></li>`).join("")
            var discount = data.discount == 0 ? "" : `<span class="percentage">${data.discount}%</span><span class="flags"> <span class="sale">Sale</span> </span>`
            var real_prices     = View.formatNumber(data.discount == 0 ? data.prices : data.prices - (data.prices*data.discount/100));
            var discount_value = data.discount == 0 ? "" : `<span class="old-price">${View.formatNumber(data.prices)} đ</span>`
                
            $(".cart-list").append(`
                <div class="col-sm-12 mb-6">
                    <div class="ec-product-inner">
                        <div class="ec-pro-image-outer">
                            <div class="ec-pro-image">
                                <a href="/product?id=${data.id}" class="image">
                                    <img class="main-image" src="/${image}" alt="Product" />
                                </a>
                            </div>
                        </div>
                        <div class="ec-pro-content">
                            <h5 class="ec-pro-title"><a href="/product?id=${data.id}">${data.name}</a></h5> 
                            <span class="ec-price">
                                    ${discount_value}
                                    <span class="new-price">${real_prices} đ</span>
                            </span>
                            <div class="ec-pro-option">
                                <div class="ec-pro-color">
                                    <span class="ec-pro-opt-label">Color</span>
                                    <ul class="ec-opt-swatch ec-change-img">
                                        ${color}
                                    </ul>
                                </div>
                                <div class="ec-pro-size">
                                    <span class="ec-pro-opt-label">Size</span>
                                    <ul class="ec-opt-size">
                                        ${size}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
            `)
            View.Cart.setTotal();
        },
        setTotal(){
            var subtotal = 0;
            var discount = 0;
            var total = localStorage.getItem("total_prices"); 
            $(".sub-total").html(View.formatNumber(subtotal) + " đ");
            $(".discount-total").html("- " + View.formatNumber(discount) + " đ");
            $(".real-total").html(View.formatNumber(total) + " đ");
            $(".real-total").attr("data-total", total);
        }
    },
    Order: {
        getVal(){
            var resource = '#checkout-form';
            var fd = new FormData();
            var required_data = [];
            var onPushData = true;

            var data_item       = localStorage.getItem("card");
            var data_quantity   = localStorage.getItem("quantity");
            var data_prices     = localStorage.getItem("total_prices");

            var data_username   = $("#username").val();
            var data_address    = $("#address").val();
            var data_telephone  = $("#telephone").val();
            var data_payment    = $("input[name=payment_method]:checked").val();
            var data_email      = $("#email").val(); 

            // --Required Value
            if (data_item == null) { required_data.push('Hãy chọn sản phẩm.'); onPushData = false }
            if (data_username == '') { required_data.push('Nhập tên.'); onPushData = false }
            if (data_address == '') { required_data.push('Nhập địa chỉ.'); onPushData = false }
            if (data_telephone == '') { required_data.push('Nhập số điện thoại.'); onPushData = false }  

            if (View.validateEmail(data_email) == null) { 
                if (data_email == '') { 
                    required_data.push('Hãy nhập email.'); onPushData = false 
                }else{
                    required_data.push('Email không hợp lệ.'); onPushData = false 
                }
            } 
            if (onPushData) {
                fd.append('data_login', 1);
                fd.append('data_item', data_item);
                fd.append('data_quantity', data_quantity);
                fd.append('data_prices', data_prices);
                fd.append('data_username', data_username);
                fd.append('data_address', data_address);
                fd.append('data_telephone', data_telephone);
                fd.append('data_email', data_email);
                fd.append('data_payment', data_payment);

                return fd;
            }else{
                $(`${resource}`).find('.error-log .js-errors').remove();
                var required_noti = ``;
                for (var i = 0; i < required_data.length; i++) { required_noti += `<li class="error">${required_data[i]}</li>`; }
                $(`${resource}`).find('.error-log').prepend(` <ul class="js-errors">${required_noti}</ul> `)
                return false;
            }

        },
        CreateOrder(callback){
            $(document).on('click', `.order-action`, function() {
                var data = View.Order.getVal();
                if (data) callback(data);
            });
        }
    }, 
    validateEmail(email){
        return email.match( /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ );
    },
    isNumberKey(evt){
        var charCode = (evt.which) ? evt.which : event.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    },
    formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    },
    init(){

    }
};
(() => {
    View.init()
    function init(){ 
        getNewArrivals();
        getCart();
    }
    View.Order.CreateOrder((fd) => {
        Api.Order.Create(fd)
            .done(res => {
                localStorage.removeItem("card")
                localStorage.removeItem("quantity")
                localStorage.removeItem("total_prices")
                if (res.payment == 1) {
                    window.location.replace("/profile");
                }else{
                    var formVNpay = new FormData();
                    formVNpay.append('data_id', res.id);
                    formVNpay.append('data_prices', res.total);
                    Api.VNpay.Create(formVNpay).done(res => {
                        window.location.replace(res);
                    })
                    .fail(err => { LayoutView.helper.showToastError('Error', 'Có lỗi sảy ra'); })
                    .always(() => { });
                }
            })
            .fail(err => { LayoutView.helper.showToastError('Error', 'Có lỗi sảy ra'); })
            .always(() => { });
    })
    function getCart(){
        var cart_item = View.Item;
        if (cart_item) {
            cart_item.split("-").map((v, k) => {
                getItem(v, k);
            })
        }
    }
    function getItem(id, key){
        Api.Product.GetOneItem(id)
            .done(res => {
                View.Cart.render(res.data[0], key)
            })
            .fail(err => {  })
            .always(() => { });
    }
    function getNewArrivals(){
        Api.Product.NewArrivals()
            .done(res => {
                View.Product.renderNew(res.data);
            })
            .fail(err => {  })
            .always(() => { });
    }
    init()
})();
