import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './editor.css';

const EditorComponent = ({ initialData, onChange }) => {
  const [editorData, setEditorData] = useState(initialData);

  const handleEditorReady = (editor) => {
    console.log('Editor is ready to use!', editor);
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEditorData(data);
    onChange(data);
  };

  const handleEditorBlur = (event, editor) => {
    console.log('Blur.', editor);
  };

  const handleEditorFocus = (event, editor) => {
    console.log('Focus.', editor);
  };

  return (
    <div className="editor-main-section">
      <div>
        <CKEditor
          editor={ClassicEditor}
          data={editorData}
          onReady={handleEditorReady}
          onChange={handleEditorChange}
          onBlur={handleEditorBlur}
          onFocus={handleEditorFocus}
        />
      </div>
    </div>
  );
};

export default EditorComponent;
