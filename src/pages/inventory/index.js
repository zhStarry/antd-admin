import React, { useState, useEffect, useCallback, useRef } from'react';
import { Card, DatePicker, Space, Button, Table, Pagination, message, Modal, Input } from 'antd';
import { SearchOutlined, UndoOutlined, PlusOutlined } from '@ant-design/icons';
import AddInventoryComponent from './AddInventoryComponent';
import DetailInventoryComponent from './DetailInventoryComponent';
import inventoryApi from '../../services/inventoryApi';
import dayjs from 'dayjs';

const obj = {
    "currentPage": 0,
    "data": [
        {
            "addTime": "2025-03-02T17:15:23.626Z",
            "id": 0,
            "month": "2025-03-02T17:15:23.626Z",
            "totalAmount": 0,
            "updateTime": "2025-03-02T17:15:23.626Z"
        }
    ],
    "lastPage": true,
    "pageSize": 0,
    "total": 0,
    "totalPages": 0
};
const pageParamsObj = {
    page: 1,
    size: 10,
    params: ""
};

function Inventory() {
    const [pageData, setPageData] = useState(obj);
    const [pageParams, setPageParams] = useState(pageParamsObj);
    const [dateValue, setDateValue] = useState(null);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [visible, setVisible] = useState(false);
    const [editData, setEditData] = useState(null);
    const [detailVisible, setDetailVisible] = useState(false);
    const [inventoryId, setInventoryId] = useState(0);

    // 分页请求
    const inventoryPage = async () => {
        const res = await inventoryApi.inventoryPageApi(pageParams);
        setPageData(res);
    };

    // 编辑
    const editClick = async (id) => {
        const res = await inventoryApi.inventoryMonthDetailApi(id);
        setEditData(res.data);
        setVisible(true);
    };

    // 查看详情
    const detailClick = (id) => {
        setInventoryId(id);
        setDetailVisible(true);
    };

    useEffect(() => {
        inventoryPage();
    }, [pageParams]);

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '盘点月份',
            dataIndex:'month',
            key:'month',
            render: (month) => dayjs(month).format("YYYY-MM")
        },
        {
            title: '盘点总计金额',
            dataIndex: 'monenyTotal',
            key: 'monenyTotal'
        },
        {
            title: '操作',
            render: (text, record, index) => (
                <>
                    <Space direction="horizontal">
                        <Button type="primary" onClick={() => detailClick(record.id)}>
                            详情
                        </Button>
                        <Button type="primary" onClick={() => editClick(record.id)}>
                            编辑
                        </Button>
                        <Button type="primary" danger onClick={() => showConfirmDelete(record.id)}>
                            删除
                        </Button>
                    </Space>
                </>
            )
        }
    ];

    const onChange = (date, dateString) => {
        setDateValue(date);
        // setPageParams({...pageParams, params: dateString });
    };

    const pageChange = (page, pageSize) => {
        setPageParams({...pageParams, page, size: pageSize });
    };

    // 搜索
    const searchClick = () => {
        setPageParams({...pageParams, params: dateValue ? dayjs(dateValue).format("YYYY-MM") : ""  });
    };

    // 重置
    const resetClick = () => {
        setDateValue(null);
        setPageParams({...pageParams, page: 1, size: 10, params: "" });
    };

    // 新增
    const addClick = () => {
        setVisible(true);
        setEditData(null);
    };

    // 显示确认删除对话框
    const showConfirmDelete = (id) => {
        setDeleteId(id);
        setConfirmDeleteVisible(true);
    };

    // 确认删除
    const handleConfirmDelete = async () => {
        try {
            await inventoryApi.inventoryMonthDeleteApi(deleteId);
            message.success('盘点记录删除成功');
            inventoryPage();
        } catch (error) {
            message.error('盘点记录删除失败');
            console.error('删除盘点记录时出错：', error);
        }
        setConfirmDeleteVisible(false);
    };

    // 取消删除
    const handleCancelDelete = () => {
        setConfirmDeleteVisible(false);
    };

    const onCancel = () => {
        setVisible(false);
        searchClick();
    };

    const detailOnCancel = () => {
        setDetailVisible(false);
    };

    return (
        <>
            <AddInventoryComponent visible={visible} onCancel={onCancel} editData={editData} />
            <DetailInventoryComponent
                visible={detailVisible}
                onCancel={detailOnCancel}
                inventoryId={inventoryId}
            />
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Card>
                    <Space direction="vertical">
                        <Space direction="horizontal">
                            <DatePicker placeholder="选择月份" value={dateValue} onChange={onChange} picker="month" />
                            <Button type="primary" icon={<SearchOutlined />} onClick={searchClick}>
                                搜索
                            </Button>
                            <Button type="default" icon={<UndoOutlined />} onClick={resetClick}>
                                重置
                            </Button>
                        </Space>
                        <Button type="primary" icon={<PlusOutlined />} onClick={addClick}>
                            新增盘点
                        </Button>
                    </Space>
                </Card>
                <Card>
                    <Space direction="vertical" style={{ display: 'flex' }}>
                        <Table rowKey="id" dataSource={pageData.data} columns={columns} pagination={false} />
                        <Pagination
                            current={pageData.currentPage}
                            total={pageData.total}
                            pageSize={pageData.pageSize}
                            showSizeChanger
                            showQuickJumper
                            onChange={pageChange}
                            showTotal={(total) => `共 ${total} 条`}
                        />
                    </Space>
                </Card>
            </Space>
            <Modal
                title="确认删除"
                visible={confirmDeleteVisible}
                onOk={handleConfirmDelete}
                onCancel={handleCancelDelete}
            >
                <p>确定要删除这条记录吗？</p>
            </Modal>
        </>
    );
}

export default Inventory;