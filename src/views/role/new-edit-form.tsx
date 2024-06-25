import { forwardRef, useImperativeHandle, ForwardRefRenderFunction, useState } from 'react';
import { Form, Input, FormInstance } from 'antd';
import RoleMenu from './role-menu.tsx';
import { useRequest } from '@/hooks/use-request';
import roleService from './service';

import type { Role } from './service';
import { antdUtils } from '@/utils/antd.ts';

interface PropsType {
	open: boolean;
	editData?: Role | null;
	onSave: () => void;
	setSaveLoading: (loading: boolean) => void;
}

const NewEditForm: ForwardRefRenderFunction<FormInstance, PropsType> = (
	{ editData, setSaveLoading, onSave },
	ref
) => {
	const [form] = Form.useForm();

	const [roleMenuVisible, setRoleMenuVisible] = useState<boolean>(false);
	const [menuIds, setMenuIds] = useState<string[]>();

	const { runAsync: addUser } = useRequest(roleService.addRole, { manual: true });
	const { runAsync: updateUser } = useRequest(roleService.updateRole, { manual: true });

	useImperativeHandle(ref, () => form, [form]);

	const finishHandle = async values => {
		setSaveLoading(true);
		if (editData) {
			// 编辑
			const [error] = await updateUser({ ...editData, menuIds });
			setSaveLoading(false);
			if (error) {
				return;
			}
			antdUtils.message?.success('更新成功');
		} else {
			// 新增
			const [error] = await addUser({ ...values, menuIds });
			setSaveLoading(false);
			if (error) {
				return;
			}
			antdUtils.message?.success('创建成功');
		}
		onSave();
	};

	return (
		<Form
			labelCol={{ sm: { span: 24 }, md: { span: 5 } }}
			wrapperCol={{ sm: { span: 24 }, md: { span: 16 } }}
			form={form}
			onFinish={finishHandle}
			initialValues={editData || {}}
			name='addAndEdit'
		>
			<Form.Item
				label='代码'
				name='code'
				rules={[
					{
						required: true,
						message: '不能为空'
					}
				]}
			>
				<Input placeholder='请输入代码' disabled={!!editData} />
			</Form.Item>
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
			<Form.Item label='分配菜单' name='menus'>
				<a
					onClick={() => {
						setRoleMenuVisible(true);
					}}
				>
					选择菜单
				</a>
			</Form.Item>
			<RoleMenu
				visible={roleMenuVisible}
				roleId={editData?.id}
				onSave={(menuIds: string[]) => {
					setMenuIds(menuIds);
					setRoleMenuVisible(false);
				}}
				onCancel={() => {
					setRoleMenuVisible(false);
				}}
			/>
		</Form>
	);
};
export default forwardRef(NewEditForm);
