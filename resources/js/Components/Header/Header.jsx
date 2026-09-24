import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import styles from './Header.module.scss';
import { MdAccountCircle } from "react-icons/md";
import AccountModificationModal from "./AccountModificationModal";



// Base navigation links array (only main nav links)
const baseNavLinks = [
    { name: 'Events', href: '/Events' },
    { name: 'Program', href: '/Programs' },
    { name: 'Resources', href: '/resources' },
    { name: 'News', href: '/news' },
];

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility

    const [showModificationModal, setShowModificationModal] = useState(false);//For the Account Modification Modal

    const { auth } = usePage().props;
    const user = auth.user;

    // Create navigation links based on user role
    const navLinks = React.useMemo(() => {
        // Only base nav links - Campus Tournament and Modification moved to dropdown
        return [...baseNavLinks];
    }, [user]);

    // Click handler for the account icon
    const handleAccountIconClick = (e) => {
        // Prevent Inertia.js from trying to navigate if user is logged in
        // and we want to open the dropdown instead.
        if (user) {
            e.preventDefault(); // Stop the default Link behavior (navigation)
            setIsDropdownOpen((prev) => !prev); // Toggle dropdown visibility
        } else {
            // If not logged in, the Link href="/login" will handle navigation
            // and we still want to close the mobile menu if it's open.
            setIsMenuOpen(false);
        }
    };

    const handleLogout = () => {
        // Close the dropdown immediately for better UX
        setIsDropdownOpen(false);

        // This is the crucial change:
        // Send a POST request to your backend's logout route.
        // Assuming your backend has a route like `/logout` that invalidates the session.
        router.post('/logout', {}, { // The second argument is data, which is empty for a simple logout
            onSuccess: () => {
                // Inertia.js automatically handles redirection after a successful logout,
                // typically to the login page if configured in your backend.
            },
            onError: (errors) => {
                // Handle any errors during logout (e.g., network issues)
            },
            onFinish: () => {
                // This will always run after the request is finished, regardless of success or failure.
            },
            replace: true, // Replace the current history entry so user can't go back to a 'logged in' state
        });
    };

    return (
        <header className={`${styles.header} text-white`}>
            <div className={styles.container}>

                <div className={styles.menuButtons}>
                    {/* Menu button for mobile view */}
                    <button
                        className={styles.menuButton}
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        aria-expanded={isMenuOpen}
                        aria-controls="main-navigation"
                    >
                        <Menu size={24} />
                    </button>
                    <div className={styles.logo}>
                        <Link href="/">
                            <img src="/msl-logo.png" alt="MSL Logo" />
                        </Link>
                    </div>
                </div>

                {/* Main Navigation */}
                <nav
                    id="main-navigation"
                    className={`${styles.nav} ${isMenuOpen ? styles.open : ''}`}
                >
                    <ul className={`${styles.navList} uppercase sm:text-sm`}>
                        {navLinks.map(({ name, href }) => (
                            <li key={name}>
                                <Link
                                    href={href}
                                    onClick={() => {
                                        setIsMenuOpen(false); // Close mobile menu
                                        setIsDropdownOpen(false); // Close dropdown if open
                                    }}
                                >
                                    {name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Account/Login Icon and Dropdown */}
                <div className={styles.authIcon}>
                    <div className={styles.accountContainer}> {/* Wrapper for positioning dropdown */}
                        <Link
                            // Use href="/login" if not logged in. If logged in, use '#' and prevent default.
                            href={user ? "#" : "/login"}
                            className={user ? styles.headerAuth : styles.signInIcon}
                            onClick={handleAccountIconClick} // New handler for icon click
                        // Optional: If you strictly want no navigation and only onClick, use as="button"
                        // as={user ? "button" : "a"}
                        >
                            {/* Make icon bigger */}
                            <MdAccountCircle size={40} />
                        </Link>

                        {user && isDropdownOpen && (
                            <div className={styles.dropdownMenu}>
                                <Link
                                    href="/studentportal"
                                    className={styles.dropdownItem}
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    Profile
                                </Link>
                                {(user.role === 'SL' || user.role === 'Super Admin' || user.role === 'Regional Admin') && (
                                    <Link
                                        href="/sl-admin"
                                        className={styles.dropdownItem}
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        SL Admin
                                    </Link>
                                )}
                                {/* Campus Tournament - only for SL and Regional Admin */}
                                {(user.role === 'SL' || user.role === 'Regional Admin' || user.role === 'Super Admin') && (
                                    <a
                                        href="/campus-tournament"
                                        className={styles.dropdownItem}
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        Campus Tournament
                                    </a>
                                )}
                                {/* Modification - different URLs based on role */}
                                {user.role === 'SL' && (
                                    <Link
                                        href="/SLAdminApproval"
                                        className={styles.dropdownItem}
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        Modification
                                    </Link>
                                )}
                                {(user.role === 'Regional Admin' || user.role === 'Super Admin') && (
                                    <Link
                                        href="/RegionalAdminApproval"
                                        className={styles.dropdownItem}
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        Modification
                                    </Link>
                                )}
                                {/* User Regions - only for Super Admin */}
                                {user.role === 'Super Admin' && (
                                    <Link
                                        href="/admin/user-regions"
                                        className={styles.dropdownItem}
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        User Regions
                                    </Link>
                                )}
                                {(user.role === 'Regional Admin' || user.role === 'Super Admin') && (
                                    <Link
                                        href="/community/create"
                                        className={styles.dropdownItem}
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        Communities
                                    </Link>
                                )}
                                {/* <button
                                    onClick={() => {
                                        setShowModificationModal(true);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={styles.dropdownItem}
                                    >
                                    Modify Account
                                </button> */}
                                <button
                                    onClick={handleLogout}
                                    className={styles.dropdownItem}
                                >
                                    Log out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modify Account Modal */}
            {showModificationModal && (
                <AccountModificationModal
                    isOpen={showModificationModal}
                    onClose={() => setShowModificationModal(false)}
                />
            )}
        </header>
    );
};

export default Header;