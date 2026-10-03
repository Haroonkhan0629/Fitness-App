'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Nav, NavItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faHome, faUserCircle, faGear, faBookmark } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/context/auth';

const tabs = [
  { route: '/home', icon: faHome, label: 'Home' },
  { route: '/search', icon: faSearch, label: 'Search' },
  { route: '/login', icon: faUserCircle, label: 'Profile' },
  { route: '/bookmarks', icon: faBookmark, label: 'Saved' },
  { route: '/settings', icon: faGear, label: 'Settings' },
];

export default function Navigation() {
  const { profile } = useAuth();
  const pathname = usePathname();
  const desktopTabs = [
    { route: '/home', label: 'Exercises' },
    { route: '/search', label: 'Search' },
    { route: '/login', label: profile ? 'Profile' : 'Login' },
    { route: '/bookmarks', label: 'Bookmarks' },
    { route: '/settings', label: 'Settings' },
  ];

  return (
    <div>
      {/* Desktop top navbar */}
      <nav className="navbar top-nav navbar-expand-md navbar-light d-none d-lg-block sticky-top" role="navigation">
        <div className="container-fluid px-0">
          <Nav className="w-100 d-flex">
            {desktopTabs.map((tab) => (
              <NavItem key={tab.route} className="top-nav-item">
                <Link
                  href={tab.route}
                  className={`nav-link${pathname === tab.route ? ' active' : ''}`}
                >
                  {tab.label}
                </Link>
              </NavItem>
            ))}
          </Nav>
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="navbar fixed-bottom navbar-light d-block d-lg-none bottom-tab-nav" role="navigation">
        <Nav className="w-100">
          <div className="d-flex flex-row justify-content-around w-100">
            {tabs.map((tab, index) => (
              <NavItem key={`tab-${index}`}>
                <Link
                  href={tab.route}
                  className={`nav-link bottom-nav-link${pathname === tab.route ? ' active' : ''}`}
                >
                  <div className="row d-flex flex-column justify-content-center align-items-center">
                    <FontAwesomeIcon size="lg" icon={tab.icon} />
                    <div className="bottom-tab-label">{tab.label}</div>
                  </div>
                </Link>
              </NavItem>
            ))}
          </div>
        </Nav>
      </nav>
    </div>
  );
}
