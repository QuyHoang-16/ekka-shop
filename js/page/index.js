const View = {
    Category: {
        firstID: 1,
        render_product(data, id){
            $(".data-category-render").find(".product-category-data").remove()
            $(".data-category-render").find(".shop-all-btn").remove()
            $(`.category-tab-list .nav-link`).removeClass("active");

            $(`.category-tab-list .nav-link[category-id=${id}]`).addClass("active");
            data.map(v => {
                var image           = v.images.split(",")[0];
                var size = JSON.parse(v.metadata).size.map(v => `<li><a href="#" class="ec-opt-sz">${v}</a></li>`).join("")
                var color = JSON.parse(v.metadata).color.map(v => `<li><a href="#" class="ec-opt-clr-img" ><span style="background-color: ${v};"></span></a></li>`).join("")
                var discount = v.discount == 0 ? "" : `<span class="percentage">${v.discount}%</span><span class="flags"> <span class="sale">Sale</span> </span>`
                var real_prices     = View.formatNumber(v.discount == 0 ? v.prices : v.prices - (v.prices*v.discount/100));
                var discount_value = v.discount == 0 ? "" : `<span class="old-price">${View.formatNumber(v.prices)} đ</span>`
                $(".data-category-render").append(`
                    <div class="col-lg-3 col-md-6 col-sm-6 col-xs-6 mb-6  ec-product-content product-category-data" >
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
            $(".data-category-render").append(`<div class="col-sm-12 shop-all-btn"><a href="/category?tag=0">Xem thêm</a></div>`)
        },
        render_top(data){
            data.map((v, k) => {
                if (k == 0) View.Category.firstID = v.id;
                $('.category-tab-list').append(`
                    <li class="nav-item">
                        <a class="nav-link" category-id="${v.id}">${v.name}</a>
                    </li>
                `)
            })
        },
        onChange(callback){
            $(document).on('click', '.category-tab-list .nav-link', function() {
                var id = $(this).attr('category-id');
                callback(id);
            });
        }
    },
    Product: {
renderNew(data){
    // 1. Xoá sạch dữ liệu cũ trước khi render mới
    $(".new-product").empty();

    // Kiểm tra nếu không có dữ liệu
    if (!data || data.length === 0) {
        $(".new-product").append('<div class="col-12 text-center py-4"><p>Chưa có sản phẩm mới nào.</p></div>');
        return;
    }

    data.map(v => {
        // Xử lý ảnh an toàn (nếu v.images rỗng sẽ dùng ảnh mặc định)
        var image = (v.images && v.images.trim() !== "") 
            ? v.images.split(",")[0] 
            : "/customer/assets/images/product-image/1.jpg";

        // Bọc try-catch để tránh crash khi parse metadata
        var sizeHtml = "";
        var colorHtml = "";
        try {
            var meta = typeof v.metadata === "string" ? JSON.parse(v.metadata || "{}") : (v.metadata || {});
            if (meta.size && Array.isArray(meta.size)) {
                sizeHtml = meta.size.map(sz => `<li><a href="#" class="ec-opt-sz">${sz}</a></li>`).join("");
            }
            if (meta.color && Array.isArray(meta.color)) {
                colorHtml = meta.color.map(cl => `<li><a href="#" class="ec-opt-clr-img"><span style="background-color: ${cl};"></span></a></li>`).join("");
            }
        } catch(e) {
            console.warn("Lỗi parse metadata sản phẩm:", v.id, e);
        }

        var discount = v.discount == 0 ? "" : `<span class="percentage">${v.discount}%</span><span class="flags"> <span class="sale">Sale</span> </span>`;
        var real_prices = View.formatNumber(v.discount == 0 ? v.prices : v.prices - (v.prices * v.discount / 100));
        var discount_value = v.discount == 0 ? "" : `<span class="old-price">${View.formatNumber(v.prices)} đ</span>`;

        // 2. ĐÃ XÓA data-animation="fadeIn" ĐỂ SẢN PHẨM HIỆN NGHĨA LẠI NGAY LẬP TỨC
        $(".new-product").append(`
            <div class="col-lg-3 col-md-6 col-sm-6 col-xs-6 mb-6 ec-product-content">
                <div class="ec-product-inner">
                    <div class="ec-pro-image-outer">
                        <div class="ec-pro-image">
                            <a href="/product?id=${v.id}" class="image">
                                <img class="main-image" src="${image}" alt="${v.name || 'Product'}" />
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
                                    ${colorHtml}
                                </ul>
                            </div>
                            <div class="ec-pro-size">
                                <span class="ec-pro-opt-label">Size</span>
                                <ul class="ec-opt-size">
                                    ${sizeHtml}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`);
    });

    $(".new-product").append(`<div class="col-sm-12 shop-all-btn text-center mt-3"><a href="/category?sort=1" class="btn btn-outline-primary">Xem thêm</a></div>`);
},
        renderBestSale(data){
            // Ẩn khu vực offer cũ
            $(".offer-wrapper").hide();
        },
        renderTrending(data){
            // Đường dẫn đến ảnh banner thể thao mới của bạn
            var bannerImg = "/customer/assets/images/banner/banner-sport.png";
            
            // Xóa slider cũ và render banner xịn xò mới
            $(".slider-wrapper").html(`
                <div class="ec-slide-item swiper-slide" style="position: relative !important; border-radius: 16px !important; overflow: hidden !important; min-height: 450px !important; background: url('${bannerImg}') center/cover no-repeat !important; padding: 0 !important;">
                    
                    <!-- Khối chứa nút đặt chính giữa phía dưới -->
                    <div style="position: absolute !important; bottom: 30px !important; left: 0 !important; right: 0 !important; width: 100% !important; display: flex !important; justify-content: center !important; align-items: center !important; z-index: 99 !important;">
                        <a href="#tab-pro-for-all" style="background-color: #2563eb !important; color: #ffffff !important; padding: 12px 35px !important; border-radius: 6px !important; font-weight: 700 !important; text-transform: uppercase !important; text-decoration: none !important; font-size: 14px !important; letter-spacing: 1px !important; box-shadow: 0 4px 15px rgba(0,0,0,0.4) !important; display: inline-block !important;">KHÁM PHÁ NGAY</a>
                    </div>

                </div>
            `);

            View.Slider.init();
        }
    },
    Slider: {
        init(){
            var EcMainSlider = new Swiper('.ec-slider.swiper-container', {
                loop: true,
                speed: 2000,
                effect: "slide",
                autoplay: {
                    delay: 7000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },

                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }
            });
        }
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
        getCategory(); 
        getNewArrivals();
        getBestSale();
        getTrending();
    }
    View.Category.onChange((id) => {
        loadProductOnCategory(id)
    })
    function debounce(f, timeout) {
        let isLock = false;
        let timeoutID = null;
        return function(item) {
            if(!isLock) {
                f(item);
                isLock = true;
            }
            clearTimeout(timeoutID);
            timeoutID = setTimeout(function() {
                isLock = false;
            }, timeout);
        }
    } 
    function getNewArrivals(){
        Api.Product.NewArrivals()
            .done(res => {
                View.Product.renderNew(res.data);
            })
            .fail(err => {  })
            .always(() => { });
    }
    function getBestSale(){
        Api.Product.BestSale()
            .done(res => {
                if (res.data.length > 0) View.Product.renderBestSale(res.data[0]);
            })
            .fail(err => {  })
            .always(() => { });
    }
    function loadProductOnCategory(id){
        Api.Product.GetWithCategory(id)
            .done(res => {
                View.Category.render_product(res.data, id);
            })
            .fail(err => {  })
            .always(() => { });
    }
    function getCategory(){
        Api.Category.GetAll()
            .done(res => {
                View.Category.render_top(res.data);
                setTimeout(loadProductOnCategory(View.Category.firstID), 500);
            })
            .fail(err => {  })
            .always(() => { });
    }
    function getTrending(){
        Api.Product.Trending()
            .done(res => {
                View.Product.renderTrending(res.data);
            })
            .fail(err => {  })
            .always(() => { });
    }
    init()
})();