//import registrationService from './services/registration'
/* import loginService from "./services/login"; */
import LoginForm from "./components/LoginForm";
//import Notification from "./components/Notification";
import RegistrationForm from "./components/RegistrationForm";
//import Navigation from "./components/Navigation";
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route exact path="/register" element={<RegistrationForm />}></Route>
      <Route exact path="/" element={<LoginForm />}></Route>
      <Route exact path="/forgotPassword" element={<ForgotPassword />}></Route>
      <Route exact path="/resetPassword" element={<ResetPassword />}></Route>
      <Route exact path="/verification" element={<Verification />}></Route>
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
      <Route exact path="*" element={<NotFound />}></Route>
    </Route>
  )
);

const App = () => {
  return <RouterProvider router={router}></RouterProvider>;
};

export default App;
