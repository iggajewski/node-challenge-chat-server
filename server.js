const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.urlencoded({ extended: false })); // for the html form
// app.use(express.json()) // for react and postman
app.use(cors());

let postId = 0;

const welcomeMessage = {
  id: postId,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

const messages = [welcomeMessage];



app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

app.get("/messages", function(request, response) {
  response.send(messages);
})

app.get("/messages/search", function(request, response) {
  let searchTerm = request.query.text.toLowerCase();
  let foundMessages = [];

  for (let i = 0; i < messages.length; ++i) {
    if (messages[i].text.toLowerCase().includes(searchTerm))
      foundMessages.push(messages[i]);
  }
  response.send(foundMessages);
})

app.get("/messages/latest", function(request, response) {
  let latestMessages = []
  for(let i = 1; i <= 10; ++i) {
    if(!messages[messages.length - i]) break;
    latestMessages.push(messages[messages.length - i]);
  }
  response.send(latestMessages);
})

app.get("/messages/:id", function (request, response) {
  const id = request.params.id;

  for (let i = 0; i < messages.length; ++i) {
    if (messages[i].id == id) {
      response.send(messages[i]);
      return;
    }
  }
  response.status(204).end();
})



app.post("/messages", function (request, response) {
  if(request.body.from === "" || request.body.text === ""){
    return response.status(400).end();
  }
  
  let newMessage = {
    id: ++postId,
    from: request.body.from,
    text: request.body.text,
  }

  messages.push(newMessage);
  return response.status(200).end();
});

// works only with postman 
app.delete('/messages/:id', function(request, response) {
  const idToDelete = request.params.id;
  for (let i = 0; i < messages.length; ++i) {
    if (messages[i].id == idToDelete) {
      messages.splice(idToDelete, 1);
    }
  }
  return response.status(204).end();
});


app.listen(process.env.PORT);