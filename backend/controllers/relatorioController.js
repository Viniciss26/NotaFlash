import Pedido from '../models/Pedido.js';

export const obterDadosPainelFinanceiro = async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;

    // Filtro base: Aceita pedidos Pendentes e Finalizados (ajuste se quiser só Finalizados)
    const filtroMatch = {
      status: { $regex: /Finalizado|Pendente/i }
    };

    // Aplica o filtro de data usando o 'createdAt' gerado pelos timestamps do seu Schema
    if (dataInicio && dataFim) {
      filtroMatch.createdAt = {
        $gte: new Date(dataInicio + "T00:00:00.000Z"),
        $lte: new Date(dataFim + "T23:59:59.999Z")
      };
    }

    // 1. Agregação dos KPIs para os Cards (Faturamento, Qtd, Ticket Médio e Origem)
    const kpisGerais = await Pedido.aggregate([
      { $match: filtroMatch },
      {
        $group: {
          _id: null,
          faturamentoTotal: { $sum: "$total" },
          qtdPedidos: { $sum: 1 },
          whatsappPedidos: {
            $sum: { $cond: [{ $eq: ["$origem", "whatsapp"] }, 1, 0] }
          },
          manualPedidos: {
            $sum: { $cond: [{ $eq: ["$origem", "Manual"] }, 1, 0] }
          }
        }
      }
    ]);

    const resumo = kpisGerais[0] || {
      faturamentoTotal: 0,
      qtdPedidos: 0,
      ticketMedio: 0,
      whatsappPedidos: 0,
      manualPedidos: 0
    };

    if (resumo.qtdPedidos > 0) {
      resumo.ticketMedio = resumo.faturamentoTotal / resumo.qtdPedidos;
    }

    // 2. Agregação do Histórico por Dia para a Tabela
    const historico = await Pedido.aggregate([
      { $match: filtroMatch },
      {
        $group: {
          _id: { $dateToString: { format: "%d/%m/%Y", date: "$createdAt", timezone: "-03:00" } },
          total: { $sum: "$total" },
          qtd: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } },
      { $project: { _id: 0, data: "$_id", total: 1, qtd: 1 } }
    ]);

    // 3. Agregação do Ranking de Produtos (Ajustado para 'precoUnitario' do seu Schema!)
    const produtos = await Pedido.aggregate([
      { $match: filtroMatch },
      { $unwind: "$itens" },
      {
        // 3.1 Cruzar com a coleção de Produtos para buscar os dados de lá
        $lookup: {
          from: "produtos",       // Nome da coleção de produtos no banco (geralmente minúsculo e no plural)
          localField: "itens.produto",
          foreignField: "_id",
          as: "dadosProduto"
        }
      },
      { $unwind: "$dadosProduto" }, // Desestrutura o array que o lookup retorna
      {
        $group: {
          _id: "$itens.produto",
          nome: { $first: "$dadosProduto.nome" }, // Agora pegamos o nome real do produto!
          quantidade: { $sum: "$itens.quantidade" },
          totalFaturado: { $sum: { $multiply: ["$itens.precoUnitario", "$itens.quantidade"] } }
        }
      },
      { $sort: { quantidade: -1 } },
      { $limit: 5 }
    ]);

    // Envia o blocão de dados pronto para o seu front novo
    res.json({
      resumo,
      historico,
      produtos
    });

  } catch (err) {
    console.error("Erro no controller de relatórios:", err);
    res.status(500).json({ error: "Erro ao gerar dados do relatório" });
  }
};