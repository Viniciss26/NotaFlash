import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
  },
  telefone: {
    type: String,
    required: true,
    trim: true,
  },
  cep: {
    type: String,
    trim: true,
  },
  endereco: {
    type: String,
    trim: true,
  },
  bairro: {
    type: String,
    trim: true,
  },
  descricao: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

const Cliente = mongoose.model('Cliente', clienteSchema);

export default Cliente;