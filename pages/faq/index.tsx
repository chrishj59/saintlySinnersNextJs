import { Accordion, AccordionTab } from 'primereact/accordion';
import { Ripple } from 'primereact/ripple';
import { classNames } from 'primereact/utils';
import React, { useState } from 'react';

const itemsList = [
	{
		label: 'General',
		icon: 'pi pi-fw pi-info-circle',
		questions: [
			'Is there a trial period?',
			'Do I need to sign up with credit card?',
			'Do I need to pay a subscription?',
		],
		bodyText: [
			'Trial period info',
			'It is not necessary to sign up but there are advantages such as viewing your orders',
			'This is not a subscription service, so there are no subscri',
			'There is only one tier',
		],
	},
	{
		label: 'Account',
		icon: 'pi pi-fw pi-file',
		questions: [
			'Are my login details safe?',
			'Is my card information safe?',
			'How can I view my orders?',
		],
		bodyText: [
			'Your login information is not held by use but by the credential provider. If you login via facebook the information is held by facebook',
			'Your card information not held by us. It is held by the payment provider',
			'Your account has details about your orders',
		],
	},
];
const Faq = () => {
	const [activeIndex, setActiveIndex] = useState(0);
	const [items] = useState(itemsList);

	const changeItem = (i: number) => {
		setActiveIndex(i);
	};

	return (
		<>
			{/* <NavBar /> */}
			<div className="card">
				<div className="text-900 font-bold text-xl mb-3">
					Frequently Asked Questions
				</div>
				<p className="text-600 line-height-3">
					Here are the answers to some of the commonly asked questions
				</p>
			</div>
			<div className="flex flex-column md:flex-row gap-5">
				<div className="card mb-0 md:w-20rem">
					<div className="text-900 block font-bold mb-3">Categories</div>
					<ul className="list-none m-0 p-0">
						{items.map((item, i) => {
							return (
								<li key={i} onClick={() => changeItem(i)} className="mb-2 ">
									<a
										className={classNames(
											'flex align-items-center cursor-pointer select-none p-3 transition-colors transition-duration-150 border-round',
											'p-ripple',
											{
												'bg-primary': activeIndex === i,
												'hover:surface-hover': activeIndex !== i,
											}
										)}>
										<i className={classNames('mr-2 text-lg', item.icon)}></i>
										<span>{item.label}</span>
										<Ripple />
									</a>
								</li>
							);
						})}
					</ul>
				</div>
				<div className="card flex-1">
					<Accordion>
						{items[activeIndex].questions.map((question, i) => {
							return (
								<AccordionTab key={i} header={question}>
									<p className="line-height-3 m-0 p-0">
										{items[activeIndex].bodyText[i]}
									</p>
								</AccordionTab>
							);
						})}
					</Accordion>
				</div>
			</div>
		</>
	);
};

export default Faq;
