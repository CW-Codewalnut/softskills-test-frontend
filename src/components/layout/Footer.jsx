import './Footer.css'

const Footer = () => {
  return (
    <footer className="cw-footer">
      <div className="footer-meta">
        <p>HSR Layout, Bengaluru · +91-97414 97123</p>
        <p>© {new Date().getFullYear()} CodeWalnut. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer

