import React, { useState, useEffect } from'react';
import { Modal, Form, Input, message, Button } from 'antd';
import materialApi from '../../services/materialApi'; // 假设接口文件路径是这样，根据实际情况调整

const AddMaterialComponent = ({ visible, onCancel, editData }) => {
    const [form] = Form.useForm();
    const [isEdit, setIsEdit] = useState(false);

    // 提交表单处理函数
    const handleSubmit = () => {
        form.validateFields().then(values => {
            // 构建要发送到接口的数据
            const sendData = {
                name: values['商品名称'],
                price: Number(values['商品单价']),
                specification: values['商品规格']
            };

            // 根据是否是编辑状态调用不同接口
            if (isEdit) {
                // 假设编辑接口需要传入id，根据实际接口调整
                sendData.id = editData.id; 
                materialApi.updateMaterialApi(sendData)
                   .then(res => {
                        if (Number(res.code) === 200) { 
                            message.success('原材料编辑成功');
                            onCancel(); 
                        } else {
                            message.error('原材料编辑失败');
                        }
                    })
                   .catch(error => {
                        console.error('编辑原材料时出错：', error);
                        message.error('编辑原材料时出现错误，请检查');
                    });
            } else {
                materialApi.addMaterialApi(sendData)
                   .then(res => {
                        if (Number(res.code) === 200) { 
                            message.success('原材料添加成功');
                            onCancel(); 
                        } else {
                            message.error('原材料添加失败');
                        }
                    })
                   .catch(error => {
                        console.error('添加原材料时出错：', error);
                        message.error('添加原材料时出现错误，请检查');
                    });
            }
        });
    };

    useEffect(() => {
        if (editData) {
            setIsEdit(true);
            // 设置表单初始值为编辑数据
            form.setFieldsValue({
                '商品名称': editData.name,
                '商品单价': editData.price,
                '商品规格': editData.specification,
            });
        } else {
            setIsEdit(false);
            // 清空表单（可选操作）
            form.resetFields(); 
        }
    }, [editData, form]);

    return (
        <Modal
            title={isEdit? "编辑原材料" : "添加原材料"}
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
                    label="商品名称"
                    name="商品名称"
                >
                    <Input placeholder="请输入商品名称" />
                </Form.Item>
                <Form.Item
                    label="商品单价"
                    name="商品单价"
                >
                    <Input placeholder="0" />
                </Form.Item>
                <Form.Item
                    label="商品规格"
                    name="商品规格"
                >
                    <Input placeholder="请输入商品规格" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddMaterialComponent;