import { BasketProvider } from '@/app/basket-context';
import { PrimeReactProvider } from 'primereact/api';
import { SessionProvider } from 'next-auth/react';
import { LayoutProvider } from '@/layout/context/layoutcontext';
import Footer from '@/components/Footer';

interface ProvidersProps {
	children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
	return (
		<SessionProvider>
			<BasketProvider>
				<PrimeReactProvider>
					<LayoutProvider>{children}</LayoutProvider>
					<p>in layout provider</p>
					<div className="flex flex justify-content-center flex-wrap text-primary">
						<Footer />
					</div>
				</PrimeReactProvider>
			</BasketProvider>
		</SessionProvider>
	);
}
