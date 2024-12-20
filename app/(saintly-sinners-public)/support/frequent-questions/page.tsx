'use client';
import React, { useState } from 'react';
import { Ripple } from 'primereact/ripple';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { classNames } from 'primereact/utils';
import Link from 'next/link';

const guideLink = () => {
	return (
		<Link
			href={'/guide/Saintly_Sinners_Guide.pdf'}
			target="_blank"
			rel="noopener noreferrer"
			locale={false}
			download>
			Download Here
		</Link>
	);
};
const itemsList = [
	{
		label: 'Using the site',
		icon: 'pi pi-fw pi-info-circle',
		questions: [
			'How do I perform a global search.',
			'Is there a guide to buying on the site?',
			'Which countries can ny order be delivered to?',
			'How do I get an answer to a  question?',
			'How do I sort the product list',
			'How do I login',
			'The size buttons are not selectable',
		],
		bodyText: [
			'You need to enter at least 4 characters in the global search bar for the site to seach all product titles and descriptions. ',
			`If you would like a guide please use the above link.`,
			'We only deliver to the United Kingdom at the moment. International deliveries is on the way!',
			'Please use the Customer services link at the bottom of the page.',
			'Click on the dropdown order by dropdown. The sorting is in order of the fields you select. To order by price and the name. Select price and then name',
			'From the user icon on the top right click the signin button. You can currently signin using your Google login or via an email link',
			'The size buttons are only selectable if diffient sizes are in stock',
		],
	},
	{
		label: 'General',
		icon: 'pi pi-fw pi-info-circle',
		questions: [
			'Is there a trial period?',

			'How do I suggest a feature I would like?',
		],
		bodyText: [
			'There is no trial period in this version as user accounts have not been implemented. Coming soon!',
			'Send an email to customer services. Popular features will be address 1st.',
		],
	},
	{
		label: 'Security',
		icon: 'pi pi-fw pi-file',
		questions: [
			'Are my login credentials safe',
			'Is my card information safe?',
			'Is my name and address safe',
			'How do I login',
		],
		bodyText: [
			'We do not store your login credentials. We use modern safe login methods - you login with your gmail login or using magic link sent to your email address ',
			'Your card information not held by us. It is held by the payment provider',
			'Your personal details are held by the payment provider',
			'From the user icon on the top right click the signin button. You can currently signin using your Google login or via an email link',
		],
	},
];
function Faq() {
	const [activeIndex, setActiveIndex] = useState(0);

	const [items] = useState(itemsList);

	const changeItem = (i: number) => {
		setActiveIndex(i);
	};

	return (
		<div>
			<div className="card">
				<div className="text-900 font-bold text-xl mb-3">
					Frequently Asked Questions
				</div>
				<div className="text-600 line-height-3">
					Here are the answers to some of the commonly asked questions
				</div>
				<div>
					<Link
						href={'/guide/Saintly_Sinners_Guide.pdf'}
						target="_blank"
						rel="noopener noreferrer"
						locale={false}
						download>
						Download the guide to buying on the site
					</Link>
				</div>
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
		</div>
	);
}

export default Faq;
