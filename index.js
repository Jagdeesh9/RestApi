const express = require('express');
const fs = require('fs')
const users = require('./MOCK_DATA.json');
const app = express();

// console.log(typeof users);
const Port = 3000;

app.use((req,res,next)=>{
    fs.appendFile("detail.txt",`[\nReqTime:${Date.now()}\nIP:${req.ip}\nPath:${req.path}\n]\n`,(err,data)=>{
        console.log("in the middile ware");
        next();
    });
})

//middleware
app.use(express.urlencoded({extended:false}));//extrac data from url

app.get("/",(req,res)=>{
    res.send("hello");
})

app.get("/user",(req,res)=>{
    const html = `
        <ul>
        ${users.map((user)=>`<li>${user.first_name}</li>`)}
        </ul>
    `;
    res.send(html);
})

//it render data for devloper
app.get("/users", (req,res)=>{
    console.log("hello from user route");
    res.send(users);
})
app.post("/user",(req,res)=>{
    //post route use to create an user
    let body = req.body;//this will return undefined because express dont know which type of data is this so we use a middileware
    console.log(body);
    console.log(users.length);
    users.push({id:users.length+1,...body})

    console.log(users.find((a)=>a.id=1002));
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data)=>{
        return res.json({"status":"success",'id':users.length+1})
    })
})

// dynamic Route
// app.get("/users/:id",(req,res)=>{
//     let id = Number(req.params.id);
//     console.log(id);
//     const user = users.find((user)=>{
//          user.id === id;
//     });
//     //find is an array method return element that satisfy the given condition
//     // console.log(user)
//     res.send(user);
// })


// app.patch("users/:id",(req,res)=>{
//     //to update the user
//     res.send({status:"pending"});

// })

// app.delete("users/:id",(req,res)=>{
//     // to delete a specific users
//     res.send({status:"pending"});

// })
// we are using same route with different request or response type so we can code it as following

app.route("/users/:id")
.get((req,res)=>{
    let id = Number(req.params.id);
    console.log(id);
    const user = users.find((user)=> user.id === id);
    //find is an array method return element that satisfy the given condition
    // console.log(user)
    res.send(user);
})
.delete((req,res)=>{
    // to delete a specific users
    res.send({status:"pending"});

})
.patch((req,res)=>{
    //to update the user
    res.send({status:"pending"});

})

app.get("/api",(req,res)=>{
    res.setHeader("X-name","Jagdeesh");
    console.log(req.headers.purpose);
    res.send(users);
})

app.get("/client",(req,res)=>{
    let html = `
        ${users.map((a)=>`<li>${a.first_name}</li>`)}
    `;
    res.send(html);
})

app.get("/api/:id",(req,res)=>{
    let id = Number(req.params.id)  ;
    console.log(id)
    let emp = users.find((emp)=>{
        // console.log(user);
        return emp.id === id;
    });
    console.log(emp)
    res.send(emp);
});

app.post("/login",(req,res)=>{
    const body = req.body;
    users.push({...body,id:users.length+1});
    // console.log(u);
    fs.writeFile("./MOCK_DATA",JSON.stringify(users),(err,data)=>{
        res.send({"status" : " success"});
    })

})



app.listen(Port,()=>{
    console.log("server started at ");
})