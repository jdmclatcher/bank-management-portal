let createButton = document.getElementById("createAccount")
let bankID = document.getElementById("bankID")
let accountID = document.getElementById("accountID")
let accountType = document.getElementById("accountType")
let customerID = document.getElementById("customerID")
let balance = document.getElementById("balance")
let minBalance = document.getElementById("minBalance")
let interestRate = document.getElementById("interestRate")
let maxWithdraws = document.getElementById("maxWithdraws")

function validate(event) {
    // prevent submitting the form until validation occurs
    message.style.display = "hidden"
    event.preventDefault();
    // make sure required fields have values
    if (bankID.value !== "" && accountID.value !== "" && accountType.value !== "") {
        createAccount();
    } else {
        message.style.display = "block"
        message.className = "alert alert-danger mt-4"
        message.innerText = "Please fill out all required fields.";
    }
}

createButton.addEventListener("click", validate)

function createAccount(event) {
    // setup POST request to server
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", responseHandler)
    query = `customerID=${customerID.value}&accountType=${accountType.value}&bankID=${bankID.value}&accountID=${accountID.value}&balance=${balance.value}&interestRate=${interestRate.value}&minBalance=${minBalance.value}&maxWithdraws=${maxWithdraws.value}`
    url = `/create_account`
    xhr.responseType = "json";
    xhr.open("POST", url)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xhr.send(query)
    bankID.value = ""
    accountID.value = ""
    accountType.value = ""
    customerID.value = ""
    balance.value = ""
    minBalance.value = ""
    interestRate.value = ""
    maxWithdraws.value = ""
}

// handle server response
function responseHandler() {
    if (this.response.success === true) {
        message.style.display = "block"
        message.className = "alert alert-success mt-4"
        message.innerText = this.response.message;
    } else {
        message.style.display = "block"
        message.className = "alert alert-danger mt-4"
        message.innerText = this.response.message;
    }
}
