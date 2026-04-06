import React from 'react';
import { Nav, NavItem } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faHome, faUserCircle, faGear, faBookmark } from '@fortawesome/free-solid-svg-icons';

// One tab list powers the bottom mobile navigation.
const tabs = [{
  route: "/home",
  icon: faHome,
  label: "Home"
}, {
  route: "/search",
  icon: faSearch,
  label: "Search"
}, {
  route: "/login",
  icon: faUserCircle,
  label: "Profile"
}, {
  route: "/bookmarks",
  icon: faBookmark,
  label: "Saved"
}, {
  route: "/settings",
  icon: faGear,
  label: "Settings"
}]

const Navigation = ({ profile }) => {

  return (
    <div>
      <nav className="navbar top-nav navbar-expand-md navbar-light d-none d-lg-block sticky-top" role="navigation">
        <div className="container-fluid">
          <a className="navbar-brand" href="/home">Exercises</a>
          <Nav className="ml-auto">
            <NavItem>
              <NavLink to="/search" className="nav-link">
                Search
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/login" className="nav-link">
                {profile ? 'Profile' : 'Login'}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/bookmarks" className="nav-link">
                Bookmarks
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/settings" className="nav-link">
                Settings
              </NavLink>
            </NavItem>
          </Nav>
        </div>
      </nav>
      <nav className="navbar fixed-bottom navbar-light d-block d-lg-none bottom-tab-nav" role="navigation">
        <Nav className="w-100">
          <div className=" d-flex flex-row justify-content-around w-100">
            {tabs.map((tab, index) => (
              <NavItem key={`tab-${index}`}>
                <NavLink
                  to={tab.route}
                  className={({ isActive }) => `nav-link bottom-nav-link${isActive ? ' active' : ''}`}
                >
                  <div className="row d-flex flex-column justify-content-center align-items-center">
                    <FontAwesomeIcon size="lg" icon={tab.icon} />
                    <div className="bottom-tab-label">{tab.label}</div>
                  </div>
                </NavLink>
              </NavItem>
            ))
            }
          </div>
        </Nav>
      </nav>
    </div>
  )
};

export default Navigation;