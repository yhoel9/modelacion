import React, { useState, useCallback, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDrawerDispatch } from 'context/DrawerContext';
import Uploader from 'components/Uploader/Uploader';
import Button, { KIND } from 'components/Button/Button';
import DrawerBox from 'components/DrawerBox/DrawerBox';
import { Row, Col } from 'components/FlexBox/FlexBox';
import Input from 'components/Input/Input';
import { Textarea } from 'components/Textarea/Textarea';
import Select from 'components/Select/Select';
import { FormFields, FormLabel } from 'components/FormFields/FormFields';
import { FirebaseContext } from '../../firebase2';

import { Form, DrawerTitleWrapper, DrawerTitle, FieldDetails, ButtonGroup } from '../DrawerItems/DrawerItems.style';

const options = [
	{ value: 'guantes', name: 'Guantes', id: '1' },
	{ value: 'ropaIndustrial', name: 'Ropa Industrial', id: '2' },
	{ value: 'lineaAltura', name: 'Linea de Altura', id: '3' },
	{ value: 'proteccionAuditiva', name: 'Protección Auditiva', id: '4' },
	{ value: 'proteccionOcular', name: 'Protección Ocular', id: '5' },
	{ value: 'proteccionRespiratoria', name: 'Protección Respiratoria', id: '6' },
	{ value: 'seguridadVial', name: 'Seguridad Vial', id: '7' },
];

const typeOptions = [
	{ value: 'grocery', name: 'Grocery', id: '1' },
	{ value: 'women-cloths', name: 'Women Cloths', id: '2' },
	{ value: 'bags', name: 'Bags', id: '3' },
	{ value: 'makeup', name: 'Makeup', id: '4' },
];
type Props = any;

