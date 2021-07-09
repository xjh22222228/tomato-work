// https://ui.toast.com/tui-editor/
import React, { useState, useEffect, useCallback } from 'react'
import './style.scss'
import Editor from '@toast-ui/editor'
import { Input, Button, message } from 'antd'
import { RouteComponentProps, match } from 'react-router-dom'
import { HOME } from '@/router/constants'
import { defaultTitle } from './constants'
import {
  serviceCreateMemorandum,
  serviceGetMemorandumById,
  serviceUpdateMemorandum
} from '@/services'

interface Props {
  computedMatch: match<any>
}

let editor: Editor


const CreatePage: React.FC<Props & RouteComponentProps> = ({ history, computedMatch }) => {
  const [title, setTitle] = useState(defaultTitle)
  const [loading, setLoading] = useState(false)

  function goBack() {
    history.replace(HOME.MEMORANDUM.path)
  }

  function handleSubmit() {
    if (loading) return

    const id = computedMatch.params.id

    // 创建或更新
    const params = {
      markdown: editor.getMarkdown(),
      title
    }
    if (!params.markdown) {
      message.warn('实体内容不能为空')
      return
    }

    setLoading(true);

    (id ? serviceUpdateMemorandum(id, params) : serviceCreateMemorandum(params))
    .then(res => {
      if (res.data.success) {
        history.replace(HOME.MEMORANDUM.path)
      }
    })
  }

  const init = useCallback(() => {
    const id = computedMatch.params.id

    editor = new Editor({
      el: document.querySelector('#edit-section') as HTMLDivElement,
      initialEditType: 'markdown',
      previewStyle: 'vertical',
      usageStatistics: false
    })

    if (id) {
      serviceGetMemorandumById(id)
      .then(res => {
        if (res.data.success) {
          setTitle(res.data.data.title)
          editor.setMarkdown(res.data.data.markdown)
        }
      })
    }
  }, [computedMatch])

  useEffect(() => {
    init()

    return () => {
      // 销毁实例
      editor?.destroy()
    }
  }, [init])

  return (
    <div className="editor-page">
      <Input
        className="input-title"
        placeholder={defaultTitle}
        maxLength={50}
        size="large"
        value={title}
        onChange={e => setTitle(e.target.value)}
        onBlur={() => (!title && setTitle(defaultTitle))}
      />
      <div id="edit-section"></div>
      <div className="button-group">
        <Button onClick={goBack}>取消</Button>
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loading}
        >
          提交
        </Button>
      </div>
    </div>
  )
}

export default CreatePage
