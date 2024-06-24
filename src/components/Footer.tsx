import React from 'react';
import Link from 'next/link';

const Footer = () => {
	return (
		<p data-testid="footer-text">
			Saintly Sinners &copy; {new Date().getFullYear()}{' '}
			<Link href="/support/customer-services">Customer Services</Link>
			<span className="ml-2">
				<Link href="/support/frequent-questions">FAQ</Link>
			</span>
		</p>
	);
};

export default Footer;
