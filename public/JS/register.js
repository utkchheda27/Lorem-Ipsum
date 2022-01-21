let userName = document.getElementById("txtUserName");
let email = document.getElementById("txtEmail");
let pwd = document.getElementById("txtPwd");
let conPwd = document.getElementById("txtConPwd");
let form = document.querySelector("form");

function validateInput() {
	//check username is empty
	let count = 0;
	if (userName.value.trim() === "") {
		onError(userName, "Username cannot be empty");
		count += 1;
	} else {
		onSuccess(userName);
	}
	if (email.value.trim() === "") {
		onError(email, "Email cannot be empty");
		count += 1;
	} else {
		if (!isValidEmail(email.value.trim())) {
			onError(email, "Email is not valid");
			count += 1;
		} else {
			onSuccess(email);
		}
	}

	//password
	if (pwd.value.trim() === "") {
		onError(pwd, "Password cannot be empty");
		count += 1;
	} else {
		onSuccess(pwd);
	}
	if (conPwd.value.trim() === "") {
		onError(conPwd, "Password cannot be empty");
		count += 1;
	} else {
		if (pwd.value.trim() !== conPwd.value.trim()) {
			onError(conPwd, "Not matching,Try again");
			count += 1;
		} else onSuccess(conPwd);
	}
	if (count == 0) {
		return true;
	} else {
		return false;
	}
}

document.querySelector(".form").addEventListener("submit", (event) => {
	console.log(validateInput())
	if (validateInput() === false) {
		event.preventDefault();
	}
});

function onSuccess(input) {
	let parent = input.parentElement;
	let messageEle = parent.querySelector("small");
	messageEle.style.visibility = "hidden";
	parent.classList.remove("error");
	parent.classList.add("success");
}
function onError(input, message) {
	let parent = input.parentElement;
	let messageEle = parent.querySelector("small");
	messageEle.style.visibility = "visible";
	messageEle.innerText = message;
	parent.classList.add("error");
	parent.classList.remove("success");
}

function isValidEmail(email) {
	const check =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return check.test(email);
}
