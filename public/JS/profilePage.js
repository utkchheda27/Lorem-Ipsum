
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
        const res1 = await axios.get('/loggedInUserInfo');
        console.log(res1)
        const loggedInuser = res1.data.loggedInuser
        const { data } = await axios.post(`/user/${loggedInuser._id}/requests/${id}`)
        console.log(data)
        if (!data.status) {
            console.log(data.error)
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
            console.log(errorCtn)
        }

    })

    cancelRequestBtn.addEventListener('click', async () => {
        overlay.appendChild(loadingAnimationCtn)
        document.querySelector('body').appendChild(overlay)
        const res1 = await axios.get('/loggedInUserInfo');
        const loggedInuser = res1.data.loggedInuser
        const { data } = await axios.delete(`/user/${loggedInuser._id}/requests/sent/${id}`)
        if (!data.status) {
            console.log(data.error)
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
        const res = await axios.get('/loggedInUserInfo');
        const loggedInuser = res.data.loggedInuser
        const { data } = await axios.post(`/user/${loggedInuser._id}/requests/${id}/response`, { status: true });
        if (data.status) {
            console.log(data.error)
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
        const res1 = await axios.get('/loggedInUserInfo');
        const loggedInuser = res1.data.loggedInuser
        const { data } = await axios.post(`/user/${loggedInuser._id}/requests/${id}/response`, { status: false });
        if (data.status) {
            console.log(data.error)
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
        const res1 = await axios.get('/loggedInUserInfo');
        const loggedInuser = res1.data.loggedInuser
        const { data } = await axios.delete(`/user/${loggedInuser._id}/friends/${id}`)
        console.log(data);
        if (data.error) {
            loadingAnimationCtn.remove()
            overlay.remove()
            error.innerText = data.error
            errorCtn.classList.add('show')
            setTimeout(() => {
                console.log("Here")
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
        const res = await axios.get('/loggedInUserInfo');
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