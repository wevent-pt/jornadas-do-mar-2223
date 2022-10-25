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
  const html = `<head>
  <!-- live chat support -->
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
  </script> <!-- login and logout -->
  <script charset="UTF-8" src="https://cdn.mojoauth.com/js/mojoauth.min.js"></script>
  <script type="text/javascript">
    function welcome() {
      console.log("clicked");
      localStorage.removeItem("userToken");
      localStorage.removeItem("userEmailSaved");
      window.location.reload();
      return false;
    }
    var AccessToken = localStorage.getItem("userToken");
    var EmailSaved = localStorage.getItem("userEmailSaved");
    const apikey = "test-719a9ce7-f1d9-4044-bc09-783779c4f9bb" /* If we don't find access token we open acess to do the login */
    if (AccessToken == null && (window.location.href == "https://jornadasdomar.pedro.gq/log-in" || window.location
        .href == "http://localhost:3000/log-in")) {
      /*add mojo div*/
      var mojoEl = document.createElement("div");
      mojoEl.setAttribute('id', 'mojoauth-passwordless-form');
      mojoEl.setAttribute('style',
        'background-color: cadetblue; width: 100%; height: 100%; position: absolute; top: 0;');
      document.body.appendChild(mojoEl);
      var mojoauth = new MojoAuth(apikey, {
        language: 'language_code',
        redirect_url: "https://jornadasdomar.pedro.gq",
        source: [{
          type: "email",
          feature: "magiclink"
        }],
      });
      mojoauth.signIn().then(response => {
        console.log("signed in", response); /*console.log(response.oauth.access_token);*/
        localStorage.setItem('userToken', response.oauth.access_token);
        localStorage.setItem('userEmailSaved', response.user.email);
        mojoEl.remove(); /*remove element after login */
        window.location.reload();
        return false;
      });
    } else if (AccessToken != null && (window.location.href == "https://jornadasdomar.pedro.gq/log-in" || window
        .location.href == "http://localhost:3000/log-in")) {
      /*has token, lets see if its valid if not, we remove the token and reload the page */
      var mojoauth = new MojoAuth(apikey); /* Use verifyToken() for token verification */
      mojoauth.verifyToken(AccessToken).then(response => {
        if (!response.isValid || response.isValid == false) {
          console.log("user not logged in"); /*remove credentials and reload */
          localStorage.removeItem("userToken");
          localStorage.removeItem("userEmailSaved");
          window.location.reload();
          return false;
        } else {
          console.log("valid log in, proceed", response);
          if (document.getElementById("mojoauth-passwordless-form")) {
            document.getElementById("mojoauth-passwordless-form").remove()
          };
          console.log("removed mojo aftyer verification");
        }
      });
    } else if (document.getElementById('mojoauth-passwordless-form')) {
      /*remove mojo*/
      document.getElementById('mojoauth-passwordless-form').outerHTML = '';
      console.log("removed mojo on simple else");
    }
    let previousUrl = "";
    const observer = new MutationObserver(() => {
      if (window.location.href !== previousUrl) {
        console.log("URL changed from" + previousUrl + "to " + window.location.href);
        previousUrl = window.location.href; /* do your thing */
        if (window.location.href == "https://jornadasdomar.pedro.gq/log-in" && window.location.href !=
          "http://localhost:3000/log-in") {
          /*remove mojo div */
          if (document.getElementById('mojoauth-passwordless-form')) {
            document.getElementById('mojoauth-passwordless-form').outerHTML = '';
            document.getElementById('mojoauth-login-container').outerHTML = '';
            document.getElementById("mojoauth-passwordless-form").remove();
            console.log("removed mojo event");
          }
        }
      }
    });
    const config = {
      subtree: true,
      childList: true
    }; /* start observing change */
    observer.observe(document, config);
  </script>
</head>

<body> <button onclick="welcome()"> Welcome to our website </button></body>`
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
