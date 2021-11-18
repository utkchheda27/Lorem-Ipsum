const main = document.querySelector('.main') // selects the main block where we are rendering our posts

// loading animation element
const loadingElementCtn = document.createElement('div')
loadingElementCtn.classList.add('loading-animation-ctn')
const loadingElement = document.createElement('div')
loadingElement.classList.add('lds-dual-ring')
loadingElementCtn.append(loadingElement)

// body
const body = document.querySelector('body')

const loadedPosts = new Map() // stores all post on the page
let pageNo = 1; // page no



// load more btn which is at the bottom of the page 
const loadMoreBtn = document.createElement('button')
loadMoreBtn.innerText = "load more posts"
loadMoreBtn.classList.add('loadmore-btn')

//overlay
const overlay = document.createElement('div')
overlay.classList.add('overlay')


let closeOverLayBtn; // create-post-elemt-close-btn

// create post form
const postInput = document.querySelector('.create-post-form .create-post-form-input')
postInput.addEventListener('click', (e) => {
  overlay.innerHTML = `
 <div class="create-post-overlay">
              <div class="create-post-title">
                <div class="placeholder">

                </div>
                <div class="title-ctn">
                  <h3>Create Post</h3>
                </div>
                <div class="close-btn-ctn">
                  <button><i class="fa fa-times" aria-hidden="true"></i></button>
                </div>
              </div>
              <div class="create-post-user-info">
                <div class="create-post-user-img-ctn">
                  <a href="#">
                    <img
                    src="https://img.etimg.com/thumb/msid-50589035,width-650,imgsize-123073,,resizemode-4,quality-100/.jpg"
                    alt="loggedInUserInfo" class="create-post-user-img">
                  </a>
                </div>
                <div class="create-post-user-name">
                  <a href="#">
                    <span>Rajesh Koothrappali</span>
                  </a>
                </div>
              </div>
              <form action="/createPost" method="post" class="create-post-form-overlay">
                <textarea name="caption" id="" cols="30" rows="10" class="create-post-caption"
                  placeholder="What's in your find, Rajesh ?"></textarea>
                <input type="text" name="image" class="create-post-img-link"
                  placeholder="Wanna share image? submit link here" autocomplete="off">
                <div class="create-post-submit-btn-ctn">
                  <button type="submit" class="submit-btn">
                    Post
                  </button>
                </div>
              </form>
            </div>
  `
  main.append(overlay)
  body.classList.add('noscroll')
  postInput.blur()
  closeOverLayBtn = document.querySelector(".create-post-title .close-btn-ctn button")
  closeOverLayBtn.addEventListener('click', () => {
    overlay.innerHTML = ``;
    overlay.remove()
    closeOverLayBtn = undefined;
    body.classList.remove('noscroll')

  })
})


const toogleMoreOptionMenu = (btn) => { // toogles more option on a post
  // btn.nextElementSibling.classList.remove('display-none')
  if (btn.nextElementSibling.classList.contains('display-none')) {
    btn.nextElementSibling.classList.remove('display-none')
  } else {
    btn.nextElementSibling.classList.add('display-none')
  }
}

const commentShowAndHide = (Btn) => { // shows and hides comment

  if (Btn.parentNode.nextElementSibling.classList.contains('display-none')) {
    Btn.parentNode.nextElementSibling.classList.remove('display-none')
    Btn.classList.add('comment-click-btn')
  }
  else {
    Btn.parentNode.nextElementSibling.classList.add('display-none')
    Btn.classList.remove('comment-click-btn')
  }
}


