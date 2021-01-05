import React, { useState } from 'react';
import { Space, Upload, Button, Form, Select, Row, Col, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import XLSX from 'xlsx';

const { Item, useForm } = Form;
const { Option } = Select;
const initValues = {
    type: [],
    level: [],
};
let typeIndex = 0;
let levelIndex = 0;
let totalIndex1 = 0; // 医疗费用总额
let totalIndex2 = 0; // 医保统筹金支付
let totalIndex3 = 0; // 大病保险支付金额
let totalIndex4 = 0; // 医保范围外金额
let totalIndex5 = 0; // 医疗救助金额

function Statistics(props) {
    const [form] = useForm();

    const [types, setTypes] = useState([]);
    const [levels, setLevels] = useState([]);

    const [filename, setFilename] = useState('');
    const [list, setList] = useState([]);
    const [total, setTotal] = useState({ a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 });

    const customRequest = ({ file }) => {
        const filename = file.name;
        const reader = new FileReader();

        reader.onload = (e) => {
            const file = e.target.result;

            const workbook = XLSX.read(file, { type: 'binary' });

            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const list = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            list.shift(); // 去除第一行
            const [columns, ...data] = list as string[][];
            columns.forEach((item, index) => {
                if (item === '医疗类别') {
                    typeIndex = index;
                } else if (item === '级别') {
                    levelIndex = index;
                } else if (item === '医疗费用总额') {
                    totalIndex1 = index;
                } else if (item === '医保统筹金支付') {
                    totalIndex2 = index;
                } else if (item === '大病保险支付金额') {
                    totalIndex3 = index;
                } else if (item === '医保范围外金额') {
                    totalIndex4 = index;
                } else if (item.indexOf('医疗救助') > -1 && item.indexOf('支付合计') > -1) {
                    totalIndex5 = index;
                }
            });

            let types = [];
            let levels = [];
            let result = [];
            data.forEach((item, i) => {
                const cur = {};
                item.forEach((val, index) => {
                    if (index === typeIndex && !types.includes(val)) {
                        types = [...types, val];
                    } else if (index === levelIndex && !levels.includes(val)) {
                        levels = [...levels, val];
                    }

                    cur[index] = val;
                });
                result.push(cur);
            });
            setTypes(types);
            setLevels(levels);
            setList(result);
            setFilename(filename);

            form.setFieldsValue({ type: types, level: levels });
            console.log(totalIndex5);
        };

        reader.readAsBinaryString(file);
    };

    const onFinish = ({ type, level }) => {
        let a = 0;
        let b = 0;
        let c = 0;
        let d = 0;
        let f = 0;
        const result = list.filter(
            (item) => type.includes(item[typeIndex]) && level.includes(item[levelIndex])
        );
        result.forEach((item) => {
            a += isNaN(Math.floor(item[totalIndex1])) ? 0 : item[totalIndex1];
            b += isNaN(Math.floor(item[totalIndex2])) ? 0 : item[totalIndex2];
            c += isNaN(Math.floor(item[totalIndex3])) ? 0 : item[totalIndex3];
            d += isNaN(Math.floor(item[totalIndex4])) ? 0 : item[totalIndex4];
            f += isNaN(Math.floor(item[totalIndex5])) ? 0 : item[totalIndex5];
        });
        setTotal({
            a: parseFloat(a.toFixed(2)),
            b: parseFloat(b.toFixed(2)),
            c: parseFloat(c.toFixed(2)),
            d: parseFloat(d.toFixed(2)),
            e: result.length,
            f: parseFloat(f.toFixed(2)),
        });
    };

    return (
        <Space direction='vertical' style={{ padding: 20 }}>
            <Row>
                <Upload showUploadList={false} customRequest={customRequest}>
                    <Button type='primary'>上传文件</Button>
                </Upload>
            </Row>

            <Form layout='inline' form={form} initialValues={initValues} onFinish={onFinish}>
                <Item label='医疗类别' name='type'>
                    <Select mode='multiple' style={{ width: 200 }}>
                        {types.map((item) => (
                            <Option key={item} value={item}>
                                {item}
                            </Option>
                        ))}
                    </Select>
                </Item>
                <Item label='级别' name='level'>
                    <Select mode='multiple' style={{ width: 200 }}>
                        {levels.map((item) => (
                            <Option key={item} value={item}>
                                {item}
                            </Option>
                        ))}
                    </Select>
                </Item>
                <Item>
                    <Button type='primary' htmlType='submit' icon={<SearchOutlined />}>
                        计算
                    </Button>
                </Item>
            </Form>

            <Row justify='center'>
                <Typography.Title level={3}>{filename}</Typography.Title>
            </Row>
            <Row>
                <Col span={12}>人次：{total.e}</Col>
                <Col span={12}>医疗费用总额：{total.a}</Col>
            </Row>
            <Row>
                <Col span={12}>医保统筹金支付：{total.b}</Col>
                <Col span={12}>大病保险支付金额：{total.c}</Col>
            </Row>
            <Row>
                <Col span={12}>医保范围外金额：{total.d}</Col>
                <Col span={12}>医保救助金额：{total.f}</Col>
            </Row>
        </Space>
    );
}

export default Statistics;
