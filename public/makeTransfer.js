let confirmButton = document.getElementById("makeTransfer")
let bankToID = document.getElementById("bankToID")
let accountToID = document.getElementById("accountToID")
let bankFromID = document.getElementById("bankFromID")
let accountFromID = document.getElementById("accountFromID")
let amount = document.getElementById("amount")
let message = document.getElementById("message")

confirmButton.addEventListener("click", validate)

function validate(event) {
    // prevent submitting the form until validation occurs
    message.style.display = "hidden"
    message.innerText = ""
    event.preventDefault();
    // make sure required fields have values
    if (bankToID.value !== "" && accountToID.value !== ""
        && bankFromID.value !== "" && accountFromID.value !== "" && amount.value !== "" && amount.value > 0) {
        makeTransfer();
    } else if (amount.value <= 0) {
        message.style.display = "block"
        message.className = "alert alert-danger mt-4"
        message.innerText = "Please provide a positive amount.";
    } else {
        message.style.display = "block"
        message.className = "alert alert-danger mt-4"
        message.innerText = "Please fill out all required fields.";
    }
}
function makeTransfer(event) {
    // setup POST request to server
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", responseHandler)
    query = `amount=${amount.value}&bankFromID=${bankFromID.value}&accountFromID=${accountFromID.value}&bankToID=${bankToID.value}&accountToID=${accountToID.value}`
    url = `/make_transfer`
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
        bankToID.value = "";
        accountToID.value = "";
        bankFromID.value = "";
        accountFromID.value = "";
        amount.value = "";
    } else {
        message.style.display = "block"
        message.className = "alert alert-danger mt-4"
        message.innerText = this.response.message;
    }
}
