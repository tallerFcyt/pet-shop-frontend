import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthContext } from "./context/AuthContext";
import Nav from "./components/nav/Nav";
import ViewProduct from "./pages/ViewProduct";

import { lazy, Suspense } from 'react';

const Buys = lazy(() => import('./pages/Buys'));
const Products = lazy(() => import('./pages/Products'));
const Favorite = lazy(() => import('./pages/Favorite'));
const Cart = lazy(() => import('./pages/Cart'));
const Services = lazy(() => import('./pages/Services'));
const Register = lazy(() => import('./pages/Register'));
const Sales = lazy(() => import('./pages/Sales'));


function App() {
  const { userData, user } = useAuthContext();

  const LazyBuys = user && userData && !userData.isAdmin ? Buys : Products;
  const LazyFavorite = user && userData && !userData.isAdmin ? Favorite : Products;
  const LazyCart = user && userData && !userData.isAdmin ? Cart : Products;
  const LazyServices = user ? Services : Products;
  const LazySales = user && userData && userData.isAdmin ? Sales :  Products; 
  const LazyRegister = !userData ? Register : Products; 

  return (
    <Router>
      <div className="App">
        <Nav />
        <Suspense fallback={<div></div>}>
          <Routes>
            <Route path="/" element={Products && <Products />} />
            <Route
              path="/buys"
              element={LazyBuys && <LazyBuys />}
            />
            <Route
              path="/favorites"
              element={LazyFavorite && <LazyFavorite />}
            />
            <Route
              path="/cart"
              element={LazyCart && <LazyCart />}
            />
            <Route
              path="/services"
              element={LazyServices && <LazyServices />}
            />
            <Route
              path="/register"
              element={LazyRegister && <LazyRegister />}
            />
            <Route
              path="/sales"
              element={LazySales && <LazySales />}
            />
            <Route
              path="/product/:id"
              element={<ViewProduct />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}


export default App;
