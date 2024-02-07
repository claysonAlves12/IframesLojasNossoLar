const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs').promises;
const ejs = require('ejs');

const app = express();
const port = 3000;


app.use(express.static(path.join(__dirname, 'src', 'public')));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use((req, res, next) => {
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
    const foldersAndPages = await listSubfoldersAndPages(viewsPath);
    res.render('home', { foldersAndPages });
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

async function listSubfoldersAndPages(dir) {
  const items = await fs.readdir(dir);
  const foldersAndPages = [];

  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stats = await fs.stat(itemPath);

    if (stats.isDirectory()) {
      const subItems = await fs.readdir(itemPath);
      const subfolders = subItems.filter(async subItem => {
        const subItemPath = path.join(itemPath, subItem);
        const subItemStats = await fs.stat(subItemPath);
        return subItemStats.isDirectory();
      });

      const pages = subItems.filter(subItem => subItem.endsWith('.ejs'));
      const subItemsDetails = await listSubfoldersAndPages(itemPath);

      foldersAndPages.push({
        folder: item,
        pages: pages.map(page => page.replace('.ejs', '')),
        subfolders: subItemsDetails
      });
    }
  }

  return foldersAndPages;
}

app.listen(port, () => {
  console.log(`Servidor está rodando em http://localhost:${port}`);
});
