import React, { useState, useEffect, useCallback, useRef } from'react';
import { Card, DatePicker, Space, Button, Table, Pagination, message, Modal, Form, Input, Col, Row } from 'antd';
import { SearchOutlined, UndoOutlined, PlusOutlined } from '@ant-design/icons';
import socialSecurityApi from '../../services/socialSecurityApi';
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

const SocialSecurityComponent = () => {
    const [form] = Form.useForm();
    const [socialSecurityList, setSocialSecurityList] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [editData, setEditData] = useState(null);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [dateValue, setDateValue] = useState(null);
    const [pageParams, setPageParams] = useState(pageParamsObj);

    // 分页请求
    const fetchSocialSecurityList = async () => {
        setLoading(true);
        try {
            const res = await socialSecurityApi.socialSecurityPageApi(pageParams);
            setSocialSecurityList(res.data);
            setTotal(res.total);
        } catch (error) {
            console.error('获取社保医疗列表出错：', error);
            message.error('获取社保医疗列表时出现错误，请检查');
        } finally {
            setLoading(false);
        }
    };

    // 编辑社保医疗
    const handleEdit = (data) => {
        form.setFieldsValue({
           ...data,
            month: dayjs(data.month)
        });
        setEditData(data);
        setVisible(true);
    };

    // 删除社保医疗
    const handleDelete = async () => {
        try {
            await socialSecurityApi.deleteSocialSecurityApi(deleteId);
            message.success('社保医疗记录删除成功');
            fetchSocialSecurityList();
            setConfirmDeleteVisible(false);
        } catch (error) {
            console.error('删除社保医疗记录出错：', error);
            message.error('删除社保医疗记录时出现错误，请检查');
        }
    };

    // 提交表单（新增或编辑）
    const handleSubmit = () => {
        form.validateFields().then(values => {
            const sendData = {
               ...values,
                // 根据实际情况调整数据格式
            };
            if (editData) {
                sendData.id = editData.id;
                const { companySecurity, companyTreatment, employeeSecurity, employeeTreatment, month, name } = values;
                const obj = {
                    companySecurity,
                    companyTreatment,
                    employeeSecurity,
                    employeeTreatment,
                    month: month.format("YYYY-MM") + "-09",
                    name,
                    id: editData.id
                };
                socialSecurityApi.updateSocialSecurityApi(obj)
                   .then(() => {
                        message.success('社保医疗记录编辑成功');
                        setVisible(false);
                        fetchSocialSecurityList();
                    })
                   .catch(error => {
                        console.error('编辑社保医疗记录出错：', error);
                        message.error('编辑社保医疗记录时出现错误，请检查');
                    });
            } else {
                socialSecurityApi.addSocialSecurityApi({...sendData, month: values.month.format("YYYY-MM") + "-09"})
                   .then(() => {
                        message.success('社保医疗记录新增成功');
                        setVisible(false);
                        fetchSocialSecurityList();
                    })
                   .catch(error => {
                        console.error('新增社保医疗记录出错：', error);
                        message.error('新增社保医疗记录时出现错误，请检查');
                    });
            }
        });
    };

    // 日期选择变化处理
    const onChange = (date, dateString) => {
        setDateValue(date);
        // setPageParams({...pageParams, params: dateString });
    };

    // 分页变化处理
    const pageChange = (page, pageSize) => {
        setPageParams({...pageParams, page, size: pageSize });
    };

    // 搜索
    const searchClick = () => {
        setPageParams({...pageParams, params: dateValue? dayjs(dateValue).format("YYYY-MM") : "" });
    };

    // 重置
    const resetClick = () => {
        setDateValue(null);
        setPageParams({...pageParams, page: 1, size: 10, params: "" });
        form.resetFields();
    };

    // 新增社保医疗
    const handleAdd = () => {
        setVisible(true);
        setEditData(null);
        form.setFieldsValue({
            employeeSecurity: 341.96,
            companySecurity: 679.86,
            employeeTreatment: 81.42,
            companyTreatment: 337.9
        })
    };

    // 显示确认删除对话框
    const showConfirmDelete = (id) => {
        setDeleteId(id);
        setConfirmDeleteVisible(true);
    };

    useEffect(() => {
        fetchSocialSecurityList();
    }, [pageParams]);

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            width: "60px"
        },
        {
            title: '社保月份',
            width: "100px",
            dataIndex:'month',
            key:'month',
            render: (text, record) => (
                <div>
                    {dayjs(text).format("YYYY-MM")}
                </div>
            )
        },
        {
            title: '参保人',
            dataIndex: 'name',
            key: 'name',
            width: "100px"
        },
        {
            title: '员工社保',
            dataIndex: 'employeeSecurity',
            key: 'employeeSecurity',
            width: "100px",
            render: (text) => (
                <div>
                    {Number(text).toFixed(2)}
                </div>
            )
        },
        {
            title: '公司社保',
            dataIndex: 'companySecurity',
            key: 'companySecurity',
            width: "100px",
            render: (text) => (
                <div>
                    {Number(text).toFixed(2)}
                </div>
            )
        },
        {
            title: '社保总计',
            render: (text, record) => (
                <div>
                    {(Number(record.companySecurity) + Number(record.employeeSecurity)).toFixed(2)}
                </div>
            ),
            width: "100px"
        },
        {
            title: '员工大病医疗',
            dataIndex: 'employeeTreatment',
            key: 'employeeTreatment',
            width: "150px",
            render: (text) => (
                <div>
                    {Number(text).toFixed(2)}
                </div>
            )
        },
        {
            title: '公司大病医疗',
            dataIndex: 'companyTreatment',
            key: 'companyTreatment',
            width: "150px",
            render: (text) => (
                <div>
                    {Number(text).toFixed(2)}
                </div>
            )
        },
        {
            title: '大病医疗总计',
            render: (text, record) => (
                <div>
                    {(Number(record.companyTreatment) + Number(record.employeeTreatment)).toFixed(2)}
                </div>
            ),
            width: "150px"
        },
        {
            title: '员工总计',
            render: (text, record) => (
                <div>
                    {(Number(record.employeeTreatment) + Number(record.employeeSecurity)).toFixed(2)}
                </div>
            ),
            width: "100px"
        },
        {
            title: '公司总计',
            render: (text, record) => (
                <div>
                    {(Number(record.companyTreatment) + Number(record.companySecurity)).toFixed(2)}
                </div>
            ),
            width: "100px"
        },
        {
            title: '全部总计',
            render: (text, record) => (
                <div>
                    {(Number(record.companyTreatment) + Number(record.companySecurity) + Number(record.employeeTreatment) + Number(record.employeeSecurity)).toFixed(2)}
                </div>
            ),
            width: "100px"
        },
        {
            title: '操作',
            render: (text, record) => (
                <Button.Group>
                    <Button type="primary" onClick={() => handleEdit(record)}>编辑</Button>
                    <Button type="primary" danger onClick={() => showConfirmDelete(record.id)}>删除</Button>
                </Button.Group>
            ),
            width: "150px"
        }
    ];

    return (
        <>
            <Card>
                <Space direction="horizontal">
                    <DatePicker placeholder="选择月份" value={dateValue} onChange={onChange} picker="month" />
                    <Button type="primary" icon={<SearchOutlined />} onClick={searchClick}>
                        搜索
                    </Button>
                    <Button type="default" icon={<UndoOutlined />} onClick={resetClick}>
                        重置
                    </Button>
                </Space>
                <Row style={{ marginTop: "20px" }}>
                    <Col>
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                            新增社保与大病医疗
                        </Button>
                    </Col>
                </Row>
            </Card>
            <Card>
                <Table
                    rowKey="id"
                    dataSource={socialSecurityList.map((item, index) => ({...item, index }))}
                    columns={columns}
                    loading={loading}
                    pagination={false}
                    scroll={{ x: 1500 }}
                />
                <Pagination
                    current={page}
                    total={total}
                    pageSize={pageSize}
                    showSizeChanger
                    showQuickJumper
                    onChange={pageChange}
                    onShowSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    showTotal={(total) => `共 ${total} 条`}
                />
            </Card>
            <Modal
                title={editData? '编辑社保医疗记录' : '新增社保医疗记录'}
                visible={visible}
                onCancel={() => {
                    form.resetFields();
                    setVisible(false);
                }}
                footer={[
                    <Button key="cancel" onClick={() => setVisible(false)}>取消</Button>,
                    <Button key="submit" type="primary" onClick={handleSubmit}>
                        {editData? '保存' : '确定'}
                    </Button>
                ]}
            >
                <Form form={form}>
                    {/* 根据实际需求添加表单字段 */}
                    <Form.Item
                        label="社保月份"
                        name="month"
                    >
                        <DatePicker placeholder="请选择社保月份" picker="month" format="YYYY-MM" />
                    </Form.Item>
                    <Form.Item
                        label="参保人"
                        name="name"
                    >
                        <Input placeholder="请输入参保人姓名" />
                    </Form.Item>
                    <Form.Item
                        label="员工社保"
                        name="employeeSecurity"
                    >
                        <Input placeholder="请输入员工社保金额" defaultValue={341.96} />
                    </Form.Item>
                    <Form.Item
                        label="公司社保"
                        name="companySecurity"
                    >
                        <Input placeholder="请输入公司社保金额" defaultValue={679.86} />
                    </Form.Item>
                    <Form.Item
                        label="员工大病医疗"
                        name="employeeTreatment"
                    >
                        <Input placeholder="请输入员工大病医疗金额" defaultValue={81.42} />
                    </Form.Item>
                    <Form.Item
                        label="公司大病医疗"
                        name="companyTreatment"
                    >
                        <Input placeholder="请输入公司大病医疗金额" defaultValue={337.9} />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="确认删除"
                visible={confirmDeleteVisible}
                onOk={handleDelete}
                onCancel={() => setConfirmDeleteVisible(false)}
            >
                <p>确定要删除这条社保医疗记录吗？</p>
            </Modal>
        </>
    );
};

export default SocialSecurityComponent;