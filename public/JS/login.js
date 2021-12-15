let userName = document.getElementById("username");
let pwd = document.getElementById("password");
let form = document.querySelector("form");

function validateInput() {
	//check username is empty
    let count =0;
	if (userName.value.trim() === "") {
		onError(userName, "Username cannot be empty");
        count+=1;
	} else {
		onSuccess(userName);
	}
	//password
	if (pwd.value.trim() === "") {
		onError(pwd, "Password cannot be empty");
        count+=1;
	} else {
		onSuccess(pwd);
	}
    if(count==0){
        return true;
       }else{
           return false;
       }
}

document.querySelector(".form").addEventListener("submit", (event) => {
	if (validateInput() === false) {
		event.preventDefault();
	}
});

function onSuccess(input){
    let parent=input.parentElement;
    let messageEle=parent.querySelector("small");
    messageEle.style.visibility="hidden"; 
    parent.classList.remove("error");
    parent.classList.add("success");  
}
function onError(input,message){
    let parent=input.parentElement;
    let messageEle=parent.querySelector("small");
    messageEle.style.visibility="visible";
    messageEle.innerText=message;  
    parent.classList.add("error");
    parent.classList.remove("success");

}
