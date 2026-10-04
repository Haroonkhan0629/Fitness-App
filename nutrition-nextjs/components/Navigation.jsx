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

  return (
    <div>
      {/* Desktop top navbar */}
      <nav className="navbar top-nav navbar-expand-md navbar-light d-none d-lg-block sticky-top" role="navigation">
        <div className="container-fluid">
          <Nav className="desktop-nav-links">
            <NavItem>
              <Link href="/home" className={`nav-link${pathname === '/home' ? ' active' : ''}`}>Exercises</Link>
            </NavItem>
            <NavItem>
              <Link href="/search" className={`nav-link${pathname === '/search' ? ' active' : ''}`}>Search</Link>
            </NavItem>
            <NavItem>
              <Link href="/login" className={`nav-link${pathname === '/login' ? ' active' : ''}`}>{profile ? 'Profile' : 'Login'}</Link>
            </NavItem>
            <NavItem>
              <Link href="/bookmarks" className={`nav-link${pathname === '/bookmarks' ? ' active' : ''}`}>Bookmarks</Link>
            </NavItem>
            <NavItem>
              <Link href="/settings" className={`nav-link${pathname === '/settings' ? ' active' : ''}`}>Settings</Link>
            </NavItem>
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
