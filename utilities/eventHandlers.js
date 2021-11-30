export const postInputClickHandler = (e) => {
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
}