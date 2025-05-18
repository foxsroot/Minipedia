import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/main.css';
import '../styles/navigationbar.css';
import { FaSearch, FaRegUserCircle } from 'react-icons/fa';

type UserType = { name: string; avatar: string; notifications: number };
const users: UserType[] = [
    { name: 'John Doe', avatar: '/john.png', notifications: 5 },
    { name: 'Jane Smith', avatar: '/jane.png', notifications: 0 },
];
const user = null as UserType | null;
// const user = users[1]; 

const NavigationBar = () => {
    return (
        <nav className="navbar-tokopedia">
            <Link to="/" className="navbar-tokopedia-logo">
                <span className="navbar-tokopedia-brand">MiniPedia</span>
            </Link>
            <div className="navbar-tokopedia-searchbar navbar-tokopedia-searchbar-center">
                <input
                    className="navbar-tokopedia-searchinput"
                    type="text"
                    placeholder="Search in MiniPedia"
                />
                <button className="navbar-tokopedia-searchbtn" aria-label="Cari">
                    <FaSearch />
                </button>
            </div>
            <div className="navbar-tokopedia-right">
                {!user && (
                    <>
                        <Link to="/login" className="navbar-tokopedia-iconlink" title="Login">
                            <FaRegUserCircle size={22} />
                        </Link>
                    </>
                )}
                {user && (
                    <Link to="/profile" className="navbar-tokopedia-profile">
                        <img src="/default.png" alt="avatar" className="navbar-tokopedia-avatar" />
                        <span className="navbar-tokopedia-username">{user.name}</span>
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default NavigationBar;
