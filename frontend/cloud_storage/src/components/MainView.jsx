import { Routes, Route } from 'react-router-dom';
import Register from './RegisterFrom';
import LoginForm from './LoginForm';
import UserList from './UserList';
import FileList from './FileList';
import Home from './Home';


const MainView = () => {
  
  return (
    <div className="content-area">
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/files/:userid" element={<FileList />} />
      </Routes>
    </div>
  );
};

export default MainView;