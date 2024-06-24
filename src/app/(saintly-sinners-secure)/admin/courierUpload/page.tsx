import CourierUpload from '@/components/ui/secure/CourierUpload';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Courier Upload',
};

export default async function UploadCourierPage() {
	return <CourierUpload />;
}
