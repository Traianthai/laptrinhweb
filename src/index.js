import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './pages/Home';
import Login from './pages/Login';
import { BrowserRouter, Switch, Route } from "react-router-dom";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
          <Route path="/login" component={Login} exact/>
          <Route path="/" component={Home} exact/>
      </Switch>
    </BrowserRouter>
  </React.StrictMode>
  
);
