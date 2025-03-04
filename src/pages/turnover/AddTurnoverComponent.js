import React, { useState, useEffect } from'react';
import { Modal, Form, DatePicker, Input, message, Button } from 'antd';
import turnoverApi from '../../services/turnoverApi';
import dayjs from 'dayjs';

const AddTurnoverComponent = ({ visible, onCancel, editData }) => {
    const [form] = Form.useForm();
    const [isEdit, setIsEdit] = useState(false);

    // 提交表单处理函数
    const handleSubmit = () => {
        form.validateFields().then(values => {
            const sendData = {
                month: values['营业额月份'].format("YYYY-MM") + "-09",
                monthMoney: Number(values['月营业额'])
            };
            if (isEdit) {
                sendData.id = editData.id;
                turnoverApi.updateTurnoverApi(sendData)
                   .then(res => {
                        if (Number(res.code) === 200) {
                            message.success('月营业额编辑成功');
                            onCancel();
                        } else {
                            message.error('月营业额编辑失败');
                        }
                    })
                   .catch(error => {
                        console.error('编辑月营业额时出错：', error);
                        message.error('编辑月营业额时出现错误，请检查');
                    });
            } else {
                turnoverApi.addTurnoverApi(sendData)
                   .then(res => {
                        if (Number(res.code) === 200) {
                            message.success('月营业额新增成功');
                            onCancel();
                        } else {
                            message.error('月营业额新增失败');
                        }
                    })
                   .catch(error => {
                        console.error('新增月营业额时出错：', error);
                        message.error('新增月营业额时出现错误，请检查');
                    });
            }
        });
    };

    useEffect(() => {
        if (editData) {
            setIsEdit(true);
            form.setFieldsValue({
                '营业额月份': dayjs(editData.month),
                '月营业额': editData.monthMoney
            });
        } else {
            setIsEdit(false);
            form.resetFields();
        }
    }, [editData, form]);

    return (
        <Modal
            title={isEdit? "编辑月营业额" : "新增月营业额"}
            visible={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>取消</Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    {isEdit? "保存修改" : "确定"}
                </Button>
            ]}
        >
            <Form form={form}>
                <Form.Item
                    label="营业额月份"
                    name="营业额月份"
                >
                    <DatePicker placeholder="请选择月份" format="YYYY-MM" picker="month" />
                </Form.Item>
                <Form.Item
                    label="月营业额"
                    name="月营业额"
                >
                    <Input placeholder="请输入月营业额" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddTurnoverComponent;