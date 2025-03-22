window.addEventListener('load', function () {
    var gtmScript = document.createElement('script');
    gtmScript.src = "https://www.googletagmanager.com/gtag/js?id=G-8YBTB93Y69";
    gtmScript.async = true;
    document.head.appendChild(gtmScript);
  
    gtmScript.onload = function () {
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', 'G-8YBTB93Y69');
    };
  });
  