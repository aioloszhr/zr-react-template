import React, { useState, useMemo, useEffect } from 'react';
import { Button, Table, Tag, Space, Divider, Popconfirm } from 'antd';
import NewEditForm from './new-edit-form';
import { antdIcons } from '@/assets/add-icons';
import { useRequest } from '@/hooks/use-request';
import menuService from './service.ts';

import { MenuTypeName, type Menu } from './interface';
import type { TablePaginationConfig, TableProps } from 'antd';

const Menu: React.FC = () => {
	const [dataSource, setDataSource] = useState<Menu[]>([]);
	const [pagination, setPagination] = useState<TablePaginationConfig>({
		current: 1,
		pageSize: 10
	});

	const [createVisible, setCreateVisible] = useState(false);

	const { loading, runAsync: getMenusByPage } = useRequest(menuService.getMenusByPage, {
		manual: true
	});

	const columns: TableProps<Menu>['columns'] = useMemo(
		() => [
			{
				title: '名称',
				dataIndex: 'name'
			},
			{
				title: '类型',
				dataIndex: 'type',
				align: 'center',
				render: (value: number) => <Tag color='processing'>{MenuTypeName[value]}</Tag>
			},
			{
				title: '图标',
				align: 'center',
				dataIndex: 'icon',
				render: value => antdIcons[value] && React.createElement(antdIcons[value])
			},
			{
				title: '路由',
				dataIndex: 'router'
			},
			{
				title: 'url',
				dataIndex: 'url'
			},
			{
				title: '文件地址',
				dataIndex: 'filePath'
			},
			{
				title: '排序号',
				dataIndex: 'orderNumber'
			},
			{
				title: '操作',
				align: 'center',
				width: 200,
				render: () => {
					return (
						<Space split={<Divider type='vertical' />}>
							<a>添加</a>
							<a>编辑</a>
							<Popconfirm title='是否删除？' placement='topRight'>
								<a>删除</a>
							</Popconfirm>
						</Space>
					);
				}
			}
		],
		[]
	);

	const getMenus = async () => {
		const { current, pageSize } = pagination || {};

		const [error, data] = await getMenusByPage({
			current,
			pageSize
		});

		if (!error) {
			setDataSource(
				data.data.map((item: any) => ({
					...item,
					children: item.hasChild ? [] : null
				}))
			);
			setPagination(prev => ({
				...prev,
				total: data.total
			}));
		}
	};

	useEffect(() => {
		getMenus();
	}, [pagination.size, pagination.current]);

	return (
		<div>
			<Button
				className='mb-[12px]'
				type='primary'
				onClick={() => {
					setCreateVisible(true);
				}}
			>
				新建
			</Button>
			<Table
				columns={columns}
				dataSource={dataSource}
				loading={loading}
				rowKey='id'
				tableLayout='fixed'
			/>
			<NewEditForm visible={createVisible} />
		</div>
	);
};
export default Menu;
