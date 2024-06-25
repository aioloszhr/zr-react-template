import React, { useState, useMemo, useEffect } from 'react';
import { Button, Table, Tag, Space, Divider, Popconfirm } from 'antd';
import NewEditForm from './new-edit-form';
import { antdIcons } from '@/assets/add-icons';
import { useRequest } from '@/hooks/use-request';
import menuService from './service.ts';

import { MenuTypeName, type Menu } from './interface';
import type { TablePaginationConfig, TableProps } from 'antd';
import { antdUtils } from '@/utils/antd.ts';

const Menu: React.FC = () => {
	const [dataSource, setDataSource] = useState<Menu[]>([]);
	const [pagination, setPagination] = useState<TablePaginationConfig>({
		current: 1,
		pageSize: 10
	});

	const [createVisible, setCreateVisible] = useState<boolean>(false);
	const [expandedRowKeys, setExpandedRowKeys] = useState<readonly React.Key[]>([]);
	const [curRowData, setCurRowData] = useState<null | Menu>();
	const [editData, setEditData] = useState<null | Menu>(null);

	const { loading, runAsync: getMenusByPage } = useRequest(menuService.getMenusByPage, {
		manual: true
	});
	const { runAsync: removeMenu } = useRequest(menuService.removeMenu, {
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
				dataIndex: 'route'
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
				render: (_: string, record: Menu) => {
					return (
						<Space split={<Divider type='vertical' />}>
							<a
								onClick={() => {
									setCreateVisible(true);
									setCurRowData(record);
								}}
							>
								添加
							</a>
							<a
								onClick={() => {
									setCreateVisible(true);
									setEditData(record);
								}}
							>
								编辑
							</a>
							<Popconfirm
								title='警告'
								description='确认删除这条数据？'
								onConfirm={async () => {
									const [error] = await removeMenu(record.id);
									if (!error) {
										antdUtils.message?.success('删除成功');
										getMenus();
									}
								}}
							>
								<a>删除</a>
							</Popconfirm>
						</Space>
					);
				}
			}
		],
		[]
	);

	// 弹窗取消
	const cancelHandle = () => {
		setCreateVisible(false);
		setCurRowData(null);
		setEditData(null);
	};

	// 弹窗确定
	const saveHandle = () => {
		setCreateVisible(false);
		setEditData(null);
		setCurRowData(null);
		if (!curRowData) {
			getMenus();
			setExpandedRowKeys([]);
		} else {
			curRowData._loaded_ = false;
			expandHandle(true, curRowData);
		}
	};

	// 表格数据展开
	const expandHandle = async (expanded: boolean, record: Menu) => {
		if (expanded && !record._loaded_) {
			const [error, children] = await menuService.getChildren(record.id);
			if (!error) {
				record._loaded_ = true;
				record.children = (children || []).map((o: Menu) => ({
					...o,
					children: o.hasChild ? [] : null
				}));
				setDataSource([...dataSource]);
			}
		}
	};

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
				pagination={pagination}
				expandable={{
					rowExpandable: () => true,
					onExpand: expandHandle,
					expandedRowKeys,
					onExpandedRowsChange: rowKeys => {
						setExpandedRowKeys(rowKeys);
					}
				}}
			/>
			<NewEditForm
				visible={createVisible}
				curRecord={curRowData}
				editData={editData}
				onSave={saveHandle}
				onCancel={cancelHandle}
			/>
		</div>
	);
};
export default Menu;
