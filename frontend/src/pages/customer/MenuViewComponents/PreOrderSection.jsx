const PreOrderSection = ({ hasCart, preOrder, onSave, onCancel }) => (
  <article className="tool-card">
    <span className="eyebrow">Pre-order Scheduling</span>
    <h3>Atur jam ambil dan simpan pre-order</h3>
    <div className="tool-card__actions">
      <button className="btn btn-primary" onClick={onSave} disabled={!hasCart}>Simpan Pre-order</button>
      <button className="btn btn-secondary" onClick={onCancel} disabled={!preOrder}>Batalkan</button>
    </div>
  </article>
);

export default PreOrderSection;