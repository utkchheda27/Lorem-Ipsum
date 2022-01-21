
const btnCtn = document.querySelector('.btn-ctn-profile-page') //container of btn


if (btnCtn) {
  // All types of btn
  const friendRequestBtn = document.createElement('button') //send friend request
  friendRequestBtn.classList.add('btn1')
  friendRequestBtn.innerText = "Add Friend"
  const cancelRequestBtn = document.createElement('button') // cancels a friends request
  cancelRequestBtn.classList.add('btn1')
  cancelRequestBtn.innerText = "Cancel Request"
  const acceptBtn = document.createElement('button') // accepts a request
  acceptBtn.classList.add('btn1')
  acceptBtn.innerText = "Accept"
  const rejectBtn = document.createElement('button') // rejects a request 
  rejectBtn.classList.add('btn1')
  rejectBtn.innerText = "Reject"
  const removeFriendBtn = document.createElement('button') // removes a friends
  removeFriendBtn.classList.add('btn1')
  removeFriendBtn.innerText = "Unfriend"

  //loggedInUserInfo
  let loggedInuser = null

  // loading animation
  const loadingAnimationCtn = document.createElement('div')
  loadingAnimationCtn.classList.add('align-center-ctn')
  loadingAnimationCtn.innerHTML = '<div class="lds-ellipsis" ><div></div><div></div><div></div><div></div></div >'

  //overlay
  const overlay = document.createElement('div')
  overlay.classList.add('cover-screen')

  const id = window.location.pathname.split('/')[2] //id of current user
  // Adding click Events


  const errorCtn = document.createElement('div')
  errorCtn.classList.add('errorCtn')
  const error = document.createElement('div')
  error.classList.add('error')
  errorCtn.append(error)

  //loggedInUser
  const loggedInUser = null

  friendRequestBtn.addEventListener('click', async (e) => {
    overlay.appendChild(loadingAnimationCtn)
    document.querySelector('body').appendChild(overlay)
    const res1 = await axios.get('/api/loggedInUserInfo');
    // console.log(res1)
    const loggedInuser = res1.data.loggedInuser
    const { data } = await axios.post(`/user/${loggedInuser._id}/requests/${id}`)
    // console.log(data)
    if (!data.status) {
      // console.log(data.error)
      loadingAnimationCtn.remove()
      overlay.remove()
      error.innerText = data.error
      errorCtn.classList.add('show')
      setTimeout(() => {
        errorCtn.classList.remove('show')
        error.innerText = ""
      }, 5000)
    } else {
      friendRequestBtn.remove();
      btnCtn.append(cancelRequestBtn)
      loadingAnimationCtn.remove()
      overlay.remove()
      // console.log(errorCtn)
    }

  })

  cancelRequestBtn.addEventListener('click', async () => {
    overlay.appendChild(loadingAnimationCtn)
    document.querySelector('body').appendChild(overlay)
    const res1 = await axios.get('/api/loggedInUserInfo');
    const loggedInuser = res1.data.loggedInuser
    const { data } = await axios.delete(`/user/${loggedInuser._id}/requests/sent/${id}`)
    if (!data.status) {
      // console.log(data.error)
      loadingAnimationCtn.remove()
      overlay.remove()
      error.innerText = data.error
      errorCtn.classList.add('show')
      setTimeout(() => {
        errorCtn.classList.remove('show')
        error.innerText = ""
      }, 5000)
    } else {
      cancelRequestBtn.remove();
      btnCtn.append(friendRequestBtn)
      loadingAnimationCtn.remove()
      overlay.remove()
    }

  })

  acceptBtn.addEventListener('click', async () => {
    overlay.appendChild(loadingAnimationCtn)
    document.querySelector('body').appendChild(overlay)
    const res = await axios.get('/api/loggedInUserInfo');
    const loggedInuser = res.data.loggedInuser
    const { data } = await axios.post(`/user/${loggedInuser._id}/requests/${id}/response`, { status: true });
    if (data.status === false) {
      // console.log(data.error)
      loadingAnimationCtn.remove()
      overlay.remove()
      error.innerText = data.error
      errorCtn.classList.add('show')
      setTimeout(() => {
        errorCtn.classList.remove('show')
        error.innerText = ""
      }, 5000)
    } else {
      acceptBtn.remove();
      rejectBtn.remove();
      btnCtn.append(removeFriendBtn)
      loadingAnimationCtn.remove()
      overlay.remove()
    }
  })

  rejectBtn.addEventListener('click', async () => {
    overlay.appendChild(loadingAnimationCtn)
    document.querySelector('body').appendChild(overlay)
    const res1 = await axios.get('/api/loggedInUserInfo');
    const loggedInuser = res1.data.loggedInuser
    const { data } = await axios.post(`/user/${loggedInuser._id}/requests/${id}/response`, { status: false });
    if (data.status) {
      // console.log(data.error)
      loadingAnimationCtn.remove()
      overlay.remove()
      error.innerText = data.error
      errorCtn.classList.add('show')
      setTimeout(() => {
        errorCtn.classList.remove('show')
        error.innerText = ""
      }, 5000)
    } else {
      rejectBtn.remove()
      acceptBtn.remove()
      btnCtn.append(friendRequestBtn)
      loadingAnimationCtn.remove()
      overlay.remove()
    }

  })

  removeFriendBtn.addEventListener('click', async () => {
    overlay.appendChild(loadingAnimationCtn)
    document.querySelector('body').appendChild(overlay)
    const res1 = await axios.get('/api/loggedInUserInfo');
    const loggedInuser = res1.data.loggedInuser
    const { data } = await axios.delete(`/user/${loggedInuser._id}/friends/${id}`)
    // console.log(data);
    if (data.error) {
      loadingAnimationCtn.remove()
      overlay.remove()
      error.innerText = data.error
      errorCtn.classList.add('show')
      setTimeout(() => {
        // console.log("Here")
        errorCtn.classList.remove('show')
        error.innerText = ""
      }, 5000)
    } else {
      removeFriendBtn.remove()
      btnCtn.append(friendRequestBtn)
      loadingAnimationCtn.remove()
      overlay.remove()
    }
  })

  window.addEventListener('load', async () => {
    const res = await axios.get('/api/loggedInUserInfo');
    document.querySelector('body').appendChild(errorCtn)
    loggedInuser = res.data.loggedInuser
    if (loggedInuser.friends.find(id1 => String(id1) === String(id))) {
      btnCtn.append(removeFriendBtn)
    } else if (loggedInuser.requests.find(id1 => String(id1) === String(id))) {
      btnCtn.append(acceptBtn, rejectBtn)
    } else if (loggedInuser.sentRequests.find(id1 => String(id1) === String(id))) {
      btnCtn.append(cancelRequestBtn)
    } else {
      btnCtn.append(friendRequestBtn)
    }
  })
}
const body = document.querySelector('body')
let currentUser = window.location.pathname.split('/')[2]
let loggedInuser = null

