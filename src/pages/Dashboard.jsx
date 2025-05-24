import { useDeviceContext } from "../context/DeviceContext";

const Dashboard = () => {
  const { state } = useDeviceContext();
  return (
    <div>
      <h1>Welcome to Dashboard</h1>
      <p>Selected ID: {state.selectedDeviceId}</p>
    </div>
  );
};

export default Dashboard;
