import { Route, Routes } from "react-router-dom";
import Login from "../pages/user/Login";
import UserLayout from "../Layout/UserLayout";
import Signup from "../pages/user/Signup";
import Home from "../pages/user/Home";
import About from "../pages/user/About";
import OTPForm from "../pages/user/OtpVerification";
import Cart from "../pages/user/Cart";
import Collection from "../pages/user/Collection";
import ProtectedRoute from "./ProtectedRoute";
import ForgotPass from "../pages/user/ForgotPass";
import OTPFormFrogotpass from "../pages/user/OtpVerifyForgotpass";
import ChangePass from "../pages/user/ChangePass";
import ProductDetails from "../pages/user/ProductDetails";
import Contact from "../pages/user/Contact";
import Wishlist from "../pages/user/Wishlist";
import PublicOnlyRoute from "./PublicOnlyRoute";
import CategoryBasedCollection from "../pages/user/CategoryBasedCollection";
import MyAccount from "../pages/user/accout/MyAccount";
import Profile from "../pages/user/accout/Profile";
import EditName from "../pages/user/accout/EditName";
import EditMobile from "../pages/user/accout/EditMobile";
import EditPassword from "../pages/user/accout/EditPassword";
import Address from "../pages/user/accout/Adress";
import AddAddress from "../pages/user/accout/AddAddress";
import Checkout from "../pages/user/Checkout";
import PaymentPage from "../pages/user/PaymentPage";
import MyOrders from "../pages/user/MyOrders";
import OrderSuccessPage from "../pages/user/orderSuccess";
import Wallet from "../pages/user/Wallet";
import OrderFailed from "../pages/user/orderFailed";
import ErrorBoundary from "../components/common/ErrorBoundary";
import Coupons from "../pages/user/Coupons";

const UserRoutes = () => {
  return (
    <div>
      <ErrorBoundary>
      <Routes>
        <Route
          path="login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="register"
          element={
            <PublicOnlyRoute>
              <Signup />
            </PublicOnlyRoute>
          }
        />

        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="collection" element={<Collection />} />
          <Route path="about" element={<About />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="verify-otp" element={<OTPForm />} />
          <Route path="change-password" element={<ChangePass />} />
          <Route path="verify-otp-forgotpass" element={<OTPFormFrogotpass />} />
          <Route path="reset-password" element={<ForgotPass />} />
          <Route path="contact" element={<Contact />} />
          <Route path="coupons" element={<Coupons />} />


          <Route
            path="cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="category-collection"
            element={<CategoryBasedCollection />}
          />
          <Route
            path="checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="payment-page"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="order-success"
            element={
              <ProtectedRoute>
                <OrderSuccessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="wallet"
            element={
              <ProtectedRoute>
                <Wallet />
              </ProtectedRoute>
            }
          />
          <Route
            path="order-failed"
            element={
              <ProtectedRoute>
                <OrderFailed />
              </ProtectedRoute>
            }
          />

          <Route
            path="My-account"
            element={
              <ProtectedRoute>
                <MyAccount />
              </ProtectedRoute>
            }
          />
          <Route
            path="My-profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="edit-name"
            element={
              <ProtectedRoute>
                <EditName />
              </ProtectedRoute>
            }
          />
          <Route
            path="edit-mobile"
            element={
              <ProtectedRoute>
                <EditMobile />
              </ProtectedRoute>
            }
          />
          <Route
            path="edit-password"
            element={
              <ProtectedRoute>
                <EditPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-address"
            element={
              <ProtectedRoute>
                <Address />
              </ProtectedRoute>
            }
          />
          <Route
            path="add-address"
            element={
              <ProtectedRoute>
                <AddAddress />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
      </ErrorBoundary>
    </div>
  );
};

export default UserRoutes;
