/**
 * 活动清单
 */
import React, { useEffect, useRef } from 'react';
import moment from 'moment';
import useKeepState from 'use-keep-state';
import Table from '@/components/table';
import CreateTodo from '../components/create-todo';
import { serviceGetTodoList, serviceDeleteTodoList, serviceUpdateTodoList } from '@/services';
import { STATUS } from '../constants';
import { DatePicker, Button, Tag, Form } from 'antd';
import { modalConfirmDelete } from '@/utils';

const { RangePicker } = DatePicker;
const DATE_FORMAT = 'YYYY-MM-DD';

interface State {
  showCreateTodoModal: boolean;
  currentRowData: { [key: string]: any; } | null;
}

const initialState: State = {
  showCreateTodoModal: false,
  currentRowData: null
};

const TodoList = () => {
  const [form] = Form.useForm();
  const [state, setState] = useKeepState(initialState);
  const tableRef = useRef<any>();
  const tableColumns = [
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status: number) => (
        <Tag color={STATUS[status].color}>
          {STATUS[status].text}
        </Tag>
      )},
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 170
    },
    {
      title: '活动内容',
      dataIndex: 'content',
      className: 'wbba'
    },
    {
      title: '操作',
      width: 250,
      align: 'right',
      fixed: 'right',
      render: (row: any) => (
        <>
          <Button onClick={handleActionButton.bind(null, 0, row)}>编辑</Button>
          <Button onClick={handleActionButton.bind(null, 1, row)}>删除</Button>
          <Button
            onClick={handleActionButton.bind(null, 2, row)}
            disabled={row.status === 2}
          >
            完成
          </Button>
        </>
      )
    }
  ];

  function getData() {
    tableRef.current.getTableData();
  }

  function getTodoList(params: any) {
    const values = form.getFieldsValue();

    if (values.date && values.date.length === 2) {
      params.startDate = values.date[0].format(DATE_FORMAT);
      params.endDate = values.date[1].format(DATE_FORMAT);
    }

    return serviceGetTodoList(params).then(res => {
      res.data.data.rows.map((item: any) => {
        item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm');
        return item;
      });
      return res;
    });
  }

  function initParams() {
    const startDate = moment().startOf('year');
    const endDate = moment().endOf('year');
    form.setFieldsValue({
      date: [startDate, endDate]
    });
    tableRef?.current?.getTableData();
  }

  function toggleCreateTodoModal() {
    setState({ showCreateTodoModal: !state.showCreateTodoModal });
  }

  const handleOnSuccess = function() {
    toggleCreateTodoModal();
    tableRef.current.getTableData();
  };

  function handleActionButton(buttonType: number, row: any) {
    switch (buttonType) {
      // 编辑
      case 0:
        setState({ showCreateTodoModal: true, currentRowData: row });
        break;
      // 删除
      case 1:
        modalConfirmDelete()
        .then(() => {
          serviceDeleteTodoList(row.id)
          .then(res => {
            if (res.data.success) {
              tableRef.current.getTableData();
            }
          });
        });
        break;
      // 状态
      case 2:
        serviceUpdateTodoList(row.id, { status: 2 })
        .then(res => {
          if (res.data.success) {
            tableRef.current.getTableData();
          }
        });
        break;
      default:
    }
  }

  useEffect(() => {
    initParams();
  }, []);

  return (
    <div className="today-task">
      <div className="query-panel">
        <Form
          form={form}
          layout="inline"
          onValuesChange={() => tableRef?.current?.getTableData()}
        >
          <Form.Item name="date" label="查询日期">
            <RangePicker allowClear />
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={getData}>查询</Button>
            <Button onClick={initParams}>重置</Button>
          </Form.Item>
        </Form>
      </div>

      <Table
        ref={tableRef}
        getTableData={getTodoList}
        columns={tableColumns}
        onDelete={serviceDeleteTodoList}
        onAdd={() => setState({
          showCreateTodoModal: true,
          currentRowData: null
        })}
      />
      <CreateTodo
        visible={state.showCreateTodoModal}
        onSuccess={handleOnSuccess}
        onCancel={toggleCreateTodoModal}
        rowData={state.currentRowData}
      />
    </div>
  );
};

export default TodoList;
