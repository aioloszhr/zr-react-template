import React, { useEffect, useState } from 'react';
import { Modal, Form, Radio, Input, Select, InputNumber, Switch } from 'antd';
import { antdIcons } from '@/assets/add-icons';
import menuService from './service';
import { antdUtils } from '@/utils/antd.ts';
import { componentPaths } from '@/config';

import { MenuType, type Menu } from './interface';

interface CreateMemuProps {
	visible: boolean;
	onCancel: (flag?: boolean) => void;
	curRecord?: Menu | null;
	onSave: () => void;
	editData?: Menu | null;
}

const CreateMenu: React.FC<CreateMemuProps> = props => {
	const { visible, curRecord, onCancel, onSave, editData } = props;

	const [saveLoading, setSaveLoading] = useState(false);
	const [form] = Form.useForm();

	useEffect(() => {
		if (visible) {
			setInitValue();
		}
	}, [visible]);

	function setInitValue() {
		if (editData) {
			form.setFieldsValue(editData);
		} else if (curRecord) {
			form.setFieldsValue({
				show: true,
				type: curRecord?.type === MenuType.MENU ? MenuType.MENU : MenuType.DIRECTORY
			});
		} else {
			form.setFieldsValue({
				show: true,
				type: MenuType.DIRECTORY
			});
		}
	}

	const save = async (values: Menu) => {
		setSaveLoading(true);
		values.parentId = curRecord?.id || null;
		if (values.type === MenuType.DIRECTORY) {
			values.show = true;
		} else if (values.type === MenuType.BUTTON) {
			values.show = false;
		}

		/** 编辑菜单 */
		if (editData) {
			values.parentId = editData.parentId;
			const [error] = await menuService.updateMenu({ ...editData, ...values });
			if (!error) {
				antdUtils.message?.success('更新成功');
				onSave();
			}
		} else {
			const [error] = await menuService.addMenu(values);
			if (!error) {
				antdUtils.message?.success('新增成功');
				onSave();
			}
		}
		setSaveLoading(false);
	};

	const renderDirectoryForm = () => {
		return (
			<>
				<Form.Item
					label='名称'
					name='name'
					rules={[
						{
							required: true,
							message: '不能为空'
						}
					]}
				>
					<Input placeholder='请输入名称' />
				</Form.Item>
				<Form.Item label='图标' name='icon'>
					<Select placeholder='请选择图标'>
						{Object.keys(antdIcons).map(key => (
							<Select.Option key={key}>
								{React.createElement(antdIcons[key])}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item
					tooltip='以/开头，不用手动拼接上级路由。参数格式/:id'
					label='路由'
					name='route'
					rules={[
						{
							pattern: /^\//,
							message: '必须以/开头'
						},
						{
							required: true,
							message: '不能为空'
						}
					]}
				>
					<Input placeholder='请输入路由' />
				</Form.Item>
				<Form.Item label='排序号' name='orderNumber'>
					<InputNumber style={{ width: 200 }} placeholder='请输入排序号' />
				</Form.Item>
			</>
		);
	};

	const renderMenuForm = () => {
		return (
			<>
				<Form.Item
					rules={[
						{
							required: true,
							message: '不能为空'
						}
					]}
					label='名称'
					name='name'
				>
					<Input placeholder='请输入名称' />
				</Form.Item>
				<Form.Item label='图标' name='icon'>
					<Select placeholder='请选择图标'>
						{Object.keys(antdIcons).map(key => (
							<Select.Option key={key}>
								{React.createElement(antdIcons[key])}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item
					tooltip='以/开头，不用手动拼接上级路由。参数格式/:id'
					label='路由'
					name='route'
					rules={[
						{
							pattern: /^\//,
							message: '必须以/开头'
						},
						{
							required: true,
							message: '不能为空'
						}
					]}
				>
					<Input placeholder='请输入路由' />
				</Form.Item>
				<Form.Item
					rules={[
						{
							required: true,
							message: '不能为空'
						}
					]}
					label='文件地址'
					name='filePath'
				>
					<Select
						placeholder='请选择文件地址'
						options={componentPaths.map(path => ({
							label: path,
							value: path
						}))}
					/>
				</Form.Item>
				<Form.Item valuePropName='checked' label='是否显示' name='show'>
					<Switch />
				</Form.Item>
				<Form.Item label='排序号' name='orderNumber'>
					<InputNumber />
				</Form.Item>
			</>
		);
	};

	const renderFormMap = {
		[MenuType.DIRECTORY.toString()]: renderDirectoryForm,
		[MenuType.MENU.toString()]: renderMenuForm
	};

	return (
		<Modal
			open={visible}
			title='新建'
			width={640}
			confirmLoading={saveLoading}
			onOk={() => {
				form.submit();
			}}
			onCancel={() => {
				onCancel();
			}}
			destroyOnClose
		>
			<Form
				form={form}
				labelCol={{ flex: '0 0 100px' }}
				wrapperCol={{ span: 16 }}
				onFinish={save}
			>
				<Form.Item label='类型' name='type'>
					<Radio.Group optionType='button' buttonStyle='solid'>
						{curRecord?.type !== MenuType.MENU && (
							<Radio value={MenuType.DIRECTORY}>目录</Radio>
						)}
						<Radio value={MenuType.MENU}>菜单</Radio>
						<Radio value={MenuType.BUTTON}>按钮</Radio>
					</Radio.Group>
				</Form.Item>
				<Form.Item shouldUpdate noStyle>
					{() => renderFormMap[form.getFieldValue('type') as string]?.()}
				</Form.Item>
			</Form>
		</Modal>
	);
};
export default CreateMenu;
