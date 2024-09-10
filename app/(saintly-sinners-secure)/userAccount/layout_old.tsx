import UserLayoutMenuUI from '@/components/ui/secure/user/userLayoutMenu';
import { PanelMenu } from 'primereact/panelmenu';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="grid">
			<div className="col-5 sm:9">
				<UserLayoutMenuUI />
			</div>
			<div className="col-7 sm:3">{children}</div>
		</div>
	);
}
