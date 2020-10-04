//environement variables......act like constants
require('dotenv').config()

var express = require('express');
var app = express();
var bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const cors = require('cors');
const { restart } = require('nodemon');

//cross-Origin resource sharing, allows restricted resource on a webpage to be requested
//residing in another domain
app.use(cors())
//recognizes the incoming  request object as Json object, acts as middleware
app.use(express.json())

const users=[{
  name: 'Pritam',
  password: '$2b$10$q/HSQp/wjnW0oda9IqZM2uP6kct6c..udjqXaWilxh84BkYhit7G2',
  email: 'abc@xyz.com'
}]
const answers=[{ questionpaperid: 'LTOK', answerpaperid: 'E/Ee', Answers: [ 'A', 'A','D' ] },
{ questionpaperid: 'PLJK', answerpaperid: '9/tr', Answers: [ 'B', 'A','A' ] }
]
const questions=[
    {
      "questionpaperid": "LTOK",
      "id": "Pritam",
      "Questions": [
        {
          "question": "capital of India",
          "optionA": "Delhi",
          "optionB": "Mumbai",
          "optionC": "Chennai",
          "optionD": "Bhubaneswar"
        },
        {
          "question": "Capital Of Odisha",
          "optionA": "Bhubaneswar",
          "optionB": "cutack",
          "optionC": "Rourkela",
          "optionD": "Balasore"
        },
        {
          "question": "Not a primary state of Matetr",
          "optionA": "Solid",
          "optionB": "Liquid",
          "optionC": "Gas",
          "optionD": "Water"
        }
      ]
    },
    {
      "questionpaperid": "PLJK",
      "id": "Suman",
      "Questions": [
        {
          "question": "90+10",
          "optionA": "12",
          "optionB": "100",
          "optionC": "89",
          "optionD": "65"
        },
        {
          "question": "% is calculated out of",
          "optionA": "100",
          "optionB": "500",
          "optionC": "1000",
          "optionD": "1"
        },
        {
          "question": "Profit percentage=",
          "optionA": "Profit/CP",
          "optionB": "Profit/CP+Profit",
          "optionC": "Profit/SP",
          "optionD": "Profit/CP+SP"
        }
      ]
    }
  ]
  const ReturnNull={
    "questionpaperid": "****",
    "id": "*****",
    "Questions": [
      {
        "question": "",
        "optionA": "",
        "optionB": "",
        "optionC": "",
        "optionD": ""
      }
     
    ]
  }

const posts=[
    {name:"Pritam", title:"Post 1"},
    {name:"Mishra", title:"Post 2"}
]

//Showing relevant posts only
app.get('/posts', authenticateToken,(req, res)=>{
    res.json(posts.filter(post=>post.name===req.userx.name))
});
  





//showing registered users and their hashed password
app.get('/users', (req, res)=>{
    res.json(users);
});

//signup and direct login(give jwt)
 app.post('/signup', async (req, res)=>{
     try{
        const salt=await bcrypt.genSalt()
        const hashedpass=await bcrypt.hash(req.body.password,salt)
        const user={name:req.body.name, password:hashedpass, email:req.body.email}
        users.push(user)
        const username=req.body.name
        const userx={name:username}
        const accessToken=jwt.sign(userx,process.env.ACCESS_TOKEN_SECRET)
        res.json({accessToken:accessToken, name:username})
        res.status(201).send("Done")
      }catch{
          res.status(500).send()
      }
   
});


//loggin in - Authentication and Authorization
app.post('/login', async (req,res)=>{
    
    const user=users.find(user=>user.name===req.body.name)
    
    if(user==null){
        console.log("reached")
        res.status(202).send("User not found")
    } 
    try{
        if(await bcrypt.compare(req.body.password,user.password)){
            const username=req.body.name
            const userx={name:username}           
            const accessToken=jwt.sign(userx,process.env.ACCESS_TOKEN_SECRET)
            res.json({accessToken:accessToken, name:username})
            res.status(200).send("Done")
        }else{
            res.status(201).send("Wrong Password")
        }
        
    }catch{
        res.status(500).send()
    }

});


//middleware
function authenticateToken(req,res,next){
    const authHeader=req.headers['authorization']
    const token=authHeader && authHeader.split(' ')[1]
    console.log(token)
    if (token==null) return res.sendStatus(401)

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,userx)=>{
      console.log(userx)
        if(err) return res.sendStatus(403)
        req.userx=userx
        next()
    })

}

//Recieving questions
app.post('/questionStore', async (req, res)=>{
    try{
      token=req.body.auth;
      token=req.body.auth;
      jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,userx)=>{
        if(err) return res.status(200).send("Invalid Tokens")
        req.userx=userx
      })
      if(req.body.TeacherCode===req.userx.name)
        {
        const salt=await bcrypt.genSalt()
        const salt4=salt.substring(8,12)
        const salt4ans=salt.substring(12,16)
        let ques=req.body.questions;
        let teacher=req.body.TeacherCode;
        let answ=req.body.answers;
        var recmsgQ={"questionpaperid":salt4,"id":teacher,"Questions":ques}
        var recmsgA={"questionpaperid":salt4,"answerpaperid":salt4ans,"Answers":answ}
        console.log(recmsgA)
        questions.push(recmsgQ);
        answers.push(recmsgA);
        return res.status(201).send("Your question paper code is "+salt4+" Your Answer paper code is "+salt4ans)
        }
        else{
          return res.status(201).send("Your accesskey has been tampered. Kindly login once again")
        }
     }catch{
         res.status(500).send()
     }
  
});


app.post('/questionget', (req, res)=>{
    requiredQ=questions.filter(ques=>ques.questionpaperid===req.body.questionpaperid)
    console.log(req.body.questionpaperid)
    if(requiredQ.length!==0)
    res.json(requiredQ[0])
    else
    res.json(ReturnNull)
    
});



app.post('/trial',(req, res)=>{
  
  token=req.body.auth;
  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,userx)=>{
    console.log(err)
    if(err) return res.status(200).send("Invalid Tokens")
    req.userx=userx
})
console.log(req.userx.name===req.body.name);
  return res.status(200).send("Authorized");
});

app.listen(3000);

