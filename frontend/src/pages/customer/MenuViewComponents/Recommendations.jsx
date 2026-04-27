const Recommendations = ({ items }) => (
  <section className="panel panel--recommendation">
    <div className="section-head">
      <div>
        <span className="eyebrow">Personalized Suggestions</span>
        <h2>Rekomendasi untuk kamu</h2>
      </div>
    </div>
    <div className="recommendation-strip recommendation-strip--wide">
      {items.map((item) => (
        <div key={item.id} className="recommendation-card">
          <div className={`recommendation-card__art ${item.accent}`}><strong>{item.initials}</strong></div>
          <div>
            <span>{item.category}</span>
            <h3>{item.name}</h3>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default Recommendations;