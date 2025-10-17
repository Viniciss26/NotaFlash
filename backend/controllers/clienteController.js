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

// --- R: READ (NOVO) ---
const obterClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro ao buscar clientes.' });
  }
};

// --- U: UPDATE (NOVO) ---
const atualizarCliente = async (req, res) => {
  const { id } = req.params;

  try {
    const cliente = await Cliente.findByIdAndUpdate(id, req.body, { new: true });

    if (!cliente) {
      return res.status(404).json({ msg: 'Cliente não encontrado.' });
    }

    res.json({ msg: 'Cliente atualizado com sucesso!', cliente });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro ao atualizar cliente.' });
  }
};

const excluirCliente = async (req, res) => {
  const { id } = req.params;

  try {
    const cliente = await Cliente.findByIdAndDelete(id);

    if (!cliente) {
      return res.status(404).json({ msg: 'Cliente não encontrado.' });
    }

    res.json({ msg: 'Cliente excluído com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro ao excluir cliente.' });
  }
};

const obterClientePorId = async (req, res) => {
  const { id } = req.params;

  try {
    const cliente = await Cliente.findById(id);

    if (!cliente) {
      return res.status(404).json({ msg: 'Cliente não encontrado.' });
    }

    res.json(cliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro ao buscar cliente.' });
  }
};

export { cadastrarCliente, obterClientes, atualizarCliente, excluirCliente, obterClientePorId };