let socket = io();
let friend = undefined
let loggedInuser = undefined
const sendMessageBtn = document.querySelector('.submit-btn');
const chatID = window.location.pathname.split('/')[2];
const form = document.querySelector('.message-form')
const messageInput = document.querySelector('.message-input')
const messagesCtn = document.querySelector('.messages')
const messagesCtnS = document.querySelector('.messages-ctn')
const loadingAnimation = document.querySelector('.loading-chat')
const createMessage = (text, rec, date) => {
    const t = new Date(date);
    const message = document.createElement('li')
    const span = document.createElement('span')
    const span2 = document.createElement('span')
    span2.classList.add('dateAndTime')
    span2.innerText = `${t.getDate()}/${t.getMonth() + 1}/${t.getFullYear() % 100}   ${t.getHours()}:${t.getMinutes()}`
    span.innerText = text;
    message.classList.add('message', String(rec));
    message.append(span)
    message.append(span2)
    return message
}
form.addEventListener('submit', (e) => {
    e.preventDefault()
    const unreadedMessageCount = document.querySelector('.unreadedMessageCount');
    if (unreadedMessageCount) {
        unreadedMessageCount.remove();
    }
    if (messageInput.value.trim()) {
        socket.emit('message', { message: messageInput.value.trim(), to: friend.username.trim(), from: loggedInuser._id, chatID })
        appendMessage(messageInput.value.trim(), 'sent', new Date())
        messageInput.value = ''
    }
})

messageInput.addEventListener('keyup', () => {
    socket.emit('typing', { to: friend.username.trim() });
})


const appendMessage = (text, rec, date) => {
    messagesCtn.append(createMessage(text, rec, date));
    messagesCtnS.scrollTop = messagesCtnS.scrollHeight;
}

socket.on('new message', async ({ message: text, date = undefined, msgID }) => {
    // console.log(date)
    const res = await axios.put(`/api/chat/${chatID}/messages/${msgID}`, { isReaded: true })
    appendMessage(text, "recieved", date)
})

let timeOutCode = undefined;
socket.on('friendTyping', () => {
    if (timeOutCode !== undefined) {
        clearTimeout(timeOutCode)
    }
    // console.log(`${friend.username} is typing...`)
    document.querySelector(".friendTyping").innerText = `${friend.username} is typing...`;
    timeOutCode = setTimeout(() => {
        document.querySelector(".friendTyping").innerText = '';
        timeOutCode = undefined
    }, 1500);

})

socket
const addFriendInfo = (username, profilePicture, id) => {
    const friendInfoTab = document.createElement('div');
    friendInfoTab.classList.add("friend-info")
    friendInfoTab.innerHTML = `
    <div class="profile-picture">
                    <img src='${profilePicture}'
                        alt="" srcset="">
                </div>
                <div class="name">
                    <a href="/user/${id}">
                        <h1>
                            ${username}
                        </h1>
                    </a>
                    <p class="friendTyping">
                    </p>
                </div>
    `
    messagesCtnS.parentElement.prepend(friendInfoTab);
}

window.onload = async () => {

    if (chatID) {
        const chatData = await axios.get(`/api/chat/${chatID}`);
        const { data } = await axios.get('/api/loggedInUserInfo');
        // console.log(chatData.data.chatData)
        // console.log(chatData.data.unreadedMsgs)
        // console.log(data)

        loggedInuser = data.loggedInuser

        if (String(chatData.data.chatData.participants[0]._id) === String(loggedInuser._id)) {
            friend = chatData.data.chatData.participants[1];
        } else {
            friend = chatData.data.chatData.participants[0];
        }

        addFriendInfo(friend.username, friend.profilePicture, friend._id)
        // console.log(chatData.data.unreadedMsgs)


        for (let message of chatData.data.chatData.messages) {
            if ((chatData.data.firstUnreadedMsg !== undefined) && (String(chatData.data.firstUnreadedMsg) === String(message._id))) {
                const label = document.createElement('div');
                label.classList.add('unreadedMessageCount')
                label.innerText = `${chatData.data.unreadedMsgs} messsages unreaded`
                messagesCtn.appendChild(label)
            }
            if (String(loggedInuser._id) === String(message.author)) {
                appendMessage(message.text, 'sent', message.date)
            } else {
                appendMessage(message.text, 'recieved', message.date)
            }
        }
        if (friend.friends.some((f) => String(f) === String(loggedInuser._id)) === false) {
            form.remove();
            const disMsg = document.createElement('div');
            disMsg.innerText = `You cannot send message as you are no longer friends with ${friend.username}`;
            document.querySelector('.ctn').append(disMsg);
        }

        messagesCtnS.scrollTop = messagesCtnS.scrollHeight;
        loadingAnimation.remove()

    }

}