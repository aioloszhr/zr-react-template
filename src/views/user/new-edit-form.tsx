import { ForwardRefRenderFunction, forwardRef, useMemo, useImperativeHandle } from 'react';
import { Form, FormInstance, Input, Radio, Select, Avatar } from 'antd';
import { useRequest } from '@/hooks/use-request';
import userService from './service.ts';
import { Role } from '../role/service.ts';
import { User } from './service.ts';
import { antdUtils } from '@/utils/antd.ts';

interface PropsType {
	editData?: any;
	setSaveLoading: (loading: boolean) => void;
	onSave: () => void;
}

const NewEditForm: ForwardRefRenderFunction<FormInstance, PropsType> = (
	{ editData, setSaveLoading, onSave },
	ref
) => {
	const [form] = Form.useForm();

	useImperativeHandle(ref, () => form, [form]);

	const { data: roles, loading: getRolesLoading } = useRequest(userService.getRoles);
	const { runAsync: updateUser } = useRequest(userService.updateUser, { manual: true });
	const { runAsync: addUser } = useRequest(userService.addUser, { manual: true });

	const finishHandle = async (values: User) => {
		setSaveLoading(true);

		if (editData) {
			const [error] = await updateUser({ ...editData, ...values });
			setSaveLoading(false);
			if (error) {
				return;
			}
			antdUtils.message?.success('更新成功');
		} else {
			const [error] = await addUser(values);
			setSaveLoading(false);
			if (error) {
				return;
			}
			antdUtils.message?.success('创建成功');
		}
		onSave();
	};

	const initialValues = useMemo(() => {
		if (editData) {
			return {
				...editData,
				roleIds: (editData.roles || []).map((role: Role) => role.id)
			};
		}
	}, [editData]);

	return (
		<Form
			labelCol={{ sm: { span: 24 }, md: { span: 5 } }}
			wrapperCol={{ sm: { span: 24 }, md: { span: 16 } }}
			form={form}
			onFinish={finishHandle}
			initialValues={initialValues || { sex: 1 }}
		>
			<Form.Item label='头像' name='avatar'>
				<Avatar />
			</Form.Item>
			<Form.Item
				label='用户名'
				name='userName'
				rules={[
					{
						required: true,
						message: '不能为空'
					}
				]}
			>
				<Input disabled={!!editData} />
			</Form.Item>
			<Form.Item
				label='昵称'
				name='nickName'
				rules={[
					{
						required: true,
						message: '不能为空'
					}
				]}
			>
				<Input />
			</Form.Item>
			<Form.Item
				label='手机号'
				name='phoneNumber'
				rules={[
					{
						required: true,
						message: '不能为空'
					},
					{
						pattern:
							/^(13[0-9]|14[5-9]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[89])\d{8}$/,
						message: '手机号格式不正确'
					}
				]}
			>
				<Input />
			</Form.Item>
			<Form.Item
				name='email'
				label='邮箱'
				rules={[
					{
						required: true,
						message: '不能为空'
					},
					{
						pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
						message: '邮箱格式不正确'
					}
				]}
			>
				<Input disabled={!!editData} />
			</Form.Item>
			<Form.Item label='角色' name='roleIds'>
				<Select
					options={(roles || []).map(role => ({
						label: role.name,
						value: role.id
					}))}
					mode='multiple'
					loading={getRolesLoading}
				/>
			</Form.Item>
			<Form.Item label='性别' name='sex'>
				<Radio.Group>
					<Radio value={1}>男</Radio>
					<Radio value={0}>女</Radio>
				</Radio.Group>
			</Form.Item>
		</Form>
	);
};
export default forwardRef(NewEditForm);
