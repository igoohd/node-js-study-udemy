const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

connection
  .authenticate()
  .then(() => {
    console.log("Conexão realizada com sucesso!");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  Pergunta.findAll({ raw: true, order: [["id", "DESC"]] }).then((perguntas) => {
    console.log(perguntas);
    res.render("index", { perguntas });
  });
});

app.get("/perguntar", (req, res) => {
  res.render("perguntar");
});

app.post("/salvarpergunta", (req, res) => {
  const titulo = req.body.titulo;
  const descricao = req.body.descricao;
  Pergunta.create({ titulo, descricao }).then(() => {
    res.redirect("/");
  });
});

app.get("/pergunta/:id", (req, res) => {
  const perguntaId = req.params.id;
  Pergunta.findOne({ where: { id: perguntaId } }).then((pergunta) => {
    if (pergunta != undefined) {
      Resposta.findAll({
        where: { perguntaId: perguntaId },
        order: [["id", "DESC"]],
      }).then((respostas) => {
        res.render("pergunta", { pergunta, respostas });
      });
    } else {
      res.redirect("/");
    }
  });
});

app.post("/responder", (req, res) => {
  var corpo = req.body.corpo;
  var perguntaId = req.body.pergunta;

  Resposta.create({ corpo, perguntaId }).then(() => {
    res.redirect(`pergunta/${perguntaId}`);
  });
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
