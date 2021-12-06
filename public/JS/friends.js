
//animation ctn
const loadingAnimationCtn = document.createElement('div')
loadingAnimationCtn.classList.add('align-center-ctn')
loadingAnimationCtn.innerHTML = '<div class="lds-ellipsis" ><div></div><div></div><div></div><div></div></div >'
// part where every part will render
const requestsCtn = document.querySelector('.friends-ctn .type-friends-ctn')

// sub-part-btns
const suggestionBtn = document.querySelector('.list-options .suggestions')
const friendsBtn = document.querySelector('.list-options .friends')
const requestBtn = document.querySelector('.list-options .requests')
const sentRequestsBtn = document.querySelector('.list-options .sent-requests')
let active = requestBtn

// overlay
const overlay = document.createElement('div')
overlay.classList.add('cover-screen')

//loggedInUserInfo
let loggedInuser = null


//==== Error =====
const errorCtn = document.createElement('div')
errorCtn.classList.add('errorCtn')
const error = document.createElement('div')
error.classList.add('error')
errorCtn.append(error)

// variables for each subpart
let requests = []
let suggestions = []
let friends = []
let sentRequests = []


//cleaning 
const cleanRequestCtn = () => {
    let lastChild = requestsCtn.lastElementChild
    while (lastChild) {
        lastChild.remove()
        lastChild = requestsCtn.lastElementChild
    }
}

suggestionBtn.addEventListener('click', (e) => {
    if (active == suggestionBtn) return;
    active.classList.remove('is-active')
    suggestionBtn.classList.add('is-active')
    active = suggestionBtn
    cleanRequestCtn()
    if (suggestions.length == 0) {
    }
})

friendsBtn.addEventListener('click', () => {
    if (active == friendsBtn) return;
    active.classList.remove('is-active')
    friendsBtn.classList.add('is-active')
    active = friendsBtn
    cleanRequestCtn()
    if (friends.length == 0) {
        getFriends()
    } else {
        showFriends()
    }
})

requestBtn.addEventListener('click', () => {
    if (active == requestBtn) return;
    active.classList.remove('is-active')
    requestBtn.classList.add('is-active')
    active = requestBtn
    cleanRequestCtn()
    if (requests.length === 0) {
        getRequests()
    } else {
        showRequests()
    }
})

sentRequestsBtn.addEventListener('click', () => {
    if (active == sentRequestsBtn) return;
    active.classList.remove('is-active')
    sentRequestsBtn.classList.add('is-active')
    active = sentRequestsBtn
    cleanRequestCtn()
    if (sentRequests.length == 0) {
        getSentRequests()
    } else {
        showSentRequests()
    }
})


const getRequests = async () => {
    requestsCtn.append(loadingAnimationCtn)
    if (!loggedInuser) {
        const { data: { loggedInuser: resUser, status } } = await axios.get('/loggedInUserInfo')
        loggedInuser = resUser
    }
    const { data } = await axios.get(`/user/${loggedInuser._id}/requests`);
    if (!data.status) {
        loadingAnimationCtn.remove();
        error.innerText = data.error;
        errorCtn.classList.add('show')
        setTimeout(() => {
            errorCtn.classList.remove('show')
            error.innerText = ""
        }, 5000)

    } else {
        requests = data.requests
        console.log(requests)
        showRequests()
        loadingAnimationCtn.remove()
    }
}

const showRequests = () => {
    for (let request1 of requests) {
        const request = document.createElement('div')
        request.classList.add('type-friends')
        request.innerHTML = `
        <div class="profile-img-ctn">
            <img src=${request1.profilePicture}
                alt="" class="profile">
        </div>
        <div class="name-ctn">
            <h4 class="username">
                <a href='/user/${request1._id}' >
                    ${request1.username}
                </a>
            </h4>
        </div>
        <div class="response-ctn">
            <div>
                <button>
                    Accept <i class="fa fa-check" aria-hidden="true"></i>
                </button>
            </div>
            <div >
                <button class="danger">
                    Reject <i class="fa fa-times" aria-hidden="true"></i>
                </button>
            </div>
        </div>
        `
        request.lastElementChild.firstElementChild.addEventListener('click', () => {
            handleResponse(request1._id, true, request)
        })
        request.lastElementChild.lastElementChild.addEventListener('click', () => {
            handleResponse(request1._id, false, request)
        })
        requestsCtn.append(request)

    }

}


