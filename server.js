const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs').promises;
const ejs = require('ejs');
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'src', 'public')));

app.set('views', path.join(__dirname, 'src', 'views'));

app.use((req, res, next) => {
  // Adicione mais cabeçalhos, se necessário
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.get('/', (req, res) => {
  const data = {
    title: 'Bem-vindo ao meu projeto Express',
    message: 'Este é um projeto básico usando Express e EJS.'
  };

  res.render('index', data);
});

app.get('/:ejsFileName', async (req, res) => {
  const ejsFileName = req.params.ejsFileName;
  const filePath = path.join(__dirname, 'src', 'views', `${ejsFileName}.ejs`);

  try {
    const ejsContent = await fs.readFile(filePath, 'utf8');

    const data = {
      title: 'Título dinâmico',
      content: 'Conteúdo dinâmico'
    };
    const renderedHtml = ejs.render(ejsContent, data);

    res.send(renderedHtml);
  } catch (error) {
    res.status(404).send('Página não encontrada');
  }
});



app.listen(port, () => {
  console.log(`Servidor está rodando em http://localhost:${port}`);
});
