import React from 'react'
import { Link, matchPath } from 'react-router-dom'
import logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../data/navbar-links"
import { useLocation } from 'react-router-dom'
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai"
import { useSelector } from 'react-redux'
import ProfileDropdown from '../core/Auth/ProfileDropdown'
import { useEffect, useState } from 'react'
import { apiConnector } from '../../services/apiconnector'
import { categories } from '../../services/apis'
import { BsChevronDown } from "react-icons/bs"
import { ACCOUNT_TYPE } from "../../utils/constants"

const subLinks = [
    {
        title: 'Python',
        link: '/catalog/python',
    },
    {
        title: 'Web dev',
        link: '/catalog/web-development',
    }
]

const Navbar = () => {
    // fetch the hooks from redux
    const {token} = useSelector((state) => state.auth);
    const {user} = useSelector((state) => state.profile);
    const {totalItems} = useSelector((state) => state.cart);
    const location = useLocation();

    const [loading, setLoading] = useState(false);

    // state variable for fetching the categories
    const [subLinks, setSubLinks] = useState([]);

    // Fetch categories on first render
    useEffect(() => {
        //Function for fetching the API response
        const fetchSubLinks = async () => {
            setLoading(true);
            try{
                const result = await apiConnector('GET', categories.CATEGORIES_API);
                console.log(result.data.data);
                setSubLinks(result.data.data);
            }
            catch(error){
                console.log(error);
            }
            setLoading(false);
        }
        fetchSubLinks();
    }, [])  

    
    // Check if current route matches
    const matchRoute = (route) => {
        return matchPath({path:route}, location.pathname)
    }

  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700'>
        {/* Navbar container */}
        <div className='w-11/12 max-w-maxContent flex flex-row items-center justify-between'>

            {/* Logo */}
            <Link to={'/'}>
                <img src={logo} width={160} height={42} loading='lazy' alt='Logo'></img>
            </Link>

            {/* Nav Links */}
            <nav>
                <ul className='flex gap-x-6 text-richblack-5'>
                    {
                        NavbarLinks.map((link, index) => (
                            <li key={index}>
                                {   
                                    // Catalog Link
                                    link.title === 'Catalog' 
                                    ? (
                                        // Container for Dropdown
                                        <>
                                        <div
                                        className={`group relative flex cursor-pointer items-center gap-1 ${
                                            matchRoute("/catalog/:catalogName")
                                            ? "text-yellow-25"
                                            : "text-richblack-25"
                                        }`}
                                        >
                                        {/* Catalog Link */}
                                        <p>{link.title}</p>
                                        <BsChevronDown />
                                        {/*  anchor */}
                                        <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                                            {/* DropDown Content Box */}
                                            <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                                            {loading ? (
                                            <p className="text-center">Loading...</p>
                                            ) : (subLinks && subLinks.length) ? (
                                            <>
                                                {/* Filter tjpse sublinks that have courses */}
                                                {subLinks
                                                ?.filter(
                                                    (subLink) => subLink?.courses?.length > 0
                                                )
                                                ?.map((subLink, i) => (
                                                    <Link
                                                    to={`/catalog/${subLink.name
                                                        .split(" ")
                                                        .join("-")
                                                        .toLowerCase()}`}
                                                    className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                                    key={i}
                                                    >
                                                    <p>{subLink.name}</p>
                                                    </Link>
                                                ))}
                                            </>
                                            ) : (
                                            <p className="text-center">No Courses Found</p>
                                            )}
                                        </div>
                                        </div>
                                    </>
                                    ) 
                                    : (
                                        // Navbar link codes
                                        <Link to={link?.path}>
                                            <p className={`${matchRoute(link?.path) ? 'text-yellow-25' : 'text-richblack-5'}`}>
                                                {link.title}
                                            </p>
                                        </Link>
                                    )
                                }
                            </li>
                        ))
                    }
                </ul>
            </nav>

            {/* Login Signup, and Dashboard Buttons */}
            <div className='hidden gap-x-4 items-center md:flex'>
                {/* Shopping Cart - Visible when User is not an instructor */}
                {
                    user && user?.accountType !== 'Instructor' && (
                        <Link to={'/dashboard/cart'} className='relative'>
                            <AiOutlineShoppingCart></AiOutlineShoppingCart>
                            {
                                totalItems > 0 && (
                                    <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                                        {totalItems}
                                    </span>
                                )
                            }
                        </Link>
                    )
                }

                {/* Login - visible when user is not logged in */}
                {token === null && (
                    <Link to="/login">
                        <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                            Log in
                        </button>
                    </Link>
                )}

                {/* Sign Up - visible when user is not logged in */}
                {token === null && (
                    <Link to="/signup">
                        <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                            Sign up
                        </button>
                    </Link>
                )}

                {/* Profile Dropdown - visible when user is logged in */}
                {
                    token !== null && (
                        <ProfileDropdown />
                    )
                }
            </div>

            {/* Mobile Hamburger Menu Button - visble on mobile */}
            <button className="mr-4 md:hidden">
                <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
            </button>
        </div>
    </div>
  )
}

export default Navbar