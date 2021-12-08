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


let loggedInuser = undefined

const getLoggedInUser = async () => {
  const res = await axios.get('/loggedInUserInfo');
  loggedInuser = res.data.loggedInuser
  console.log(loggedInuser)
}
getLoggedInUser()



const createCommentObj = (commentText, date, time) => {
  const commentCtn = document.createElement('article')
  commentCtn.classList.add('comment')
  commentCtn.innerHTML = `<div class="comment-header">
      <div class="commentators-img-ctn">
        <a href="#">
          <img src=${loggedInuser.profilePicture}
            alt="commentators picture" class="commentators-img">
        </a>
      </div>
      <div class="commentators-details">
        <a href="/user/${loggedInuser._id}">
          <span class="commentators-name">${loggedInuser.username}</span>
        </a>
        <div>
          <span class="time">${date}</span>
          <span class="time">${time}</span>
        </div>
      </div> <div class="comment-morebtn-ctn"><button class="comment-morebtn">Delete</button></div>
    </div>
    <div class="comment-body">
      <p class="comment-text">
        ${commentText}
      </p>
    </div>`
  return commentCtn;
}

const handleCommentForm = async (id, post1) => {
  const commentInput = post1.children[post1.children.length - 2].children[0].children[1].children[0]
  const commentText = commentInput.value
  const { data } = await axios.post(`/posts/${id}/comments`, {
    commentBody: commentText
  })
  const { date, time } = data
  if (data.status) {
    const commentElement = createCommentObj(commentText, date, time)
    post1.children[post1.children.length - 1].prepend(commentElement)
    console.log(post1.children[post1.children.length - 1])
    post1.children[post1.children.length - 1].classList.remove('display-none')
    post1.children[3].children[1].classList.add('comment-click-btn')
  }
}