const getLoggedInUser = async () => {
  const { data } = await axios.get('/api/loggedInUserInfo')
  loggedInuser = data.loggedInuser
}
getLoggedInUser()
// loading animation element
const loadingElementCtn = document.createElement('div')
loadingElementCtn.classList.add('loading-animation-ctn')
const loadingElement = document.createElement('div')
loadingElement.classList.add('lds-dual-ring')
loadingElementCtn.append(loadingElement)

//overlay
const overlay = document.createElement('div')
overlay.classList.add('overlay')

//user posts section
const main = document.querySelector('.user-posts')
const postInput = document.querySelector('.create-post-form .create-post-form-input')
postInput && postInput.addEventListener('click', (e) => {

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
                  </a>dr
                </div>
                <div class="create-post-user-name">
                  <a href="/user/${loggedInuser._id}">
                    <span>${loggedInuser.username}</span>
                  </a>
                </div>
              </div>
              <form action="/posts" method="post" class="create-post-form-overlay" enctype="multipart/form-data">
                <textarea name="caption" id="" cols="30" rows="10" class="create-post-caption"
                  placeholder="What's in your mind, ${loggedInuser.username.trim().split(" ")[0]} ?"></textarea>
                  <div class="create-post-submit-btn-ctn">
                  <input autocomplete="off" type="file" name="images" class="create-post-img-link"
                     autocomplete="off" multiple >
                  <button type="submit" class="submit-btn">
                    Post
                  </button>
                </div>
              </form>
            </div>
  `
  body.append(overlay)
  body.classList.add('noscroll')
  // body.style.filter = 'blur(2px)';
  postInput.blur()
  closeOverLayBtn = document.querySelector(".create-post-title .close-btn-ctn button")
  closeOverLayBtn.addEventListener('click', () => {
    overlay.innerHTML = ``;
    overlay.remove()
    closeOverLayBtn = undefined;
    body.style.filter = 'none'
    body.classList.remove('noscroll')

  })
})

const handleCommentForm = async (id, post1) => {
  const commentInput = post1.children[post1.children.length - 2].children[0].children[1].children[0]
  const commentText = commentInput.value
  const { data } = await axios.post(`/posts/${id}/comments`, {
    commentBody: commentText
  })
  const { date, time } = data
  if (data.status) {
    const commentElement = createCommentObj(commentText, date, time, data.commentId, id, post1)
    post1.children[post1.children.length - 1].prepend(commentElement)
    post1.children[2].children[2].innerText = data.commentsLength === 1 ? `1 Comment` : `${data.commentsLength} Comments`
    post1.children[post1.children.length - 1].classList.remove('display-none')
    // console.log(post1.children[post1.children.length - 1].children[post1.children[post1.children.length - 1].children.length - 1])
    if (post1.children[post1.children.length - 1].children[post1.children[post1.children.length - 1].children.length - 1].classList.contains('no-comment')) {
      post1.children[post1.children.length - 1].children[post1.children[post1.children.length - 1].children.length - 1].remove()
    }
    post1.children[3].children[1].classList.add('comment-click-btn')
  }
}


const createCommentObj = (commentText, date, time, commentId, postId, post) => {
  const commentCtn = document.createElement('article')
  commentCtn.classList.add('comment')
  commentCtn.innerHTML = `<div class="comment-header">
      <div class="commentators-img-ctn">
        <a href="/user/${loggedInuser.profilePicture_id}">
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
      </div> 
      <div class="comment-morebtn-ctn">
        <button class="comment-morebtn">Delete</button>
      </div>
    </div>
    <div class="comment-body">
      <p class="comment-text">
        ${commentText}
      </p>
    </div>`
  commentCtn.children[0].children[commentCtn.children[0].children.length - 1].children[0].addEventListener('click', () => {
    deleteComment(commentId, postId, commentCtn, post)
  })
  // console.log(commentCtn.children[0].children[commentCtn.children[0].children.length - 1].children[0])
  return commentCtn;
}

const deleteComment = async (commentId, postId, domELe, post) => {
  const { data } = await axios.delete(`/posts/${postId}/comments/${commentId}`);
  if (data.status) {
    domELe.remove();
    post.children[2].children[2].innerText = data.commentsLength === 1 ? `1 Comment` : `${data.commentsLength} Comments`
    if (data.commentsLength == 0) {
      post.children[post.children.length - 1].innerHTML = `<h3 class="no-comment">This post has no commnets</h3>`
    }
  }
}

const unlikePost = async (post, _id) => {
  const res = await axios.delete(`/posts/${_id}/likes`);
  if (res.data.status == true) {
    post.children[2].children[0].innerText = `${res.data.noOfLikes === 1 ? `${res.data.noOfLikes} Like` : `${res.data.noOfLikes} Likes`}`
    // post.children[3].children[0].children[0].innerText = "Like"
    // post.children[3].children[0].children[1].classList.remove('fas')
    // post.children[3].children[0].children[1].classList.add('far')
    // post.children[3].children[0].onClick = null;
    // post.children[3].children[0].addEventListener('click', () => {
    //   postLike(post, _id);
    // })
    // post.children[2].children[0].innerText = res.data.noOfLikes === 1 ? "1 Like" : `${data.noOfLikes} Likes`
    post.children[3].children[0].remove();
    const tempBtn = document.createElement('button');
    tempBtn.classList.add('like-btn')
    const tempSpan = document.createElement('span');
    tempSpan.innerText = `Like`
    const tempIcon = document.createElement('i');
    tempIcon.classList.add('far')
    tempIcon.classList.add('fa-thumbs-up')
    tempBtn.append(tempSpan, tempIcon);
    tempBtn.addEventListener('click', () => {
      postLike(post, _id);
    })
    post.children[3].prepend(tempBtn)
  }
}

const postLike = async (post, _id) => {
  const res = await axios.post(`/posts/${_id}/likes`);
  if (res.data.status == true) {
    post.children[2].children[0].innerText = `${res.data.noOfLikes === 1 ? `${res.data.noOfLikes} Like` : `${res.data.noOfLikes} Likes`}`
    // post.children[3].children[0].children[0].innerText = "Liked"
    // post.children[3].children[0].children[1].classList.remove('far')
    // post.children[3].children[0].children[1].classList.add('fas')
    // post.children[3].children[0].onClick = null;
    // post.children[3].children[0].addEventListener('click', () => {
    //   unlikePost(post, _id);
    // })
    // post.children[2].children[0].innerText = data.noOfLikes === 1 ? "1 Like" : `${data.noOfLikes} Likes`
    post.children[3].children[0].remove();
    const tempBtn = document.createElement('button');
    tempBtn.classList.add('like-btn')
    const tempSpan = document.createElement('span');
    tempSpan.innerText = `Liked `
    const tempIcon = document.createElement('i');
    tempIcon.classList.add('fas')
    tempIcon.classList.add('fa-thumbs-up')
    tempBtn.append(tempSpan, tempIcon);
    tempBtn.addEventListener('click', () => {
      unlikePost(post, _id);
    })
    post.children[3].prepend(tempBtn)
  }
}

const createPost = ({ caption, likes, comments, images, date, User, time, _id }) => {
  // console.log(comments)
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
                <div class="morebtn-ctn ${String(User._id) !== String(loggedInuser._id) ? 'display-none' : ''}">
                  <button class="more-btn">
                    <i class="fas fa-ellipsis-h"></i>
                  </button>
                  <div class="post-header-pop-up-options display-none">
                    <div>
                      <form action="/posts/${_id}?_method=DELETE" method="post">
                        <button>
                          <i class="fa fa-times"></i>
                          <span>Delete post</span>
                        </button>
                      </form>
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
                  ${likes.length === 1 ? `1 Like` : `${likes.length} Likes`}
                </span>
                <span class="dot"></span>
                <span class="comment-count">
                   ${comments.length === 1 ? "1 Comment" : `${comments.length} Comments`}
                </span>
              </div>
              <div class="post-footer">
                <button class="like-btn">
                  <span>${likes.some((like) => String(like.author) === String(loggedInuser._id)) ? "Liked" : "Like"}</span>
                  <i class="${likes.some((like) => String(like.author) === String(loggedInuser._id)) ? "fas" : "far"}  fa-thumbs-up"></i>
                </button>
                <button class="comment-btn">
                  <span>Comment</span>
                  <i class="far fa-comments"></i>
                </button>
              </div>
              <div class="create-comment-form">
            <form class="comment-form">
              <div class="img-ctn">
                <a href="/user/${loggedInuser._id} ">
                  <img src=${loggedInuser.profilePicture} alt="" class="comment-loggedIn-user"></a>
              </div>
              <div class="text-input">
                <input autocomplete="off" name="commentBody" class="comment-body-input">
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
  if (likes.some((like) => String(like.author) === String(loggedInuser._id)) === false) {
    post.children[3].children[0].addEventListener('click', () => {
      postLike(post, _id)
    })
  } else {
    post.children[3].children[0].addEventListener('click', () => {
      unlikePost(post, _id)
    })
  }
  if (comments.length === 0) {
    commentContainer.innerHTML = `<h3 class="no-comment">This post has no commnets</h3>`
  }
  else {
    for (let comment of comments) {
      if (comment != null) {
        const tempArticle = document.createElement('article')
        tempArticle.classList.add('comment')
        tempArticle.innerHTML = `
                      <div class="comment-header">
                        <div class="commentators-img-ctn">
                          <a href="/user/${comment.author._id}">
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
            deleteComment(comment._id, _id, tempArticle, post);
          })
        }
        commentContainer.append(tempArticle)
      }

    }
  }
  post.append(commentContainer)

  return post

}

