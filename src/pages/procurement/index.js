import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, DatePicker, Space, Button, Table, Pagination, message, Modal } from 'antd';
import { SearchOutlined, UndoOutlined, PlusOutlined } from '@ant-design/icons';
import AddComponents from './addComponents';
import DetailComponent from './detailComponent';
import procurementApi from '../../services/procurementApi';
import dayjs from 'dayjs';

const obj = {
    "currentPage": 0,
    "data": [
        {
            "addTime": "2025-02-27T02:34:07.490Z",
            "id": 0,
            "monenyTotal": 0,
            "month": "2025-02-27T02:34:07.490Z",
            "updateTime": "2025-02-27T02:34:07.490Z"
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

function Procurement() {
    const [pageData, setPageData] = useState(obj);
    const [pageParams, setPageParams] = useState(pageParamsObj);
    const [dateValue, setDateValue] = useState(null);
    const [isAdd, setIsAdd] = useState(false);
    const [openState, setOpenState] = useState(false);
    const [detailData, setDetailData] = useState({});
    const editCallBackFunc = useRef(null);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const onMountEdit = useCallback((method) => {
        console.log(method, 41);
        editCallBackFunc.current = method;
    }, []);

    // 分页请求
    const procurementMonthPage = async () => {
        const res = await procurementApi.procurementMonthPageApi(pageParams);
        const data = res.data;
        data.forEach(element => {
            const month = element.month;
            delete element.month;
            element.month = dayjs(month).format("YYYY-MM");
            console.log(dayjs(element.month).format("YYYY-MM"), 42);
        });
        setPageData(res);
        console.log(res);
    };

    // 编辑
    const editClick = async (id) => {
        const res = await procurementApi.procurementMonthDetailApi(id);
        console.log(res.data, 63);
        setIsAdd(true);
        console.log(editCallBackFunc.current, 65);
        editCallBackFunc.current(res.data);
    };

    useEffect(() => {
        console.log(pageParams, 39);
        procurementMonthPage();
    }, [pageParams]);

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '采购月份',
            dataIndex: 'month',
            key: 'age',
        },
        {
            title: '采购金额',
            dataIndex: 'monenyTotal',
            key: 'monenyTotal',
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

    const requestProcurementMonthDetailApi = async (id) => {
        const res = await procurementApi.procurementMonthDetailApi(id);
        setDetailData(res.data);
        console.log(res, 98);
    };

    // 详情
    const detailClick = async (id) => {
        setOpenState(true);
        requestProcurementMonthDetailApi(id);
    };

    const onChange = (date, dateString) => {
        console.log(date, dateString, Object.assign(pageParams, { params: dateString }));
        setDateValue(date);
        setPageParams(Object.assign(pageParams, { params: dateString }));
    };

    const pageChange = (page, pageSize) => {
        console.log(page, pageSize);
        setPageParams({ ...pageParams, page, size: pageSize });
    };

    // 搜索
    const searchClick = () => {
        procurementMonthPage();
    };

    // 重置
    const resetClick = () => {
        setDateValue(null);
        setPageParams({ ...pageParams, page: 1, size: 10, params: "" });
    };

    // 新增
    const addClick = () => {
        setIsAdd(true);
    };

    // 新增提交
    const submitClick = (isSubmit) => {
        setIsAdd(false);
        if (isSubmit) {
            procurementMonthPage();
        }
    };

    // 显示确认删除对话框
    const showConfirmDelete = (id) => {
        setDeleteId(id);
        setConfirmDeleteVisible(true);
    };

    // 确认删除
    const handleConfirmDelete = async () => {
        try {
            await procurementApi.procurementMonthDeleteApi(deleteId);
            message.success('删除成功');
            procurementMonthPage(); // 删除成功后重新获取数据
        } catch (error) {
            message.error('删除失败');
            console.error('删除失败:', error);
        }
        setConfirmDeleteVisible(false);
    };

    // 取消删除
    const handleCancelDelete = () => {
        setConfirmDeleteVisible(false);
    };

    return (
        <>
            <AddComponents style={{ display: isAdd ? "block" : "none" }} submitClick={submitClick} onMountEdit={onMountEdit} />

            <Space direction="vertical" size="middle" style={{ display: 'flex', display: !isAdd ? "block" : "none" }}>
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
                            新增
                        </Button>
                    </Space>
                </Card>
                <Card style={{ marginTop: "10px" }}>
                    <Space direction="vertical" style={{ display: 'flex' }}>
                        <Table rowKey="id" dataSource={pageData.data} columns={columns} pagination={false} />
                        <Pagination
                            current={pageData.currentPage}
                            total={pageData.total}
                            pageSize={pageData.pageSize}
                            showSizeChanger
                            showQuickJumper
                            onChange={pageChange}
                            showTotal={(total) => `总共 ${total} 条`}
                        />
                    </Space>
                </Card>
                <DetailComponent openState={openState} detailData={detailData} cancel={setOpenState} requestProcurementMonthDetailApi={requestProcurementMonthDetailApi} />
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

export default Procurement;