const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");

const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
})

app.post("/",function(req,res){
  const firstName=req.body.fName;
  const lastName=req.body.lName;
  const email=req.body.email;
  const data = {
      members: [{
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }]
    }
  const jsonData = JSON.stringify(data);

  const url = "https://us7.api.mailchimp.com/3.0/lists/5915b3b880";
  const options = {
    method: "POST",
    auth: "anantya:ed34ed75d10527eb89b89c3170198f8f-us7"
  }

  const request = https.request(url, options, function(response) {
    // console.log(">>>>>"+response.statusCode);
    if(response.statusCode==200){
      res.sendFile(__dirname+"/success.html");
    }else {
      res.sendFile(__dirname+"/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })
  // console.log("out of request");
  request.write(jsonData);
  request.end();
  // console.log("at the end");
})

app.post("/failure",function(req,res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(){
  console.log("server is up and running at port 3000");
})

// API key
// 57a8765953a5c7ec6deaf6a58c13d95a-us7

// list id
// 5915b3b880
