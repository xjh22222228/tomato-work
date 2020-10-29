import React from 'react'
import './style.scss'
import CONFIG from '@/config'

const currentYear = new Date().getFullYear()

const Footer = () => {
  return (
    <footer className="global-footer">
      <div>
        Copyright &copy; 2019-{currentYear} {CONFIG.title} -
        <a href="https://github.com/xjh22222228" target="_blank" rel="noopener noreferrer"> xiejiahe</a>
      </div>
    </footer>
  )
}

export default Footer
