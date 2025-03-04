import React, { useEffect, useState } from 'react';
import { Button, Modal, Table, Space, Form, Row, Col, DatePicker, Input, message } from 'antd';
import procurementApi from '../../services/procurementApi';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const formObj = {
    date: dayjs().format("YYYY-MM-DD"),
    oil: 0,
    vegetables: 0,
    pork: 0,
    sundry: 0,
    flavour: 0,
    rice: 0
};

const DetailComponent = ({ openState, detailData, cancel, requestProcurementMonthDetailApi }) => {
    const { procurementMonth, procurementList } = detailData;
    const [oneOpenState, setOneOpenState] = useState(false);
    const [initialValues, setInitialValues] = useState(formObj);
    const [monthDayJs, setMonthDayJs] = useState(null);
    const [addOrEdit, setAddOrEdit] = useState("add");
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [form] = Form.useForm();

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '总价',
            dataIndex: 'totalMoney',
            key: 'totalMoney',
        },
        {
            title: '日期',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: '蔬菜',
            dataIndex: 'vegetables',
            key: 'vegetables',
        },
        {
            title: '猪肉',
            dataIndex: 'pork',
            key: 'pork',
        },
        {
            title: '杂支',
            dataIndex: 'sundry',
            key: 'sundry',
        },
        {
            title: '香料',
            dataIndex: 'flavour',
            key: 'flavour',
        },
        {
            title: '油',
            dataIndex: 'oil',
            key: 'oil',
        },
        {
            title: '大米',
            dataIndex: 'rice',
            key: 'rice',
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

    const editClick = async (id) => {
        const res = await procurementApi.procurementDetailApi(id);
        console.log(res, 74);
        setOneOpenState(true);
    };

    const oneCancel = () => {
        setOneOpenState(false);
    };

    const oneOK = () => {
        if (addOrEdit === "add") {
            form.validateFields().then(values => {
                console.log(values, 101);
                const date = values.date.format("YYYY-MM-DD");
                const obj = { ...formObj, ...values, date, monthId: procurementMonth.id };
                procurementApi.addProcurementApi(obj).then(res => {
                    console.log(res, 105);
                    const { code, msg } = res;
                    if (Number(code) === 200) {
                        message.success("新增成功");
                        requestProcurementMonthDetailApi(procurementMonth.id);
                        setOneOpenState(false);
                    }
                });
            });
        }
    };

    const addClick = () => {
        setInitialValues({ ...formObj, date: dayjs(procurementMonth.month) });
        setMonthDayJs(dayjs(procurementMonth.month));
        setOneOpenState(true);
    };

    const disabledDate = (current) => {
        const year = dayjs(procurementMonth.month)?.year();
        const month = dayjs(procurementMonth.month)?.month();
        return (current.year() !== year || current.month() !== month);
    };

    // 显示确认删除对话框
    const showConfirmDelete = (id) => {
        setDeleteId(id);
        setConfirmDeleteVisible(true);
    };

    // 确认删除
    const handleConfirmDelete = async () => {
        try {
            await procurementApi.procurementDeleteApi(deleteId);
            message.success('删除成功');
            requestProcurementMonthDetailApi(procurementMonth.id); // 删除成功后重新获取数据
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
            <Modal
                title="详情"
                open={openState}
                width={900}
                footer={[
                    <Button type="primary" onClick={() => cancel(false)}>确定</Button>
                ]}
                onCancel={() => cancel(false)}
            >
                {
                    procurementMonth && Object.keys(procurementMonth).length > 0 ? (
                        <>
                            <h4>月份：{dayjs(procurementMonth.month).format("YYYY-MM")}</h4>
                            <h4>采购额：{procurementMonth.monenyTotal} 元</h4>
                            <Button type="primary" icon={<PlusOutlined />} onClick={addClick} style={{ marginBottom: "10px" }}>
                                新增
                            </Button>
                        </>
                    ) : "无内容"
                }

                <Table rowKey="id" bordered dataSource={procurementList} columns={columns} pagination={false} />
            </Modal>
            <Modal
                title="单条采购"
                open={oneOpenState}
                onCancel={oneCancel}
                onOk={oneOK}
            >
                <Form form={form} initialValues={initialValues}>
                    <Row gutter={10}>
                        <Col span={12}>
                            <Form.Item
                                label="采购日期"
                                name="date"
                            >
                                <DatePicker
                                    style={{ width: "100%" }}
                                    format="YYYY-MM-DD"
                                    disabledDate={disabledDate}
                                    defaultPickerValue={monthDayJs || dayjs()}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="猪肉价格"
                                name="pork"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="蔬菜价格"
                                name="vegetables"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="杂支价格"
                                name="sundry"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="大米价格"
                                name="rice"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="调料价格"
                                name="flavour"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="菜油价格"
                                name="oil"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
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
};

export default DetailComponent;