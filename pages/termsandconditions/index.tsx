import Link from 'next/link';
import { AccordionTabChangeEvent } from 'primereact/accordion';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Ripple } from 'primereact/ripple';
import { classNames } from 'primereact/utils';
import { useState } from 'react';

const itemList = [
	{
		header: 'Terms',
		bodyText: [
			'We, Lovehoney Limited, operate the Lovehoney website. We are a company registered in England and Wales under company number 04637868 with its registered office and main trading address at 100 Locksbrook Road, Bath BA1 3EN ',
		],
	},
];

const TermsAndConditions = () => {
	const [activeIndex, setActiveIndex] = useState<number | number[]>(0);

	const selectPolicy = (idx: number) => {
		setActiveIndex(idx);
	};

	return (
		<>
			<Card title="Terms and Coinditions">
				<Accordion
					activeIndex={activeIndex}
					multiple={false}
					onTabChange={(e) => setActiveIndex(e.index)}>
					<AccordionTab header="Terms">
						<ul className="list-none p-0 m-0 flex-grow-1">
							<li className="flex align-items-center mb-3">
								<i className="pi pi-check-circle text-purple-500 mr-2"></i>
								<span className="m-0 text-color-secondary">
									'We, Rationem Limited, operate the SaintlySinners website. We
									are a company registered in England and Wales under company
									number 11112396 with its registered office at{' '}
									<i>
										3rd Floor Office, 207 Regent Street, London, England, W1B
										3HH{' '}
									</i>
									and main trading address at{' '}
									<i>66 Cop Lane, Penwortham, Lancashire PR1 0UR </i>'
								</span>
							</li>
							<li className="flex align-items-center mb-3">
								<i className="pi pi-check-circle text-purple-500 mr-2"></i>
								<span className="m-0 text-color-secondary">
									For the avoidance of doubt any reference to “us” “we” or “our”
									in these Terms refers to Lovehoney Group and any reference to
									“you” or “your” refers to the customer as a purchaser of the
									SaintlySinners products
								</span>
							</li>
							<li className="flex align-items-center mb-3">
								<i className="pi pi-check-circle text-purple-500 mr-2"></i>
								<span className="m-0 text-color-secondary">
									It is a condition of a user accessing and reading the Saintly
									website (“the Website(s)”) that SaintlySinners disclaims all
									warranties in respect of the same whether express or implied
									in relation to the material published on the Website. Your
									statutory rights as a consumer are not affected.
								</span>
							</li>
							<li className="flex align-items-center mb-3">
								<i className="pi pi-check-circle text-purple-500 mr-2"></i>
								<span className="m-0 text-color-secondary">
									This page (together with our{' '}
									<span
										style={{ cursor: 'pointer', textDecoration: 'underline' }}
										onClick={() => selectPolicy(5)}>
										{' '}
										Privacy Policy{' '}
									</span>
									,{' '}
									<span
										style={{ cursor: 'pointer', textDecoration: 'underline' }}
										onClick={() => selectPolicy(5)}>
										Returns Policy
									</span>{' '}
									and{' '}
									<span
										style={{ cursor: 'pointer', textDecoration: 'underline' }}
										onClick={() => selectPolicy(5)}>
										Delivery Policy
									</span>
									) tells you information about SaintlySinners and the legal
									terms and conditions on which we sell any of the products
									listed on the Website.
								</span>
							</li>
							<li className="flex align-items-center mb-3">
								<i className="pi pi-check-circle text-purple-500 mr-2"></i>
								<span className="m-0 text-color-secondary">
									These Terms will apply to any contract between us for the sale
									of products to yourself. Please read these Terms carefully and
									make sure that you understand them, before ordering any
									products from the Website. Before placing any order you will
									be asked to agree to these Terms. If you refuse to accept
									these Terms, you will not be able to order any products from
									the Website.
								</span>
							</li>
							<li className="flex align-items-center mb-3">
								<i className="pi pi-check-circle text-purple-500 mr-2"></i>
								<span className="m-0 text-color-secondary">
									We reserve the right to amend these Terms from time to time.
									Every time you wish to place an order you should check these
									Terms to ensure you understand the terms which will apply at
									that time.
								</span>
							</li>
						</ul>
					</AccordionTab>
					<AccordionTab header="Age of Consent">
						<li className="flex align-items-center mb-3">
							<i className="pi pi-check-circle text-purple-500 mr-2"></i>
							<span className="m-0 text-color-secondary">
								By placing an order on the Website, you declare that you are of
								the appropriate legal age to purchase the items. If we discover
								that you are not of legal age to order certain goods, we reserve
								the right to cancel your order.
							</span>
						</li>
					</AccordionTab>
					<AccordionTab header="Contract Formation">
						<ul className="list-none p-0 m-0 flex-grow-1">
							<li className="flex align-items-center mb-3">
								<i className="pi pi-check-circle text-purple-500 mr-2"></i>
								<span className="m-0 text-color-secondary">
									All orders made by you through the Website are subject to
									acceptance and availability. We may choose not to accept your
									order for any reason.
								</span>
							</li>
							<li className="flex align-items-center mb-3">
								<i className="pi pi-check-circle text-purple-500 mr-2"></i>
								<span className="m-0 text-color-secondary">
									Prices of products are correct at the time of entering
									information, however, we reserve the right to change prices
									without prior notice (although we will inform you if any such
									price change affects your order).
								</span>
							</li>
							<li className="flex align-items-center mb-3">
								<i className="pi pi-check-circle text-purple-500 mr-2"></i>
								<span className="m-0 text-color-secondary">
									Only when SaintlySinners accepts the Order by sending you a
									confirmation email that your order has been dispatched will a
									contract have been created between yourself and
									SaintlySinners.
								</span>
							</li>
						</ul>
					</AccordionTab>
					<AccordionTab header="Cancellation">
						<li className="flex align-items-center mb-3">
							<i className="pi pi-check-circle text-purple-500 mr-2"></i>
							<span className="m-0 text-color-secondary">
								If you are an EU or UK consumer, you have the legal right, under
								the Consumer Protection (Distance Selling) Regulations of 2000
								to cancel your order within fourteen (14) working days following
								receipt of the goods or the date on which we begun the provision
								of services. Refunds for orders cancelled under the provisions
								of the Consumer Protection (Distance Selling) Regulations will
								be processed in accordance with your legal rights.
							</span>
						</li>
					</AccordionTab>
					<AccordionTab header="Email Marketing">
						<li className="flex align-items-center mb-3">
							<i className="pi pi-check-circle text-purple-500 mr-2"></i>
							<span className="m-0 text-color-secondary">
								SaintlySinners does not send marketing emails
							</span>
						</li>
					</AccordionTab>
					<AccordionTab header="Privacy">
						<li className="flex align-items-center mb-3">
							<i className="pi pi-check-circle text-purple-500 mr-2"></i>
							<span className="m-0 text-color-secondary">
								We use cookies or similar technologies to store certain types of
								information each time you use our site. You can find out more
								information about how we use cookies and other similar
								technologies in our Cookies Policy.
							</span>
						</li>
					</AccordionTab>
					<AccordionTab header="Use Of Internet Bots">
						<ul className="list-none p-0 m-0 flex-grow-1">
							<li className="flex align-items-center mb-3">
								<i className="pi pi-check-circle text-purple-500 mr-2"></i>
								<span className="text-color-secondary">
									We only permit the use of low impact software applications
									that run automated scripts (internet bots) on the Websites
									which comply with our current bot policy and for which we have
									given permission (“Permitted Bots”). All other internet bots
									are unauthorised bots and are not permitted to be used on any
									of our Websites.
								</span>
							</li>
							<li className="flex align-items-center mb-3">
								<i className="pi pi-check-circle text-purple-500 mr-2"></i>
								<span className="text-color-secondary">
									Lovehoney Group employs sophisticated and best practise fraud
									and bot prevention solutions. Examples of unauthorised bots
									include those internet bots that use an excessive amount of
									hosting resources, automatically add items to basket without
									our prior consent, or impact the shopping user experience for
									other customers.
								</span>
							</li>
							<li className="flex align-items-center mb-3">
								<i className="pi pi-check-circle text-purple-500 mr-2"></i>
								<span className="text-color-secondary">
									Lovehoney Group reserves the right to block any unauthorised
									bots from our websites (either ourselves and/or through third
									parties such as security fraud prevention services), and to
									immediately suspend or close any accounts which we reasonably
									suspect of using unauthorised bots.
								</span>
							</li>
							<li className="flex align-items-center mb-3">
								<i className="pi pi-check-circle text-purple-500 mr-2"></i>
								<span className="text-color-secondary">
									Lovehoney Group reserves the right to block any unauthorised
									bots from our websites (either ourselves and/or through third
									parties such as security fraud prevention services), and to
									immediately suspend or close any accounts which we reasonably
									suspect of using unauthorised bots.
								</span>
							</li>
							<li className="flex align-items-center mb-3">
								<i className="pi pi-check-circle text-purple-500 mr-2"></i>
								<span className="text-color-secondary">
									Users agree to indemnify us against all losses, costs and
									expenses that Lovehoney Group incurs in connection with the
									breach of these rules relating to the use of internet bots on
									the Websites.
								</span>
							</li>
						</ul>
					</AccordionTab>
				</Accordion>
			</Card>
		</>
	);
};

export default TermsAndConditions;
