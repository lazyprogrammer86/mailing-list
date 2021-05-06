const express = require("express");
const app = express();
const https = require("https");

const bodyparser = require("body-parser");

app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(express.static("public"));
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});


app.post("/", function(req, res) {
    var firstName = req.body.FirstName;
    var lastName = req.body.LastName;
    var email = req.body.Email;


    var data = {
        members : [{
            email_address : email,
            status : "subscribed",
            merge_fields : {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    }

    var jsonData = JSON.stringify(data);

    const url = "https://us18.api.mailchimp.com/3.0/lists/537ef98559";

    const options ={
        method:"POST",
        auth:"adarsh:09fa36e568c03964f12443c228f880cb-us18"
    }
    const request = https.request(url, options, function(response) {
        response.on("data",function(data){


        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure",function(req,res){
    res.redirect("/");
});
app.listen(process.env.PORT|| 3000, function() {
    console.log("up and running on port 3000");
});
