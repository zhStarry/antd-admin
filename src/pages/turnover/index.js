import React, { useState, useEffect, useCallback, useRef } from'react';
import { Card, DatePicker, Space, Button, Table, Pagination, message, Modal, Input } from 'antd';
import { SearchOutlined, UndoOutlined, PlusOutlined } from '@ant-design/icons';
import AddTurnoverComponent from './AddTurnoverComponent';
import turnoverApi from '../../services/turnoverApi';
import dayjs from 'dayjs';

const obj = {
    "currentPage": 0,
    "data": [
        {
            "addTime": "2025-03-02T17:15:23.626Z",
            "id": 0,
            "month": "2025-03-02T17:15:23.626Z",
            "monthMoney": 0,
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

function Turnover() {
    const [pageData, setPageData] = useState(obj);
    const [pageParams, setPageParams] = useState(pageParamsObj);
    const [dateValue, setDateValue] = useState(null);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [visible, setVisible] = useState(false);
    const [editData, setEditData] = useState(null);


    // 分页请求
    const turnoverPage = async () => {
        const res = await turnoverApi.turnoverPageApi(pageParams);
        setPageData(res);
    };

    // 编辑
    const editClick = async (id) => {
        const res = await turnoverApi.detailTurnoverApi(id);
        setEditData(res.data);
        setVisible(true);
    };

    useEffect(() => {
        turnoverPage();
    }, [pageParams]);

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '营业额月份',
            dataIndex:'month',
            key:'month',
            render: (month) => dayjs(month).format("YYYY-MM")
        },
        {
            title: '月营业额',
            dataIndex:'monthMoney',
            key:'monthMoney'
        },
        {
            title: '操作',
            render: (text, record, index) => (
                <>
                    <Space direction="horizontal">
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
        setPageParams({...pageParams, params: dateValue ? dayjs(dateValue).format("YYYY-MM") : "" });
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
            await turnoverApi.deleteTurnoverApi(deleteId);
            message.success('月营业额记录删除成功');
            turnoverPage();
        } catch (error) {
            message.error('月营业额记录删除失败');
            console.error('删除月营业额记录时出错：', error);
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

    return (
        <>
            <AddTurnoverComponent visible={visible} onCancel={onCancel} editData={editData} />
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
                            新增月营业额
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

export default Turnover;