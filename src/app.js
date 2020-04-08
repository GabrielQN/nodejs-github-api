const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// MIDDLEWARES
function validateRepositoryId(request, response, next){
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({ error: "Invalid repository ID." });
  };

  return next();
};

app.use('/repositories/:id', validateRepositoryId);


// GET
app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
}); 


// POST
app.post("/repositories", (request, response) => {
    const { title, url, techs } = request.body;
    const repository = { id: uuid(), 
                        title: title, 
                        url: url, 
                        techs: techs, 
                        likes: 0 } 

    repositories.push(repository);
    return response.status(200).json(repository);
}); 

// PUT
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.'})
  };

  repositories[repositoryIndex].title = title;
  repositories[repositoryIndex].url = url;
  repositories[repositoryIndex].techs = techs;

  return response.status(200).json(repositories[repositoryIndex]);

}); 


// DELETE
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.'})
  };

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
}); 


// POST
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.'})
  };

  repositories[repositoryIndex].likes += 1;

  return response.status(200).json(repositories[repositoryIndex]);
});

module.exports = app;
