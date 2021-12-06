const dropDownBtn = document.querySelector('.drop-down-menu-btn')
const dropDownMenu = document.querySelector('.drop-down-menu')
dropDownBtn.addEventListener('click', () => {
    dropDownMenu.classList.toggle('display-none')
})