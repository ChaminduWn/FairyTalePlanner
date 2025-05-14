import { useEffect, useState } from "react";
import { HiArrowNarrowUp } from "react-icons/hi";
import { FaUserTie } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Card } from "flowbite-react";
import { Bar, Pie } from "react-chartjs-2";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function DashboardComponent() {
  const [managers, setManagers] = useState([]);
  const [users, setUsers] = useState([]);
  const [totalManagers, setTotalManagers] = useState(0);
  const [lastMonthManagers, setLastMonthManagers] = useState(0);
  const [approvedLocations, setApprovedLocations] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  const categories = [
    { name: "Photography", color: "#FF5733", icon: "📷" },
    { name: "Bridal Service", color: "#FFC0CB", icon: "👰" },
    { name: "Photo Location", color: "#33FF57", icon: "🏞️" },
    { name: "Groom Dressing", color: "#3357FF", icon: "🤵" },
    { name: "Car Rental", color: "#000000", icon: "🚗" },
    { name: "Entertainment Services", color: "#9933FF", icon: "🎭" },
    { name: "Invitation & Gift Services", color: "#FF33E9", icon: "🎁" },
    { name: "Honeymoon", color: "#FF9933", icon: "🏝️" },
    { name: "Hotel", color: "#33FFF9", icon: "🏨" },
  ];

  const dataFormatter = (number) =>
    Intl.NumberFormat("us").format(number).toString();

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await fetch(`/api/employee/getemployee?role=Manager`);
        const data = await res.json();
        if (res.ok) {
          setManagers(data.employees || []);
          setTotalManagers(data.totalEmployees || 0);
          setLastMonthManagers(data.lastMonthEmployees || 0);
        } else {
          console.error("Failed to fetch managers:", data.message);
        }
      } catch (error) {
        console.error("Error fetching managers:", error.message);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users || []);
        } else {
          console.error("Failed to fetch users:", data.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    const fetchApprovedLocations = async () => {
      try {
        const res = await fetch(`/api/location`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setApprovedLocations(data || []);
        } else {
          console.error("Failed to fetch approved locations:", data.message);
        }
      } catch (error) {
        console.error("Error fetching approved locations:", error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchManagers();
      fetchUsers();
      fetchApprovedLocations();
    }
  }, [currentUser]);

  // Prepare data for charts
  const categoryCounts = categories.reduce((acc, category) => {
    acc[category.name] = approvedLocations.filter(
      (loc) => loc.category === category.name
    ).length;
    return acc;
  }, {});

  const barChartData = {
    labels: categories.map((cat) => cat.name),
    datasets: [
      {
        label: "Locations by Category",
        data: categories.map((cat) => categoryCounts[cat.name] || 0),
        backgroundColor: categories.map((cat) => cat.color),
        borderColor: categories.map((cat) => cat.color),
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: categories.map((cat) => cat.name),
    datasets: [
      {
        label: "Location Distribution",
        data: categories.map((cat) => categoryCounts[cat.name] || 0),
        backgroundColor: categories.map((cat) => cat.color),
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Location Categories Distribution",
      },
    },
  };

  // Download CSV report for approved locations
  const downloadLocationsReport = () => {
    const headers = ["Name", "Category", "Address", "Latitude", "Longitude"];
    const rows = approvedLocations.map((loc) => [
      loc.name,
      loc.category,
      loc.address,
      loc.lat || "N/A",
      loc.lng || "N/A",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "approved_locations_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-3 md:mx-auto">
      <div className="flex flex-wrap justify-center gap-4">
        {/* Total Managers */}
        <div className="flex flex-col justify-between w-full gap-4 p-3 bg-white rounded-md shadow-md md:w-72">
          <div className="flex justify-between">
            <div>
              <h3 className="text-[#1f1f1f] text-md uppercase">Total Managers</h3>
              <p className="text-2xl font-semibold">
                {totalManagers > 0 ? dataFormatter(totalManagers) : "Loading..."}
              </p>
            </div>
            <FaUserTie className="p-3 text-5xl text-white rounded-full shadow-lg bg-blue-950" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="flex items-center text-green-500">
              <HiArrowNarrowUp />
              <p>{lastMonthManagers > 0 ? dataFormatter(lastMonthManagers) : "0"}</p>
            </span>
            <div className="text-[#707070]">Last month</div>
          </div>
        </div>

        {/* Total Locations */}
        <div className="flex flex-col justify-between w-full gap-4 p-3 bg-white rounded-md shadow-md md:w-72">
          <div className="flex justify-between">
            <div>
              <h3 className="text-[#1f1f1f] text-md uppercase">Total Locations</h3>
              <p className="text-2xl font-semibold">{dataFormatter(approvedLocations.length)}</p>
            </div>
            <div className="p-3 text-5xl text-white bg-green-600 rounded-full shadow-lg">📍</div>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="flex items-center text-green-500">
              <HiArrowNarrowUp />
              <p>{dataFormatter(approvedLocations.length)}</p>
            </span>
            <div className="text-[#707070]">Total Approved</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 py-3 mx-auto">
        {/* Bar Chart */}
        <Card className="w-full sm:max-w-md">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
            Location Categories (Bar)
          </h5>
          <div className="mt-4">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </Card>

        {/* Pie Chart */}
        <Card className="w-full sm:max-w-md">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
            Location Categories (Pie)
          </h5>
          <div className="mt-4">
            <Pie data={pieChartData} options={chartOptions} />
          </div>
        </Card>

        {/* Map */}
        <Card className="w-full sm:max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
              Approved Locations Map
            </h5>
            <button
              onClick={downloadLocationsReport}
              className="text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-500"
            >
              Download Report
            </button>
          </div>
          <div className="mt-4 h-96">
            <MapContainer
              center={[0, 0]}
              zoom={2}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {approvedLocations
                .filter((loc) => loc.lat && loc.lng)
                .map((location) => (
                  <Marker
                    key={location._id}
                    position={[parseFloat(location.lat), parseFloat(location.lng)]}
                  >
                    <Popup>
                      <div>
                        <h3 className="font-bold">{location.name}</h3>
                        <p>{location.address}</p>
                        <p>Category: {location.category}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
            </MapContainer>
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap justify-center gap-4 py-3 mx-auto">
        {/* Managers List */}
        <Card className="w-full sm:max-w-72">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
              Managers
            </h5>
            <Link to={"/admin-dashboard?tab=admin-managers"}>
              <p className="text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                View all
              </p>
            </Link>
          </div>
          <div className="flow-root">
            {managers.map((manager) => (
              <ul
                className="border-b-2 divide-y divide-gray-200 dark:divide-gray-700"
                key={manager._id}
              >
                <li className="py-3 sm:py-4">
                  <div className="flex items-center space-x-4">
                    <div className="shrink-0">
                      <img
                        alt="Profile"
                        height="32"
                        src={manager.profilePicture}
                        width="32"
                        className="rounded-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                        {manager.firstname} {manager.lastname}
                      </p>
                      <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                        {manager.email}
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            ))}
          </div>
        </Card>

        {/* Users List */}
        <Card className="w-full sm:max-w-72">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
              Latest Members
            </h5>
            <Link to={"/admin-dashboard?tab=admin-users"}>
              <p className="text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                View all
              </p>
            </Link>
          </div>
          <div className="flow-root">
            {users.map((user) => (
              <ul
                className="border-b-2 divide-y divide-gray-200 dark:divide-gray-700"
                key={user._id}
              >
                <li className="py-3 sm:py-4">
                  <div className="flex items-center space-x-4">
                    <div className="shrink-0">
                      <img
                        alt="Profile"
                        height="32"
                        src={user.profilePicture}
                        width="32"
                        className="rounded-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}