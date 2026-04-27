import { formatRupiah } from '../../../utils/formatRupiah';

const AnalyticsDashboard = ({ monthlySpend, favoriteCoffee, planStatus }) => (
  <article className="tool-card">
    <span className="eyebrow">Analytics Dashboard</span>
    <h3>Ringkasan kebiasaan ngopi</h3>
    <div className="insight-list">
      <div><span>Total belanja</span><strong>{formatRupiah(monthlySpend)}</strong></div>
      <div><span>Menu favorit</span><strong>{favoriteCoffee}</strong></div>
      <div><span>Status langganan</span><strong>{planStatus}</strong></div>
    </div>
  </article>
);

export default AnalyticsDashboard;