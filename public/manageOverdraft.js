let confirmButton = document.getElementById("manageOverdraft")
let bankIDChecking = document.getElementById("bankIDChecking")
let accountIDChecking = document.getElementById("accountIDChecking")
let bankIDSavings = document.getElementById("bankIDSavings")
let accountIDSavings = document.getElementById("accountIDSavings")
let adding = document.getElementById("adding")
let message = document.getElementById("message")

confirmButton.addEventListener("click", validate)

function validate(event) {
    // prevent submitting the form until validation occurs
    message.style.display = "hidden"
    event.preventDefault();
    // make sure required fields have values
    if (bankIDChecking.value !== "" && accountIDChecking.value !== "") {
        manageOverdraft();
    } else {
        message.style.display = "block"
        message.className = "alert alert-danger mt-4"
        message.innerText = "Please fill out all required fields.";
    }
}
function manageOverdraft(event) {
    // setup POST request to server
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", responseHandler)
    query = `bankIDChecking=${bankIDChecking.value}&accountIDChecking=${accountIDChecking.value}&bankIDSavings=${bankIDSavings.value}&accountIDSavings=${accountIDSavings.value}&adding=${adding.checked}`
    url = `/manage_overdraft`
    xhr.responseType = "json";
    xhr.open("POST", url)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xhr.send(query)
}

// handle server response
function responseHandler() {
    if (this.response.success === true) {
        message.style.display = "block"
        message.className = "alert alert-success mt-4"
        message.innerText = this.response.message;
        bankIDChecking.value = "";
        accountIDChecking.value = "";
        bankIDSavings.value = "";
        accountIDSavings.value = "";
        adding.checked = false;
    } else {
        message.style.display = "block"
        message.className = "alert alert-danger mt-4"
        message.innerText = this.response.message;
    }
}
