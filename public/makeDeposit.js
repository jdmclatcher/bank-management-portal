let confirmButton = document.getElementById("makeDeposit")
let bankID = document.getElementById("bankID")
let accountID = document.getElementById("accountID")
let amount = document.getElementById("amount")
let message = document.getElementById("message")

confirmButton.addEventListener("click", validate)

function validate(event) {
    // prevent submitting the form until validation occurs
    message.style.display = "hidden"
    message.innerText = ""
    event.preventDefault();
    // make sure required fields have values
    if (bankID.value !== "" && accountID.value !== "" && amount.value !== "" && amount.value > 0) {
        makeDeposit();
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
function makeDeposit(event) {
    // setup POST request to server
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", responseHandler)
    query = `bankID=${bankID.value}&accountID=${accountID.value}&amount=${amount.value}`
    url = `/make_deposit`
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
        amount.value = "";
    } else {
        message.style.display = "block"
        message.className = "alert alert-danger mt-4"
        message.innerText = this.response.message;
    }
}
