import { useSelector } from "react-redux"
import { selectAllPosts, selectPostById, selectPostsPyUser } from "../posts/postsSlice"
import { Link, useParams } from "react-router-dom"
import { selectUserById } from "./usersSlice"

function UserPage() {

    const { userId } = useParams()
    const user = useSelector((state) => selectUserById(state, userId))

    const allPostsByUser = useSelector( state => selectPostsPyUser(state, userId))

    {/* useSelector( state => {
        const allPosts = selectAllPosts(state);
        return allPosts.filter(post => post.userId === Number(userId))
    }) */}

    const renderAllPostsTitle =  allPostsByUser.map(post => (
        <li>
            <Link to={`/post/${post.id}`} >{post.title}</Link>
        </li>
    ))

  return (
    <section>
        <h2>{user?.name}</h2>
        <ol>
            {renderAllPostsTitle}
        </ol>
    </section>
  )
}

export default UserPage