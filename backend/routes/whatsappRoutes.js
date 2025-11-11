import express from 'express';

const router = express.Router();

function parsePedido(textoDoWhatsapp) {
  console.log("Iniciando o 'tradutor' para:", textoDoWhatsapp);
  
  const linhas = textoDoWhatsapp.split('\n');
  const itensDoPedido = [];
  const regex = /(\d+)\s*(KG|UND|G|PCT|CX)\s+(?:de\s+)?(.+)/i;

  for (const linha of linhas) {
    const match = linha.trim().match(regex);

    if (match) {
      itensDoPedido.push({
        quantidade: parseInt(match[1], 10),
        unidade: match[2].toUpperCase(),
        produto: match[3].trim()
      });
    } else if (linha.trim() !== "") {
      console.log(`Linha ignorada (formato não reconhecido): "${linha}"`);
    }
  }

  return itensDoPedido;
}

router.post('/webhook', (req, res) => {
  console.log("==========================================");
  console.log(">>> MENSAGEM DO WHATSAPP RECEBIDA! <<<");
  
  const remetente = req.body.From;
  const mensagem = req.body.Body;

  console.log('De:', remetente);
  console.log('Mensagem:', mensagem);
  console.log("==========================================");

  const itensFormatados = parsePedido(mensagem);

  console.log(">>> PEDIDO TRADUZIDO COM SUCESSO <<<");
  console.log(itensFormatados);
  console.log("==========================================");

  res.status(200).send('OK');
});

export default router;