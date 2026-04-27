const GroupOrderSection = ({ groupOrder = { members: 4, items: [] }, hasCart, onUpdateMembers, onAddCart, onConfirm }) => (
  <article className="tool-card">
    <span className="eyebrow">Group Order & Split Payment</span>
    <h3>Gabung pesanan bareng teman</h3>
    <div className="tool-card__mini-grid">
      <label className="field">
        <span>Anggota</span>
        <input type="number" min="1" value={groupOrder.members} onChange={(e) => onUpdateMembers(e.target.value)} />
      </label>
      <label className="field">
        <span>Kode grup</span>
        <input type="text" value={groupOrder.code} readOnly />
      </label>
    </div>
    <div className="tool-card__actions">
      <button className="btn btn-primary" onClick={onAddCart} disabled={!hasCart}>Tambah ke Grup</button>
      <button className="btn btn-secondary" onClick={onConfirm} disabled={!(groupOrder.items || []).length}>Konfirmasi Pembayaran</button>
    </div>
  </article>
);

export default GroupOrderSection;
