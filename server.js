const express = require('express')
const mysql = require("mysql2") // for sql
const app = express()
const { json } = require("express/lib/response")
const ejs = require('ejs')
const port = 3000
let userType = null; // "admin", "manager", "customer", or "manager/customer"
let currentUserId = null;

// establish connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "minesql4",
  database: "bank_management",
});
connection.connect(function (err) {
  if (err) {
      console.log("Error connecting to MySQL", err);
  } else {
    console.log("Connection established");
  }
});

connection.query("set session SQL_MODE = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'", function(err) {
 if (err) {
   console.log(err);
 }
})

app.use(express.urlencoded({ extended: false }))
app.use(express.static("public"))
app.set('views', './public/views');
app.set('view engine', 'ejs');

// go to login page on startup
app.get("/", function (req, res) {
  userType = null;
  res.sendFile(__dirname + "/public/views/" + "login.html");
})

// TODO need this?
// app.get("/login", function (req, res) {
//   res.send("/")
// })

// app.get("/*", function(req, res) {
//   if (userType == null) {
//     // not logged in
//     res.redirect("/login")
//   } else {
//     res.redirect("/menu")
//   }
// })

app.post("/login", function(req, res) {
  // ensure passwords match
  let passwordMatch = false;
  connection.query("SELECT pwd FROM person WHERE perID = ?", [req.body.id], function (err, rows) {
    if (err || rows[0] == null) {
      res.json({success: false, message: "ID or Password is incorrect."})
    } else {
      // rows - returned list of objects from sql query
      if (req.body.password === rows[0].pwd) {
        passwordMatch = true;
      } else {
        res.json({success: false, message: "ID or Password is incorrect."})
      }
    }
    // determine what type of user is logging in
    if (passwordMatch) {
      // check if also a manager
      connection.query("SELECT perID FROM system_admin WHERE perID = ?", [req.body.id], function (err, rows) {
        if (err) {
          userType = null;
          currentUserId = null;
          res.json({success: false, message: "System error."})
        } else if (rows[0] == null) {
          // try checking if customer
          connection.query("SELECT manager FROM bank WHERE manager = ?", [req.body.id], function (err, rows) {
            if (err) {
              userType = null;
              currentUserId = null;
              res.json({success: false, message: "System error."})
            } else if (rows[0] == null) {
              // try checking if admin
              connection.query("SELECT perID FROM customer WHERE perID = ?", [req.body.id], function(err, rows) {
                if (err) {
                  userType = null;
                  currentUserId = null;
                  res.json({success: false, message: "System error."})
                } else if (rows[0] == null) {
                  // not in database
                  userType = null;
                  currentUserId = null;
                  res.json({ success: false, message: "ID or Password incorrect."});
                } else {
                  // know they are customer
                  userType = "customer"
                  currentUserId = req.body.id;
                  res.json({success: true, message: "Customer logged in."});
                }
              })
            } else {
              // check if they are both a manager and customer
              connection.query("SELECT perID FROM customer WHERE perID = ?", [req.body.id], function(err, rows) {
                if (err) {
                  userType = null;
                  currentUserId = null;
                  res.json({success: false, message: "System error."})
                } else if (rows[0] == null) {
                  // know they are a manager
                  userType = "manager"
                  currentUserId = req.body.id;
                  res.json({success: true, message: "Manager logged in."});
                } else {
                  // know they are customer & manager
                  userType = "manager/customer"
                  currentUserId = req.body.id;
                  res.json({success: true, message: "Manager/Customer logged in."});
                }
              })
            }
          })
        } else {
          // know they are an admin
          userType = "admin"
          currentUserId = req.body.id;
          res.json({success: true, message: "Admin logged in."});
        }
      })
    }
  })  
})

app.get("/menu", function (req, res) {
  if (userType == null) {
    res.sendFile(__dirname + "/public/views/" + "login.html")
  } else if (userType === "admin") {
    res.render('admin_menu', { user: currentUserId });
    res.end();
  } else if (userType === "manager") {
    res.render('manager_menu', { user: currentUserId });
    res.end();
  } else if (userType === "customer") {
    res.render('customer_menu', { user: currentUserId });
    res.end();
  } else if (userType === "manager/customer") {
    res.render('manager_customer_menu', { user: currentUserId });
    res.end();
  }
})

app.get("/view_stats", function(req, res) {
  if (currentUserId == null) {
    res.redirect("/");
  } else {
    res.sendFile(__dirname + "/public/views/" + "view_stats.html");
  }
})

