const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

// Configuração do CORS
app.use(cors());

// Configuração do storage do Multer para usar `Date.now()` e `Math.random()`
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); // Define a pasta onde os arquivos serão salvos
  },
  filename: (req, file, cb) => {
    // Gera um nome de arquivo exclusivo com timestamp e um número aleatório, mantendo a extensão original
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname); // Obtém a extensão original do arquivo
    cb(null, file.fieldname + '-' + uniqueSuffix + extension); // Define o nome do arquivo com a extensão
  }
});

const upload = multer({ storage });

// Endpoint para upload de arquivos
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }
  res.json({ message: 'Upload bem-sucedido', filePath: `/uploads/${req.file.filename}` });
});

app.get('/get/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'public', 'uploads', filename);

  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json({ error: 'Arquivo não encontrado' });
    }
  });
});

// Servir arquivos estáticos da pasta "public"
app.use(express.static('public'));

// Iniciar o servidor na porta 3001
app.listen(3001, () => {
  console.log('Servidor de upload rodando em http://localhost:3001');
});
