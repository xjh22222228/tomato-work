module.exports = {
  rules: {
    // [关闭警告] 未使用变量警告
    '@typescript-eslint/no-unused-vars': 0,
    
    // [关闭警告] 必须使用 target="_blank" rel="noopener noreferrer"
    'react/jsx-no-target-blank': 0,

    // [关闭警告] href属性为描点或js代码警告 <a href="javascript:;"></a>
    'jsx-a11y/anchor-is-valid': 0,

    // [关闭警告] img标签必须带有alt属性
    'jsx-a11y/alt-text': 0,

    // [关闭警告] 在定义之前使用过
    // type Props = ReturnType<typeof mapStateToProps>;
    // const mapStateToProps = ...
    'no-use-before-define': 0
  }
} 