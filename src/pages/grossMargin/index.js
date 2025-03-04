import React, { useState, useEffect } from'react';
import { Card, Input, Button, Table, Pagination, message } from 'antd';
import { SearchOutlined, UndoOutlined } from '@ant-design/icons';
import grossMarginApi from '../../services/grossMarginApi';

const GrossMarginComponent = () => {
    const [searchYear, setSearchYear] = useState('');
    const [grossMarginList, setGrossMarginList] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [pageData, setPageData] = useState({})

    // 获取毛利数据列表
    const fetchGrossMarginList = async () => {
        setLoading(true);
        const params = {
            params: searchYear,
            page,
            size: pageSize
        };
        try {
            const res = await grossMarginApi.grossMarginAdminApi(params);
            setGrossMarginList(res.data.pageResult.data);
            setTotal(res.data.pageResult.total);
            setPageData(res.data)
        } catch (error) {
            console.error('获取毛利数据列表出错：', error);
            message.error('获取毛利数据列表时出现错误，请检查');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGrossMarginList();
    }, [page, pageSize]);

    // 搜索
    const handleSearch = () => {
        setPage(1);
        fetchGrossMarginList();
    };

    // 重置
    const handleReset = () => {
        setSearchYear('');
        setPage(1);
        fetchGrossMarginList();
    };

    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
        },
        {
            title: '毛利润月份',
            dataIndex:'month',
            key:'month'
        },
        {
            title: '月毛利润',
            dataIndex:'monthMoney',
            key:'monthMoney',
            render: (text) => `${text}元`
        },
        {
            title: '月毛利率',
            dataIndex:'monthMoneyProfitMargin',
            key:'monthMoneyProfitMargin',
            render: (text) => `${text}%`
        }
    ];

    return (
        <Card>
            <div style={{ marginBottom: 16 }}>
                <Input
                    placeholder="请输入年份"
                    value={searchYear}
                    style={{ width: "200px", marginRight: "10px" }}
                    onChange={(e) => setSearchYear(e.target.value)}
                />
                <Button style={{ marginRight: "10px" }} type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                    搜索
                </Button>
                <Button type="default" icon={<UndoOutlined />} onClick={handleReset}>
                    重置
                </Button>
            </div>
            <div>利润总额：{ pageData.profitsTotal }</div>
            <Table
                rowKey="id"
                dataSource={grossMarginList.map((item, index) => ({...item, index }))}
                columns={columns}
                loading={loading}
                pagination={false}
            />
            <Pagination
                current={page}
                total={total}
                pageSize={pageSize}
                showSizeChanger
                showQuickJumper
                onChange={(newPage) => setPage(newPage)}
                onShowSizeChange={(newPageSize) => setPageSize(newPageSize)}
                showTotal={(total) => `共 ${total} 条`}
            />
        </Card>
    );
};

export default GrossMarginComponent;