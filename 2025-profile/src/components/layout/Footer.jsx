import { Link } from '../ui/Link';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { label: 'GitHub', href: 'https://github.com/jamubc' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/yourusername' },
    { label: 'Email', href: 'mailto:your.email@example.com' },
  ];

  return (
    <footer className="bg-bg-primary border-t-border-primary border-t-thick py-12 mt-24">
      <div className="container mx-auto page-gutter">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Social Links */}
          <div className="flex flex-wrap gap-6">
            {socialLinks.map((link) => (
              <Link key={link.label} href={link.href} external>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-body-sm text-text-secondary">
            © {currentYear} Andrew. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
