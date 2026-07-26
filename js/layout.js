const LayoutView = {
	Category: {
		render_top(data){
			data.map(v => {
                $(".category-nav-list").append(`<li><a href="/category?tag=${v.id}">${v.name}</a></li>`)
            })
		}
	},
    Cart: {
        add_to_card(name, callback){
            $(document).on('click', `.action-add-to-card`, function() {
                if($(this).attr('atr').trim() == name) {
                    callback($(this));
                }
            });
        },
        update(){
            var card_data = localStorage.getItem("card")
            var count = card_data == null || card_data == "" ? 0 : card_data.split("-").length;
            $(".cart-count").html(count)
        }
    },
    onPushSearch(){
        var search_data = LayoutView.toSlug($(".product-search-field").val());
        return `keyword=${search_data}`
    },
    toSlug(title){
        slug = title.toLowerCase();
        //Đổi ký tự có dấu thành không dấu
        slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
        slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
        slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
        slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
        slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
        slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
        slug = slug.replace(/đ/gi, 'd');
        //Xóa các ký tự đặt biệt
        slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
        //Đổi khoảng trắng thành ký tự gạch ngang
        slug = slug.replace(/ /gi, " - ");
        //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
        //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
        slug = slug.replace(/\-\-\-\-\-/gi, '-');
        slug = slug.replace(/\-\-\-\-/gi, '-');
        slug = slug.replace(/\-\-\-/gi, '-');
        slug = slug.replace(/\-\-/gi, '-');
        //Xóa các ký tự gạch ngang ở đầu và cuối
        slug = '@' + slug + '@';
        slug = slug.replace(/\@\-|\-\@|\@/gi, '');
        return slug;
    },
};
(() => { 
    $(document).on('click', '[modal-control]', function() {
        var name = $(this).attr('modal-control')
        $(`.I-modal[modal-block=${name}]`).addClass('active');
        $("html").addClass("o-hidden")
    });
    $(document).mouseup(function(e) {
        var container = $(".modal-dialog");
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            $('.I-modal').removeClass('active');
            $("html").removeClass("o-hidden")
        }
    });
    function init(){ 
        getCategory(); 
        LayoutView.Cart.update();
    }
    function getCategory(){
        Api.Category.GetAll()
            .done(res => {
                LayoutView.Category.render_top(res.data);
            })
            .fail(err => {  })
            .always(() => { });
    }
    LayoutView.Cart.add_to_card("Add to card", (item) => {
        var card = localStorage.getItem("card"); 
        card = card == null ? "" : card;
        var data_id = item.attr("data-id")
        if (card.split("-") > 0) {
            hasId = card.split("-").includes(data_id)
            if (!hasId) {
                item.text("✔ đã thêm")
                card = card + "-" + data_id; 
                localStorage.setItem("card", card); 
            }
        }else{
            item.text("✔ đã thêm")
            localStorage.setItem("card", data_id); 
        }
        LayoutView.Cart.update();
    })
    $(document).on('click', '.header-search-button', function() {
        window.location.href = `/category?${LayoutView.onPushSearch()}` ;
    });
    init()
})();