const createPost = ({ Description, Likes, Comments, Images }) => {
  const post = document.createElement('div') // post element
  post.classList.add('post')
  post.innerHTML = `<div class="post-header">
                <div class="post-user-img-ctn">
                  <a href="#">
                    <img
                    src="https://images6.fanpop.com/image/photos/39400000/Bernadette-Rostenkowski-bernadette-rostenkowski-39458985-466-304.jpg"
                    alt="user profile" class="post-user-img">
                  </a>
                </div>
                <div class="user-name-date">
                  <a href="#"><span class="username">Bernadette Rostenkowski</span></a>
                  <span>3h</span>
                </div>
                <div class="morebtn-ctn">
                  <button class="more-btn">
                    <i class="fas fa-ellipsis-h"></i>
                  </button>
                  <div class="post-header-pop-up-options display-none">
                    <div>
                      <i class="fas fa-bookmark"></i>
                      <span>Save post</span>
                    </div>
                    <div>
                      <i class="fa fa-link"></i>
                      <span>Copy link</span>
                    </div>
                    <div>
                      <i class="fa fa-times"></i>
                      <span>Hide post</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="post-body">
                <p class="post-caption">
                  ${Description}
                </p>
                <div class="post-img-ctn">
                  <img
                    src=${Images[0]}
                    alt="post images" class="post-img">
                </div>
              </div>
              <div class="likes-comment-count">
                <span class="like-count">
                  ${Likes} Likes
                </span>
                <span class="dot"></span>
                <span class="comment-count">
                   ${Comments.length}  comments
                </span>
              </div>
              <div class="post-footer">
                <button class="like-btn">
                  <span>Like</span>
                  <i class="far fa-thumbs-up"></i>
                </button>
                <button class="comment-btn">
                  <span>Comment</span>
                  <i class="far fa-comments"></i>
                </button>
                <button class="share-btn">
                  <span>Share</span>
                  <i class="fas fa-share"></i>
                </button>
              </div>
              `


  let s = ''
  for (let comment of Comments) {
    s += `
    <article class="comment">
                    <div class="comment-header">
                      <div class="commentators-img-ctn">
                        <a href="#">
                          <img src="https://upload.wikimedia.org/wikipedia/en/d/da/Matt_LeBlanc_as_Joey_Tribbiani.jpg"
                          alt="commentators picture" class="commentators-img">
                        </a>
                      </div>
                      <div class="commentators-details">
                        <a href="#">
                          <span class="commentators-name">Joey_Tribbiani__</span>
                        </a>
                        <span class="time">3 h</span>
                      </div>
                      <div class="comment-morebtn-ctn">
                        <button class="comment-morebtn">
                          <i class="fas fa-ellipsis-h"></i>
                        </button>
                      </div>
                    </div>
                    <div class="comment-body">
                      <p class="comment-text">
                        ${comment}
                      </p>
                    </div>
                  </article>
    `
  }
  const commentContainer = document.createElement('div')
  commentContainer.classList.add('comments-ctn')
  commentContainer.classList.add('display-none')
  commentContainer.innerHTML = s;
  post.append(commentContainer)

  return post

}

const addApost = (post) => {
  const post1 = createPost(post)
  const btn = post1.childNodes[0].childNodes[5].childNodes[1]
  const Btn = post1.childNodes[6].childNodes[3]
  Btn.addEventListener('click', () => {
    commentShowAndHide(Btn)
  })
  btn.addEventListener('click', () => {
    toogleMoreOptionMenu(btn)
  })
  return post1
}


const loadMoreHandler = async (e) => { // add more post at the end when user clicks on load more
  loadMoreBtn.remove()
  main.append(loadingElementCtn) // adding loading animation 
  pageNo++;
  const posts = await axios.get(`/get_posts?pageNo=${pageNo}`) // request backend for more posts
  const morePosts = posts.data.posts  // extract posts
  const more = posts.data.more;
  const temp = []
  for (let post of morePosts) { // going through moreposts we check whether a post in moreposts is present in the loadedPosts if not we add post to main element and add that it to loaded posts

    if (loadedPosts.get(post._id) == undefined) {
      const postElement = addApost(post);
      temp.push(postElement);
      loadedPosts.set(post._id, post);
    }
  }
  loadingElementCtn.remove() // removing loading animation
  main.append(...temp)      // adding posts
  if (!more) {
    const noMorePostsCtn = document.createElement('div');
    const h3 = document.createElement('h3');
    h3.innerText = "No More Posts";
    noMorePostsCtn.append(h3);
    noMorePostsCtn.classList.add('no-more-posts')
    main.append(noMorePostsCtn);
  }
  else {
    main.append(loadMoreBtn) // appending load more posts option
  }

}
loadMoreBtn.addEventListener('click', loadMoreHandler) // adds click event to loadmorw btn




const mainLoadEventHandler = async () => {  // load event handler
  main.append(loadingElementCtn)
  const data = await axios.get('/get_posts');
  const posts = data.data.posts
  for (let post of posts) {
    loadedPosts.set(post._id, post)
  }
  const postElements = []
  for (let post of posts) {
    postElements.push(addApost(post))
  }
  loadingElementCtn.remove()
  main.append(...postElements)
  main.append(loadMoreBtn)
}

window.addEventListener('load', mainLoadEventHandler)  // adds load event to window which adds post to main element