import {
  HiArrowSmRight,
  HiUser,
  HiUsers,
  HiOutlineUserGroup,
  HiLocationMarker,
  HiPresentationChartBar,
} from "react-icons/hi";
import {
  MdDashboard,
  MdLogout,
} from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { LuUsers } from "react-icons/lu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";

export default function AdminDashSideBar() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [dropdowns, setDropdowns] = useState({
    isOpenEmp: false,
    isOpenServ: false,
  });

  const [activeTab, setActiveTab] = useState("");

  const toggleDropdown = (key) => {
    setDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }

    return () => {
      // Cleanup if necessary
    };
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/employee/signout', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      
      if (res.ok) {
        dispatch(signoutSuccess());
        navigate('/signin');
      } else {
        console.error('Signout failed:', data);
      }
    } catch (error) {
      console.error('Error during signout:', error);
    }
  };

  return (
    <div className="w-full h-full md:w-56 drop-shadow-2xl border-b-white">
      <div className="flex-col h-full overflow-x-hidden overflow-y-auto text-center bg-[#1f1f1f]">
        {currentUser.role && (
          <Link to="/admin-dashboard?tab=profile">
            <div
              className={`p-2.5 my-2 mx-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-[#707070] text-white ${
                activeTab === "profile" ? "bg-[#707070]" : ""
              }`}
            >
              <HiUser color="#D4D4D4" />
              <span className="text-[15px] ml-4 text-[#D4D4D4]">Profile</span>
            </div>
          </Link>
        )}
        {!currentUser.role && (
          <Link to="/admin-dashboard?tab=member-profile">
            <div
              className={`p-2.5 my-2 mx-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-[#707070] text-white ${
                activeTab === "member-profile" ? "bg-[#707070]" : ""
              }`}
            >
              <HiUser color="#D4D4D4" />
              <span className="text-[15px] ml-4 text-[#D4D4D4]">Profile</span>
            </div>
          </Link>
        )}

        {currentUser.isAdmin && (
          <Link to="/admin-dashboard?tab=dashboard-comp">
            <div
              className={`p-2.5 my-2 mx-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-[#707070] text-white ${
                activeTab === "dashboard-comp" ? "bg-[#707070]" : ""
              }`}
            >
              <MdDashboard color="#D4D4D4" />
              <span className="text-[15px] ml-4 text-[#D4D4D4]">Dashboard</span>
            </div>
          </Link>
        )}

        {(currentUser.role === "Manager" || currentUser.isAdmin) && (
          <>
            {currentUser.isAdmin && (
              <Link to="/admin-dashboard?tab=admin-users">
                <div
                  className={`p-2.5 my-2 mx-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-[#707070] text-white ${
                    activeTab === "admin-users" ? "bg-[#707070]" : ""
                  }`}
                >
                  <HiUsers color="#D4D4D4" />
                  <span className="text-[15px] ml-4 text-[#D4D4D4]">Users</span>
                </div>
              </Link>
            )}

            <Link to="/admin-dashboard?tab=Property-service">
              <div
                className={`p-2.5 my-2 mx-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-[#707070] text-white ${
                  activeTab === "Property-service" ? "bg-[#707070]" : ""
                }`}
              >
                <MdDashboard color="#D4D4D4" />
                <span className="text-[15px] ml-4 text-[#D4D4D4]">Service Management</span>
              </div>
            </Link>

            <Link to="/admin-dashboard?tab=advertisement">
              <div
                className={`p-2.5 my-2 mx-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-[#707070] text-white ${
                  activeTab === "advertisement" ? "bg-[#707070]" : ""
                }`}
              >
                <HiPresentationChartBar color="#D4D4D4" />
                <span className="text-[15px] ml-4 text-[#D4D4D4]">Advertisement</span>
              </div>
            </Link>

            <Link to="/admin-dashboard?tab=admin-Locations">
              <div
                className={`p-2.5 my-2 mx-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-[#707070] text-white ${
                  activeTab === "admin-Locations" ? "bg-[#707070]" : ""
                }`}
              >
                <HiLocationMarker color="#D4D4D4" />
                <span className="text-[15px] ml-4 text-[#D4D4D4]">Add-Locations</span>
              </div>
            </Link>

            {currentUser.isAdmin && (
              <>
                <div
                  className={`p-2.5 my-2 mx-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-[#707070] text-white ${
                    activeTab === "emp" ? "bg-[#707070]" : ""
                  }`}
                  onClick={() => toggleDropdown("isOpenEmp")}
                >
                  <HiOutlineUserGroup color="#D4D4D4" />
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[15px] ml-4 text-[#D4D4D4]">Employees</span>
                    <span className="text-sm">
                      {dropdowns.isOpenEmp ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </span>
                  </div>
                </div>

                {dropdowns.isOpenEmp && (
                  <div className="text-left text-sm font-light w-4/5 mx-auto text-[#D4D4D4] p-2">
                    <Link to="/admin-dashboard?tab=addemployee">
                      <h1
                        className={`cursor-pointer p-2 hover:bg-[#707070] rounded-md mt-1 ${
                          activeTab === "addemployee" ? "bg-[#707070]" : ""
                        }`}
                      >
                        Add Employees
                      </h1>
                    </Link>
                    <Link to="/admin-dashboard?tab=admin-managers">
                      <h1
                        className={`cursor-pointer p-2 hover:bg-[#707070] rounded-md mt-1 ${
                          activeTab === "admin-managers" ? "bg-[#707070]" : ""
                        }`}
                      >
                        Managers
                      </h1>
                    </Link>
                  </div>
                )}
              </>
            )}
          </>
        )}

        <div 
          className="p-2.5 my-2 mx-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-[#707070] text-white mt-auto"
          onClick={handleSignout}
        >
          <MdLogout color="#D4D4D4" />
          <span className="text-[15px] ml-4 text-[#D4D4D4]">Sign Out</span>
        </div>
      </div>
    </div>
  );
}