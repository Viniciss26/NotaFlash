import './CupomFiscal.css';

const CupomFiscal = ({ pedido, refCupom }) => {
  if (!pedido) return null;

  const logoUrl = "/logo-notaflash.png"; 
  
  // URL para o QR Code (ex: link do Instagram ou site da loja)
  const linkLoja = "https://www.instagram.com/estacaodosfriosdf?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(linkLoja)}`;

  return (
    <div className="area-impressao" ref={refCupom}>
      <div className="cupom-conteudo">
        
        {/* CABEÇALHO COM LOGO */}
        <div className="cupom-header">
          <img 
            src={logoUrl} 
            alt="Logo Nota Flash" 
            style={{ width: '50mm', marginBottom: '5px', filter: 'grayscale(100%)' }} 
          />
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

        {/* RODAPÉ COM QR CODE */}
        <div className="cupom-footer">
          <div style={{ marginTop: '10px', marginBottom: '10px' }}>
            <p style={{ fontSize: '10px', marginBottom: '5px' }}>Siga nosso Instagram:</p>
            <img 
              src={qrCodeUrl} 
              alt="QR Code Loja" 
              style={{ width: '30mm', height: '30mm' }} 
            />
          </div>
          <p>Obrigado pela preferência!</p>
          <p>www.notaflash.com.br</p>
        </div>

      </div>
    </div>
  );
};

export default CupomFiscal;