app.get("/manage_users", function(req, res) {
  if (currentUserId == null) {
    res.redirect("/");
  } else {
    res.sendFile(__dirname + "/public/views/" + "manage_users.html");
  }
})

app.get("/account_menu", function(req, res) {
  if (currentUserId == null) {
    res.redirect("/");
  } else {
    res.sendFile(__dirname + "/public/views/" + "account_menu.html");
  }
})

app.get("/create_corporation", function(req, res) {
  if (currentUserId == null) {
    res.redirect("/");
  } else {
    res.sendFile(__dirname + "/public/views/" + "create_corporation.html");
  }
})

app.get("/stop_customer", function(req, res) {
  connection.query("SELECT perID FROM customer",function(err, customers) {
    if (err) {
      console.error("Server error.")
    } else if (currentUserId == null) {
      res.redirect("/");
    } else {
      // render ejs view for display table
      res.render('stop_customer', { customers: customers });
      res.end();
    }
  });
})

app.post("/stop_customer", function(req, res) {
  connection.query("call stop_customer_role(?)", [req.body.id], function(err, rows) {
    if (err || rows.affectedRows === 0) {
      res.json({ success: false, message: "Error stopping customer." })
    } else {
      res.json({ success: true, message: "Customer stopped successfully." })
    }
  })
})

app.get("/stop_employee", function(req, res) {
  connection.query("SELECT perID FROM employee",function(err, employees) {
    if (err) {
      console.error("Server error.")
    } else if (currentUserId == null) {
      res.redirect("/");
    } else {
      // render ejs view for display table
      res.render('stop_employee', { employees: employees });
      res.end();
    }
  });
})

app.post("/stop_employee", function(req, res) {
  connection.query("call stop_employee_role(?)", [req.body.id], function(err, rows) {
    if (err || rows.affectedRows === 0) {
      res.json({ success: false, message: "Error stopping employee." })
    } else {
      res.json({ success: true, message: "Employee stopped successfully." })
    }
  })
})

app.get("/replace_manager", function(req, res) {
  connection.query("SELECT DISTINCT bankID FROM bank",function(err, banks) {
    if (err) {
      console.error("Server error.")
    } else if (currentUserId == null) {
      res.redirect("/");
    } else {
      connection.query("SELECT perID FROM employee", function(err, employees) {
        if (err) {
          console.error("Server error.")
        } else {
          // render ejs view
          res.render('replace_manager', { banks: banks, employees: employees });
          res.end();
        }
      })
    }
  });
})

app.post("/replace_manager", function(req, res) {
  connection.query("call replace_manager(?, ?, ?)", [req.body.employeeID, req.body.bankID, req.body.salary], function(err, rows) {
    if (err || rows.affectedRows === 0) {
      res.json({ success: false, message: "Error replacing manager." })
    } else {
      res.json({ success: true, message: "Manager replaced successfully." })
    }
  })
})

app.get("/hire_worker", function(req, res) {
  connection.query("SELECT DISTINCT bankID FROM bank",function(err, banks) {
    if (err) {
      console.error("Server error.")
    } else if (currentUserId == null) {
      res.redirect("/");
    } else {
      connection.query("SELECT perID FROM employee", function(err, employees) {
        if (err) {
          console.error("Server error.")
        } else {
          // render ejs view
          res.render('hire_worker', { banks: banks, employees: employees });
          res.end();
        }
      })
    }
  });
})

app.post("/hire_worker", function(req, res) {
  connection.query("call hire_worker(?, ?, ?)", [req.body.employeeID, req.body.bankID, req.body.salary], function(err, rows) {
    if (err || rows.affectedRows === 0) {
      res.json({ success: false, message: "Error hiring worker." })
    } else {
      res.json({ success: true, message: "Worker hired successfully." })
    }
  })
})

app.get("/create_fee", function(req, res) {
  connection.query("SELECT DISTINCT bankID FROM interest_bearing",function(err, banks) {
    if (err) {
      console.error("Server error.")
    } else if (currentUserId == null) {
      res.redirect("/");
    } else {
      connection.query("SELECT DISTINCT accountID FROM interest_bearing", function(err, accounts) {
        if (err) {
          console.error("Server error.")
        } else {
          // render ejs view
          res.render('create_fee', { banks: banks, accounts: accounts });
          res.end();
        }
      })
    }
  });
})