const AddProduct: React.FC<Props> = (props) => {
	const fb = useContext(FirebaseContext);
	console.log(fb);
 

	// a.db.collection('productos').add(b);

	const dispatch = useDrawerDispatch();
	const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [dispatch]);
	const { register, handleSubmit, setValue } = useForm();
	const [type, setType] = useState([]);
	const [tag, setTag] = useState([]);
	const [description, setDescription] = useState('');

	React.useEffect(() => {
		register({ name: 'type' });
		register({ name: 'categories' });
		register({ name: 'image', required: true });
		register({ name: 'description' });
	}, [register]);

	const handleDescriptionChange = (e) => {
		const value = e.target.value;
		setValue('description', value);
		setDescription(value);
	};

	const handleMultiChange = ({ value }) => {
		setValue('categories', value);
		setTag(value);
	};

	const handleTypeChange = ({ value }) => {
		setValue('type', value);
		setType(value);
	};
	const handleUploader = (files) => {
		setValue('image', files[0].path);
	};

	const onSubmit = async (data) => {
		const {
			name,
			categories,
			description,
			discountInPercent,
			image,
			price,
			quantity,
			salePrice,
			type,
			unit,
		} = data;

		try {
			await fb.db.collection('productos').add({
				name,
				categories,
				description: data.description && data.description.length !== 0 ? data.description: '',
				discountInPercent: data.discountInPercent && data.discountInPercent.length !== 0 ? data.discountInPercent: '',
				image: data.image && data.image.length !== 0 ? data.image : '',
				price,
				quantity: data.quantity && data.quantity.length !== 0 ? data.quantity: '',
				salePrice: data.salePrice && data.salePrice.length !== 0 ? data.salePrice: '',
				type: data.type && data.type.length !== 0 ? data.type: '',
				unit: data.unit && data.unit.length !== 0 ? data.unit: '',
			});
		} catch (error) {
			console.log(error);
		}
		closeDrawer();
	};

	return (
		<>
			<DrawerTitleWrapper>
				<DrawerTitle>Agregar Producto</DrawerTitle>
			</DrawerTitleWrapper>

			<Form onSubmit={handleSubmit(onSubmit)} style={{ height: '100%' }}>
				<Scrollbars
					autoHide
					renderView={(props) => <div {...props} style={{ ...props.style, overflowX: 'hidden' }} />}
					renderTrackHorizontal={(props) => (
						<div {...props} style={{ display: 'none' }} className="track-horizontal" />
					)}
				>
					<Row>
						<Col lg={4}>
							<FieldDetails>Sube la una imagen de tu producto</FieldDetails>
						</Col>
						<Col lg={8}>
							<DrawerBox
								overrides={{
									Block: {
										style: {
											width: '100%',
											height: 'auto',
											padding: '30px',
											borderRadius: '3px',
											backgroundColor: '#ffffff',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										},
									},
								}}
							>
								<Uploader onChange={handleUploader} />
							</DrawerBox>
						</Col>
					</Row>

					<Row>
						<Col lg={4}>
							<FieldDetails>
								Agrega la información necesaria para crear un producto
							</FieldDetails>
						</Col>

						<Col lg={8}>
							<DrawerBox>
								<FormFields>
									<FormLabel>Nombre</FormLabel>
									<Input inputRef={register({ required: true, maxLength: 20 })} name="name" />
								</FormFields>

								<FormFields>
									<FormLabel>Descripción</FormLabel>
									<Textarea value={description} onChange={handleDescriptionChange} />
								</FormFields>

								<FormFields>
									<FormLabel>Unidad</FormLabel>
									<Input type="text" inputRef={register} name="unit" />
								</FormFields>

								<FormFields>
									<FormLabel>Precio</FormLabel>
									<Input type="number" inputRef={register({ required: true })} name="price" />
								</FormFields>

								<FormFields>
									<FormLabel>Precio de Rebaja</FormLabel>
									<Input type="number" inputRef={register} name="salePrice" />
								</FormFields>

								<FormFields>
									<FormLabel>Porcentaje de Descuento</FormLabel>
									<Input type="number" inputRef={register} name="discountInPercent" />
								</FormFields>

								<FormFields>
									<FormLabel>Cantidad del Producto</FormLabel>
									<Input type="number" inputRef={register({ required: true })} name="quantity" />
								</FormFields>

								<FormFields>
									<FormLabel>Tipo</FormLabel>
									<Select
										options={typeOptions}
										labelKey="name"
										valueKey="value"
										placeholder="Product Type"
										value={type}
										searchable={false}
										onChange={handleTypeChange}
										overrides={{
											Placeholder: {
												style: ({ $theme }) => {
													return {
														...$theme.typography.fontBold14,
														color: $theme.colors.textNormal,
													};
												},
											},
											DropdownListItem: {
												style: ({ $theme }) => {
													return {
														...$theme.typography.fontBold14,
														color: $theme.colors.textNormal,
													};
												},
											},
											OptionContent: {
												style: ({ $theme, $selected }) => {
													return {
														...$theme.typography.fontBold14,
														color: $selected
															? $theme.colors.textDark
															: $theme.colors.textNormal,
													};
												},
											},
											SingleValue: {
												style: ({ $theme }) => {
													return {
														...$theme.typography.fontBold14,
														color: $theme.colors.textNormal,
													};
												},
											},
											Popover: {
												props: {
													overrides: {
														Body: {
															style: { zIndex: 5 },
														},
													},
												},
											},
										}}
									/>
								</FormFields>

								<FormFields>
									<FormLabel>Categorías</FormLabel>
									<Select
										options={options}
										labelKey="name"
										valueKey="value"
										placeholder="Product Tag"
										value={tag}
										onChange={handleMultiChange}
										overrides={{
											Placeholder: {
												style: ({ $theme }) => {
													return {
														...$theme.typography.fontBold14,
														color: $theme.colors.textNormal,
													};
												},
											},
											DropdownListItem: {
												style: ({ $theme }) => {
													return {
														...$theme.typography.fontBold14,
														color: $theme.colors.textNormal,
													};
												},
											},
											Popover: {
												props: {
													overrides: {
														Body: {
															style: { zIndex: 5 },
														},
													},
												},
											},
										}}
										multi
									/>
								</FormFields>
							</DrawerBox>
						</Col>
					</Row>
				</Scrollbars>

				<ButtonGroup>
					<Button
						kind={KIND.minimal}
						onClick={closeDrawer}
						overrides={{
							BaseButton: {
								style: ({ $theme }) => ({
									width: '50%',
									borderTopLeftRadius: '3px',
									borderTopRightRadius: '3px',
									borderBottomRightRadius: '3px',
									borderBottomLeftRadius: '3px',
									marginRight: '15px',
									color: $theme.colors.red400,
								}),
							},
						}}
					>
						Cancelar
					</Button>

					<Button
						type="submit"
						overrides={{
							BaseButton: {
								style: ({ $theme }) => ({
									width: '50%',
									borderTopLeftRadius: '3px',
									borderTopRightRadius: '3px',
									borderBottomRightRadius: '3px',
									borderBottomLeftRadius: '3px',
								}),
							},
						}}
					>
						Crear Producto
					</Button>
				</ButtonGroup>
			</Form>
		</>
	);
};

export default AddProduct;
