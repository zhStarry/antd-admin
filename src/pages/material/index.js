// Material.js
import React, { useState, useEffect} from'react';
import { Card, Space, Button, Table, Pagination, message, Modal, Input } from 'antd';
import { SearchOutlined, UndoOutlined, PlusOutlined } from '@ant-design/icons';
import AddComponents from './addComponent'; // 假设新增组件的路径
// import DetailComponent from './detailComponent'; // 假设详情组件的路径
import materialApi from '../../services/materialApi';

// 将searchKeyword字段换成params字段
const pageParamsObj = {
    page: 1,
    size: 10,
    params: "" 
};

function Material() {
    const [pageData, setPageData] = useState({
        "currentPage": 0,
        "data": [
            {
                "addTime": "2025-03-02T14:50:04.894Z",
                "id": 0,
                "name": "string",
                "price": 0,
                "specification": "string",
                "updateTime": "2025-03-02T14:50:04.894Z"
            }
        ],
        "lastPage": true,
        "pageSize": 0,
        "total": 0,
        "totalPages": 0
    });
    const [pageParams, setPageParams] = useState(pageParamsObj);
    const [dateValue, setDateValue] = useState(null);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [visible, setVisible] = useState(false);
    const [editData, setEditData] = useState(null); // 用于存储要编辑的数据

    // 分页请求
    const materialPage = async () => {
        const res = await materialApi.materialPageApi(pageParams);
        const data = res.data;
        setPageData(res);
    };

    // 编辑
    const editClick = async (id) => {
        // 这里假设存在获取详情的接口，暂时使用 materialPageApi 示例
        const res = await materialApi.detailMaterialApi(id);
        setEditData(res.data); // 将获取到的要编辑的数据存储起来
        setVisible(true);
    };

    useEffect(() => {
        console.log(pageParams, 39);
        materialPage();
    }, [pageParams]);

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: '规格',
            dataIndex: 'specification',
            key: 'specification',
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

    const requestMaterialDetailApi = async (id) => {
        // 这里假设存在获取详情的接口，暂时使用 materialPageApi 示例
        const res = await materialApi.materialPageApi({ id });
        setDetailData(res.data);
        console.log(res, 98);
    };

    // 详情
    const detailClick = async (id) => {
        setOpenState(true);
        requestMaterialDetailApi(id);
    };

    const pageChange = (page, pageSize) => {
        console.log(page, pageSize);
        setPageParams({...pageParams, page, size: pageSize });
    };

    // 搜索
    const [searchInputValue, setSearchInputValue] = useState(''); // 用于存储搜索框输入值
    const handleSearchInputChange = (e) => {
        setSearchInputValue(e.target.value);
    };
    const searchClick = () => {
        setPageParams({
           ...pageParams,
            params: searchInputValue // 更新params字段
        });
    };

    // 重置
    const resetClick = () => {
        setDateValue(null);
        setPageParams({
           ...pageParams,
            page: 1,
            size: 10,
            params: "" // 清空params字段
        });
        setSearchInputValue(''); // 清空搜索框内容
    };

    // 新增
    const addClick = () => {
        setVisible(true);
        setEditData(null); // 新增时清空编辑数据
    };

    // 新增提交
    const submitClick = (isSubmit) => {
        setIsAdd(false);
        if (isSubmit) {
            materialPage();
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
            await materialApi.deleteMaterialApi(deleteId);
            message.success('删除成功');
            materialPage(); // 删除成功后重新获取数据
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

    const onCancel = () => {
        setVisible(false);
        searchClick();
    };

    return (
        <>
            {/* 将 visible 和 editData 传递给 AddComponents 组件 */}
            <AddComponents visible={visible} onCancel={onCancel} editData={editData} /> 

            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Card>
                    <Space direction="vertical">
                        <Space direction="horizontal">
                            <Input
                                placeholder="搜索商品名称"
                                value={searchInputValue}
                                onChange={handleSearchInputChange}
                                style={{ width: 200 }}
                            />
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
                            showTotal={(total) => `总共 ${total} 条`}
                        />
                    </Space>
                </Card>
                {/* <DetailComponent openState={openState} detailData={detailData} cancel={setOpenState} requestMaterialDetailApi={requestMaterialDetailApi} /> */}
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

export default Material;