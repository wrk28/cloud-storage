import { useSelector } from 'react-redux';
import '../styles.css';


const Home = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  return (
    <div className="home-section">
      {isLoggedIn && isAdmin && ( <div className='text-home'>You logged in as administrator</div>) }
      {isLoggedIn && !isAdmin && ( <div className='text-home'>You can go to your files</div>) }
      {!isLoggedIn && ( <div className='text-home'>You can sign up or log in</div>) }
    </div>
  );
};

export default Home;