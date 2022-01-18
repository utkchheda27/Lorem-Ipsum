const dropDownBtn = document.querySelector('.drop-down-menu-btn')
const dropDownMenu = document.querySelector('.drop-down-menu')
dropDownBtn.addEventListener('click', () => {
    dropDownMenu.classList.toggle('display-none')
})

const searchRedirectBtn = document.querySelector('.search-redirect-btn')
const deleteAccountBtn = document.querySelector('.delete-user-btn')

deleteAccountBtn.addEventListener('click', (e) => {
    const res = confirm("Are you sure you want to delete your account ? ( You won't be able to recover it )")
    if (res == false) {
        e.preventDefault()
    }
})


searchRedirectBtn.addEventListener('click', () => {
    window.location.replace("/search");
})