import React, { FC, useEffect, useState } from 'react';
import './style.scss';
import { Icon } from 'antd';
import { match, Link, RouteComponentProps } from 'react-router-dom';
import { serviceGetMemorandumById } from '@/services';
import { defaultTitle } from '../constants';

interface Props {
  computedMatch: match<any>
}

const Detail: FC<Props & RouteComponentProps> = ({ computedMatch, history }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const id = computedMatch.params.id;

  const goBack = function () {
    history.goBack();
  };

  useEffect(() => {
    serviceGetMemorandumById(id)
    .then(res => {
      if (res.data.success) {
        const title = res.data.data.title || defaultTitle;
        document.title = title;
        setTitle(title);
        setContent(res.data.data.html);
      }
    });
  }, [id]);

  return (
    <div className="memorandum-detail">
      <div className="tool-bar">
        <Icon type="left" className="icon-left" onClick={goBack} />
        <Link className="edit" to={`/home/memorandum/update/${id}`}>
          <Icon type="edit" title="编辑" />
        </Link>
      </div>
      <h1 className="title">{ title }</h1>
      <div 
        className="markdown-body tui-editor-contents" 
        dangerouslySetInnerHTML={{ __html: content }}
      >
      </div>
    </div>
  )
};

export default Detail;