app.post("/create_fee", function(req, res) {
  connection.query("call create_fee(?, ?, ?)", [req.body.bankID, req.body.accountID, req.body.feeType], function(err, rows) {
    if (err || rows.affectedRows === 0) {
      res.json({ success: false, message: "Error creating fee." })
    } else {
      res.json({ success: true, message: "Fee created successfully." })
    }
  })
})

app.get("/make_deposit", function(req, res) {
  connection.query("SELECT DISTINCT bankID FROM access WHERE perID = ?", [currentUserId],function(err, banks) {
    if (err) {
      console.error("Server error.")
    } else if (currentUserId == null) {
      res.redirect("/");
    } else {
      // get accounts
      connection.query("SELECT DISTINCT accountID FROM access WHERE perID = ?", [currentUserId], function(err, accounts) {
        if (err) {
          console.error("Server error.")
        } else {
          // render ejs view
          res.render('make_deposit', { banks: banks, accounts: accounts });
          res.end();
        }
      })
    }
  });
})

app.post("/make_deposit", function(req, res) {
  connection.query("call account_deposit(?, ?, ?, ?, ?)", [currentUserId, req.body.amount, req.body.bankID, req.body.accountID, new Date().toISOString().slice(0, 19).replace('T', ' ')], function(err, rows) {
    if (err || rows.affectedRows === 0) {
      res.json({ success: false, message: "Error making deposit." })
    } else {
      res.json({ success: true, message: "Deposit made successfully." })
    }
  })
})

app.get("/make_withdraw", function(req, res) {
  connection.query("SELECT DISTINCT bankID FROM access WHERE perID = ?", [currentUserId],function(err, banks) {
    if (err) {
      console.error("Server error.")
    } else if (currentUserId == null) {
      res.redirect("/");
    } else {
      // get accounts
      connection.query("SELECT DISTINCT accountID FROM access WHERE perID = ?", [currentUserId], function(err, accounts) {
        if (err) {
          console.error("Server error.")
        } else {
          // render ejs view
          res.render('make_withdraw', { banks: banks, accounts: accounts });
          res.end();
        }
      })
    }
  });
})

app.post("/make_withdraw", function(req, res) {
  connection.query("call account_withdrawal(?, ?, ?, ?, ?)", [currentUserId, req.body.amount, req.body.bankID, req.body.accountID, new Date().toISOString().slice(0, 19).replace('T', ' ')], function(err, rows) {
    if (err || rows.affectedRows === 0) {
      res.json({ success: false, message: "Error making withdraw." })
    } else {
      res.json({ success: true, message: "Withdraw made successfully." })
    }
  })
})

app.get("/make_transfer", function(req, res) {
  connection.query("SELECT DISTINCT bankID FROM access WHERE perID = ?", [currentUserId],function(err, banksFrom) {
    if (err) {
      console.error("Server error.")
    } else if (currentUserId == null) {
      res.redirect("/");
    } else {
      // get accounts
      connection.query("SELECT DISTINCT accountID FROM access WHERE perID = ?", [currentUserId],function(err, accountsFrom) {
        if (err) {
          console.error("Server error.")
        } else {
          connection.query("SELECT DISTINCT bankID FROM access WHERE perID = ?", [currentUserId], function(err, banksTo) {
            if (err) {
              console.error("Server error.")
            } else {
              connection.query("SELECT DISTINCT accountID FROM access WHERE perID = ?", [currentUserId], function(err, accountsTo) {
                if (err) {
                  console.error("Server error.")
                } else {
                  // render ejs view
                  res.render('make_transfer', { banksFrom: banksFrom, accountsFrom: accountsFrom, banksTo: banksTo, accountsTo: accountsTo });
                  res.end();
                }
              })
            }
          })
        }
      })
    }
  });
})

app.post("/make_transfer", function(req, res) {
  connection.query("call account_transfer(?, ?, ?, ?, ?, ?, ?)", [currentUserId, req.body.amount, req.body.bankFromID, req.body.accountFromID, req.body.bankToID, req.body.accountToID,new Date().toISOString().slice(0, 19).replace('T', ' ')], function(err, rows) {
    if (err || rows.affectedRows === 0) {
      res.json({ success: false, message: "Error making transfer." })
    } else {
      res.json({ success: true, message: "Transfer made successfully." })
    }
  })
})

