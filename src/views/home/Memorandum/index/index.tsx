import React, { FC, useState, useEffect, useCallback } from 'react';
import './style.scss';
import { RouteComponentProps } from 'react-router-dom';
import { Card, Col, Row, Button } from 'antd';
import { Link } from 'react-router-dom';
import { serviceGetMemorandum, serviceDeleteMemorandum } from '@/services';
import moment from 'moment';
import { defaultTitle } from '../constants';
import md from '@/utils/markdown';
import { modalConfirmDelete } from '@/utils';
import NoData from '@/components/NoData';


const Memorandum: FC<RouteComponentProps> = ({ history }) => {
  const [list, setList] = useState([]);

  const handleButton = useCallback((buttonType: 0 | 1 | 2, item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (buttonType === 0) {
      modalConfirmDelete()
      .then(() => {
        serviceDeleteMemorandum(item.id)
        .then(res => {
          if (res.data.success) {
            const index = list.findIndex((el: any) => el.title === item.title);
            if (index !== -1) {
              const copyList = [...list];
              copyList.splice(index, 1);
              setList(copyList);
            }
          }
        });
      });
      return;
    }

    if (buttonType === 2) {
      history.push('/home/memorandum/create');
      return;
    }
    
    history.push(`/home/memorandum/update/${item.id}`);
  }, [history, list]);

  useEffect(() => {
    serviceGetMemorandum()
    .then(res => {
      if (res.data.success) {
        const data = res.data.data.map((item: any) => {
          // 小段落显示，只截取前100字符串
          item.markdown = item.markdown.slice(0, 100);
          item.contentHTML = md.render(item.markdown);
          item.createdAt = moment(item.createdAt).format('YYYY/M/D HH:mm');
          item.title = item.title || defaultTitle;
          return item;
        });
        setList(data);
      }
    });
  }, []);

  return (
    <div className="memorandum">
    {
      (list.length > 0)
      ?
      <Row gutter={16} type="flex">
      {
        list.map((item: any) => (
          <Col span={8} key={item.id}>
            <Link to={`/home/memorandum/detail/${item.id}`}>
              <Card title={item.title} hoverable>
                { item.createdAt }
                <div 
                  className="content" 
                  dangerouslySetInnerHTML={{ __html: item.contentHTML }}
                >
                </div>
                <div className="button-group">
                  <Button size="small" onClick={handleButton.bind(null, 0, item)}>删除</Button>
                  <Button size="small" onClick={handleButton.bind(null, 1, item)}>编辑</Button>
                </div>
              </Card>
            </Link>
          </Col>
        ))
      }
      </Row>
      :
      <NoData
        message="还没有备忘录，是否马上创建？"
        onClick={handleButton.bind(null, 2, null)}
      />
    }
    </div>
  )
};

export default Memorandum;
