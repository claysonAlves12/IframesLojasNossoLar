const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const fs = require('fs').promises;
const ejs = require('ejs');
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'src', 'public')));
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(bodyParser.json());

app.use((req, res, next) => {
  // Add more headers if necessary
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.get('/', (req, res) => {
  res.render('login');
});

app.get('/home', async (req, res) => {
  try {
      const viewsPath = path.join(__dirname, 'src', 'views');
      const folders = await fs.readdir(viewsPath);

      const foldersAndPages = await Promise.all(folders.map(async folder => {
          const folderPath = path.join(viewsPath, folder);
          const stats = await fs.stat(folderPath);

          if (stats.isDirectory()) {
              const files = await fs.readdir(folderPath);
              const pages = files
                  .filter(file => file.endsWith('.ejs'))
                  .map(file => file.replace('.ejs', ''));

              const subfolders = await Promise.all(files
                  .filter(file => !file.endsWith('.ejs'))
                  .map(async subfolder => {
                      const subfolderPath = path.join(folderPath, subfolder);
                      const subfolderStats = await fs.stat(subfolderPath);

                      if (subfolderStats.isDirectory()) {
                          const subfolderFiles = await fs.readdir(subfolderPath);
                          const subfolderPages = subfolderFiles
                              .filter(file => file.endsWith('.ejs'))
                              .map(file => file.replace('.ejs', ''));

                          return {
                              folder: subfolder,
                              pages: subfolderPages,
                          };
                      }
                      return null;
                  }));

              return {
                  folder,
                  pages,
                  subfolders: subfolders.filter(subfolder => subfolder !== null),
              };
          }
          return null;
      }));

      const validFoldersAndPages = foldersAndPages.filter(item => item !== null);

      res.render('home', { foldersAndPages: validFoldersAndPages });
  } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao listar pastas e páginas');
  }
});

app.get('/view/:ejsFilePath(*)', async (req, res) => {
  const ejsFilePath = req.params.ejsFilePath;
  const filePath = path.join(__dirname, 'src', 'views', `${ejsFilePath}.ejs`);

  try {
    const ejsContent = await fs.readFile(filePath, 'utf8');
    const renderedHtml = ejs.render(ejsContent);
    res.send(renderedHtml);
  } catch (error) {
    res.status(404).send('Página não encontrada');
  }
});


app.post('/configurar-cronometro', (req, res) => {
  const { hours, minutes, seconds } = req.body;

  const totalSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);

  if (isNaN(totalSeconds) || totalSeconds <= 0) {
    res.status(400).json({ error: 'Por favor, insira valores válidos para horas, minutos e segundos.' });
    return;
  }

  console.log("foi");
  res.status(200).json({ success: true });
});


app.listen(port, () => {
  console.log(`Servidor está rodando em http://localhost:${port}`);
});
