import './CupomFiscal.css';

const CupomFiscal = ({ pedido, refCupom }) => {
  if (!pedido) return null;

  return (
    <div className="area-impressao" ref={refCupom}>
      <div className="cupom-conteudo">
        <div className="cupom-header">
          <h3>NOTA FLASH</h3>
          <p>Pedido #{pedido._id.slice(-4)}</p>
          <p>{new Date().toLocaleString()}</p>
        </div>
        <div className="cupom-info">
          <strong>Cliente:</strong> {pedido.cliente?.nome || 'Consumidor'}<br />
          <strong>Tel:</strong> {pedido.cliente?.telefone || 'N/A'}<br />
          {pedido.origem === 'whatsapp' && <span>(Via WhatsApp)</span>}
        </div>
        <div className="cupom-itens">
          <div style={{fontWeight: 'bold', marginBottom: '5px'}}>ITENS DO PEDIDO</div>
          
          {pedido.itens.map((item, index) => (
            <div key={index} className="item-row">
              {/* Ex: 2x Coca Cola */}
              <span style={{ width: '70%' }}>
                {item.quantidade}x {item.produto?.nome || item.nomeProduto || 'Item'}
              </span>

              <span style={{ width: '30%', textAlign: 'right' }}>
                {(item.precoUnitario * item.quantidade).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="cupom-total">
          TOTAL: R$ {(pedido.total || pedido.valorTotal || 0).toFixed(2)}
        </div>

        {/* RODAPÉ */}
        <div className="cupom-footer">
          <p>Obrigado pela preferência!</p>
          <p>www.notaflash.com.br</p>
        </div>

      </div>
    </div>
  );
};

export default CupomFiscal;