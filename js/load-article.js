jQuery(document).ready(function(){
  loadSkinAlchemyArticlePage = function(pagePath, articlesBuilder) {
  jQuery.getJSON(pagePath)
    .done(articlesBuilder)
    .fail(function(jqXHR, textStatus, errorThrown) {
      console.error("Error getting articles feed:", textStatus, errorThrown);
    });
};
  
  buildArticlesSection = function(page) {
    loadSkinAlchemyArticlePage(page, function(data){

        var articleSection = '';
        data.articles.forEach(function(article) {
            articleSection += `
            <li class="wow fadeInLeft" data-wow-duration="1s">
            <div class="list_inner">
                <div class="image">
                    <img src="img/thumbs/4-3.jpg" alt="" />
                    <div class="main" data-img-url="${article.img}"></div>
                    <a class="erling_tm_full_link" href="${article.link}"></a>
                </div>
                <div class="details">
                    <div class="title">
                        <h3><a class="text_hover_effect" href="${article.link}">${article.title}</a></h3>
                    </div>
                </div>
            </div>
            </li>
            `;
    
        });
        var slideSelector = '#news .erling_tm_news .container .news_list ul';
        jQuery(slideSelector).fadeOut(400, function() {
            jQuery(this).html(articleSection).fadeIn(400, function() {
                //jQuery('#articlePaginator .current').html(data.page);
                //jQuery('#articlePaginator .total').html(data.total_pages);
        
                var images = jQuery('#news .erling_tm_news .container .news_list *[data-img-url]');
                images.each(function(){
                    var element	= jQuery(this);
                    var url	= element.data('img-url');
                    element.css({backgroundImage: 'url('+url+')'});
                });
                alrticlesViewProgress(data.page, data.total_pages);

    
            });
        });
        //jQuery(slideSelector).html(articleSection);

        var nextPage = data.next_page_link;
        paginatorAction(jQuery('#articlePaginatorControls .my_next'), nextPage);

        var previousPage = data.previous_page_link;
        paginatorAction(jQuery('#articlePaginatorControls .my_prev'), previousPage);
	
    
    });
  };

   paginatorAction = function(control, action) {
    control.unbind('click');
    if (action) {
        control.on('click', function(){
            buildArticlesSection(action);
            return false; 
        });
    } else {
        control.on('click', function(){return false;});
    }

   };

   initArticlesSwiper = function() {
    
     buildArticlesSection("/articles/articles_feed-1.json");




     jQuery('#news .erling_tm_news .container .news_list').hammer( {
        recognizers: [
            [Hammer.Swipe,{ direction: Hammer.DIRECTION_HORIZONTAL }],
        ]
    }).on("swipeleft", function(){
        jQuery('#articlePaginatorControls .my_next').click();
    }).on("swiperight", function(){
        jQuery('#articlePaginatorControls .my_prev').click();
    }); 
   };
   
   alrticlesViewProgress = function(current, total) {
		// progress animation
		var scale,translateX;
		var progressDOM	= jQuery('#articlePaginator');
		translateX 	= '0px';
		scale = parseInt((current/total)*100)/100;


		progressDOM.find('.all span').css({transform:'translate3d('+translateX+',0px,0px) scaleX('+scale+') scaleY(1)'});
		if(current<10){current = '0' + current;}
		if(total<10){total = '0' + total;}
		progressDOM.find('.current').html(current);
		progressDOM.find('.total').html(total);
   };

});