app.get("/manage_overdraft", function(req, res) {
  if (userType === "admin") {
    // get all admin accounts
    connection.query("SELECT DISTINCT bankID FROM access JOIN checking USING(bankID, accountID)", [],function(err, banksChecking) {
      if (err) {
        console.error("Server error.")
      } else if (currentUserId == null) {
        res.redirect("/");
      } else {
        // get banks and accounts
        connection.query("SELECT DISTINCT accountID FROM access JOIN checking USING(bankID, accountID)", [], function(err, accountsChecking) {
          if (err) {
            console.error("Server error.")
          } else {
            connection.query("SELECT DISTINCT bankID FROM access JOIN savings USING(bankID, accountID)", [], function(err, banksSavings) {
              if (err) {
                console.error("Server error.")
              } else {
                connection.query("SELECT DISTINCT accountID FROM access JOIN savings USING(bankID, accountID)", [], function(err, accountsSavings) {
                  if (err) {
                    console.error("Server error.")
                  } else {
                    // render ejs view
                    res.render('manage_overdraft', { banksChecking: banksChecking, accountsChecking: accountsChecking, banksSavings: banksSavings, accountsSavings: accountsSavings });
                    res.end();
                  }
                })
              }
            })
          }
        })
      }
    });
  } else {
    // get only accessible accounts
    connection.query("SELECT DISTINCT bankID FROM access JOIN checking USING(bankID, accountID) WHERE perID = ?", [currentUserId],function(err, banksChecking) {
      if (err) {
        console.error("Server error.")
      } else if (currentUserId == null) {
        res.redirect("/");
      } else {
        // get banks and accounts
        connection.query("SELECT DISTINCT accountID FROM access JOIN checking USING(bankID, accountID) WHERE perID = ?", [currentUserId], function(err, accountsChecking) {
          if (err) {
            console.error("Server error.")
          } else {
            connection.query("SELECT DISTINCT bankID FROM access JOIN savings USING(bankID, accountID) WHERE perID = ?", [currentUserId], function(err, banksSavings) {
              if (err) {
                console.error("Server error.")
              } else {
                connection.query("SELECT DISTINCT accountID FROM access JOIN savings USING(bankID, accountID) WHERE perID = ?", [currentUserId], function(err, accountsSavings) {
                  if (err) {
                    console.error("Server error.")
                  } else {
                    // render ejs view
                    res.render('manage_overdraft', { banksChecking: banksChecking, accountsChecking: accountsChecking, banksSavings: banksSavings, accountsSavings: accountsSavings });
                    res.end();
                  }
                })
              }
            })
          }
        })
      }
    });
  }
})

app.post("/manage_overdraft", function(req, res) {
  if (req.body.adding === "true") {
    // starting overdraft
    connection.query("call start_overdraft(?, ?, ?, ?, ?)", [currentUserId, req.body.bankIDChecking,
      req.body.accountIDChecking, req.body.bankIDSavings, req.body.accountIDSavings], function(err, rows) {
      if (err || rows.affectedRows === 0) {
        res.json({ success: false, message: "Error adding overdraft protection." })
      } else {
        res.json({ success: true, message: "Overdraft protection added successfully." })
      }
    })
  } else {
    // stopping overdraft
    connection.query("call stop_overdraft(?, ?, ?)", [currentUserId, req.body.bankIDChecking,
      req.body.accountIDChecking], function(err, rows) {
      if (err || rows.affectedRows === 0) {
        res.json({ success: false, message: "Error removing overdraft protection." })
      } else {
        res.json({ success: true, message: "Overdraft protection successfully removed." })
      }
    })
  }

})

app.get("/pay_employees", function(req, res) {
  if (currentUserId == null) {
    res.redirect("/");
  } else {
    res.sendFile(__dirname + "/public/views/" + "pay_employees.html");
  }
})

app.post("/pay_employees", function(req, res) {
  connection.query("call pay_employees()", function(err, rows) {
    if (err) {
      res.json({ success: false, message: "Error paying employees." })
      // TODO add 3rd option of no affected rows and report that no employees were paid
    } else {
      res.json({ success: true, message: "Employees paid successfully." })
    }
  })
})

