import React, { useReducer, useCallback, useEffect } from 'react';
import './style.scss';
import NoData from '@/components/no-data/index';
import TaskItem from './components/task-item';
import CreateTask from './components/create-task';
import moment from 'moment';
import { DatePicker, Button, Tag, Row, Col } from 'antd';
import { getStartTimestampByDate, getEndTimestampByDate } from '@/utils';
import { serviceGetTask } from '@/services';


const dateFormat = 'YYYY-MM-DD';
const datePickerValue = moment(new Date(getStartTimestampByDate()), dateFormat);
const TASK_TYPE: any = {
  wait: { text: '待作业', color: 'orange' },
  process: { text: '作业中', color: '#108ee9' },
  finished: { text: '已完成', color: '#87d068' },
  unfinished: { text: '未完成', color: '#f50' }
};

interface State {
  startDate: moment.Moment;
  data: {
    wait: any[];
    process: any[];
    finished: any[];
    unfinished: any[];
  };
  showCreateTaskModal: boolean;
}

const initialState: State = {
  startDate: datePickerValue,
  data: { wait: [], process: [], finished: [], unfinished: [] },
  showCreateTaskModal: false
};

function reducer(state: State, action: any) {
  switch (action.type) {
    case 'setState':
      return { ...state, ...action.state };
    default:
      return state;
  }
}

const TodayTask = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setState = useCallback((state) => {
    dispatch({ type: 'setState', state });
  }, []);

  const getTask = useCallback(() => {
    const date = state.startDate.valueOf();
    serviceGetTask({
      startDate: getStartTimestampByDate(date),
      endDate: getEndTimestampByDate(date)
    })
    .then(res => {
      if (res.data.success) {
        setState({ data: res.data.data });
      }
    });
  }, [setState, state.startDate]);

  const initParams = useCallback(() => {
    setState({ startDate: datePickerValue });
    getTask();
  }, [setState, getTask]);

  const handleOnSuccess = useCallback(() => {
    setState({ showCreateTaskModal: false });
    getTask();
  }, [setState, getTask]);

  useEffect(() => {
    getTask();
  }, [getTask]);

  return (
    <div className="today-task">
      <div className="query-panel">
        <span>查询日期：</span>
        <DatePicker
          format={dateFormat} 
          allowClear 
          value={state.startDate} 
          onChange={date => setState({ startDate: date })} 
        />
        <Button type="primary" onClick={getTask}>查询</Button>
        <Button onClick={() => setState({ showCreateTaskModal: true })}>新增</Button>
        <Button onClick={initParams}>重置</Button>
      </div>
      <div className="wrapper">
        {(
          state.data.wait.length > 0 ||
          state.data.process.length > 0 ||
          state.data.finished.length > 0 ||
          state.data.unfinished.length > 0
        ) ? (
          <Row gutter={24} type="flex">
            {Object.keys(state.data).map((key: string) => (
              <Col span={6} key={key}>
                <div className="text-align_center">
                  <Tag color={TASK_TYPE[key].color}>{TASK_TYPE[key].text}</Tag>
                </div>
                {state.data[key].map((item: any) => (
                  <TaskItem key={item.id} data={item} reloadData={getTask} />
                ))}
              </Col>
            ))}
          </Row>
        ) : (
          <NoData
            message="还没有待办事项，是否马上创建？"
            onClick={() => setState({ showCreateTaskModal: true })}
          />
        )}
      </div>
      <CreateTask
        visible={state.showCreateTaskModal}
        onSuccess={handleOnSuccess}
        setParentState={setState}
      />
    </div>
  );
};

export default TodayTask;
