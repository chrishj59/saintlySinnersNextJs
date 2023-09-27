import axios from 'axios';
import { Brand } from 'interfaces/brand.interface';
import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import { BrandList } from 'components/ui/BrandList';
import { s3Client } from 'utils/s3-utils';
import { AwsImageType } from 'types/aws';
import { imageAWS } from 'interfaces/product.type';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import Image from 'next/image';

export default function BrandsAll({
	brands,
}: InferGetStaticPropsType<typeof getStaticProps>): any {
	return (
		<>
			<div className="flex flex-column align-items-center">
				<span className="text-900 font-bold text-4xl">
					Saintly Sinners Brands
				</span>
			</div>
			<BrandList brands={brands} />
		</>
	);
}

export const getStaticProps: GetStaticProps<{ brands: Brand[] }> = async (
	context
) => {
	const { data } = await axios.get<Brand[]>(
		process.env.EDC_API_BASEURL + `/brand`,
		{
			params: { category: 'B' },
		}
	);
	let brands = data;
	const bucketName = process.env.AWS_PUBLIC_BUCKET_NAME || '';
	let imageParam: AwsImageType[] = [];
	let index = 0;
	for (const brand of brands) {
		if (brand.awsKey) {
			const key = brand.awsKey;

			const imgFormat = key.split('.')[1];

			const bucketParams = {
				Bucket: bucketName,
				Key: key,
			};
			const data = await s3Client.send(new GetObjectCommand(bucketParams));
			if (data) {
				const imgData = await data.Body?.transformToString('base64');
				if (imgData) {
					brands[index].awsImage = imgData;
					brands[index].awsImageFormat = imgFormat;
				}
			}
		}
		index++;
	}

	return {
		props: { brands: data },
		revalidate: 86400,
	};
};
