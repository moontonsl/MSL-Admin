import styles from './Footer.module.scss';
import { Link, usePage } from '@inertiajs/react';
import { Facebook, Youtube, Shield } from 'lucide-react';
import ThemeToggleButton from '../ThemeToggleButton.jsx';

const Footer = () => {
    const { footer } = usePage().props;

    // Fallback to default values if footer data is not available
    const navSections = footer?.nav_sections || [
        {
            title: 'Explore',
            links: [
                { label: 'Events', href: '/Events' },
                { label: 'News', href: '/news' },
                { label: 'Program', href: '/Programs' },
                { label: 'Resources', href: '/resources' }
            ]
        },
        {
            title: 'Legal',
            links: [
                { label: 'Privacy Policy', href: '/PrivacyPolicy' },
                { label: 'Terms of Use', href: '/TermsAndConditions' }
            ]
        }
    ];

    const description = footer?.description || 'This website is under the use of Moonton Student Leaders Philippines supervised and monitored by the SERP Department. For inquiries and website concerns, send it to us using this link or you may contact us through contact@moontonslph.org';
    const copyright = footer?.copyright || '© 2025 — Moonton Student Leaders Philippines';
    const logo = footer?.logo || '/msl-logo.png';
    const facebookUrl = footer?.facebook_url || 'https://www.facebook.com/MSLPhilippines';
    const youtubeUrl = footer?.youtube_url || 'https://www.youtube.com/@MSLPhilippines';
    const mlbbLogo = footer?.mlbb_logo || '/mlbb-logo.png';
    const moontonLogo = footer?.moonton_logo || '/moonton-logo.png';

    return (
        <footer className={`${styles.footer} text-white relative z-[9999] pointer-events-auto`}>
            <div className={styles.footerTop}>
                <div className={styles.footerInfo}>
                    <div className={styles.logo}>
                        <Link href="/">
                            <img src={logo} alt="MSL Logo" />
                        </Link>
                    </div>
                    <p>{description}</p>
                </div>
                <div className={styles.navGrid}>
                    {navSections.map((section, index) => (
                        <div key={index} className={styles.navs}>
                            <div className={styles.categoryTitle}>{section.title}</div>
                            <ul>
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <Link href={link.href}>{link.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <div className={styles.navs}>
                        <div className={styles.categoryTitle}>Safe Spaces</div>
                        <p className={styles.safeSpaceText}>We are committed to RA 11313 compliance.</p>
                        <Link href="/report-violation" className={styles.reportButton}>
                            <Shield size={16} />
                            <span>Report Violation</span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className={styles.dividerWrapper}>
                <div className={styles.divider}>
                </div>
            </div>

            <div className={styles.partnered}>
                <div className={styles.partneredLogo}>
                    <Link href="/">
                        <img src={mlbbLogo} alt="MLBB Logo" />
                    </Link>
                </div>
                <div className={styles.partneredLogo}>
                    <Link href="/">
                        <img src={moontonLogo} alt="Moonton Logo" />
                    </Link>
                </div>
            </div>

            <div className={styles.footerBottom}>
                <div className={styles.footerCopyright}>{copyright}</div>
                <div className={styles.socials}>
                    <div className="hidden"><ThemeToggleButton /></div>
                    <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                        <Youtube size={20} />
                    </a>
                    <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <Facebook size={20} />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
