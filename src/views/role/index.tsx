import React, { useEffect, useState, useRef } from 'react';
import { Form, Input, Row, Col, Space, Button, Table, Divider, Modal, FormInstance } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useRequest } from '@/hooks/use-request';
import roleService from './service';
import NewEditForm from './new-edit-form';
import RoleMenu from './role-menu';

import type { Role } from './service';
import type { TablePaginationConfig, TableProps } from 'antd';

const Role: React.FC = () => {
	const [form] = Form.useForm();

	const [formOpen, setFormOpen] = useState<boolean>(false);
	const [eidtData, setEditData] = useState<Role | null>(null);
	const [saveLoading, setSaveLoading] = useState(false);
	const [curRoleId, setCurRoleId] = useState<string | null>();
	const [roleMenuVisible, setRoleMenuVisible] = useState<boolean>(false);
	const [dataSource, setDataSource] = useState<Role[]>([]);
	const [pagination, setPagination] = useState<TablePaginationConfig>({
		current: 1,
		pageSize: 10
	});

	const formRef = useRef<FormInstance>(null);

	const { runAsync: getRoleListByPage } = useRequest(roleService.getRoleListByPage, {
		manual: true
	});

	const columns: TableProps<Role>['columns'] = [
		{
			title: '名称',
			dataIndex: 'name'
		},
		{
			title: '代码',
			dataIndex: 'code'
		},
		{
			title: '创建时间',
			dataIndex: 'createDate',
			width: 190,
			render: (value: Date) => {
				return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
			}
		},
		{
			title: '操作',
			dataIndex: 'action',
			width: 240,
			align: 'center',
			render: (_text: string, record: Role) => (
				<Space split={<Divider type='vertical' />}>
					<a
						onClick={() => {
							setCurRoleId(record.id);
							setRoleMenuVisible(true);
						}}
					>
						分配菜单
					</a>
					<a
						onClick={() => {
							setEditData(record);
							setFormOpen(true);
						}}
					>
						编辑
					</a>
				</Space>
			)
		}
	];

	const getRoleList = async () => {
		const { current, pageSize } = pagination || {};

		const [error, data] = await getRoleListByPage({
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
		setFormOpen(false);
		setEditData(null);
		getRoleList();
	};

	const closeForm = () => {
		setFormOpen(false);
	};

	useEffect(() => {
		getRoleList();
	}, [pagination.size, pagination.current]);

	return (
		<div>
			<Form
				form={form}
				size='large'
				className='dark:bg-[rgb(33,41,70)] bg-white p-[24px] rounded-lg'
			>
				<Row gutter={24}>
					<Col className='w-[100%]' lg={24} xl={8}>
						<Form.Item name='code' label='代码'>
							<Input placeholder='请输入代码' />
						</Form.Item>
					</Col>
					<Col className='w-[100%]' lg={24} xl={8}>
						<Form.Item name='name' label='名称'>
							<Input placeholder='请输入名称' />
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
					scroll={{ x: true }}
					dataSource={dataSource}
					columns={columns}
					className='bg-transparent'
				/>
			</div>
			<Modal
				title={eidtData ? '编辑' : '新增'}
				open={formOpen}
				width={640}
				destroyOnClose
				onOk={() => {
					formRef.current?.submit();
				}}
				onCancel={closeForm}
				confirmLoading={saveLoading}
			>
				<NewEditForm
					ref={formRef}
					editData={eidtData}
					onSave={saveHandle}
					open={formOpen}
					setSaveLoading={setSaveLoading}
				/>
			</Modal>
			<RoleMenu
				onCancel={() => {
					setCurRoleId(null);
					setRoleMenuVisible(false);
				}}
				roleId={curRoleId}
				visible={roleMenuVisible}
			/>
		</div>
	);
};
export default Role;
