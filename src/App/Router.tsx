import { RouteObject, useRoutes } from 'react-router-dom';

import {
  Market,
  Collections,
  Wallet,
  Rents,
  Claim
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
    </>
  );
}

export default Router;