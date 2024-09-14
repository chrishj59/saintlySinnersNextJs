import { BasketProvider } from '@/app/basket-context';
import { PrimeReactProvider } from 'primereact/api';
import { SessionProvider } from 'next-auth/react';
import { LayoutProvider } from '@/layout/context/layoutcontext';
import Footer from '@/components/Footer';
import { Suspense } from 'react';
import Loading from '@/app/loading';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

interface ProvidersProps {
	children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
	return (
		<Suspense fallback={<Loading />}>
			<AppRouterCacheProvider>
				<SessionProvider>
					<BasketProvider>
						<PrimeReactProvider>
							<LayoutProvider>{children}</LayoutProvider>

							<div className="flex flex justify-content-center flex-wrap text-primary">
								<Footer />
							</div>
						</PrimeReactProvider>
					</BasketProvider>
				</SessionProvider>
			</AppRouterCacheProvider>
		</Suspense>
	);
}
