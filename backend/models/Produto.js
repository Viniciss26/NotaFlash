import mongoose from 'mongoose';

const produtoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
  },
  precoVenda: {
    type: Number,
    required: true,
  },
  unidade: {
    type: String,
    required: true,
    enum: ['un', 'kg', 'pct', 'cx'],
  },
  grupo: {
    type: String,
    trim: true,
  },
  codigo: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
  },
  descricao: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

const Produto = mongoose.model('Produto', produtoSchema);

export default Produto;