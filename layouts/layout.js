import Image from 'next/image'
import Container from '@/components/Container'
import TagItem from '@/components/TagItem'
import { NotionRenderer, Equation, Code, Collection, CollectionRow } from 'react-notion-x'
import BLOG from '@/blog.config'
import formatDate from '@/lib/formatDate'
import { useLocale } from '@/lib/locale'
import { useRouter } from 'next/router'
import Comments from '@/components/Comments'

const mapPageUrl = id => {
  return 'https://www.notion.so/' + id.replace(/-/g, '')
}

const Layout = ({
  children,
  blockMap,
  frontMatter,
  emailHash,
  fullWidth = false
}) => {
  const locale = useLocale()
  const router = useRouter()
  const html = `<script>
  function welcome() {
    console.log("clicked");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userEmailSaved");
    window.location.reload();
    return false;
  }
</script>

<head>
  <script type="text/javascript">
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "7ebf4eb1-38f7-4c10-8fab-db71c20240ef";
    (function() {
      d = document;
      s = d.createElement("script");
      s.src = "https://client.crisp.chat/l.js";
      s.async = 1;
      d.getElementsByTagName("head")[0].appendChild(s);
    })();
  </script>

  <script charset="UTF-8" src="https://cdn.mojoauth.com/js/mojoauth.min.js"></script>
  <script type="text/javascript">

    var AccessToken = localStorage.getItem("userToken");
    var EmailSaved = localStorage.getItem("userEmailSaved");
    const apikey = "test-719a9ce7-f1d9-4044-bc09-783779c4f9bb"
    // If we don't find access token we open acess to do the login
    if (AccessToken == null && window.location.href == "https://jornadasdomar.gq/log-in") {
      //add mojo div
      var mojoEl = document.createElement("div");
      mojoEl.setAttribute('id', 'mojoauth-passwordless-form');
      mojoEl.setAttribute('style', 'background-color: cadetblue; width: 100%; height: 100%; position: absolute; top: 0;');
      document.body.appendChild(mojoEl);
      var mojoauth = new MojoAuth(apikey, {
        language: 'language_code',
        redirect_url: "https://jornadasdomar.gq",
        source: [{
          type: "email",
          feature: "magiclink"
        }],
      })
      mojoauth.signIn().then(response => {
        console.log("signed in", response);
        //console.log(response.oauth.access_token);
        localStorage.setItem('userToken', response.oauth.access_token);
        localStorage.setItem('userEmailSaved', response.user.email);
        mojoEl.remove(); //remove element after login
        window.location.reload();
        return false;
      });
    } else if (AccessToken != null && window.location.href == "https://jornadasdomar.gq/log-in") {
      //has token, lets see if its valid if not, we remove the token and reload the page
      var mojoauth = new MojoAuth(apikey);
      // Use verifyToken() for token verification
      mojoauth.verifyToken(AccessToken).then(response => {
        if (!response.isValid || response.isValid == false) {
          console.log("user not logged in");
          //remove credentials and reload
          localStorage.removeItem("userToken");
          localStorage.removeItem("userEmailSaved");
          window.location.reload();
          return false;
        } else {
          console.log("valid log in, proceed", response);
          document.getElementById("mojoauth-passwordless-form").remove();
          console.log("removed mojo aftyer verification");
        }
      });
    } else { //remove mojo
      document.getElementById('mojoauth-passwordless-form').outerHTML = ''; 
      console.log("removed mojo on simple else");
    }
  </script>
      <script type="text/javascript">
          let previousUrl = "";
  
          const observer = new MutationObserver(() => {
              if (window.location.href !== previousUrl) {
                  console.log("URL changed from " + previousUrl + " to " + window.location.href);
                  previousUrl = window.location.href;
                  // do your thing
                  if (window.location.href != "https://jornadasdomar.gq/log-in") {
                  //remove mojo div
                      document.getElementById('mojoauth-passwordless-form').outerHTML = ''; 
                      document.getElementById('mojoauth-login-container').outerHTML = ''; 
                      document.getElementById("mojoauth-passwordless-form").remove();
                      console.log("removed mojo event");
                  }
              }
          });
          const config = { subtree: true, childList: true };
  
          // start observing change
          observer.observe(document, config);
      </script>
</head>

<body>
  <button onclick="welcome()"> Welcome to our website </button>
</body>

<style>
  :root {
    --bg-color: #f6f6f6;
    --fg-color: #373530;
  }

  body {
    overflow: scroll;
    overflow-x: hidden !important;
    scrollbar-width: none;
    background-color: #FCFCF4 !important;
  }

  body::-webkit-scrollbar {
    width: 0em;
  }

  .notion-frame {
    background-color: #FCFCF4 !important;
  }

  .notion-page-scroller {}

  .notion-full-width {}

  .notion-page-content-inner {}

  .notion-page {
    /*width: 100% !important;*/
    margin-top: 0% !important;
    background-color: #FCFCF4 !important;
    scroll-snap-type: y !important;
  }

  .notion {
    font-size: 16px;
  }

  .notion-title {
    display: none;
  }

  .index-page .notion-page-link {
    display: none;
  }

  .notion-page-icon-inline {
    display: none;
  }

  .notion-collection-card {
    box-shadow: none !important;
  }

  .notion-collection-card-property {
    display: flex;
    justify-content: center;
  }

  .notion-callout {
    border-radius: 8px !important;
    background-color: #822BDD !important;
    color: white !important;
    width: 100% !important;
    justify-content: center !important;
    box-shadow: 0 10px 20px -10px #516Bbef !important;
  }

  .notion-callout .notion-link {
    opacity: 1 !important;
    font-size: 18px;
    border: none;
  }

  .notion-callout:hover {
    background-color: #a175d1 !important;
  }

  .notion-callout-text {
    display: flex;
    justify-content: center;
  }

  /*hero image block*/
  .notion-block-93ecb7a733b146e8846df004c4e841a4 {
    width: 100vw !important;
    height: 100vh !important;
    background-image: url('https://user-images.githubusercontent.com/25424969/197489563-19eddc09-a5f1-4855-9a96-82df1ab46dc6.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    image-rendering: -webkit-optimize-contrast;
    scroll-snap-align: start !important;
  }

  .notion-block-93ecb7a733b146e8846df004c4e841a4>div {
    /*width: 50vw !important;
      height: 50vh !important;
      position: absolute;*/
    opacity: 0;
  }

  /*.notion-block-64adfdda7d8a4973bb11b3dd7dcdf312{
      width: 100vw !important;
      height: 100vh !important;
      background-image: url('https://user-images.githubusercontent.com/25424969/197489563-19eddc09-a5f1-4855-9a96-82df1ab46dc6.jpg');
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center center;
      image-rendering: -webkit-optimize-contrast;
      scroll-snap-align: start !important;
          
          
  }*/
  /*editon info class
  .notion-block-ba1ef29269fa4682a6391e19c7b57768{
      width: 100vw !important;
      height: 60vh !important;
      background-image: url('https://user-images.githubusercontent.com/25424969/197521679-a3127327-4454-41d5-a4b2-be9d17267b2a.jpg');
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center center;
      image-rendering: -webkit-optimize-contrast;
      scroll-snap-align: start !important;
      color: transparent;
  }*/
  /*About us   class
  .notion-block-ea02492a6b41430ea579156279fdef9c{
      width: 100vw !important;
      height: 100vh !important;
      background-image: url('https://user-images.githubusercontent.com/25424969/197496849-80181320-4f8c-4536-9176-8a9601938e80.jpg');
      background-size: cover;
      background-position: center center;
      image-rendering: -webkit-optimize-contrast;
      color:  transparent;
      scroll-snap-align: start !important;
  }*/
  /* Extra small devices (phones, 600px and down) */
  @media only screen and (max-width: 600px) {
    /*hero  class
      .notion-block-64adfdda7d8a4973bb11b3dd7dcdf312{
          width: 100vw !important;
          height: 100vh !important;
          background-image: url('https://user-images.githubusercontent.com/25424969/197534765-baff8ed5-ca1a-4317-93bb-3913ce64932c.jpg');
          background-repeat: no-repeat;
          background-size: contain;
          background-size: auto 100%;
          background-position: center center;
          image-rendering: -webkit-optimize-contrast;
          scroll-snap-align: start !important;
          
      }*/
    /*editon info class
      .notion-block-ba1ef29269fa4682a6391e19c7b57768{ 
          width: 90vw !important;
          height: 20vh !important;
          background-image: url('https://user-images.githubusercontent.com/25424969/197521679-a3127327-4454-41d5-a4b2-be9d17267b2a.jpg');
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center center;
          image-rendering: -webkit-optimize-contrast;
          scroll-snap-align: start !important;
          color: transparent;
      }*/
    /*About us   class
      .notion-block-ea02492a6b41430ea579156279fdef9c{
          width: 90vw !important;
          height: 30vh !important;
          background-image: url('https://user-images.githubusercontent.com/25424969/197496849-80181320-4f8c-4536-9176-8a9601938e80.jpg');
          background-repeat: no-repeat;
          background-size: contain;
          background-position: center center;
          image-rendering: -webkit-optimize-contrast;
          color:  transparent;
          scroll-snap-align: start !important;
      }*/
  }

  iframe {
    pointer-events: unset !important;
    /*add this so the embeds can be clickable*/
  }
</style>`
  function createMarkup(c){
    return { __html: c };
  }
  return (
    <Container
      layout="blog"
      title={frontMatter.title}
      description={frontMatter.summary}
      // date={new Date(frontMatter.publishedAt).toISOString()}
      type="article"
      fullWidth={fullWidth}
    >
      <article>
        <h1 className="font-bold text-3xl text-black dark:text-white">
          {frontMatter.title}
        </h1>
        {frontMatter.type[0] !== 'Page' && (
          <nav className="flex mt-7 items-start text-gray-500 dark:text-gray-400">
            <div className="flex mb-4">
              <a href={BLOG.socialLink || '#'} className="flex">
                <Image
                  alt={BLOG.author}
                  width={24}
                  height={24}
                  src={`https://gravatar.com/avatar/${emailHash}`}
                  className="rounded-full"
                />
                <p className="ml-2 md:block">{BLOG.author}</p>
              </a>
              <span className="block">&nbsp;/&nbsp;</span>
            </div>
            <div className="mr-2 mb-4 md:ml-0">
              {formatDate(
                frontMatter?.date?.start_date || frontMatter.createdTime,
                BLOG.lang
              )}
            </div>
            {frontMatter.tags && (
              <div className="flex flex-nowrap max-w-full overflow-x-auto article-tags">
                {frontMatter.tags.map(tag => (
                  <TagItem key={tag} tag={tag} />
                ))}
              </div>
            )}
          </nav>
        )}
        {children}
        {blockMap && (
          <div className="-mt-4">
            <NotionRenderer
              recordMap={blockMap}
              components={{
                equation: Equation,
                code: Code,
                collection: Collection,
                collectionRow: CollectionRow
              }}
              mapPageUrl={mapPageUrl}
            />
          </div>
        )}
      <div dangerouslySetInnerHTML={createMarkup(html)}></div>
      </article>
      <div className="flex justify-between font-medium text-gray-500 dark:text-gray-400">
        <a>
          <button
            onClick={() => router.push(BLOG.path || '/')}
            className="mt-2 cursor-pointer hover:text-black dark:hover:text-gray-100"
          >
            ← {locale.POST.BACK}
          </button>
        </a>
        <a>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mt-2 cursor-pointer hover:text-black dark:hover:text-gray-100"
          >
            ↑ {locale.POST.TOP}
          </button>
        </a>
      </div>
      <Comments frontMatter={frontMatter} />
    </Container>
  )
}

export default Layout
