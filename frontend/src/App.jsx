import  {useEffect, useState} from 'react'
import axios from 'axios'
import "./App.css";
function App() {
  const [data, setData] = useState()
  const [user, setUser] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });
  const [submit, setSubmit] = useState(false);
  const onChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setUser({
      ...user,
      [name]:value
    })
  };
  const register = (e) => {
    e.preventDefault();
    setSubmit(true)
    console.log("Submit")
  };

  const fetchUserDetails =async () => {
    await axios.get('http://localhost:5000/').then((res) => {
      console.log('User Details:', res?.data);
      setData(res?.data);
    })
    .catch((error) => {
      if (error.response) {
        console.error( error.response.status);
      } else if (error.request) {
        console.error('No response');
      } else {
        console.error(error.message);
      }
    });
  };
  useEffect(()=>{
    if (submit) {
      console.log("firsbbvjdbt")
      axios.post("http://localhost:5000/submit",user)
      .then((res)=>{
        console.log("Submited",res.data)
        fetchUserDetails();
      })
      .catch((err)=>{
        console.log(err)
      })
    }
  },[submit])
  useEffect(() => {
    fetchUserDetails();
  }, []);
  
  return (
    <div className="App">
      <form>
        <h1>Form</h1>
        <p></p>
        <input
          type="name"
          name="name"
          id="name"
          placeholder="Enter Name"
          onChange={onChange}
        ></input>
        <p></p>
        <input
          type="address"
          name="address"
          id="address"
          placeholder="Address"
          onChange={onChange}
        ></input>
        <p></p>
        <input
          type="phone"
          name="phone"
          id="phone"
          placeholder="Phone"
          onChange={onChange}
        ></input>
        <p></p>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          onChange={onChange}
        ></input>
        <p></p>
        <button type="submit" onClick={register}>
          Submit
        </button>
      </form>
      <div>
        <h1>User Details</h1>
        <ul>
        {data && data?.map((user) => (
            <li key={user.id}>
              <li>Name: {user.name}</li>
              <li>Address: {user.address}</li>
              <li>Phone: {user.phone}</li>
              <li>Email: {user.email}</li>
              <hr/>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
