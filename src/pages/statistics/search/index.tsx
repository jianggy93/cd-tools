import React from 'react';
import { Form, Select, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Item, useForm } = Form;
const { Option } = Select;
const initValues = {
    type: [],
    level: [],
};

function Search(props) {
    const { types, levels } = props;
    const [form] = useForm();

    const onFinish = (values) => {
        console.log(values);
    };

    return (
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
                    查询
                </Button>
            </Item>
        </Form>
    );
}

export default Search;