const getFriends = async () => {
    requestsCtn.append(loadingAnimationCtn)
    const { data } = await axios.get(`/user/${loggedInuser._id}/friends`)
    if (!data.status) {
        console.log(data.error)
        loadingAnimationCtn.remove()
        error.innerText = data.error
        errorCtn.classList.add('show')
        setTimeout(() => {
            errorCtn.classList.remove('show')
            error.innerText = ""
        }, 5000)
    }
    else {
        friends = data.friends
        showFriends()
        loadingAnimationCtn.remove()
    }

}

const showFriends = () => {
    for (let friend of friends) {
        const friend1 = document.createElement('div')
        friend1.classList.add('type-friends')
        friend1.innerHTML = `
        <div class="profile-img-ctn">
            <img src=${friend.profilePicture}
                alt="" class="profile">
        </div>
        <div class="name-ctn">
            <h4 class="username">
                <a href='/user/${friend._id}' >
                    ${friend.username}
                </a>
            </h4>
        </div>
        <div class="response-ctn">
                <div>
                    <button class="danger">Unfriend</button>
                </div>
        </div>
        `
        friend1.lastElementChild.lastElementChild.addEventListener('click', () => {
            unfriend(friend._id, friend1)
        })
        requestsCtn.append(friend1)
    }
}

const getSentRequests = async () => {
    requestsCtn.append(loadingAnimationCtn)
    const { data } = await axios.get(`/user/${loggedInuser._id}/requests/sent`)
    if (!data.status) {
        console.log(data.error)
        loadingAnimationCtn.remove()
        error.innerText = data.error
        errorCtn.classList.add('show')
        setTimeout(() => {
            errorCtn.classList.remove('show')
            error.innerText = ""
        }, 5000)
    } else {
        console.log("sentRequests => " + data.sentRequests)
        sentRequests = data.sentRequests
        showSentRequests();
        loadingAnimationCtn.remove()
    }
}

const showSentRequests = () => {
    for (let sentRequest of sentRequests) {
        const friend1 = document.createElement('div')
        friend1.classList.add('type-friends')
        friend1.innerHTML = `
        <div class="profile-img-ctn">
            <img src=${sentRequest.profilePicture}
                alt="" class="profile">
        </div>
        <div class="name-ctn">
            <h4 class="username">
                <a href='/user/${sentRequest._id}' >
                    ${sentRequest.username}
                </a>
            </h4>
        </div>
        <div class="response-ctn">
                <div>
                    <button class="danger">Cancel Request</button>
                </div>
        </div>
        `
        friend1.lastElementChild.lastElementChild.addEventListener('click', () => {
            cancelRequest(sentRequest._id, friend1)
        })

        requestsCtn.append(friend1)
    }
}


const handleResponse = async (id, status, reqDomEle) => {
    overlay.appendChild(loadingAnimationCtn)
    requestsCtn.appendChild(overlay)
    if (!loggedInuser) {
        const { loggedInuser: resLoggedInUser, status } = await axios.get('/loggedInUserInfo')
        loggedInuser = resLoggedInUser
    }
    const { data } = await axios.post(`/user/${loggedInuser._id}/requests/${id}/response`, { status: status });
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
        reqDomEle.remove()
        requests = requests.filter((r) => r._id !== id);
        loadingAnimationCtn.remove()
        overlay.remove()
    }
}

const unfriend = async (id, domEle) => {
    overlay.appendChild(loadingAnimationCtn)
    requestsCtn.appendChild(overlay)
    const { data } = await axios.delete(`/user/${loggedInuser._id}/friends/${id}`)
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
        domEle.remove();
        friends = friends.filter((f) => f._id !== id);
        loadingAnimationCtn.remove()
        overlay.remove()
    }

}

const cancelRequest = async (id, domEle) => {
    overlay.appendChild(loadingAnimationCtn)
    requestsCtn.appendChild(overlay)
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
        domEle.remove()
        requests = requests.filter(id1 => String(id1) !== String(id))
        loadingAnimationCtn.remove()
        overlay.remove()
    }

}


window.addEventListener('load', () => {
    getRequests();
    document.querySelector('body').appendChild(errorCtn)
})