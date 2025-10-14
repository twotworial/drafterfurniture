
// Related Posts (robust)
$(function(){
  function relatedPost($box, label, limit){
    if(!label){ console.warn('Related: label kosong'); $box.hide(); return; }

    $.ajax({
      url: "/feeds/posts/summary/-/"+ encodeURIComponent(label) +"?alt=json-in-script&max-results="+ (limit||6),
      type: "get",
      dataType: "jsonp",
      success: function(res){
        var entries = (res && res.feed && res.feed.entry) || [];
        if(!entries.length){ $box.hide(); return; }

        var html = '<div class="related"><ul>', href, title, raw, img;

        for(var i=0;i<entries.length;i++){
          var ent = entries[i];

          // link artikel
          href = "";
          var links = ent.link || [];
          for(var j=0;j<links.length;j++){
            if(links[j].rel === "alternate"){ href = links[j].href; break; }
          }

          title = (ent.title && ent.title.$t) || "";

          // ambil konten/summary buat cari gambar
          raw = (ent.content && ent.content.$t) || (ent.summary && ent.summary.$t) || "";
          img = "";

          // YouTube > pakai media$thumbnail kalau ada
          if (/youtube\.com\/embed\//i.test(raw) && ent.media$thumbnail && ent.media$thumbnail.url){
            img = ent.media$thumbnail.url.replace('/default.jpg','/mqdefault.jpg');
          }

          // kalau belum dapat, ambil img pertama dari HTML
          if(!img && raw.indexOf("<img")>-1){
            var div = document.createElement('div'); div.innerHTML = raw;
            var first = div.querySelector('img');
            if(first){
              var s = first.getAttribute('src') || "";
              img = s
                .replace(/\/s\d+(?:-c)?\//i,'/s600/')
                .replace(/\/w\d+-h\d+(?:-c)?\//i,'/w600-h400$1/');
            }
          }

          // fallback
          if(!img){
            img = 'https://2.bp.blogspot.com/-4lZ7DCckjkg/WtaPclghMGI/AAAAAAAAN00/4Cais5iSDRwwUyU6jEc7qlCojlg1izsVgCLcBGAs/s1600/noImage.png';
          }

          html += '<li><div class="related-thumb"><a class="related-img lazyload" href="'+href+'" style="background:url('+img+') no-repeat center center;background-size:cover"></a></div><h3 class="related-title"><a href="'+href+'">'+title+'</a></h3></li>';
        }

        html += '</ul></div>';
        $box.html(html);
      },
      error: function(_,status,err){
        console.error('Related AJAX error:', status, err);
        $box.hide();
      }
    });
  }

  // Ambil label dari data-attribute dulu, kalau kosong baru .text()
  $('#related-posts').each(function(){
    var $el = $(this);
    var label = $.trim($el.attr('data-label') || $el.text() || "");
    relatedPost($el, label, 6);
  });
});
