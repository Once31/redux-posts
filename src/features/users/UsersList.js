import { useSelector } from "react-redux";
import { selectAllUsers } from "./usersSlice"
import { Link } from "react-router-dom"


function UsersList() {
    const users = useSelector(selectAllUsers);

    const renderAllUsers = users.map((user) => (
        <li key={user.id}>
        <Link to={`/user/${user.id}`}>{user.name}</Link>
        </li>
    ))


  return (
    <section>
        <h2>Users</h2>
        <ul>
            {renderAllUsers}
        </ul>
    </section>
  )
}

export default UsersList