const express = require("express");
const app = express();

const users=[];
//[
// { username : "Arsal"
//  password : "239838";
// }
//]


// function to generate a token when user signs up
function generateToken()
{
    //logic is upon you. HERE , its to generate a 32 character long string of only characters & numbers.
    let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let token = "";
    for (let i=0;i<32;i++)
    {
        token+=options[Math.floor(Math.random()*options.length)];
    }
    return token;
}

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
        const token = generateToken();
        founduser.token = token;

        res.json({
        token : token
    });
    }else{
        res.status(403).send("Invalid username or password!!!!");
    }
    
})

//after signing in , any request you send will have your token passed IN THE HEADER . THIS IS STORED IN YOUR BROWSER as well.

app.get("/me" , (req,res) => {
    const token= req.headers.token;
    const user=users.find(u => u.token === token);
    if(user){
        res.json({
        message : "Hello " + user.username + ".Your password is : " + user.password
    })
    }else{
        res.send("Invalid token!");
    }
    
})
app.listen(3000 , () => {
    console.log("SERVER RUNNING")
});