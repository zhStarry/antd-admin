import React, { useState, useEffect } from 'react';
import { Modal, Form, DatePicker, Select, Input, Button, message, Space } from 'antd';
import inventoryApi from '../../services/inventoryApi';
import materialApi from '../../services/materialApi';
import dayjs from 'dayjs';

const { Option } = Select;

const AddInventoryComponent = ({ visible, onCancel, editData, allProducts }) => {
    const [form] = Form.useForm();
    const [isEdit, setIsEdit] = useState(false);
    const [materialList, setMaterialList] = useState([]);

    // 获取商品列表
    const fetchMaterialList = async () => {
        try {
            const res = await materialApi.materialListApi();
            setMaterialList(res.data);
        } catch (error) {
            console.error('获取商品列表出错：', error);
            message.error('获取商品列表时出现错误，请检查');
        }
    };

    useEffect(() => {
        if (!materialList.length) {
            fetchMaterialList();
        }
    }, [materialList.length]);

    // 提交处理
    const handleSubmit = () => {
        form.validateFields().then(values => {
            let sendData;
            if (isEdit) {
                const selectIds = values.inventoryForms.map(item => item.id)
                const neverSelectIds = editData.inventoryList.filter(item => !selectIds.includes(item.id)).map(item=>item.id)
            
                sendData = {
                    id: editData.inventoryMonth.id,
                    month: values['month'].format("YYYY-MM") + "-09",
                    inventoryForms: values.inventoryForms || [],
                    neverSelectIds
                }
            } else {
                sendData = {
                    month: values['month'].format("YYYY-MM") + "-09",
                    inventoryForms: values.inventoryForms || [],
                };
            }


            inventoryApi[isEdit ? 'inventoryMonthUpdateApi' : 'addInventoryPageApi'](sendData)
                .then(res => {
                    if (Number(res.code) === 200) {
                        message.success(isEdit ? '编辑成功' : '新增成功');
                        onCancel();
                        form.resetFields();
                    } else {
                        message.error(res.msg || (isEdit ? '编辑失败' : '新增失败'));
                    }
                })
                .catch(error => {
                    console.error('操作失败：', error);
                    message.error(isEdit ? '编辑时出现错误' : '新增时出现错误');
                });
        });
    };

    // 初始化编辑数据
    useEffect(() => {
        if (editData) {
            setIsEdit(true);
            form.setFieldsValue({
                // '盘点月份': dayjs(editData.inventoryMonth.month),
                id: editData.inventoryMonth.id,
                month: dayjs(editData.inventoryMonth.month),
                inventoryForms: editData.inventoryList?.map(item => ({
                    monthId: item.monthId,
                    projectId: item.projectId,
                    projectNum: item.projectNum,
                    id: item.id
                })) || []
            });
        } else {
            setIsEdit(false);
            form.resetFields();
        }
    }, [editData, form]);

    return (
        <Modal
            title={isEdit ? "编辑盘点信息" : "添加盘点"}
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="reset" onClick={() => form.resetFields()}>重置</Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    {isEdit ? "保存修改" : "提交"}
                </Button>
            ]}
            width={800}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="盘点月份"
                    name="month"
                >
                    <DatePicker 
                        placeholder="请选择月份" 
                        format="YYYY-MM" 
                        picker="month" 
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item label="商品清单">
                    <Form.List name="inventoryForms">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space 
                                        key={key} 
                                        align="baseline" 
                                        style={{ display: 'flex', marginBottom: 8 }}
                                    >
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'projectId']}
                                        >
                                            <Select 
                                                placeholder="选择商品" 
                                                style={{ width: 200 }}
                                                showSearch
                                                optionFilterProp="children"
                                            >
                                                {materialList.map(material => (
                                                    <Option 
                                                        key={material.id} 
                                                        value={material.id}
                                                    >
                                                        {material.name} ({material.specification})
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            {...restField}
                                            name={[name, 'projectNum']}
                                        >
                                            <Input 
                                                placeholder="数量" 
                                                min={1}
                                                style={{ width: 120 }}
                                            />
                                        </Form.Item>

                                        <Button 
                                            type="link" 
                                            danger
                                            onClick={() => remove(name)}
                                        >
                                            删除
                                        </Button>
                                    </Space>
                                ))}

                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    style={{ marginTop: 16 }}
                                >
                                    + 添加商品
                                </Button>
                            </>
                        )}
                    </Form.List>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddInventoryComponent;