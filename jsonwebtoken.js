//JSON Webtokens are crerated and returned when the user signs in . It Has the username ENCODED. 
//JWT creation folllows a standard procedure.

const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const JWT_SECRET = "MANGOMUSTARD";
const users=[];


app.use(express.json()); //to parse the post request body. W/o this we can't access the request body.  

app.post("/signup" , (req,res) =>{
    const user_name=req.body.username;
    const pass_word=req.body.password;

    //dont signup the same user more than once. 
    if(users.find(user => user.username === user_name))
    {
        return res.status(400).send("This username already exists!!!!!");
    }
    //we gotta save this in the users variable
    users.push({
        username : user_name,
        password : pass_word
    });
    res.json({
        message : "Succesfully signed up!"
    })
})

app.post("/signin" , (req,res) =>{
    const user_name=req.body.username;
    const pass_word=req.body.password;
    //check if user_name & pass_word belongs to some user or not
    const founduser=users.find(u => u.username === user_name && u.password === pass_word)
    if(founduser){
        //GENERATE JWT and return as a header .
        const token=jwt.sign({
            username : founduser.username                
        }, JWT_SECRET);
        
        res.json({
            token : token
        })
    }else{
        res.status(403).send("Invalid username or password!!!!");
    }
    
})

//after signing in , any request you send will have your JWT passed IN THE HEADER . Just verify that jwt for the particular user.

app.get("/me" , (req,res) => {
    const token= req.headers.token;//JWT Token sent in the header
    const decodedToken = jwt.verify(token , JWT_SECRET); // get back the JSON object containing username
    const user_name = decodedToken.username;

    const user=users.find(u => u.username === user_name);

    if(user){
        res.json({
        username : user.username ,
        password : user.password
    })
    }else{
        res.send("Invalid token!");
    }
    
})
app.listen(3000 , () => {
    console.log("SERVER RUNNING")
});