import React, { useState, useEffect } from'react';
import { Modal, Card, Table, Button, message, Form, Select, Input } from 'antd';
import inventoryApi from '../../services/inventoryApi';
import materialApi from '../../services/materialApi';
import dayjs from 'dayjs';

const { Option } = Select;

// 新增和修改的模态框组件
const AddEditProductModal = ({ visible, onCancel, title, productData, onSubmit, inventoryMonthDetail, addAndUpdate }) => {
    const [form] = Form.useForm();
    const [productOptions, setProductOptions] = useState([]);

    // 获取下拉框数据
    const fetchProductOptions = async () => {
        try {
            const res = await materialApi.materialListApi();
            console.log(res.data, 18)
            setProductOptions(res.data);
        } catch (error) {
            console.error('获取商品选项出错：', error);
            message.error('获取商品选项时出现错误，请检查');
        }
    };

    useEffect(() => {
        if (productOptions.length === 0) {
            fetchProductOptions();
        }
    }, [productOptions.length]);

    useEffect(() => {
        if (productData) {
            form.setFieldsValue({
                projectId: productData.projectId,
                projectNum: productData.projectNum,
                
            });
        }
    }, [productData, form]);

    const handleSubmit = () => {
        form.validateFields().then(values => {
            console.log(values, 44)
            if(addAndUpdate === "add"){
                const sendData = {
                    ...values,
                    monthId: inventoryMonthDetail.id
                 };
                 onSubmit(sendData);
            } else if (addAndUpdate === "update") {
                const sendData = {
                    ...values,
                    monthId: inventoryMonthDetail.id,
                    id: productData.id
                 };
                 onSubmit(sendData);
            }

        });
    };

    return (
        <Modal
            title={title}
            visible={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>取消</Button>
               ,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    {title === '新增商品项'? '确定' : '保存'}
                </Button>
            ]}
        >
            <Form form={form}>
                <Form.Item
                    label="商品"
                    name="projectId"
                >
                    <Select placeholder="请选择商品">
                        {productOptions.map(product => (
                            <Option key={product.id} value={product.id}>
                                {product.name} ({product.specification})
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="商品数量"
                    name="projectNum"
                >
                    <Input placeholder="请输入商品数量" type="number" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

const DetailInventoryComponent = ({ visible, onCancel, inventoryId }) => {
    const [inventoryDetail, setInventoryDetail] = useState({});
    const [productList, setProductList] = useState([]);
    const [addProductVisible, setAddProductVisible] = useState(false);
    const [editProductVisible, setEditProductVisible] = useState(false);
    const [editProductData, setEditProductData] = useState(null);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [deleteProductId, setDeleteProductId] = useState(null);

    // 获取盘点详情和商品列表
    const fetchInventoryDetail = async () => {
        try {
            const res = await inventoryApi.inventoryMonthDetailApi(inventoryId);
            setInventoryDetail(res.data);
            setProductList(res.data.inventoryList || []);
        } catch (error) {
            console.error('获取盘点详情出错：', error);
            message.error('获取盘点详情时出现错误，请检查');
        }
    };

    useEffect(() => {
        if (inventoryId) {
            fetchInventoryDetail();
        }
    }, [inventoryId]);

    // 编辑商品项
    const handleEditProduct = (product) => {
        setEditProductData(product);
        setEditProductVisible(true);
    };

    // 删除商品项
    const handleDeleteProduct = async () => {
        try {
            await inventoryApi.inventoryDeleteApi(deleteProductId);
            message.success('商品项删除成功');
            fetchInventoryDetail();
            setConfirmDeleteVisible(false);
        } catch (error) {
            console.error('删除商品项出错：', error);
            message.error('删除商品项时出现错误，请检查');
        }
    };

    // 新增商品项
    const handleAddProduct = (newProduct) => {
        inventoryApi.addInventoryApi(newProduct)
           .then(() => {
                message.success('商品项新增成功');
                fetchInventoryDetail();
                setAddProductVisible(false);
            })
           .catch((error) => {
                console.error('新增商品项出错：', error);
                message.error('新增商品项时出现错误，请检查');
            });
    };

    // 修改商品项
    const handleUpdateProduct = (updatedProduct) => {
        inventoryApi.inventoryUpdateApi(updatedProduct)
           .then(() => {
                message.success('商品项修改成功');
                fetchInventoryDetail();
                setEditProductVisible(false);
            })
           .catch((error) => {
                console.error('修改商品项出错：', error);
                message.error('修改商品项时出现错误，请检查');
            });
    };

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '商品名称',
            dataIndex: 'projectName',
            key: 'projectName'
        },
        {
            title: '商品单价',
            dataIndex: 'projectPrice',
            key: 'projectPrice'
        },
        {
            title: '商品数量',
            dataIndex: 'projectNum',
            key: 'projectNum'
        },
        {
            title: '商品总计',
            dataIndex: 'projectMoney',
            key: 'projectMoney',
        },
        {
            title: '操作',
            render: (text, record) => (
                <Button.Group>
                    <Button type="primary" onClick={() => handleEditProduct(record)}>编辑</Button>
                    <Button type="primary" danger onClick={() => {
                        setDeleteProductId(record.id);
                        setConfirmDeleteVisible(true);
                    }}>删除</Button>
                </Button.Group>
            )
        }
    ];

    return (
        <Modal
            title="盘点详情"
            visible={visible}
            onCancel={onCancel}
            width={850}
        >
            <Card>
                <p>盘点所属月份：{inventoryDetail?.inventoryMonth?.month || '-'}</p>
                <p>盘点总计金额：{inventoryDetail?.inventoryMonth?.monenyTotal || 0}￥</p>
                <Button type="primary" onClick={() => setAddProductVisible(true)}>
                    添加单条盘点
                </Button>
            </Card>
            <Table
                dataSource={productList.map((item, index) => ({...item, index }))}
                columns={columns}
                rowKey="id"
                bordered
            />
            <AddEditProductModal
                visible={addProductVisible}
                onCancel={() => setAddProductVisible(false)}
                inventoryMonthDetail={inventoryDetail?.inventoryMonth}
                title="新增商品项"
                onSubmit={handleAddProduct}
                addAndUpdate="add"
            />
            <AddEditProductModal
                visible={editProductVisible}
                onCancel={() => setEditProductVisible(false)}
                title="修改商品项"
                productData={editProductData}
                inventoryMonthDetail={inventoryDetail?.inventoryMonth}
                onSubmit={handleUpdateProduct}
                addAndUpdate="update"
            />
            <Modal
                title="确认删除"
                visible={confirmDeleteVisible}
                onOk={handleDeleteProduct}
                onCancel={() => setConfirmDeleteVisible(false)}
            >
                <p>确定要删除该商品项吗？</p>
            </Modal>
        </Modal>
    );
};

export default DetailInventoryComponent;