import express from 'express';
import Pedido from '../models/Pedido.js';
import Cliente from '../models/Cliente.js';
import Produto from '../models/Produto.js';

const router = express.Router();

const limparTelefone = (telefoneBruto) => {
  // Remove tudo que não é dígito e o "55" inicial se houver
  return telefoneBruto.replace(/\D/g, '').replace(/^55/, ''); 
};

async function processarItensDoPedido(texto) {
  const linhas = texto.split('\n');
  const itensParaSalvar = [];
  let totalCalculado = 0;
  const regex = /(\d+[\.,]?\d*)\s*(KG|UN|G|PCT|CX)\s+(?:de\s+)?(.+)/i;

  for (const linha of linhas) {
    const match = linha.trim().match(regex);

    if (match) {
      const qtdTexto = match[1].replace(',', '.'); 
      const quantidade = parseFloat(qtdTexto);
      const nomeProdutoTexto = match[3].trim();

      // --- BUSCA NO BANCO ---
      const produtoEncontrado = await Produto.findOne({ 
        nome: { $regex: nomeProdutoTexto, $options: 'i' } 
      });

      if (produtoEncontrado) {
        const preco = produtoEncontrado.precoVenda;
        const subtotal = quantidade * preco;
        totalCalculado += parseFloat(subtotal.toFixed(2));

        itensParaSalvar.push({
          produto: produtoEncontrado._id,
          quantidade: quantidade,
          precoUnitario: preco
        });
        
        console.log(`✅ Produto identificado: ${produtoEncontrado.nome} | Qtd: ${quantidade} | Total: ${subtotal}`);
      } else {
        console.log(`⚠️ Produto não encontrado no banco: "${nomeProdutoTexto}"`);
      }
    }
  }

  return { itens: itensParaSalvar, total: parseFloat(totalCalculado.toFixed(2)) };
}

router.post('/webhook', async (req, res) => {
  console.log(">>> WHATSAPP: Mensagem Recebida <<<");

  try {
    const { Body, From } = req.body;
    if (!Body || !From) return res.status(200).send('OK');

    const telefoneLimpo = limparTelefone(From);
    console.log(`De: ${telefoneLimpo} | Msg: ${Body}`);
    let cliente = await Cliente.findOne({ telefone: { $regex: telefoneLimpo } });

    if (!cliente) {
      console.log("Cliente não encontrado pelo telefone. Usando 'Cliente Padrão' (o primeiro do banco) para teste.");
      cliente = await Cliente.findOne(); 
    }

    if (!cliente) {
      console.log("ERRO: Nenhum cliente existe no banco de dados. Cadastre pelo menos um cliente.");
      return res.status(200).send('OK');
    }

    const { itens, total } = await processarItensDoPedido(Body);

    if (itens.length === 0) {
      console.log("Nenhum item válido identificado. Ignorando criação de pedido.");
      return res.status(200).send('OK');
    }

    const novoPedido = new Pedido({
      cliente: cliente._id,
      itens: itens,
      total: total,
      origem: 'whatsapp',
      status: 'Pendente',
      observacoes: `Pedido via WhatsApp:\n${Body}`
    });

    await novoPedido.save();
    console.log("🎉 SUCESSO! Pedido WhatsApp salvo no banco com ID:", novoPedido._id);

  } catch (error) {
    console.error("Erro ao processar webhook:", error);
  }

  res.status(200).send('OK');
});

export default router;