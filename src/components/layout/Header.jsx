import { Link } from 'react-router-dom'
import logo from '../../assets/codewalnut-logo.jpeg'
import './Header.css'

const Header = () => {
  return (
    <header className="cw-header">
      <Link to="/" className="cw-logo" aria-label="CodeWalnut home">
        <img src={logo} alt="CodeWalnut" />
      </Link>
    </header>
  )
}

export default Header

