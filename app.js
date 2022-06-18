
const express = require("express");
const bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const { Redirect } = require("request/lib/redirect");


const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// Mailchimp configuration
mailchimp.setConfig({
    apiKey: "25551c95a1de8cef4130c2465a2f09a5-us8",
    server: "us8"
});

// Acceesing webapp home page
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

// Sending subscriber infomation to our external API
app.post("/", function(req, res) {

    // Grabbing the subscriber details with bodyParser 
    
    console.log(req.body.fName, req.body.lName, req.body.email);

    const listId = "f88674a389";
    const subscribingUser = { 
        firstName: req.body.fName,
        lastName: req.body.lName,
        email: req.body.email
   };

   async function run() {
    try {
        const response = await mailchimp.lists.addListMember(listId, {
          email_address: subscribingUser.email,
          status: "subscribed",
          merge_fields: {
            FNAME: subscribingUser.firstName,
            LNAME: subscribingUser.lastName
          }
        });

        console.log("Successfully added contact as an audience member. The contact's id is " + response.Id);

        res.sendFile(__dirname + "/success.html");
    } catch (e) {
        res.sendFile(__dirname + "/failure.html");
    }
    }

run();
});

// Redirecting to success page
app.post("/success.html", function(req, res) {
    res.redirect("/");
})

// Redirecting to failure page
app.post("/failure.html", function(req, res) {
    res.redirect("/");
});

// Server side
app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port: 3000");
});

