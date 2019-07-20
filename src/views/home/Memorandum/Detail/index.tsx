import React, { FC, useEffect, useState } from 'react';
import './style.scss';
import { Icon } from 'antd';
import { match, Link } from 'react-router-dom';
import { serviceGetMemorandumById } from '@/services';
import { defaultTitle } from '../constants';
import md from '@/utils/markdown';

interface Props {
  computedMatch: match<any>
}

const Detail: FC<Props> = ({ computedMatch }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const id = computedMatch.params.id;

  useEffect(() => {
    serviceGetMemorandumById(id)
    .then(res => {
      if (res.data.success) {
        const html = md.render(res.data.data.markdown);
        const title = res.data.data.title || defaultTitle;
        document.title = title;
        setTitle(title);
        setContent(html);
      }
    });
  }, [id]);

  return (
    <div className="memorandum-detail">
      <Link className="edit" to={`/home/memorandum/update/${id}`}>
        <Icon type="edit" title="编辑" />
      </Link>
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