app.get("/manage_accounts", function(req, res) {
  if (userType === "admin") {
    // get all accounts
    connection.query("SELECT DISTINCT bankID FROM bank_account", [],function(err, banks) {
      if (err) {
        console.error("Server error.")
      } else if (currentUserId == null) {
        res.redirect("/");
      } else {
        connection.query("SELECT DISTINCT accountID FROM bank_account", [], function(err, accounts) {
          if (err) {
            console.error("Server error.")
          } else {
            connection.query("SELECT DISTINCT perID FROM customer", function(err, customers) {
              if (err) {
                console.error("Server error.")
              } else {
                // render ejs view
                res.render('manage_accounts', { banks: banks, accounts: accounts, customers: customers });
                res.end();
              }
            })
          }
        })
      }
    });
  } else {
    // get only accessable accounts
    connection.query("SELECT DISTINCT bankID FROM access WHERE perID = ?", [currentUserId], function (err, banks) {
      if (err) {
        console.error("Server error.")
      } else if (currentUserId == null) {
        res.redirect("/");
      } else {
        connection.query("SELECT DISTINCT accountID FROM access WHERE perID = ?", [currentUserId], function (err, accounts) {
          if (err) {
            console.error("Server error.")
          } else {
            connection.query("SELECT DISTINCT perID FROM customer", function (err, customers) {
              if (err) {
                console.error("Server error.")
              } else {
                // render ejs view
                res.render('manage_accounts', {banks: banks, accounts: accounts, customers: customers});
                res.end();
              }
            })
          }
        })
      }
    });
  }
})

app.post("/manage_accounts", function(req, res) {
  if (req.body.adding === "true") {
    connection.query("call add_account_access(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [currentUserId,
      req.body.customerID, null, req.body.bankID, req.body.accountID, null, null,
      new Date().toISOString().slice(0, 19).replace('T', ' '), null, null,
      null, new Date().toISOString().slice(0, 19).replace('T', ' ')], function(err, rows) {
      if (err) {
        res.json({ success: false, message: "Error adding account owner." })
        // TODO add 3rd option of no affected rows
      } else {
        res.json({ success: true, message: "Account owner added successfully." })
      }
    })
  } else {
    connection.query("call remove_account_access(?, ?, ?, ?)", [currentUserId,
      req.body.customerID, req.body.bankID, req.body.accountID], function(err, rows) {
      if (err) {
        res.json({ success: false, message: "Error removing account owner." })
        // TODO add 3rd option of no affected rows
      } else {
        res.json({ success: true, message: "Account owner removed successfully." })
      }
    })
  }
})

app.get("/create_account", function(req, res) {
  connection.query("SELECT DISTINCT bankID FROM bank",function(err, banks) {
    if (err) {
      console.error("Server error.")
    } else if (currentUserId == null) {
      res.redirect("/");
    } else {
      connection.query("SELECT perID FROM customer",function(err, customers) {
        if (err) {
          console.error("Server error.")
        } else if (currentUserId == null) {
          res.redirect("/");
        } else {
          // render ejs view
          res.render('create_account', { banks: banks, customers: customers });
          res.end();
        }
      });
    }
  });
})

app.post("/create_account", function(req, res) {
  connection.query("call add_account_access(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [currentUserId,
    req.body.customerID, req.body.accountType, req.body.bankID, req.body.accountID, req.body.balance, req.body.interestRate,
    new Date().toISOString().slice(0, 19).replace('T', ' '), req.body.minBalance, null,
    req.body.maxWithdraws, new Date().toISOString().slice(0, 19).replace('T', ' ')], function(err, rows) {
    if (err) {
      res.json({ success: false, message: "Error creating account." })
      // TODO add 3rd option of no affected rows
    } else {
      res.json({ success: true, message: "Account created/updated successfully." })
    }
  })
})

app.get("/create_customer", function(req, res) {
  connection.query("SELECT DISTINCT perID FROM person",function(err, persons) {
    if (err) {
      console.error("Server error.")
    } else if (currentUserId == null) {
      res.redirect("/");
    } else {
      // render ejs view
      res.render('create_customer', { persons: persons });
      res.end();
    }
  });
})

app.post("/create_customer", function(req, res) {
  connection.query("call start_customer_role(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [req.body.perID, req.body.taxID,
  req.body.firstName, req.body.lastName, req.body.birthdate, req.body.street, req.body.city, req.body.state, req.body.zip,
    req.body.dateJoined, req.body.password], function(err, rows) {
    if (err || rows.affectedRows === 0) {
      res.json({ success: false, message: "Error creating customer." })
    }
    // TODO additional option of indicated customer was only updated
    else {
      // ended up making a new customer
      res.json({ success: true, message: "Customer created/updated successfully." })
    }
  })
})

