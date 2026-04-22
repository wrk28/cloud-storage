import Sidebar from './Sidebar';
import MainView from './MainView';
import '../styles.css';

const MiddleComponent = () => {

  return (
    <div className="middle-section">
      <Sidebar />
      <MainView />
    </div>
  );
};

export default MiddleComponent;