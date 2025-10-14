<script>
// Related Posts — same markup as reference
$(function(){
  function relatedPost($box, label, limit){
    if(!label){ $box.hide(); return; }
    $.ajax({
      url: "/feeds/posts/summary/-/"+encodeURIComponent(label)+"?alt=json-in-script&max-results="+(limit||6),
      dataType: "jsonp",
      success: function(res){
        var entries = (res && res.feed && res.feed.entry) || [];
        if(!entries.length){ $box.hide(); return; }

        var h = '<div class="related">', i, e, href, title, raw, img;
        for(i=0;i<entries.length;i++){
          e = entries[i];

          // link artikel
          href = "";
          (e.link||[]).some(function(L){ if(L.rel==="alternate"){ href=L.href; return true; }});

          title = (e.title && e.title.$t) || "";

          // content/summary buat cari gambar
          raw = (e.content && e.content.$t) || (e.summary && e.summary.$t) || "";
          img = "";

          // youtube -> pakai media$thumbnail jika ada
          if(/youtube\.com\/embed\//i.test(raw) && e.media$thumbnail && e.media$thumbnail.url){
            img = e.media$thumbnail.url.replace('/default.jpg','/mqdefault.jpg');
          }

          // ambil img pertama dari HTML kalau belum ada
          if(!img && raw.indexOf('<img')>-1){
            var div=document.createElement('div'); div.innerHTML=raw;
            var first=div.querySelector('img');
            if(first){
              var s=first.getAttribute('src')||"";
              img = s
                .replace(/\/s\d+(?:-c)?\//i,'/s600/')
                .replace(/\/w\d+-h\d+(?:-c)?\//i,'/w600-h400$1/');
            }
          }

          // fallback
          if(!img){
            img='https://2.bp.blogspot.com/-4lZ7DCckjkg/WtaPclghMGI/AAAAAAAAN00/4Cais5iSDRwwUyU6jEc7qlCojlg1izsVgCLcBGAs/s1600/noImage.png';
          }

          h += '<li><div class="related-thumb"><a class="related-img lazyload" href="'+href+
               '" style="background:url('+img+') no-repeat center center;background-size: cover"></a></div>'+
               '<h3 class="related-title"><a href="'+href+'">'+title+'</a></h3></li>';
        }
        h += '</div>';
        $box.html(h);
      },
      error:function(){ $box.hide(); }
    });
  }

  $("#related-posts").each(function(){
    var $el=$(this), label=$.trim($el.attr("data-label")||$el.text()||"");
    relatedPost($el,label,6);
  });
});
</script>
