const noOfMessages = document.querySelector('.no-of-messages')
const noOfRequests = document.querySelector('.no-of-requests')
let user = undefined;


const getUser = async () => {
    const res = await axios.get('/api/loggedInUserInfo');
    user = res.data.loggedInuser
}

getUser()
setInterval(async () => {

    try {
        const res = await axios.get(`/user/${user._id}/requests`);
        // console.log(res)
        // // console.log(noOfMessages)
        // // console.log(noOfRequests)
        if (res.data.requests.length !== 0) {
            noOfRequests.innerText = res.data.requests.length
            if (noOfRequests.classList.contains('display-none') === true) {
                noOfRequests.classList.remove('display-none')
            }
        } else {
            noOfRequests.innerText = 0
            if (noOfRequests.classList.contains('display-none') === false) {
                noOfRequests.classList.add('display-none')
            }
        }

        const { data } = await axios.get('/api/chat');
        // console.log(data)
        if (data.noOfUnreadedChats !== 0) {
            if (noOfMessages.classList.contains('display-none') === true)
                noOfMessages.classList.remove('display-none');
            noOfMessages.innerText = data.noOfUnreadedChats
        } else {
            if (noOfMessages.classList.contains('display-none') === false)
                noOfMessages.classList.add('display-none');
            noOfMessages.innerText = data.noOfUnreadedChats
        }
    } catch (e) {
        // console.log(e.message)
    }

}, 10000)
