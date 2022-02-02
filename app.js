const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");
const api=require(__dirname+"/api.js");

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


  const url = "https://us7.api.mailchimp.com/3.0/lists/"+api.audience_id;
  const options = {
    method: "POST",
    auth: "anantya:"+api.key
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