const toogleMoreOptionMenu = (btn) => { // toogles more option on a post
  // btn.nextElementSibling.classList.remove('display-none')
  if (btn.nextElementSibling.classList.contains('display-none')) {
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

const addApost = (post) => { // returns a post DOM object
  // if(post.comments.)
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
    if (e.target.children[1].children[0].value.toString().length === 0) return;
    handleCommentForm(post._id, post1)
    e.target.children[1].children[0].value = ""
  })
  return post1
}




const mainLoadEventHandler = async () => {  // load event handler
  main.append(loadingElementCtn)
  const { data } = await axios.get(`/posts?id=${currentUser}`)
  // console.log(data)
  if (data.posts.length === 0) {
    loadingElementCtn.remove();
    // main.innerHTML = `
    // <div className="align-center">
    //   <h1>
    //       ${loggedInuser.username} haven't posted anything
    //   </h1>
    // </div>
    // `
    // return;
  }
  const posts = []

  for (let post of data.posts) {
    const t = addApost(post);
    posts.push(t);
  }
  main.append(...posts)
  carasolSelector()
  loadingElementCtn.remove()

}

const carasolSelector = () => {
  var swiper = new Swiper(".mySwiper", {
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

}

const bioPopUpBtn = document.querySelector('.bio-form-btn')

const createBioForm = () => {
  const bioFormCtn = document.createElement('div')
  const idCtn = document.querySelector('.user-id')
  const id = String(idCtn.innerText).trim()
  // console.log(id)
  bioFormCtn.classList.add('bio-form-ctn')
  bioFormCtn.innerHTML = `
            <button  class="close-bio-form-btn">
              <i class="far fa-times-circle"></i>
            </button>
            <form method="POST" action="/user/${id}?_method=PUT" class="bio-form">
              <textarea name="description" class="description" placeholder="Say Something About Yourself"></textarea>
              <button>Add Bio</button>
            </form>
  `
  return bioFormCtn
}

//method="POST" action="/resource?_method=DELETE"

if (bioPopUpBtn) {
  bioPopUpBtn.addEventListener('click', () => {
    const overlay1 = document.createElement('div')
    overlay1.classList.add('cover-screen')
    overlay1.classList.add('overlay')
    overlay1.classList.add('z-200')
    const editBioForm = createBioForm();
    overlay1.append(editBioForm)
    document.querySelector('body').append(overlay1);
    document.querySelector('body').classList.add('overflow-hidden')
    editBioForm.children[0].addEventListener('click', () => {
      overlay1.remove()
      document.querySelector('body').classList.remove('overflow-hidden')
    })
  })
}

const editDetailBtn = document.querySelector('.edit-detail-form-popup-btn')
const editInterestsForm = document.querySelector('.edit-interest-form-popup-btn')

const createDetailsEditForm = () => {
  const detailsEditForm = document.createElement('div')
  const idCtn = document.querySelector('.user-id')
  const id = String(idCtn.innerText).trim()

  detailsEditForm.classList.add('edit-details-form-ctn')
  console.log("description ==> ", loggedInuser.description)
  detailsEditForm.innerHTML = `
  <div class="edit-details-form-title">
              Edit Details
            </div>
            <button class="close-details-edit-form-btn">
              <i class="far fa-times-circle"></i>
            </button>
            <form class="edit-details-form" method="POST" action="/user/${id}?_method=PUT">
              <input autocomplete="off" type="text" ${loggedInuser.description !== undefined ? `value="${loggedInuser.description}"` : ''} class="description-input details-input" placeholder="Description" name="description" >
              <input autocomplete="off" type="text" ${loggedInuser.country !== undefined ? `value="${loggedInuser.country}"` : ''} class="country details-input" placeholder="Country" name="country" >
              <input autocomplete="off" type="text" ${loggedInuser.state !== undefined ? `value="${loggedInuser.state}"` : ''} name="state" class="state details-input" placeholder="State">
              <input autocomplete="off" type="text" ${loggedInuser.city !== undefined ? `value="${loggedInuser.city}"` : ''} name="city" class="city details-input" placeholder="City">
              <input autocomplete="off" type="text" ${loggedInuser.yearOfGraduation !== undefined ? `value="${loggedInuser.yearOfGraduation}"` : ''} name="yearOfGraduation" class="year-of-graduation details-input" placeholder="Year of graduation ">
              <div class="branch-ctn">
                <label for="branch" class="branch-label">Course : </label>
                <select name="course" class="course" value=${loggedInuser.course} >
                  <option value="B. Tech.">Bachelor of Technology</option>
                  <option value="M. Tech.">Master of Technology</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Ph. D.">Doctor of Philosophy</option>
                  <option value="MCA">MCA</option>
                </select>
              </div>
              <div class="branch-ctn">
                <label for="branch" class="branch-label">Branch : </label>
                <select name="branchInCollege" class="course" value=${loggedInuser.branchInCollege} >
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Electronics Engineering">Electronics Engineering</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Production Engineering">Production Engineering</option>
                  <option value="Textile Engineering">Textile Engineering</option>
                </select>
              </div>
              <div class="edit-details-submit-btn-ctn">
                <button class="edit-details-submit-btn" type="submit">Update!</button>
              </div>
            </form>
  `
  return detailsEditForm
}

if (editDetailBtn) {
  editDetailBtn.addEventListener('click', () => {
    const overlay1 = document.createElement('div')
    // overlay1.classList.add('cover-screen')
    overlay1.classList.add('overlay')
    overlay1.classList.add('z-200')
    const detailsEditForm = createDetailsEditForm()
    console.log(detailsEditForm)
    overlay1.append(detailsEditForm);
    document.querySelector('body').append(overlay1);
    document.querySelector('body').classList.add('overflow-hidden')
    document.querySelector('.close-details-edit-form-btn').addEventListener('click', () => {
      overlay1.remove()
      document.querySelector('body').classList.remove('overflow-hidden')
    })
  })
}

const createEditInterestsForm = () => {
  const idCtn = document.querySelector('.user-id')
  const id = String(idCtn.innerText).trim()

  const formCtn = document.createElement('div')
  formCtn.classList.add('edit-interests-form-ctn')
  formCtn.innerHTML = `
  <button class="close-interests-edit-form-btn">
              <i class="far fa-times-circle"></i>
            </button>
  <form method="POST" action="/user/${id}?_method=PUT" class="edit-interests-form">
              <h1 class="title">Edit Interests</h1>
              <div class="check-box-ctn">
                <div class="input">
                  <label for="cricket" class="label">
                    <img src="/assets/tick-mark-2.png" alt="" class="overlay-tick ${loggedInuser.interests.includes('cricket') === true ? "" : "display-none"}">
                    <img src="/assets/cricket.jpg" alt=""
                      style="height: 100px; width: 100px; border-radius: 20px; object-fit: cover;">
                  </label>
                  <input autocomplete="off" type="checkbox" name="interests[cricket]" id="cricket" class="interests-input" ${loggedInuser.interests.includes('cricket') === true ? "checked" : ""} >
                </div>
                <div class="input">
                  <label for="football" class="label">
                    <img src="/assets/tick-mark-2.png" alt="" class="overlay-tick ${loggedInuser.interests.includes('football') === true ? "" : "display-none"}">
                    <img src="/assets/football.jpg" alt=""
                      style="height: 100px; width: 100px; border-radius: 20px; object-fit: cover;">
                  </label>
                  <input autocomplete="off" type="checkbox" name="interests[football]" id="football" class="interests-input" ${loggedInuser.interests.includes('football') === true ? "checked" : ""} >
                </div>
                <div class="input">
                  <label for="singing" class="label" class="label">
                    <img src="/assets/tick-mark-2.png" alt="" class="overlay-tick ${loggedInuser.interests.includes('singing') === true ? "" : "display-none"}">
                    <img src="/assets/singing.jpg" alt=""
                      style="height: 100px; width: 100px; border-radius: 20px; object-fit: cover; position: relative;top: 0;">
                  </label>
                  <input autocomplete="off" type="checkbox" name="interests[singing]" id="singing" class="interests-input" ${loggedInuser.interests.includes('singing') === true ? "checked" : ""} >
                </div>
                <div class="input">
                  <label for="coding" class="label">
                    <img src="/assets/tick-mark-2.png" alt="" class="overlay-tick ${loggedInuser.interests.includes('coding') === true ? "" : "display-none"}">
                    <img src="/assets/coding.jpg" alt=""
                      style="height: 100px; width: 100px; border-radius: 20px; object-fit: cover;">
                  </label>
                  <input autocomplete="off" type="checkbox" name="interests[coding]" id="coding" class="interests-input" ${loggedInuser.interests.includes('coding') === true ? "checked" : ""} >
                </div>
                <div class="input">
                  <label for="dancing" class="label">
                    <img src="/assets/tick-mark-2.png" alt="" class="overlay-tick ${loggedInuser.interests.includes('dancing') === true ? "" : "display-none"}">
                    <img src="/assets/dancing.jpg" alt=""
                      style="height: 100px; width: 100px; border-radius: 20px; object-fit: cover;">
                  </label>
                  <input autocomplete="off" type="checkbox" name="interests[dancing]" id="dancing" class="interests-input" ${loggedInuser.interests.includes('dancing') === true ? "checked" : ""} >
                </div>
              </div>
              <div class="edit-interests-form-submit-btn-ctn">
                <button class="edit-interests-form-submit-btn">Update!</button>
              </div>
            </form>
  `
  return formCtn
}

if (editInterestsForm) {
  editInterestsForm.addEventListener('click', () => {
    const overlay = document.createElement('div')
    overlay.classList.add('overlay')
    overlay.classList.add('z-200')
    const editInterestsForm = createEditInterestsForm()
    overlay.appendChild(editInterestsForm)
    document.querySelector('body').append(overlay);
    document.querySelector('body').classList.add('overflow-hidden')
    const checkBoxs = document.querySelectorAll('.interests-input')

    for (let checkBox of checkBoxs) {
      checkBox.addEventListener('click', () => {
        checkBox.parentNode.children[0].children[0].classList.toggle('display-none')
      })
    }

    document.querySelector('.close-interests-edit-form-btn').addEventListener('click', () => {
      overlay.remove()
      document.querySelector('body').classList.remove('overflow-hidden')
    })
  })
}

// const checkBoxs = document.querySelectorAll('.interests-input')

// for (let checkBox of checkBoxs) {
//   checkBox.addEventListener('click', () => {
//     checkBox.parentNode.children[0].children[0].classList.toggle('display-none')
//   })
// }


// const profilePicture = document.querySelector('.profile-img')
// if (profilePicture) {
//   profilePicture.addEventListener('click', () => {
//     profilePicture.classList.add('high-z-index');
//   })
// }

window.addEventListener('load', mainLoadEventHandler)  // adds load event to window which adds post to main element