import Cliente from '../models/Cliente.js';

const cadastrarCliente = async (req, res) => {
  const { nome, telefone, cep, endereco, bairro, descricao } = req.body;

  if (!nome || !telefone) {
    return res.status(400).json({ msg: 'Nome e Telefone são obrigatórios.' });
  }

  try {
    const novoCliente = new Cliente({
      nome,
      telefone,
      cep,
      endereco,
      bairro,
      descricao,
    });

    const clienteSalvo = await novoCliente.save();

    res.status(201).json(clienteSalvo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Erro ao cadastrar cliente. Tente novamente mais tarde.' });
  }
};

export { cadastrarCliente };