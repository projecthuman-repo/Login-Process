import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Verification from "./components/Verification";
import { Route, RouterProvider } from "react-router-dom";
import AccountInfo from "./components/AccountInfo";
import HomePage from "./components/HomePage";
import {
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { checkAuthLoader } from "./util/auth";
import NotFound from "./components/NotFound";
/**
 * Contains all routes of the app
 * RegistrationForm -> For registration
 * LoginForm -> For logging in user
 * ForgotPassword -> For getting reset password link
 * ResetPassword -> For resetting user password
 * Verification -> For verifying user account
 * @const router
 *
 */
const router = createBrowserRouter(
  createRoutesFromElements(
    // Routes of app
    <Route>
      <Route exact path="/register" element={<RegistrationForm />}></Route>
      <Route exact path="/" element={<LoginForm />}></Route>
      <Route exact path="/forgotPassword" element={<ForgotPassword />}></Route>
      <Route exact path="/resetPassword" element={<ResetPassword />}></Route>
      <Route exact path="/verification" element={<Verification />}></Route>
      {/* Protected routes */}
      <Route
        exact
        path="/view/account"
        element={<AccountInfo />}
        loader={checkAuthLoader}
      ></Route>
      <Route
        exact
        path="/homepage"
        element={<HomePage />}
        loader={checkAuthLoader}
      ></Route>
      {/* For all routes not defined above */}
      <Route exact path="*" element={<NotFound />}></Route>
    </Route>
  )
);

const App = () => {
  return <RouterProvider router={router}></RouterProvider>;
};

export default App;
