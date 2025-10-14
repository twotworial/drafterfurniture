<script>
!function(W,D){'use strict';
var nopage,jenis,nomerhal,lblname1;

/* build paginator html */
W.loophalaman=function(T){
  var h='',L=parseInt(numshowpage/2),b,m,x,e,s,r,n,t,a,i,p,g;
  numshowpage=(L==numshowpage-L)?2*L+1:numshowpage;
  b=nomerhal-L; if(b<1)b=1;
  m=parseInt(T/postperpage)+1; if(m-1==T/postperpage)m-=1;
  x=b+numshowpage-1; if(x>m)x=m;
  h+="<span class='showpageOf'>Page "+nomerhal+" of "+m+"</span>";
  s=parseInt(nomerhal)-1;
  if(nomerhal>1){
    h+= (nomerhal==2)
      ? (jenis=="page"
          ? '<span class="showpage"><a href="'+home_page+'">'+upPageWord+'</a></span>'
          : '<span class="showpageNum"><a href="/search/label/'+lblname1+'?&max-results='+postperpage+'">'+upPageWord+'</a></span>')
      : (jenis=="page"
          ? '<span class="showpageNum"><a href="#" onclick="redirectpage('+s+');return false">'+upPageWord+'</a></span>'
          : '<span class="showpageNum"><a href="#" onclick="redirectlabel('+s+');return false">'+upPageWord+'</a></span>');
  }
  if(b>1){
    h+= (jenis=="page"
          ? '<span class="showpageNum"><a href="'+home_page+'">1</a></span>'
          : '<span class="showpageNum"><a href="/search/label/'+lblname1+'?&max-results='+postperpage+'">1</a></span>');
  }
  for(e=b;e<=x;e++){
    if(nomerhal==e){ h+='<span class="showpagePoint">'+e+'</span>'; }
    else if(e==1){
      h+= (jenis=="page"
            ? '<span class="showpageNum"><a href="'+home_page+'">1</a></span>'
            : '<span class="showpageNum"><a href="/search/label/'+lblname1+'?&max-results='+postperpage+'">1</a></span>');
    }else{
      h+= (jenis=="page"
            ? '<span class="showpageNum"><a href="#" onclick="redirectpage('+e+');return false">'+e+'</a></span>'
            : '<span class="showpageNum"><a href="#" onclick="redirectlabel('+e+');return false">'+e+'</a></span>');
    }
  }
  if(x<m){
    h+= (jenis=="page"
          ? '<span class="showpageNum"><a href="#" onclick="redirectpage('+m+');return false">'+m+'</a></span>'
          : '<span class="showpageNum"><a href="#" onclick="redirectlabel('+m+');return false">'+m+'</a></span>');
  }
  r=parseInt(nomerhal)+1;
  if(nomerhal<m){
    h+= (jenis=="page"
          ? '<span class="showpageNum"><a href="#" onclick="redirectpage('+r+');return false">'+downPageWord+'</a></span>'
          : '<span class="showpageNum"><a href="#" onclick="redirectlabel('+r+');return false">'+downPageWord+'</a></span>');
  }
  a=D.getElementsByName('pageArea'); i=D.getElementById('blog-pager');
  for(p=0;p<a.length;p++) a[p].innerHTML=h;
  if(a&&a.length>0) h='';
  if(i) i.innerHTML=h;
};

/* callback total results */
W.hitungtotaldata=function(j){
  W.loophalaman(parseInt(j.feed.openSearch$totalResults.$t,10));
};

/* init */
W.halamanblogger=function(){
  var u=urlactivepage, s;
  if(u.indexOf('/search/label/')!=-1){
    lblname1=(u.indexOf('?updated-max')!=-1)
      ? u.substring(u.indexOf('/search/label/')+14,u.indexOf('?updated-max'))
      : u.substring(u.indexOf('/search/label/')+14,u.indexOf('?&max'));
  }
  if(u.indexOf('?q=')==-1 && u.indexOf('.html')==-1){
    if(u.indexOf('/search/label/')==-1){
      jenis='page';
      nomerhal=(urlactivepage.indexOf('#PageNo=')!=-1)?urlactivepage.substring(urlactivepage.indexOf('#PageNo=')+8):1;
      D.write('<script src="'+home_page+'feeds/posts/summary?max-results=1&alt=json-in-script&callback=hitungtotaldata"><\/script>');
    }else{
      jenis='label';
      if(u.indexOf('&max-results=')==-1) postperpage=20;
      nomerhal=(urlactivepage.indexOf('#PageNo=')!=-1)?urlactivepage.substring(urlactivepage.indexOf('#PageNo=')+8):1;
      D.write('<script src="'+home_page+'feeds/posts/summary/-/'+lblname1+'?alt=json-in-script&callback=hitungtotaldata&max-results=1"><\/script>');
    }
  }
};

/* helpers used by onclick */
W.redirectpage=function(p){
  var st=(p-1)*postperpage; nopage=p;
  var h=D.getElementsByTagName('head')[0], s=D.createElement('script');
  s.type='text/javascript';
  s.src=home_page+'feeds/posts/summary?start-index='+st+'&max-results=1&alt=json-in-script&callback=finddatepost';
  h.appendChild(s);
};
W.redirectlabel=function(p){
  var st=(p-1)*postperpage; nopage=p;
  var h=D.getElementsByTagName('head')[0], s=D.createElement('script');
  s.type='text/javascript';
  s.src=home_page+'feeds/posts/summary/-/'+lblname1+'?start-index='+st+'&max-results=1&alt=json-in-script&callback=finddatepost';
  h.appendChild(s);
};
W.finddatepost=function(j){
  var e=j.feed.entry[0], t=e.published.$t.substring(0,19)+e.published.$t.substring(23,29),
      qm=encodeURIComponent(t),
      u=(jenis=='page')
        ? '/search?updated-max='+qm+'&max-results='+postperpage+'#PageNo='+nopage
        : '/search/label/'+lblname1+'?updated-max='+qm+'&max-results='+postperpage+'#PageNo='+nopage;
  location.href=u;
};

/* auto-run */
W.halamanblogger();
}(window,document));
</script>
