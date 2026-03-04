import React from 'react';
import Sidebar from './Sidebar';
import Player from './Player';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="app">
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          <div className="page-content">
            {children}
          </div>
        </div>
      </div>
      <Player />
    </div>
  );
};

export default Layout;