// comment-click-btn
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
                  <a href="/user/${loggedInuser._id}">
                    <img
                    src=${loggedInuser.profilePicture}
                    alt="loggedInUserInfo" class="create-post-user-img">
                  </a>
                </div>
                <div class="create-post-user-name">
                  <a href="#">
                    <span>${loggedInuser.username}</span>
                  </a>
                </div>
              </div>
              <form action="/post" method="post" class="create-post-form-overlay" enctype="multipart/form-data">
                <textarea name="caption" id="" cols="30" rows="10" class="create-post-caption"
                  placeholder="What's in your find, ${loggedInuser.username.trim().split(" ")[0]} ?"></textarea>
                <input type="file" name="images" class="create-post-img-link"
                   autocomplete="off" multiple >
                <div class="create-post-submit-btn-ctn">
                  <button type="submit" class="submit-btn">
                    Post
                  </button>
                </div>
              </form>
            </div>
  `
  body.append(overlay)
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
  if (btn.nextElementSibling.nextElementSibling.classList.contains('display-none')) {
    btn.nextElementSibling.classList.remove('display-none')
  } else {
    btn.nextElementSibling.classList.add('display-none')
  }
}

const commentShowAndHide = (Btn) => { // shows and hides comment
  if (Btn.parentNode.nextElementSibling.nextElementSibling.classList.contains('display-none')) {
    Btn.parentNode.nextElementSibling.nextElementSibling.classList.remove('display-none')
    Btn.classList.add('comment-click-btn')
  }
  else {
    Btn.parentNode.nextElementSibling.nextElementSibling.classList.add('display-none')
    Btn.classList.remove('comment-click-btn')
  }
}

const delteComment = async (commentId, postId, domELe) => {
  console.log(commentId, postId, domELe)
  const { data } = await axios.delete(`/posts/${postId}/comments/${commentId}`);
  if (data.status) {
    domELe.remove();
  }
}

const createPost = ({ caption, likes, comments, images, date, User, time, _id }) => {
  const post = document.createElement('div') // post element
  post.classList.add('post')

  let sliderImages = ''
  for (let image of images) {
    sliderImages += ` <div class="swiper-slide">
                    <img
                      src=${image}
                      class="slide-image" alt="">
                  </div> `
  }

  const postImgCtn = images.length !== 0 ? `<div class="post-img-ctn">
              <div class="swiper mySwiper">
                <div class="swiper-wrapper">
                  ${sliderImages}
              </div>
              <div class="swiper-button-next"></div>
              <div class="swiper-button-prev"></div>
            </div>
          </div> ` : ""


  post.innerHTML = `<div class="post-header">
                <div class="post-user-img-ctn">
                  <a href="/user/${User._id}">
                    <img
                    src=${User.profilePicture}
                    alt="user profile" class="post-user-img">
                  </a>
                </div>
                <div class="user-name-date">
                  <a href="/user/${User._id}"><span class="username">${User.username}</span></a>
                  <div class="date-time">
                    <span>${date}</span>
                    <span>${time}</span>
                  </div>
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
                <p class="post-caption ${images.length === 0 ? "marginB" : ""}">
                  ${caption}
                </p>
                ${postImgCtn}
              </div>
              <div class="likes-comment-count">
                <span class="like-count">
                  ${likes.length} Likes
                </span>
                <span class="dot"></span>
                <span class="comment-count">
                   ${comments.length}  comments
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
              <div class="create-comment-form">
            <form class="comment-form">
              <div class="img-ctn">
                <a href="/user/${loggedInuser._id} ">
                  <img src=${loggedInuser.profilePicture} alt="" class="comment-loggedIn-user"></a>
              </div>
              <div class="text-input">
                <input name="commentBody" class="comment-body-input">
              </div>
              <div class="btn-ctn">
                <button type="submit">
                  <i class="fa fa-angle-double-right" aria-hidden="true"></i>
                </button>
              </div>
            </form>
          </div>
              `

  const commentContainer = document.createElement('div')
  commentContainer.classList.add('comments-ctn')
  commentContainer.classList.add('display-none')
  console.log(comments)
  if (comments.length === 0) {
    commentContainer.innerHTML = `<h3>This post has no commnets</h3>`
  }
  else {
    for (let comment of comments) {
      console.log(comment == null)
      if (comment != null) {
        const tempArticle = document.createElement('article')
        tempArticle.classList.add('comment')
        tempArticle.innerHTML = `
                      <div class="comment-header">
                        <div class="commentators-img-ctn">
                          <a href="#">
                            <img src=${comment.author.profilePicture}
                            alt="commentators picture" class="commentators-img">
                          </a>
                        </div>
                        <div class="commentators-details">
                          <a href="/user/${comment.author._id}">
                            <span class="commentators-name">${comment.author.username}</span>
                          </a>
                          <div>
                            <span class="time">${comment.date}</span>
                            <span class="time">${comment.time}</span>
                          </div>
                        </div>
                        ${String(comment.author._id) === String(loggedInuser._id) ? '<div class="comment-morebtn-ctn"><button class="comment-morebtn">Delete</button></div>' : ""}
                      </div>
                      <div class="comment-body">
                        <p class="comment-text">
                          ${comment.body}
                        </p>
                      </div>
      `
        if (tempArticle.children[0].children[2]) {
          tempArticle.children[0].children[2].children[0].addEventListener('click', () => {
            delteComment(comment._id, _id, tempArticle);
          })
        }
        commentContainer.append(tempArticle)
      }

    }
  }
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
  post1.children[post1.children.length - 2].children[0].addEventListener("submit", (e) => {
    e.preventDefault()
    handleCommentForm(post._id, post1)
    e.target.children[1].children[0].value = ""
  })
  return post1
}


const loadMoreHandler = async (e) => { // add more post at the end when user clicks on load more
  loadMoreBtn.remove()
  main.append(loadingElementCtn) // adding loading animation 
  pageNo++;
  const posts = await axios.get(`/get_posts?pageNo=${pageNo}`) // request backend for more posts
  const morePosts = posts.data.posts  // extract posts
  console.log(loadedPosts.size, morePosts.length)
  if (loadedPosts.size === morePosts.length) {
    const noMorePostsCtn = document.createElement('div');
    const h3 = document.createElement('h3');
    h3.innerText = "No More Posts";
    noMorePostsCtn.append(h3);
    noMorePostsCtn.classList.add('no-more-posts')
    loadingElementCtn.remove()
    main.append(noMorePostsCtn);
    return;
  }

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
  carasolSelector()
  main.append(loadMoreBtn) // appending load more posts option


}
loadMoreBtn.addEventListener('click', loadMoreHandler) // adds click event to loadmorw btn




const mainLoadEventHandler = async () => {  // load event handler
  main.append(loadingElementCtn)
  const data = await axios.get('/get_posts');
  console.log(data.length, loadedPosts.size);
  const posts = data.data.posts

  for (let post of posts) {
    loadedPosts.set(post._id, post)
  }
  const postElements = []
  for (let post of posts) {
    postElements.push(addApost(post))
  }
  main.append(...postElements)
  loadingElementCtn.remove()
  carasolSelector()
  main.append(loadMoreBtn)

}

const carasolSelector = () => {
  var swiper = new Swiper(".mySwiper", {
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

}

window.addEventListener('load', mainLoadEventHandler)  // adds load event to window which adds post to main element