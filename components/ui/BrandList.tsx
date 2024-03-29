import { Brand } from 'interfaces/brand.interface';
import { DataTable, DataTableSelectEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/router';

export const BrandList = ({ brands }: any) => {
	const [brandSet, setbrands] = useState<Brand[]>(brands);

	const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
	const router = useRouter();
	const imageBodyTemplate = (rowData: Brand) => {
		return (
			<div style={{ position: 'relative', width: '370px', height: '200px' }}>
				<Image
					fill
					src={`data:image/${rowData.awsImageFormat};base64,${rowData.awsImage}`}
					alt={rowData.title}
					style={{ objectFit: 'cover' }}
					placeholder="blur"
					blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM0ZfgfBwADOgGU33xQ2gAAAABJRU5ErkJggg=="
				/>
			</div>
		);
	};
	// const onSelectionChange = (
	// 	e: DataTable<Brand[]>
	// ): void => {
	// 	setSelectedBrand(e.value as Brand);
	// };
	const onBrandSelect = (event: DataTableSelectEvent) => {
		const brandId = event.data.id;
		router.push(`/product/brandProduct/${brandId}`);
	};
	return (
		<>
			<div className="grid">
				<div className="col-12">
					<div className="card">
						<DataTable
							value={brandSet}
							selection={selectedBrand || undefined}
							// onSelectionChange={onSelectionChange}
							//selectionMode="single"
							onRowSelect={onBrandSelect}
							sortField="title"
							sortOrder={1}
							responsiveLayout="stack">
							<Column
								field="id"
								header=""
								body={imageBodyTemplate}
								style={{ width: '370px' }}
							/>
							<Column field="title" sortable header="Name" />
							<Column field="catDescription" header="Desription" />
						</DataTable>
					</div>
				</div>
			</div>
		</>
	);
};
