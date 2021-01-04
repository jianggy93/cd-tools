import React from 'react';
import XLSX from 'xlsx';
import { Upload, Button } from 'antd';

function SelectFile() {
    const customRequest = ({ file }) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = e.target.result;

            const workbook = XLSX.read(data, { type: 'binary' });

            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const list = XLSX.utils.sheet_to_json(worksheet);
            console.log(list);

            // const [column, ...arr] = list;
            // const keys = Object.keys(column);
            // let typeKey = '';
            // let levelKey = '';
            // const columns = keys.map((key) => {
            //     if (column[key] === '医疗类别') {
            //         typeKey = key;
            //     } else if (column[key] === '级别') {
            //         levelKey = key;
            //     }
            //     return { title: column[key], dataIndex: key };
            // });
            // setColumns(columns);
            // arr.pop();
            // setList(arr);

            // let types = [];
            // let levels = [];
            // arr.forEach((item) => {
            //     console.log(item);
            //     if (!types.includes(item[typeKey])) {
            //         types = [...types, item[typeKey]];
            //     }
            //     if (!levels.includes(item[levelKey])) {
            //         levels = [...levels, item[levelKey]];
            //     }
            // });

            // setTypes(types);
            // setLevels(levels);
        };

        reader.readAsBinaryString(file);
    };

    return (
        <Upload showUploadList={false} customRequest={customRequest}>
            <Button type='primary'>上传文件</Button>
        </Upload>
    );
}

export default SelectFile;
