import React from 'react'

export default function Footer() {
  return (
    <footer className="foo sticky-footer">
      <div className="container my-auto">
        <div className="copyright text-center my-auto">
    
          <span> ZITAPP</span>
        </div>
      </div>
      <style>
        {`
          .foo {
            background-color: #0a0f2c; /* Azul muy oscuro */
            color: white;
            padding: 20px 0;
          }
        `}
      </style>
    </footer>
  )
}
