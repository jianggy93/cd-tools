import React, { useState } from 'react';
import XLSX from 'xlsx';
import { Upload, Button, Form, Select, Table } from 'antd';

const { Item } = Form;
const { Option } = Select;

function App() {
    const [types, setTypes] = useState([]);
    const [levels, setLevels] = useState([]);
    const [columns, setColumns] = useState([]);
    const [list, setList] = useState([]);

    const customRequest = ({ file }) => {
        console.log('customRequest', file);
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;

            const workbook = XLSX.read(data, { type: 'binary' });

            // 表格的表格范围，可用于判断表头是否数量是否正确
            let persons = [];
            // 遍历每张表读取
            for (const sheet in workbook.Sheets) {
                if (workbook.Sheets.hasOwnProperty(sheet)) {
                    persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                    // break; // 如果只取第一张表，就取消注释这行
                }
            }

            console.log(persons);

            const [column, ...arr] = persons;
            const keys = Object.keys(column);
            let typeKey = '';
            let levelKey = '';
            const columns = keys.map((key) => {
                if (column[key] === '医疗类别') {
                    typeKey = key;
                } else if (column[key] === '级别') {
                    levelKey = key;
                }
                return { title: column[key], dataIndex: key };
            });
            setColumns(columns);
            arr.pop();
            setList(arr);

            console.log(typeKey, levelKey);

            let types = [];
            let levels = [];
            arr.forEach((item) => {
                console.log(item);
                if (!types.includes(item[typeKey])) {
                    types = [...types, item[typeKey]];
                }
                if (!levels.includes(item[levelKey])) {
                    levels = [...levels, item[levelKey]];
                }
            });

            setTypes(types);
            setLevels(levels);

            console.log(types, levels);
        };

        reader.readAsBinaryString(file);
    };

    return (
        <>
            <Upload showUploadList={false} customRequest={customRequest}>
                <Button type='primary'>上传文件</Button>
            </Upload>
            <Form layout='inline'>
                <Item label='医疗类别'>
                    <Select style={{ width: 200 }}>
                        {types.map((item) => (
                            <Option key={item} value={item}>
                                {item}
                            </Option>
                        ))}
                    </Select>
                </Item>
                <Item label='级别'>
                    <Select style={{ width: 200 }}>
                        {levels.map((item) => (
                            <Option key={item} value={item}>
                                {item}
                            </Option>
                        ))}
                    </Select>
                </Item>
            </Form>
            <Table rowKey='__EMPTY' columns={columns} dataSource={list} />
        </>
    );
}

export default App;
