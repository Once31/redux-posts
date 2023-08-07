import { useEffect, useReducer, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";

import { selectPostById, updatePost, deletePost } from "./postsSlice";
import { selectAllUsers } from "../users/usersSlice";


function EditPostForm() {

    const {postId} = useParams();
    const navigate = useNavigate()

    const post = useSelector((state) => selectPostById(state, Number(postId)))
    const users = useSelector(selectAllUsers)

    const dispatch = useDispatch()
    

    const [title, setTitle] = useState(post?.title)
    const [userId, setUserId] = useState(post?.userId)
    const [content, setContent] = useState(post?.body)
    const [requestStatus, setRequestStatus] = useState('idle')

    if( !post ){
        return (
            <section>
            <h2>Post not found!</h2>
          </section>
        );
    }

    const canSave = [title, userId, content].every(Boolean) && requestStatus === 'idle'
    
    const onTitleChanged = (e) => setTitle(e.target.value)
    const onAuthorChanged = (e) => setUserId(Number(e.target.value))
    const onContentChanged = (e) => setContent(e.target.value)


    const userOptions = users.map(user => (
        <option key={user.id} value={user.id}>{user.name}</option>
    ))

    

    const editPost = () => {
        try {
            setRequestStatus('pending')
            dispatch(updatePost({id:post.id,title, body: content, userId, reactions: post?.reactions})).unwrap()

            setTitle('');
            setContent('');
            setUserId('')

            navigate(`/post/${postId}`)

        } catch (error){
            console.error('Failed to save post.', error)
        } finally {
            setRequestStatus('idle')
        }
    }

    const deletePosts = () => {
        try {
            setRequestStatus('pending');
            dispatch(deletePost({id:post.id})).unwrap();
            setTitle('');
            setContent('');
            setUserId('');
            navigate('/')
        } catch(error) {
            console.error('error', error)
        } finally {
            setRequestStatus('idle');
        }
    }

  return (
    <section>
        <h2>Edit Post</h2>
        <form >
            <label htmlFor="postTitle">Post Title:</label>
            <input 
                type='text'
                id='postTitle'
                name='postTitle'
                value={title}
                onChange={onTitleChanged}
            />
            <label htmlFor='postAuthor'>Author:</label>
            <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
                <option value=''></option>
                {userOptions}
            </select>
            <label htmlFor="postContent">Content:</label>
            <textarea
                id='postContent'
                name='postContent'
                value={content}
                onChange={onContentChanged}
            />
            <button 
                type='button' 
                onClick={editPost} 
                disabled={!canSave}
            >Edit Post</button>
            <button 
                className="deleteButton"
                type='button' 
                onClick={deletePosts} 
            >Delete Post</button>
        </form>
    </section>
  )
}

export default EditPostForm