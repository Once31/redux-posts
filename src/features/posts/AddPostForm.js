import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addNewPost } from './postsSlice'
import { selectAllUsers } from '../users/usersSlice'

const AddPostForm = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [userId, setUserId] = useState('')
    const [addRequestStatus, setAddRequestStatus] = useState('idle');

    const users = useSelector(selectAllUsers);

    const onTitleChanged = e => setTitle(e.target.value)
    const onContentChanged = e => setContent(e.target.value)
    const onAuthorChanged = e => setUserId(e.target.value)
    
    const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle';

    const addPost = async (e) => {
       if(canSave) {
        try {
            setAddRequestStatus('pending')
           await dispatch(addNewPost({ title, body: content, userId})).unwrap();
            setTitle('');
            setContent('');
            setUserId('');
            navigate('/')
        } catch(error){
            console.error('failed to save the post', error)
        } finally {
            setAddRequestStatus('idle')
        }
       }
    }


    
    const userOptions = users.map((user) => (
        <option key={user.id} value={user.id}>
            {user.name}
        </option>
    ))


  return (
    <section>
        <h2>Add a New Post</h2>
        <form >
            <lable htmlFor="postTitle">Post Title:</lable>
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
            <lable htmlFor="postContent">Content:</lable>
            <textarea
                id='postContent'
                name='postContent'
                value={content}
                onChange={onContentChanged}
            />
            <button type='button' onClick={addPost} disabled={!canSave}>Save Post</button>
        </form>
    </section>
  )
}

export default AddPostForm