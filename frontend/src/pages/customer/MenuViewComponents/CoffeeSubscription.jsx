import { formatRupiah } from '../../../utils/formatRupiah';

const CoffeeSubscription = ({ plans, activeId, onActivate }) => (
  <article className="tool-card">
    <span className="eyebrow">Coffee Subscription</span>
    <h3>Aktifkan langganan favorit</h3>
    <div className="subscription-list">
      {plans.map((plan) => (
        <button key={plan.id} className={`subscription-plan ${activeId === plan.id ? 'is-active' : ''} ${plan.accent}`} onClick={() => onActivate(plan)}>
          <div>
            <strong>{plan.name}</strong>
            <span>{formatRupiah(plan.price)}</span>
          </div>
        </button>
      ))}
    </div>
  </article>
);

export default CoffeeSubscription;