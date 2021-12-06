const socket = io();
const messageForm = document.querySelector('.message-form')
const messageInput = document.querySelector('.message-input')

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    socket.emit('message', { message: messageInput.value })
    messageInput.value = ""
})
let loggedInUser = undefined
const getLoggedInUser = async () => {
    const { data } = await axios.get('/loggedInUserInfo')
    loggedInUser = data.loggedInuser
}
getLoggedInUser()

socket.on('newMessage', ({ message }) => {
    console.log(message)
})
socket.on('userOnline', ({ username }) => {
    console.log(username)
})
socket.on('userDisconnected', () => {
    console.log("user left")
})