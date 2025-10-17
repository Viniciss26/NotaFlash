import mongoose from 'mongoose';

const pedidoSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true,
  },
  itens: [
    {
      produto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produto',
        required: true,
      },
      quantidade: {
        type: Number,
        required: true,
      },
      precoUnitario: {
        type: Number,
        required: true,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Pendente', 'Finalizado', 'Cancelado'],
    default: 'Pendente',
  },
  observacoes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

export default Pedido;