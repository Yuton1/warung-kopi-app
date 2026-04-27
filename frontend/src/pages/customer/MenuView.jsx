// ... (semua import state & logic tetap di sini)
import Banner from './MenuViewComponents/Banner';
import PromoMingguan from './MenuViewComponents/PromoMingguan';
import Recommendations from './MenuViewComponents/Recommendations';
import MenuGrid from './MenuViewComponents/MenuGrid';
import PreOrderSection from './MenuViewComponents/PreOrderSection';
import GroupOrderSection from './MenuViewComponents/GroupOrderSection';
import CoffeeSubscription from './MenuViewComponents/CoffeeSubscription';
import AnalyticsDashboard from './MenuViewComponents/AnalyticsDashboard';

const MenuView = () => {
  // ... (semua state & function handler tetap di sini)

  return (
    <div className="page-shell">
      <Banner />
      <PromoMingguan />

      <section className="layout-grid">
        <main className="content-column">
          <Recommendations items={recommendations} />
          
          <MenuGrid 
            menu={displayedMenu} 
            loading={loadingMenu}
            favoriteIdSet={favoriteIdSet}
            toggleFavorite={toggleFavorite}
            addToCart={addToCart}
            addToGroup={addToGroup}
            menuRef={menuSectionRef}
          />

          <section className="panel" id="tools">
            <div className="tools-grid">
               <PreOrderSection 
                 hasCart={cart.length > 0} 
                 preOrder={preOrder} 
                 onSave={savePreOrder} 
                 onCancel={cancelPreOrder} 
               />
               <GroupOrderSection 
                 groupOrder={groupOrder} 
                 hasCart={cart.length > 0}
                 onUpdateMembers={updateGroupMembers}
                 onAddCart={addCartToGroup}
                 onConfirm={confirmGroupPayment}
               />
               <CoffeeSubscription 
                 plans={subscriptionPlans} 
                 activeId={subscription?.id} 
                 onActivate={activatePlan} 
               />
               <AnalyticsDashboard 
                 monthlySpend={monthlySpend} 
                 favoriteCoffee={favoriteCoffee} 
                 planStatus={planStatus} 
               />
            </div>
          </section>
        </main>
        
        {/* Sidebar Cart tetep di sini */}
        <div className="sidebar-column">
             <CartFloating />
        </div>
      </section>
    </div>
  );
}