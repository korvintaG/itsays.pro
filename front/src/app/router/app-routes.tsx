import { createBrowserRouter } from "react-router-dom";
import { appRoutesURL } from "./app-routes-URL";
import App from "../App";
import { UIList } from "../../domains/trash-ui-entity";
import { AboutPage } from "../../pages/about-page/about-page";
import { NotFoundPage } from "../../pages/not-found-page/not-found-page";
import ErrorPage from "../../pages/error-page/error-page";
import LoginPage from "../../pages/login-page/login-page";
import { thingsLoad } from "../../domains/things/loaders/thing-list-loader";
import { thingLoad } from "../../domains/things/loaders/thing-details-loader";
import { ThingListPage } from "../../domains/things/pages/thing-list-page/thing-list-page";
import { ThingDetailsPage } from "../../domains/things/pages/thing-details-page/thing-details-page";
import { DialogListPage } from "../../domains/dialogs/pages/dialogs-list-page";

export const appRoutes = createBrowserRouter([
  {
    path: appRoutesURL.home,
    element: <App />,
    children: [
      { index: true, element: <AboutPage /> },
      {
        path: appRoutesURL.tests,
        element: <UIList/>,
        errorElement: <ErrorPage />,
      },
      {
        path: appRoutesURL.things,
        Component: ThingListPage,
        loader: thingsLoad,
        errorElement: <ErrorPage />,
      },
      { path: appRoutesURL.thingAdd, 
        Component: ThingDetailsPage,
        loader: thingLoad,
        errorElement: <ErrorPage />},
      {
        path: appRoutesURL.thing,
        Component: ThingDetailsPage,
        loader: thingLoad,
        errorElement: <ErrorPage />,
      },
      { path: appRoutesURL.auth, element: <LoginPage /> },
      {
        path: appRoutesURL.messages,
        Component: DialogListPage,
        errorElement: <ErrorPage />,
      },

      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
