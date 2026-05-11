router.get('/relatorios/faturamento', async (req, res) => {
  try {
    const dados = await Pedido.aggregate([
      {
        $match: { 
          status: "Finalizado", // Apenas pedidos concluídos
          createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%d/%m", date: "$createdAt" } },
          totalVendas: { $sum: "$total" },
          qtdPedidos: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    res.json(dados);
  } catch (err) {
    res.status(500).json({ error: "Erro ao gerar relatório" });
  }
});