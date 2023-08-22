import Link from 'next/link';
import { AccordionTabChangeEvent } from 'primereact/accordion';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Ripple } from 'primereact/ripple';
import { classNames } from 'primereact/utils';
import { useState } from 'react';

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
								<i className="pi pi-info-circle text-purple-500 mr-2"></i>
								<span className="m-0 text-color-secondary">
									We, Rationem Limited, operate the SaintlySinners website. We
									are a company registered in England and Wales under company
									number 11112396 with its registered office at{' '}
									<i>
										3rd Floor Office, 207 Regent Street, London, England, W1B
										3HH{' '}
									</i>
									and main trading address at{' '}
									<i>66 Cop Lane, Penwortham, Lancashire PR1 0UR </i>
								</span>
							</li>
							<li className="flex align-items-center mb-3">
								<i className="pi pi-info-circle text-purple-500 mr-2"></i>
								<span className="m-0 text-color-secondary">
									For the avoidance of doubt any reference to “us” “we” or “our”
									in these Terms refers to SaintlySinners and any reference to
									“you” or “your” refers to the customer as a purchaser of the
									SaintlySinners products
								</span>
							</li>
							<li className="flex align-items-center mb-3">
								<i className="pi pi-info-circle text-purple-500 mr-2"></i>
								<span className="m-0 text-color-secondary">
									It is a condition of a user accessing and reading the Saintly
									website (“the Website(s)”) that SaintlySinners disclaims all
									warranties in respect of the same whether express or implied
									in relation to the material published on the Website. Your
									statutory rights as a consumer are not affected.
								</span>
							</li>
							<li className="flex align-items-center mb-3">
								<i className="pi pi-info-circle text-purple-500 mr-2"></i>
								<span className=" text-color-secondary">
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
								<i className="pi pi-info-circle text-purple-500 mr-2"></i>
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
								<i className="pi pi-info-circle text-purple-500 mr-2"></i>
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
							<i className="pi pi-info-circle text-purple-500 mr-2"></i>
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
								<i className="pi pi-info-circle text-purple-500 mr-2"></i>
								<span className="m-0 text-color-secondary">
									All orders made by you through the Website are subject to
									acceptance and availability. We may choose not to accept your
									order for any reason.
								</span>
							</li>
							<li className="flex align-items-center mb-3">
								<i className="pi pi-info-circle text-purple-500 mr-2"></i>
								<span className="m-0 text-color-secondary">
									Prices of products are correct at the time of entering
									information, however, we reserve the right to change prices
									without prior notice (although we will inform you if any such
									price change affects your order).
								</span>
							</li>
							<li className="flex align-items-center mb-3">
								<i className="pi pi-info-circle text-purple-500 mr-2"></i>
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
							<i className="pi pi-info-circle  text-purple-500 mr-2"></i>
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
							<i className="pi pi-info-circle text-red-500 mr-2"></i>
							<span className="m-0 text-color-secondary">
								SaintlySinners does not send marketing emails
							</span>
						</li>
					</AccordionTab>
					<AccordionTab header="Privacy">
						<li className="flex align-items-center mb-3">
							<i className="pi pi-info-circle text-purple-500 mr-2"></i>
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
								<i className="pi pi-info-circle text-purple-500 mr-2"></i>
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
								<i className="pi pi-info-circle text-purple-500 mr-2"></i>
								<span className="text-color-secondary">
									SaintlySinners employs sophisticated and best practise fraud
									and bot prevention solutions. Examples of unauthorised bots
									include those internet bots that use an excessive amount of
									hosting resources, automatically add items to basket without
									our prior consent, or impact the shopping user experience for
									other customers.
								</span>
							</li>
							<li className="flex align-items-center mb-3">
								<i className="pi pi-info-circle text-purple-500 mr-2"></i>
								<span className="text-color-secondary">
									SaintlySinners reserves the right to block any unauthorised
									bots from our websites (either ourselves and/or through third
									parties such as security fraud prevention services), and to
									immediately suspend or close any accounts which we reasonably
									suspect of using unauthorised bots.
								</span>
							</li>
							<li className="flex align-items-center mb-3">
								<i className="pi pi-info-circle text-purple-500 mr-2"></i>
								<span className="text-color-secondary">
									SaintlySinners Group reserves the right to block any
									unauthorised bots from our websites (either ourselves and/or
									through third parties such as security fraud prevention
									services), and to immediately suspend or close any accounts
									which we reasonably suspect of using unauthorised bots.
								</span>
							</li>
							<li className="flex align-items-center mb-3">
								<i className="pi pi-info-circle text-purple-500 mr-2"></i>
								<span className="text-color-secondary">
									Users agree to indemnify us against all losses, costs and
									expenses that SaintlySinners incurs in connection with the
									breach of these rules relating to the use of internet bots on
									the Websites.
								</span>
							</li>
						</ul>
					</AccordionTab>
					<AccordionTab header="Copyright">
						<li className="flex align-items-center mb-3">
							<i className="pi pi-info-circle text-purple-500 mr-2"></i>
							<span className="m-0 text-color-secondary">
								Any material found within the pages of the Websites, including,
								but not limited to text or images are the property of
								SaintlySinners and may not be copied, reproduced, republished,
								downloaded, posted, broadcast or transmitted in any way except
								for your own personal non-commercial use. You hereby agree not
								to adapt, alter or create any derivative work from any of the
								material contained in this site.
							</span>
						</li>
					</AccordionTab>
					<AccordionTab header="Disclaimer">
						<ul className="list-none p-0 m-0 flex-grow-1">
							<li className="flex align-items-center mb-3">
								<i className="pi pi-info-circle text-purple-500 mr-2"></i>
								<span className="m-0 text-color-secondary">
									SaintlySinners provides the Website on an &apos;as is&apos;
									basis and does not warrant that the functions contained in and
									the material on the Website will be uninterrupted, or error or
									defect free, or that the Website or the server that makes it
									available are free of viruses or bugs. Further SaintlySinners
									does not represent the full functionality, accuracy,
									reliability of the materials on the Website.
								</span>
							</li>
							<li className="flex align-items-center mb-3">
								<i className="pi pi-info-circle text-purple-500 mr-2"></i>
								<span className="m-0 text-color-secondary">
									In addition, SaintkySinners makes no (and disclaims all)
									representations or warranties of any kind, express of implied,
									with respect to the Website or the information or content
									included on it.
								</span>
							</li>
							<li className="flex align-items-center mb-3">
								<i className="pi pi-info-circle text-purple-500 mr-2"></i>
								<span className="m-0 text-color-secondary">
									This disclaimer does not affect your statutory rights in
									relation to the provision of goods
								</span>
							</li>
						</ul>
					</AccordionTab>
					<AccordionTab header="Use of SaintlySinners">
						<ul className="list-none p-0 m-0 flex-grow-1">
							<li className="flex align-items-center mb-3">
								<i className="pi pi-times-circle text-purple-500 mr-2"></i>
								<span className="m-0 text-color-secondary">
									SaintlySinners will not be liable for any use of the Website
									(including any ordering of products) that results in:
								</span>
							</li>
							<ul className="list-none  mr-3 ">
								<li className="flex align-items-center mb-3">
									<i className="pi pi-times-circle text-purple-500 mr-2"></i>
									<span className="m-0 text-color-secondary">
										losses that were not foreseeable to both parties when the
										contract was made;
									</span>
								</li>
								<li className="flex align-items-center mb-3">
									<i className="pi pi-times-circle text-purple-500 mr-2"></i>
									<span className="m-0 text-color-secondary">
										losses that were not caused by any breach on the part of the
										supplier;
									</span>
								</li>
								<li className="flex align-items-center mb-3">
									<i className="pi pi-times-circle text-purple-500 mr-2"></i>
									<span className="m-0 text-color-secondary">
										business losses and/or losses to non consumers.
									</span>
								</li>
							</ul>
							<li className="flex align-items-center mb-3">
								<i className="pi pi-times-circle text-purple-500 mr-2"></i>
								<span className="m-0 text-color-secondary">
									We do not in any way exclude or limit our liability for:
								</span>
							</li>
							<ul className="list-none  mr-3 ">
								<li className="flex align-items-center mb-3">
									<i className="pi pi-info-circle text-purple-500 mr-2"></i>
									<span className="m-0 text-color-secondary">
										(a) death or personal injury caused by our negligence;
									</span>
								</li>
								<li className="flex align-items-center mb-3">
									<i className="pi pi-info-circle text-purple-500 mr-2"></i>
									<span className="m-0 text-color-secondary">
										(b) fraud or fraudulent misrepresentation;
									</span>
								</li>
								<li className="flex align-items-center mb-3">
									<i className="pi pi-info-circle text-purple-500 mr-2"></i>
									<span className="m-0 text-color-secondary">
										(c) any breach of the terms implied by section 12 of the
										Sale of Goods Act 1979 (title and quiet possession);
									</span>
								</li>
								<li className="flex align-items-center mb-3">
									<i className="pi pi-info-circle text-purple-500 mr-2"></i>
									<span className="m-0 text-color-secondary">
										(d) any breach of the terms implied by section 13 to 15 of
										the Sale of Goods Act 1979 (description, satisfactory
										quality, fitness for purpose and samples; and
									</span>
								</li>
								<li className="flex align-items-center mb-3">
									<i className="pi pi-info-circle text-purple-500 mr-2"></i>
									<span className="m-0 text-color-secondary">
										(e) defective products under the Consumer Protection Act
										1987.
									</span>
								</li>
							</ul>
							<li className="flex align-items-center mb-3">
								<i className="pi pi-info-circle text-purple-500 mr-2"></i>
								<span className="m-0 text-color-secondary">
									You agree to use the Website only for lawful purposes, and in
									a manner which does not infringe the rights of, or restrict or
									inhibit the use and enjoyment of this site by any third party,
									such restriction or inhibition includes, without limitation,
									conduct which is unlawful, or which may harass or cause
									distress or inconvenience to any person and the transmission
									of obscene or offensive content or disruption of normal flow
									of dialogue within the Website.
								</span>
							</li>
						</ul>
					</AccordionTab>
					<AccordionTab header="Submitting reviews, forum messages and photographs to SaintlySinners">
						<li className="flex align-items-center mb-3">
							<i className="pi pi-info-circle text-purple-500 mr-2"></i>
							<span className="m-0 text-color-secondary">
								We are currently working on an exciting new features for you to
								interact with other customers on the SaintlySinners website
							</span>
						</li>
					</AccordionTab>
					<AccordionTab header="SaintlySinners Loyalty Points">
						<li className="flex align-items-center mb-3">
							<i className="pi pi-info-circle text-purple-500 mr-2"></i>
							<span className="m-0 text-color-secondary">
								We are currently working on an exciting new loyalty programme to
								better reward our customers. To make way for this, we have now
								closed our old loyalty programmes and you can no longer earn or
								redeem loyalty points.
							</span>
						</li>
					</AccordionTab>
					<AccordionTab header="External websites">
						<li className="flex align-items-center mb-3">
							<i className="pi pi-info-circle text-purple-500 mr-2"></i>
							<span className="m-0 text-color-secondary">
								As a convenience for SaintlySinners customers, our website
								includes links to other websites or material which are beyond
								our control. SaintlySinners is not responsible for the content
								of external websites linked on the Websites.
							</span>
						</li>
					</AccordionTab>
					<AccordionTab header="Jurisdiction">
						<li className="flex align-items-center mb-3">
							<i className="pi pi-info-circle text-purple-500 mr-2"></i>
							<span className="m-0 text-color-secondary">
								These Terms are governed by the laws of England and Wales.
							</span>
						</li>
						<li className="flex align-items-center mb-3">
							<i className="pi pi-info-circle text-purple-500 mr-2"></i>
							<span className="m-0 text-color-secondary">
								SaintlySinners reserves the right to amend these terms and
								conditions from time to time without notice.
							</span>
						</li>
					</AccordionTab>
					<AccordionTab header="Force Majeure">
						<li className="flex align-items-center mb-3">
							<i className="pi pi-info-circle text-purple-500 mr-2"></i>
							<span className="m-0 text-color-secondary">
								We will not be liable or responsible for any failure to perform,
								or delay in performance of, any of our obligations under a
								contract that is caused by a force majeure event. A force
								majeure event which means any act or event beyond our reasonable
								control such as, but not limited to, strikes or industrial
								action by third parties (but not those caused by
								SaintlySinners&apos;s own employees), civil commotion, riot,
								invasion, terrorist attacks, war (whether declared or not) or
								threat or preparation for war, fire, explosion, storm, flood,
								earthquake, subsidence, epidemic, pandemic or other natural
								disaster (“Event”).
							</span>
						</li>
						<li className="flex align-items-center mb-3">
							<i className="pi pi-info-circle text-purple-500 mr-2"></i>
							<span className="m-0 text-color-secondary">
								If an Event takes place that affects the performance of our
								obligations under a contract:
							</span>
						</li>
						<ul className="list-none  mr-3 ">
							<li className="flex align-items-center mb-3">
								<i className="pi pi-info-circle text-purple-500 mr-2"></i>
								<span className="m-0 text-color-secondary">
									(a) we will contact you as soon as reasonably possible to
									notify you; and
								</span>
							</li>
							<li className="flex align-items-center mb-3">
								<i className="pi pi-info-circle text-purple-500 mr-2"></i>
								<span className="m-0 text-color-secondary">
									(b) our obligations under a contract will be suspended and the
									time for performance of our obligations will be extended for
									the duration of the Event. Where the Event affects our
									delivery of products to you, we will arrange a new delivery
									date with you after the Event is over.
								</span>
							</li>
						</ul>
						<li className="flex align-items-center mb-3">
							<i className="pi pi-info-circle text-purple-500 mr-2"></i>
							<span className="m-0 text-color-secondary">
								You may cancel a contract affected by an Event . To cancel
								please contact our customer services team. If you opt to cancel,
								you will have to return (at our cost) any relevant products you
								have already received and we will refund the price you have
								paid, including any delivery charges.
							</span>
						</li>
					</AccordionTab>
					<AccordionTab header="Additional terms">
						<li className="flex align-items-center mb-3">
							<i className="pi pi-info-circle text-purple-500 mr-2"></i>
							<span className="m-0 text-color-secondary">
								We may transfer our rights and obligations under a contract to
								another organisation, but this will not affect your rights or
								our obligations under these Terms.
							</span>
						</li>
						<li className="flex align-items-center mb-3">
							<i className="pi pi-info-circle text-purple-500 mr-2"></i>
							<span className="m-0 text-color-secondary">
								You may only transfer your rights or your obligations under
								these Terms to another person if SaintlySinners agrees in
								writing.
							</span>
						</li>
						<li className="flex align-items-center mb-3">
							<i className="pi pi-info-circle text-purple-500 mr-2"></i>
							<span className="m-0 text-color-secondary">
								These Terms are agreed between you and us. No other person shall
								have any rights to enforce any of its Terms.
							</span>
						</li>
						<li className="flex align-items-center mb-3">
							<i className="pi pi-info-circle text-purple-500 mr-2"></i>
							<span className="m-0 text-color-secondary">
								Each of the clauses within these Terms operates separately. If
								any court or relevant authority decides that any of the clauses
								are unlawful or unenforceable, then the remaining paragraphs
								will remain in full force and effect.
							</span>
						</li>
						<li className="flex align-items-center mb-3">
							<i className="pi pi-info-circle text-purple-500 mr-2"></i>
							<span className="m-0 text-color-secondary">
								The failure or delay of SaintlySinners to exercise any right,
								power or remedy provided under these Terms or otherwise
								available in respect hereof at law or in equity shall not
								constitute a waiver by SaintlySinners of its right to exercise
								any such or other right, power or remedy or to demand such
								compliance, or you of your obligations under these Terms. In the
								event we do waive a default we will do so in writing on a case
								by case basis.
							</span>
						</li>
					</AccordionTab>
				</Accordion>
			</Card>
		</>
	);
};

export default TermsAndConditions;