app.get("/create_employee", function(req, res) {
  connection.query("SELECT DISTINCT perID FROM person",function(err, persons) {
    if (err) {
      console.error("Server error.")
    } else if (currentUserId == null) {
      res.redirect("/");
    } else {
      // render ejs view
      res.render('create_employee', { persons: persons });
      res.end();
    }
  });
})

app.post("/create_employee", function(req, res) {
  connection.query("call start_employee_role(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [req.body.perID, req.body.taxID,
    req.body.firstName, req.body.lastName, req.body.birthdate, req.body.street, req.body.city, req.body.state, req.body.zip,
    req.body.dateJoined, req.body.salary, req.body.payments,
    req.body.earnings, req.body.password], function(err, rows) {
    if (err || rows.affectedRows === 0) {
      res.json({ success: false, message: "Error creating employee." })
    }
    // TODO additional option of indicated customer was only updated
    else {
      // ended up making a new customer
      res.json({ success: true, message: "Employee created/updated successfully." })
    }
  })
})

app.post("/add_corporation", function(req, res) {
  // call stored procedure
  connection.query("call create_corporation(?, ?, ?, ?)", [req.body.id, req.body.shortName, req.body.longName, req.body.resAssets], function (err, rows) {
    if (err || rows.affectedRows === 0) {
      // if procedure failed
      res.json({ success: false, message: "Error creating corporation." })
    } else {
      res.json({ success: true, message: "Corporation created successfully." })
    }
  });
})

app.get("/create_bank", function (req, res) {
  let getCorps = 'select corpID from corporation'
  let getManagers = 'select perID from employee where perID not in (select manager from bank) and perID not in (select perID from workFor)'
  let getEmployees = 'select perID from employee'
  connection.query(getCorps, [], function (err, corporations) {
    connection.query(getManagers, [], function (err, managers) {
      connection.query(getEmployees, [], function (err, employees) {
        if (err) {
          console.error("Server error.")
        } else if (currentUserId == null) {
          res.redirect("/");
        } else {
          res.render('create_bank', {corporations: corporations, managers: managers, employees: employees});
          res.end();
        }
      })
    })
  })
})

app.post("/add_bank", function (req, res) {
  let call = 'call create_bank(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(call, [req.body.bankID, req.body.name, req.body.street, req.body.city,
    req.body.state, req.body.zip, req.body.resAssets, req.body.corpID, req.body.managerID, req.body.employeeID], function (err, rows) {
    if (err || rows.affectedRows === 0) {
      res.json({ success: false, message: "Error creating bank." })
    } else {
      res.json({ success: true, message: "Bank created successfully." })
    }
  });
});

app.get('/display_accounts', function(req,res) {
  connection.query("select * from display_account_stats",function(err, result) {
    if (err) {
      console.error("Server error.")
    } else if (currentUserId == null) {
      res.redirect("/");
    } else {
      // render ejs view for display table
      res.render('display_accounts', { accounts: result });
      res.end();
    }
  });
});

app.get('/display_banks', function(req,res) {
  connection.query("select * from display_bank_stats",function(err, result) {
    if (err) {
      console.error("Server error.")
    } else if (currentUserId == null) {
      res.redirect("/");
    } else {
      // render ejs view for display table
      res.render('display_banks', { banks: result });
      res.end();
    }
  });
});

app.get('/display_customers', function(req,res) {
  connection.query("select * from display_customer_stats",function(err, result) {
    if (err) {
      console.error("Server error.")
    } else if (currentUserId == null) {
      res.redirect("/");
    } else {
      // render ejs view for display table
      res.render('display_customers', { customers: result });
      res.end();
    }
  });
});

app.get('/display_corporations', function(req,res) {
  connection.query("select * from display_corporation_stats",function(err, result) {
    if (err) {
      console.error(err)
    } else if (currentUserId == null) {
      res.redirect("/");
    } else {
      // render ejs view for display table
      res.render('display_corporations', { require: require, corporations: result });
      res.end();
    }
  });
});

app.get('/display_employees', function(req,res) {
  connection.query("select * from display_employee_stats",function(err, result) {
    if (err) {
      console.error("Server error.")
    } else if (currentUserId == null) {
      res.redirect("/");
    } else {
      // render ejs view for display table
      res.render('display_employees', { employees: result });
      res.end();
    }
  });
});

// start server
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})