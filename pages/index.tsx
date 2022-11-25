import axios from 'axios';
import Head from 'next/head';

import styles from '../styles/Home.module.css';

import type { NextPage } from 'next';

type MenuItemData = {
	id: number;
	title: string;
	categoryType: string;
	catLevel: number;
	catDescription: string;
};

const Home: NextPage = (data) => {
	return (
		<div className={styles.container}>
			<Head>
				<title>Sinful Sinners</title>
				<meta
					name="description"
					content="Sinful Sinners shopping application"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<div className="grid grid-nogutter surface-0 text-800">
					{/* <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center "> */}
					<section>
						<div className="text-6xl text-primary font-bold ">
							Welcome to SaintlySinners!
						</div>
						<div className="text-2xl text-primary font-bold mb-3">
							Choose from a wide range of lingerie and fun additions
						</div>
					</section>
					{/* </div> */}
				</div>
			</main>

			{/* <footer className={styles.footer}>
				<a
					href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer">
					Powered by{' '}
					<span className={styles.logo}>
						<Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
					</span>
				</a>
			</footer> */}
		</div>
	);
};

export async function getStaticProps() {
	console.log('Home getStaticProps');

	const { data } = await axios.get<MenuItemData[]>(
		process.env.EDC_API_BASEURL + `/brand`,
		{
			params: { category: 'B', catLevel: 6 },
		}
	);
	const menuItems = data;
	console.log(data);
	return {
		props: { menuItems },
	};
}
export default Home;
