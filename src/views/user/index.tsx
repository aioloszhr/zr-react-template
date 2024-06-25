import { useEffect, useState, useRef } from 'react';
import {
	Form,
	FormInstance,
	Row,
	Col,
	Input,
	Space,
	Button,
	Table,
	Tag,
	Modal,
	Popconfirm
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useRequest } from '@/hooks/use-request';
import userService from './service';

import type { TablePaginationConfig, TableProps } from 'antd';
import type { User } from './service';
import type { Role } from '../role/service';
import NewEditForm from './new-edit-form.tsx';
import { antdUtils } from '@/utils/antd.ts';

const User: React.FC = () => {
	const [form] = Form.useForm();

	const formRef = useRef<FormInstance>(null);

	const [formOpen, setFormOpen] = useState<boolean>(false);
	const [editData, setEditData] = useState<User | null>(null);
	const [saveLoading, setSaveLoading] = useState(false);
	const [dataSource, setDataSource] = useState<User[]>([]);
	const [pagination, setPagination] = useState<TablePaginationConfig>({
		current: 1,
		pageSize: 10
	});

	const { runAsync: getUsersByPage } = useRequest(userService.getUserListByPage, {
		manual: true
	});
	const { runAsync: deleteUser } = useRequest(userService.deleteUser, { manual: true });

	const columns: TableProps<User>['columns'] = [
		{
			title: '头像',
			dataIndex: 'avatarPath'
		},
		{
			title: '用户名',
			dataIndex: 'userName'
		},
		{
			title: '昵称',
			dataIndex: 'nickName'
		},
		{
			title: '手机号',
			dataIndex: 'phoneNumber'
		},
		{
			title: '邮箱',
			dataIndex: 'email'
		},
		{
			title: '角色',
			dataIndex: 'roles',
			render: (roles: Role[]) => {
				return (
					<Space>
						{(roles || []).map(role => (
							<Tag key={role.id} color='geekblue'>
								{role.name}
							</Tag>
						))}
					</Space>
				);
			}
		},
		{
			title: '创建时间',
			dataIndex: 'createDate',
			render: (value: number) => value && dayjs(value).format('YYYY-MM-DD HH:mm:ss')
		},
		{
			title: '操作',
			key: 'action',
			render: (_, record) =>
				record.userName !== 'admin' &&
				record.userName !== 'user' && (
					<Space size='middle'>
						<a
							onClick={() => {
								setEditData(record);
								setFormOpen(true);
							}}
						>
							编辑
						</a>
						<Popconfirm
							title='警告'
							description='确认删除这条数据？'
							onConfirm={async () => {
								const [error] = await deleteUser(record.id);
								if (!error) {
									antdUtils.message?.success('删除成功');
									getUsers();
								}
							}}
						>
							<a>删除</a>
						</Popconfirm>
					</Space>
				)
		}
	];

	const getUsers = async () => {
		const { current, pageSize } = pagination || {};

		const [error, data] = await getUsersByPage({
			current,
			pageSize
		});

		if (!error) {
			setDataSource(data.data);
			setPagination(prev => ({
				...prev,
				total: data.total
			}));
		}
	};

	const saveHandle = () => {
		getUsers();
		setFormOpen(false);
		setEditData(null);
	};

	const closeForm = () => {
		setFormOpen(false);
		setEditData(null);
	};

	useEffect(() => {
		getUsers();
	}, [pagination.current, pagination.pageSize]);

	return (
		<div>
			<Form form={form} size='large' className=' bg-white p-[24px] rounded-lg'>
				<Row gutter={24}>
					<Col className='w-[100%]' lg={24} xl={8}>
						<Form.Item name='nickName' label='昵称'>
							<Input placeholder='请输入昵称' />
						</Form.Item>
					</Col>
					<Col className='w-[100%]' lg={24} xl={8}>
						<Form.Item name='phoneNumber' label='手机号'>
							<Input placeholder='请输入手机号' />
						</Form.Item>
					</Col>
					<Col className='w-[100%]' lg={24} xl={8}>
						<Space>
							<Button type='primary'>搜索</Button>
							<Button>清除</Button>
						</Space>
					</Col>
				</Row>
			</Form>
			<div className='mt-[16px] bg-white rounded-lg px-[12px]'>
				<div className='py-[16px] '>
					<Button
						type='primary'
						size='large'
						icon={<PlusOutlined />}
						onClick={() => {
							setFormOpen(true);
						}}
					>
						新增
					</Button>
				</div>
				<Table
					rowKey='id'
					tableLayout='fixed'
					dataSource={dataSource}
					columns={columns}
					className='bg-transparent'
					pagination={pagination}
				/>
			</div>
			<Modal
				title={editData ? '编辑' : '新增'}
				open={formOpen}
				confirmLoading={saveLoading}
				width={640}
				zIndex={999}
				destroyOnClose
				onOk={() => {
					formRef.current?.submit();
				}}
				onCancel={closeForm}
			>
				<NewEditForm
					ref={formRef}
					editData={editData}
					setSaveLoading={setSaveLoading}
					onSave={saveHandle}
				/>
			</Modal>
		</div>
	);
};
export default User;
