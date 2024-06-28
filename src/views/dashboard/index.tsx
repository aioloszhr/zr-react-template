import {
	InfoCircleOutlined,
	CaretUpOutlined,
	DashOutlined,
	CaretDownOutlined
} from '@ant-design/icons';
import { Col, Divider, Dropdown, Row, Select, Tooltip } from 'antd';

import DemoTinyArea from './tiny-area';
import DemoTinyColumn from './tiny-column';
import DemoTinyLine from './tiny-line';
import DemoColumn from './column';

const Dashboard = () => {
	return (
		<>
			<Row gutter={[16, 16]}>
				<Col lg={24} xl={8} className='w-[100%]'>
					<div className='color-transition w-[100%] bg-[rgb(94,53,177)] overflow-hidden h-[241px] relative rounded-md bg-card p-[32px] box-border'>
						<div className='absolute top-[24px] right-[24px] z-10'>
							<Tooltip title='指标说明'>
								<InfoCircleOutlined className='text-[rgb(179,157,219)] text-[20px]' />
							</Tooltip>
						</div>
						<div className='text-[rgba(229,224,216,0.45)] text-[16px]'>总销售额</div>
						<div className='text-white text-2xl mt-[20px] text-[30px]'>¥ 126,560</div>
						<div className='mt-[30px] text-[rgba(229,224,216,0.85)] text-[16px] flex gap-[24px]'>
							<div className='flex items-center'>
								<span>周同比</span>
								<span className='ml-[12px]'>12%</span>
								<CaretDownOutlined className='ml-[6px] text-red-500' />
							</div>
							<div className='flex items-center'>
								<span>日同比</span>
								<span className='ml-[12px]'>12%</span>
								<CaretUpOutlined className='ml-[6px] text-green-500' />
							</div>
						</div>
						<Divider className='bg-[rgb(227,232,239)] opacity-[0.2] my-[16px]' />
						<div className='text-[rgba(229,224,216,0.85)] text-[16px]'>
							<span>日销售额</span>
							<span className='ml-[8px]'>￥12,423</span>
						</div>
					</div>
				</Col>
				<Col lg={24} xl={8} className='w-[100%]'>
					<div className='color-transition bg-[rgb(30,136,229)] theme1 overflow-hidden h-[241px] relative rounded-md bg-card p-[32px] box-border'>
						<div className='absolute top-[24px] right-[24px] z-10'>
							<Tooltip title='指标说明'>
								<InfoCircleOutlined className='text-[rgb(179,157,219)] text-[20px]' />
							</Tooltip>
						</div>
						<div className='text-[rgba(229,224,216,0.45)] text-[16px]'>访问量</div>
						<div className='text-white text-2xl mt-[20px] text-[30px]'>8,930</div>
						<div className='mt-[12px] text-[rgba(229,224,216,0.85)] text-[16px] flex gap-[24px]'>
							<DemoTinyLine />
						</div>
						<Divider className='bg-[rgb(227,232,239)] opacity-[0.2] my-[16px]' />
						<div className='text-[rgba(229,224,216,0.85)] text-[16px]'>
							<span>日访问量</span>
							<span className='ml-[8px]'>9,431</span>
						</div>
					</div>
				</Col>
				<Col lg={24} xl={8} className='w-[100%]'>
					<div className='color-transition bg-[rgb(94,53,177)] theme2 overflow-hidden h-[241px] relative rounded-md bg-card p-[32px] box-border'>
						<div className='absolute top-[24px] right-[24px] z-10'>
							<Tooltip title='指标说明'>
								<InfoCircleOutlined className='text-[rgb(179,157,219)] text-[20px]' />
							</Tooltip>
						</div>
						<div className='text-[rgba(229,224,216,0.45)] text-[16px]'>支付笔数</div>
						<div className='text-white text-2xl mt-[20px] text-[30px]'>8,943</div>
						<div className='mt-[12px] text-[rgba(229,224,216,0.85)] text-[16px] flex gap-[24px]'>
							<DemoTinyColumn />
						</div>
						<Divider className='bg-[rgb(227,232,239)] opacity-[0.2] my-[16px]' />
						<div className='text-[rgba(229,224,216,0.85)] text-[16px]'>
							<span>转化率</span>
							<span className='ml-[8px]'>2,421</span>
						</div>
					</div>
				</Col>
				<Col className='w-[100%]' lg={24} xl={16}>
					<div className='color-transition bg-white h-[600px] rounded-md p-[24px] relative'>
						<div className='flex justify-between items-center'>
							<div>
								<div className='text-[rgb(132,146,196)]'>总增长</div>
								<div className='text-[rgb(18,25,38)] mt-[8px] text-[18px]'>
									￥12,423
								</div>
							</div>
							<Select
								options={[
									{
										label: '今日',
										value: 'today'
									},
									{
										label: '本月',
										value: 'mouth'
									},
									{
										label: '本年',
										value: 'year'
									}
								]}
								defaultValue='today'
								size='large'
								dropdownMatchSelectWidth={false}
								placement='bottomRight'
							/>
						</div>
						<div className='mt-[50px] absolute bottom-[12px] w-[90%] box-border'>
							<DemoColumn />
						</div>
					</div>
				</Col>
				<Col className='w-[100%]' lg={24} xl={8}>
					<div className='color-transition bg-white h-[600px] rounded-md p-[24px] relative'>
						<div className='flex justify-between'>
							<span className='text-[18px] text-[rgb(18,25,38)]'>门店销售额</span>
							<Dropdown
								menu={{
									items: [
										{
											label: '今日',
											key: 'today'
										},
										{
											label: '本月',
											key: 'mouth'
										},
										{
											label: '本年',
											key: 'year'
										}
									]
								}}
							>
								<span className='text-[rgb(144,202,249)] cursor-pointer'>
									<DashOutlined />
								</span>
							</Dropdown>
						</div>
						<div className='bg-[rgb(237,231,246)] px-[16px] pt-[16px] mt-[24px] rounded-t-lg'>
							<div className='flex justify-between items-center'>
								<span className='text-[rgb(101,31,255)] text-[16px]'>上海分店</span>
								<span className='text-[rgb(66,66,66)]'>￥12,423</span>
							</div>
							<div className='mt-[10px] text-[rgb(66,66,66)]'>20% 利润</div>
						</div>
						<div className='bg-[rgb(237,231,246)] rounded-b-lg'>
							<DemoTinyArea />
						</div>
						<div className='py-[24px]'>
							<div>
								<div className='flex justify-between items-center'>
									<span className='text-[rgb(54,65,82)] font-medium'>
										上海分店
									</span>
									<div>
										<span className='mr-[8px] text-[rgb(54,65,82)] font-medium'>
											￥12,423
										</span>
										<CaretUpOutlined className='text-[rgb(0,200,83)]' />
									</div>
								</div>
								<div className='text-[rgb(0,200,83)] text-[12px] mt-[6px]'>
									20% 利润
								</div>
							</div>
							<Divider className='bg-[rgb(227,232,239)] my-[16px]' />
							<div>
								<div className='flex justify-between items-center'>
									<span className='text-[rgb(54,65,82)] font-medium'>
										合肥分店
									</span>
									<div>
										<span className='mr-[8px] text-[rgb(54,65,82)] font-medium'>
											￥10,000
										</span>
										<CaretUpOutlined className='text-[rgb(0,200,83)]' />
									</div>
								</div>
								<div className='text-[rgb(0,200,83)] text-[12px] mt-[6px]'>
									6% 利润
								</div>
							</div>
							<Divider className='bg-[rgb(227,232,239)] my-[16px]' />
							<div>
								<div className='flex justify-between items-center'>
									<span className='text-[rgb(54,65,82)] font-medium'>
										北京分店
									</span>
									<div>
										<span className='mr-[8px] text-[rgb(54,65,82)] font-medium'>
											￥8,000
										</span>
										<CaretDownOutlined className='text-[rgb(216,67,21)] ' />
									</div>
								</div>
								<div className='text-[rgb(216,67,21)] text-[12px] mt-[6px]'>
									8% 亏损
								</div>
							</div>
							<Divider className='bg-[rgb(227,232,239)] my-[16px]' />
							<div>
								<div className='flex justify-between items-center'>
									<span className='text-[rgb(54,65,82)] font-medium'>
										苏州分店
									</span>
									<div>
										<span className='mr-[8px] text-[rgb(54,65,82)] font-medium'>
											￥9,423
										</span>
										<CaretUpOutlined className='text-[rgb(0,200,83)]' />
									</div>
								</div>
								<div className='text-[rgb(0,200,83)] text-[12px] mt-[6px]'>
									14% 利润
								</div>
							</div>
							<Divider className='bg-[rgb(227,232,239)] my-[16px]' />
							<div>
								<div className='flex justify-between items-center'>
									<span className='text-[rgb(54,65,82)] font-medium'>
										南京分店
									</span>
									<div>
										<span className='mr-[8px] text-[rgb(54,65,82)] font-medium'>
											￥7,423
										</span>
										<CaretDownOutlined className='text-[rgb(216,67,21)]' />
									</div>
								</div>
								<div className='text-[rgb(0,200,83)] text-[12px] mt-[6px] text-[rgb(216,67,21)]'>
									6% 亏损
								</div>
							</div>
						</div>
					</div>
				</Col>
			</Row>
		</>
	);
};

export default Dashboard;
