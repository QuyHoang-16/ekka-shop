const View = { 
    Product: {
        renderListItem(data){

            $("#list-view").find(".product").remove() 
            data.map(v => {
                var image           = v.images.split(",")[0];
                var real_prices     = View.formatNumber(v.discount == 0 ? v.prices : v.prices - (v.prices*v.discount/100));
                var discount = v.discount == 0 ? "" : `<span class="percentage">${v.discount}%</span><span class="flags"> <span class="sale">Sale</span> </span>`
                var discount_value = v.discount == 0 ? "" : `<span class="old-price">${View.formatNumber(v.prices)} đ</span>`
                var size = JSON.parse(v.metadata).size.map(v => `<li><a href="#" class="ec-opt-sz">${v}</a></li>`).join("")
                var color = JSON.parse(v.metadata).color.map(v => `<li><a href="#" class="ec-opt-clr-img" ><span style="background-color: ${v};"></span></a></li>`).join("")
                 
                 
                $("#list-view .products").append(`
                    <div class="col-lg-4 col-md-6 col-sm-6 col-xs-6 mb-6 pro-gl-content product">
                        <div class="ec-product-inner">
                            <div class="ec-pro-image-outer">
                                <div class="ec-pro-image">
                                    <a href="/product?id=${v.id}" class="image">
                                        <img class="main-image" src="/${image}" alt="Product">
                                    </a>
                                    ${discount}
                                </div>
                            </div>
                            <div class="ec-pro-content">
                                <h5 class="ec-pro-title"><a href="/product?id=${v.id}">${v.name}</a></h5> 
                                <div class="ec-pro-list-desc">${v.description}</div>
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
            })
        }
    },
    Category: {
        render_top(data){
            data.map(v => {
                $('.category-list-filter').append(`
                    <li>
                        <div class="ec-sidebar-block-item" category-id="${v.id}">
                            <input type="radio" name="category" category-id="${v.id}"> <a href="#">${v.name}</a><span class="checked"></span>
                        </div>
                    </li>
                `)
            })
            var category_id = View.URL.get("tag") ?? 0
            $(`[category-id=${category_id}]`).prop('checked', true);
        },
        onChange(callback){
            $(document).on('click', `.ec-sidebar-block-item`, function() {
                callback($(this).attr("category-id"))
            });
        },
        setData(data){
            var page_title = "";
            if (View.URL.get("tag") == null || View.URL.get("tag") == 0) {
                if (View.URL.get("status") == "new") {
                    page_title = "Sản phẩm mới";
                }else if (View.URL.get("status") == "sale"){
                    page_title = "Đang giảm giá";
                }else{
                    page_title = "Tất cả sản phẩm";
                }
            }else{
                page_title = data.name;
            }
            $(".page-title").html(page_title)

        }
    },
    Layout: {
        setDefaul(){
            $(".pageSize").val(View.URL.get("pageSize") ?? 10)
        },
        setData(data){
            var page        = View.URL.get("page") ?? 1;
            var pageSize    = View.URL.get("pageSize") ?? $(".pageSize").val();
            $(".count-start").html((page-1) * pageSize + 1);
            $(".count-end").html(page * pageSize > data ? data : page * pageSize);
            $(".count-total").html(data);
            $(".page-total").html(Math.ceil(data/pageSize));
            $(".pageSize").val(View.URL.get("pageSize") ?? 10)
        }
    },
    pagination: {
        page: 1,
        pageSize: 20,
        total: 0,
        onChange(callback) {
            const oThis = this;
            $(document).on('click', '.pagination-wrapper .paginate_button.page-item:not(.disabled, .active)', function () {
                const page = $(this).text();
                let nextPage = null;
                if (page.match(/Next/g)) {
                    nextPage = oThis.page + 1;
                }
                else if (page.match(/Previous/g)) {
                    nextPage = oThis.page - 1;
                }
                else {
                    nextPage = +page;
                }
                callback(+nextPage);
                oThis.page = +nextPage;
            });
        },
        length(){
            return Math.ceil(this.total / this.pageSize);
        },
        render() {
            const paginationHTML = generatePagination(this.page, Math.ceil(this.total / this.pageSize));
            if($('.pagination-wrapper .page-numbers').length) {
                $('.pagination-wrapper .page-numbers').remove();
            }
            $('.pagination-wrapper').html(paginationHTML)

            const startEntry = this.pageSize * (this.page - 1) + 1;
            const lastEntry = Math.min(this.pageSize * this.page, this.total);
        }
    },
    Sort: {
        onChange(callback){
            $(document).on('change', `#ec-select`, function() {
                callback( )
            });
        },
        getVal(){
            return $("#ec-select").val()
        },
        setVal(data){
            return $("#ec-select").val(data)
        }
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
    filterPrices(callback){
        $(document).on('click', `.filter-prices`, function() {
            callback()
        });
    },
    onChangePage(callback){
        $(document).on('click', `.change-page-number`, function() {
            callback()
        });
    },
    onChangePageSize(callback){
        $(document).on('change', `.pageSize`, function() {
            callback()
        });
    },
    URL: {
        setURL(filters){
            const param     = (new URLSearchParams({ ...filters })).toString();
            window.history.pushState('','', '?' + param);
        },
        getFilterURL(){
            var prices_filter = [];
             $(".filter__input").each(function(index, el) {
                prices_filter.push($(el).val())
            });
            // lấy ra url và trả về chuỗi filter tương ứng
            var urlParam    = new URLSearchParams(window.location.search);
            return filters  = {
                keyword:        urlParam.get('keyword') ?? '',
                tag:            urlParam.get('tag') ?? '0',
                page:           View.pagination.page ?? '1',
                pageSize:       20,
                prices:         prices_filter.toString(),
                sort:           View.Sort.getVal(),
                status:         urlParam.get('status') ?? '',
            };
        },
        get(id){
            var urlParam    = new URLSearchParams(window.location.search);
            return urlParam.get(id)
        }
    },
    Auth: {
        get(){
            return $(".authen").val() == "" ? 0 : $(".authen").val();
        }
    },
    isNumberKey(evt){
        var charCode = (evt.which) ? evt.which : event.keyCode
        if (charCode > 31 && (charCode < 49 || charCode > 57))
            return false;
        return true;
    },
    init(){
        $(document).on('keypress', `#page-number`, function(event) {
            return View.isNumberKey(event);
        });
    }
};
(() => {
    View.init()
    function init(){ 
        getCategory();
        getProductList();
    }
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
    function getCategory(){
        Api.Category.GetAll()
            .done(res => {
                View.Category.render_top(res.data);
            })
            .fail(err => {  })
            .always(() => { });
    }
    function getProductList(){
        View.Layout.setDefaul()
        View.Sort.setVal(View.URL.get("sort") ?? 0)
        Api.Product.GetAll(View.URL.getFilterURL())
            .done(res => {
                View.Product.renderListItem(res.data.data);
                View.Category.setData(res.data.category);
                View.Layout.setData(res.data.count);
                View.pagination.total = res.data.count;
                View.pagination.render();
            })
            .fail(err => {  })
            .always(() => { });
    }
    View.Sort.onChange(() => {
        View.URL.setURL(View.URL.getFilterURL())
        getProductList();
    })
    View.Category.onChange((id) => {
        window.location.href = `/category?tag=${id}`;
    })
    View.pagination.onChange((page) => {
        View.pagination.page = page;
        View.URL.setURL(View.URL.getFilterURL())
        getProductList();
    })

    View.filterPrices(() => {
        View.URL.setURL(View.URL.getFilterURL())
        getProductList();
    })
    View.onChangePage(() => {
        View.URL.setURL(View.URL.getFilterURL())
        getProductList();
    })
    View.onChangePageSize(() => {
        View.pagination.page = 1;
        View.URL.setURL(View.URL.getFilterURL())
        getProductList();
    })
 
    init()
})();
