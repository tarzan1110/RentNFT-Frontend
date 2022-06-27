import { RouteObject, useRoutes } from 'react-router-dom';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {
  Market,
  Collections,
  Wallet,
  Rents,
  Claim,
  StopLending
} from 'pages';


const routes: RouteObject[] = [
  {
    path: "/",
    element: <Market />,
    children: [],
  },
  {
    path: "/Market/:id",
    element: <Market />,
    children: [],
  },
  {
    path: "/Collections",
    element: <Collections />,
    children: [],
  },
  {
    path: "/Collections/:id",
    element: <Market />,
    children: [],
  },
  {
    path: "/Wallet/:id",
    element: <Wallet />,
    children: [],
  },
  {
    path: "/Rents",
    element: <Rents />,
    children: [],
  },
  {
    path: "/StopLending",
    element: <StopLending />,
    children: [],
  },
  {
    path: "/Claim",
    element: <Claim />,
    children: [],
  }
];

const Router: React.FC = () => {
  const routing = useRoutes(routes);
  return (
    <>
      {routing}
      <NotificationContainer/>
    </>
  );
}

export default Router;