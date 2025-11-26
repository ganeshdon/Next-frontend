import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-9H4HVE7C7R"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-9H4HVE7C7R');
            `,
          }}
        />
        {/* Microsoft Clarity */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "tpiv5tdupm");
            `,
          }}
        />
        {/* Tawk.to Widget Size Control */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Prevent full screen - force widget size */
              #tawkchat-container,
              #tawkchat-container iframe,
              .tawk-chat-container,
              .tawk-chat-container iframe,
              iframe[title*="Tawk"],
              iframe[id*="tawk"],
              div[id*="tawk"],
              div[class*="tawk"] {
                max-width: 400px !important;
                max-height: 600px !important;
                width: 400px !important;
                height: 600px !important;
              }
              
              /* Prevent any element from taking full screen */
              body > div[style*="width: 100%"],
              body > div[style*="width:100%"],
              body > div[style*="height: 100%"],
              body > div[style*="height:100%"] {
                max-width: 400px !important;
                max-height: 600px !important;
              }
              
              @media (max-width: 480px) {
                #tawkchat-container,
                #tawkchat-container iframe,
                .tawk-chat-container,
                .tawk-chat-container iframe {
                  max-width: 100% !important;
                  width: 100% !important;
                  max-height: 100vh !important;
                  height: 100vh !important;
                }
              }
            `,
          }}
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
        {/* Tawk.to Chat Widget */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/6074672d067c2605c0c1a922/1f33b62tp';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
              })();
              
              // Function to force widget to default size
              function forceWidgetSize(){
                var chatContainer = document.getElementById('tawkchat-container');
                var allTawkElements = document.querySelectorAll('[id*="tawk"], [class*="tawk"], iframe[title*="Tawk"]');
                
                if(chatContainer){
                  chatContainer.style.setProperty('width', '400px', 'important');
                  chatContainer.style.setProperty('height', '600px', 'important');
                  chatContainer.style.setProperty('max-width', '400px', 'important');
                  chatContainer.style.setProperty('max-height', '600px', 'important');
                  chatContainer.style.setProperty('right', '20px', 'important');
                  chatContainer.style.setProperty('bottom', '80px', 'important');
                  chatContainer.style.setProperty('left', 'auto', 'important');
                  chatContainer.style.setProperty('top', 'auto', 'important');
                }
                
                allTawkElements.forEach(function(el){
                  if(el.tagName === 'IFRAME'){
                    el.style.setProperty('width', '400px', 'important');
                    el.style.setProperty('height', '600px', 'important');
                    el.style.setProperty('max-width', '400px', 'important');
                    el.style.setProperty('max-height', '600px', 'important');
                  }
                });
              }
              
              // Override maximize function to prevent full screen
              var originalMaximize = null;
              Tawk_API.onLoad = function(){
                // Store original maximize function
                if(Tawk_API.maximize){
                  originalMaximize = Tawk_API.maximize.bind(Tawk_API);
                }
                
                // Override maximize to use default size
                Tawk_API.maximize = function(){
                  forceWidgetSize();
                  // Don't call original maximize - prevent full screen
                };
                
                // Force size on load
                setTimeout(forceWidgetSize, 1000);
                setTimeout(forceWidgetSize, 2000);
                setTimeout(forceWidgetSize, 3000);
              };
              
              // Override maximize event
              Tawk_API.onChatMaximized = function(){
                setTimeout(forceWidgetSize, 50);
                setTimeout(forceWidgetSize, 100);
                setTimeout(forceWidgetSize, 200);
              };
              
              // Monitor for size changes using MutationObserver
              setTimeout(function(){
                var observer = new MutationObserver(function(mutations){
                  forceWidgetSize();
                });
                
                var targetNode = document.body;
                observer.observe(targetNode, {
                  childList: true,
                  subtree: true,
                  attributes: true,
                  attributeFilter: ['style', 'class', 'id']
                });
                
                // Also check periodically
                setInterval(forceWidgetSize, 1000);
              }, 3000);
            `,
          }}
        />
      </body>
    </Html>
  );
}
