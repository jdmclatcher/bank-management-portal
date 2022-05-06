let confirmButton = document.getElementById("manageAccounts")
let bankID = document.getElementById("bankID")
let accountID = document.getElementById("accountID")
let customerID = document.getElementById("customerID")
let adding = document.getElementById("adding")
let message = document.getElementById("message")

confirmButton.addEventListener("click", validate)

function validate(event) {
    // prevent submitting the form until validation occurs
    message.style.display = "hidden"
    event.preventDefault();
    // make sure required fields have values
    if (bankID.value !== "" && accountID.value !== "" && customerID.value !== "") {
        manageAccounts();
    } else {
        message.style.display = "block"
        message.className = "alert alert-danger mt-4"
        message.innerText = "Please fill out all required fields.";
    }
}
function manageAccounts(event) {
    // setup POST request to server
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", responseHandler)
    query = `customerID=${customerID.value}&bankID=${bankID.value}&accountID=${accountID.value}&adding=${adding.checked}`
    url = `/manage_accounts`
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
        bankID.value = "";
        accountID.value = "";
        customerID.value = "";
        adding.checked = false;
    } else {
        message.style.display = "block"
        message.className = "alert alert-danger mt-4"
        message.innerText = this.response.message;
    }
}
