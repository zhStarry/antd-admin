import React, { useState, useEffect } from'react';
import { Modal, Form, Input, DatePicker, message, Button } from 'antd';
import wageApi from '../../services/wageApi';
import dayjs from 'dayjs';

const AddWageComponent = ({ visible, onCancel, editData }) => {
    const [form] = Form.useForm();
    const [isEdit, setIsEdit] = useState(false);

    // 提交表单处理函数
    const handleSubmit = () => {
        form.validateFields().then(values => {
            const sendData = {
                month: values['薪资月份'].format("YYYY-MM") + "-09",
                monthMoney: Number(values['月薪资'])
            };
            if (isEdit) {
                sendData.id = editData.id;
                wageApi.updateWageApi(sendData)
                   .then(res => {
                        if (Number(res.code) === 200) {
                            message.success('月薪编辑成功');
                            onCancel();
                        } else {
                            message.error('月薪编辑失败');
                        }
                    })
                   .catch(error => {
                        console.error('编辑月薪时出错：', error);
                        message.error('编辑月薪时出现错误，请检查');
                    });
            } else {
                wageApi.addWageApi(sendData)
                   .then(res => {
                        if (Number(res.code) === 200) {
                            message.success('月薪新增成功');
                            onCancel();
                        } else {
                            message.error('月薪新增失败');
                        }
                    })
                   .catch(error => {
                        console.error('新增月薪时出错：', error);
                        message.error('新增月薪时出现错误，请检查');
                    });
            }
        });
    };

    useEffect(() => {
        if (editData) {
            setIsEdit(true);
            form.setFieldsValue({
                '薪资月份': dayjs(editData.month),
                '月薪资': editData.monthMoney
            });
        } else {
            setIsEdit(false);
            form.resetFields();
        }
    }, [editData, form]);

    return (
        <Modal
            title={isEdit? "编辑月薪" : "新增月薪"}
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
                    label="薪资月份"
                    name="薪资月份"
                >
                    <DatePicker placeholder="请选择月份" format="YYYY-MM" picker="month" />
                </Form.Item>
                <Form.Item
                    label="月薪资"
                    name="月薪资"
                >
                    <Input placeholder="请输入月薪资" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddWageComponent;