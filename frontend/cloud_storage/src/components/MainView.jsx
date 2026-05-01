import { Routes, Route } from 'react-router-dom';
import Register from './RegisterFrom';
import LoginForm from './LoginForm';
import UserList from './UserList';
import FileList from './FileList';
import Home from './Home';
import PrivateRoute from './PrivateRoute';


const MainView = () => {
  
  return (
    <div className="content-area">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/users" element={<PrivateRoute> <UserList /> </PrivateRoute>} />
        <Route path="/files/:userid" element={<PrivateRoute> <FileList /> </PrivateRoute>} />
      </Routes>
    </div>
  );
};

export default MainView;