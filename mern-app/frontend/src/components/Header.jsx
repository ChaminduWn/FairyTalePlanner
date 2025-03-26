import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Dropdown } from "flowbite-react";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

    const handleSignout = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST',
                credentials: 'include' // Important for cookies
            });
            const data = await res.json();
            
            if (res.ok) {
                dispatch(signoutSuccess());
                navigate("/");
            } else {
                console.error("Signout failed:", data.message);
            }
        } catch (error) {
            console.error("Signout error:", error.message);
        }
    };

    const handleProfileClick = () => {
        navigate('/Dashboard?tab=profile');
    };

    return (
        <header className="border-b-2 border-b-black shadow-md relative bg-gradient-to-r from-[#AC5180] to-[#160121] z-50">
            <div className="flex items-center justify-between p-6 mx-auto max-w-7xl relative">
            <Link to="/">
                    <img src={logo} alt="logo" className="w-40" />
                </Link>
                
                <ul className="flex items-center gap-10">
                    <Link to="/">
                        <li className="hidden sm:inline text-[#D4D4D4] hover:underline hover:underline-offset-4 hover:text-white">
                            Home
                        </li>
                    </Link>
                    <Link to="/about">
                        <li className="hidden sm:inline text-[#D4D4D4] hover:underline hover:underline-offset-4 hover:text-white">
                            About
                        </li>
                    </Link>
                    {!(currentUser?.role === "Manager" || currentUser?.isAdmin) && (
                        <Link to="/item">
                            <li className="hidden sm:inline text-[#D4D4D4] hover:underline hover:underline-offset-4 hover:text-white">
                                Item
                            </li>
                        </Link>
                    )}
                    {!(currentUser?.role === "Manager" || currentUser?.isAdmin) && (
                        <Link to="/properties">
                            <li className="hidden sm:inline text-[#D4D4D4] hover:underline hover:underline-offset-4 hover:text-white">
                                Properties
                            </li>
                        </Link>
                    )}
                    {!(currentUser?.role === "Manager" || currentUser?.isAdmin) && (
                        <Link to="/services">
                            <li className="hidden sm:inline text-[#D4D4D4] hover:underline hover:underline-offset-4 hover:text-white">
                                Services
                            </li>
                        </Link>
                    )}
                    {!(currentUser?.role === "Manager" || currentUser?.isAdmin) && (
                        <Link to="/advertisement">
                            <li className="hidden sm:inline text-[#D4D4D4] hover:underline hover:underline-offset-4 hover:text-white">
                                Advertisement
                            </li>
                        </Link>
                    )}
                </ul>
                
                <div className='flex gap-4 relative z-50'>
                    {currentUser ? (
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={<Avatar alt='user' img={currentUser.profilePicture} rounded />}
                            placement="bottom-end" // Ensures dropdown appears below and aligned to the end
                            className="z-50" // Ensure high z-index
                        >
                            <Dropdown.Header>
                                <span className='block text-sm'>@{currentUser.username}</span>
                                <span className='block text-sm font-medium truncate'>
                                    {currentUser.email}
                                </span>
                            </Dropdown.Header>
                            <Dropdown.Item onClick={handleProfileClick}>
                                Profile
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={handleSignout}> 
                                Sign Out
                            </Dropdown.Item>
                        </Dropdown>
                    ) : (
                        <Link to='/signin'>
                            <button className='px-4 py-2 text-white bg-red-900 rounded'>
                                Sign In
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}