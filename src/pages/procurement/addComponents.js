import React, { useState, useEffect, Fragment } from 'react'
import { Button, Form, Row, Col, DatePicker, Card, Input, Space, message } from 'antd';
import getDaysInMonthFromStr from '../../utils/getDaysInMonthFromStr'
import procurementApi from '../../services/procurementApi';
import dayjs from 'dayjs'

const AddComponents = (props) => {
    const { submitClick, onMountEdit } = props;
    const [form] = Form.useForm();
    const [monthDayNum, setMonthDayNum] = useState(30)
    const [monthDayJs, setMonthDayJs] = useState(null)
    const [initialValues, setInitialValues] = useState({ purchases: [] })
    const [addorEdit, setAddorEdit] = useState("add")



    const formSubmitClick = () => {
        form.validateFields().then(values => {
            const obj = {
                month: `${values.month.format("YYYY-MM")}-10`,
                procurementForms: []
            }

            for (let i = 0; i < values.purchases.length; i++) {
                const element = values.purchases[i];
                if (element.date) {
                    const date = element.date.format("YYYY-MM-DD")
                    delete element.date;
                    element["date"] = date;
                    obj.procurementForms.push(element)
                }

            }

            if (addorEdit === "add") {
                procurementApi.addProcurementMonthApi(obj).then(res => {
                    if (Number(res.code) === 200) {
                        message.success("新增成功")
                        submitClick(true)
                    }
    
                })
            } else if (addorEdit) {
                // 编辑
                procurementApi.updateProcurementMonthApi(obj).then(res => {
                    if (Number(res.code) === 200) {
                        message.success("编辑成功")
                        submitClick(true)
                    }
                })
            }



        })
    }

    const datePickerChange = (date, dateString) => {
        const dayNum = getDaysInMonthFromStr(dateString)
        setMonthDayJs(date)
        setMonthDayNum(dayNum)

        // 生成初始值结构
        const purchases = Array.from({ length: dayNum }, (_, index) => ({
            // date: dayjs(dateString).add(index, 'day'),
            date: null,
            oil: 0,
            vegetables: 0,
            pork: 0,
            flavour: 0,
            sundry: 0,
            rice: 0
        }))

        setInitialValues({ purchases })
        form.setFieldsValue({ purchases })
    }

    const editInintialValue = (data) => {
        console.log(data, 67)
        if (data?.procurementList && data?.procurementMonth) {

            setMonthDayJs(dayjs(data.procurementMonth.month))

            const purchases = data.procurementList.map(item => ({
                ...item, date: dayjs(item.date)
            }))


            setAddorEdit("edit")
            setInitialValues({ month: dayjs(data.procurementMonth.month), purchases })
            form.setFieldsValue({ month: dayjs(data.procurementMonth.month), purchases })
        }

    }

    // 编辑方法传出去
    useEffect(() => {
        onMountEdit(editInintialValue)
    }, [onMountEdit])

    const cancelClick = () => {
        submitClick(false)
    }

    const disabledDate = (current) => {
        if (!monthDayJs) return true
        const year = dayjs(monthDayJs).year()
        const month = dayjs(monthDayJs).month()
        return current.year() !== year || current.month() !== month
    }

    return (
        <Card {...props}>
            <Form form={form} initialValues={initialValues}>
                <Row gutter={10}>
                    <Col span={24}>
                        <Form.Item
                            label="采购月份"
                            name="month"
                            labelCol={{ width: 108 }}
                            rules={[{ required: true }]}
                        >
                            <DatePicker
                                placeholder="请选择月份"
                                format="YYYY-MM"
                                picker="month"
                                onChange={datePickerChange}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.List name="purchases">
                    {(fields) => (
                        <>
                            {fields.map(({ key, name, ...restField }, index) => (
                                <Fragment key={key}>
                                    {index+1}
                                    <Row gutter={10}>
                                        <Col span={24}>
                                            <Form.Item
                                                {...restField}
                                                label="采购日期"
                                                name={[name, 'date']}
                                            >
                                                <DatePicker
                                                    format="YYYY-MM-DD"
                                                    disabledDate={disabledDate}
                                                    defaultPickerValue={monthDayJs || dayjs()} // 新增此行
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={4}>
                                            <Form.Item
                                                {...restField}
                                                label="蔬菜"
                                                name={[name, 'vegetables']}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col span={4}>
                                            <Form.Item
                                                {...restField}
                                                label="猪肉"
                                                name={[name, 'pork']}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col span={4}>
                                            <Form.Item
                                                {...restField}
                                                label="调料"
                                                name={[name, 'flavour']}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col span={4}>
                                            <Form.Item
                                                {...restField}
                                                label="杂支"
                                                name={[name, 'sundry']}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col span={4}>
                                            <Form.Item
                                                {...restField}
                                                label="大米"
                                                name={[name, 'rice']}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col span={4}>
                                            <Form.Item
                                                {...restField}
                                                label="油"
                                                name={[name, 'oil']}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Fragment>
                            ))}
                        </>
                    )}
                </Form.List>
            </Form>

            {
                addorEdit === "add" ? (
                    <Button type="primary" onClick={formSubmitClick}>
                        新增完成
                    </Button>
                ) : (
                    <Button type="primary" onClick={formSubmitClick}>
                        编辑完成
                    </Button>
                )
            }

            <Button onClick={cancelClick} style={{ marginLeft: 10 }}>
                取消
            </Button>
        </Card>
    )
}

export default AddComponents;