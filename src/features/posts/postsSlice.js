import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { sub } from 'date-fns';
import axios from "axios";

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

const initialState = {
    posts: [],
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    try {
        const response = await axios.get(POSTS_URL);
        return [...response.data];
    } catch(error){
        return error.message;
    }
})

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialState) => {
    try {
        const response = await axios.post(POSTS_URL, initialState)
        return response.data;
    } catch (error) {
        return error.message;
        //if new post is created and you want to update it then return initialstate in catch as we can interact with json api but not update it so it gives error message
    }
})

export const updatePost = createAsyncThunk ('posts/updatePost', async(initialState) => {
   try {
    const { id } = initialState
    const response = await axios.put(`${POSTS_URL}/${id}`, initialState)
    return response.data
   } catch(error) {
    return error.message;
   }
})

export const deletePost = createAsyncThunk('posts/deletePost', async (initialState) => {
    try {
        const { id } = initialState
        const response = await axios.delete(`${POSTS_URL}/${id}`)
        if(response?.status === 200) return initialState
        return `${response?.status} : ${response?.statusText}`
    } catch (error) {
        return error.message;
    }
})

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action) { //action that should be done after calling postAdd function
                console.log(action)
                state.posts.push(action.payload)
            },
            prepare(title, body, userId) { // callback function
                return {
                    payload : {
                        id: nanoid(),
                        title,
                        body,
                        date: new Date().toISOString(),
                        userId,
                        reactions : {
                            thumbsup: 0,
                            wow: 0,
                            heart: 0,
                            rocket: 0,
                            coffee: 0
                        }
                    }
                }
            }
        },
        reactionAdded: (state, action) => {
            const { postId, reaction} = action.payload;
            const existingPost = state.posts.find( post => post.id === postId);
            if(existingPost){
                existingPost.reactions[reaction]++
            }
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';

                //Adding date and reactions
                let min = 1;
                const loadedPosts = action.payload.map((post) => {
                    post.date = sub(new Date(), { minutes: min++}).toISOString();
                    post.reactions = {
                        thumbsup: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    };
                    return post
                })
                

                state.posts = loadedPosts;
                // state.posts = state.posts.concat(loadedPosts)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                action.payload.userId = Number(action.payload.userId);
                action.payload.date = new Date().toISOString();
                action.payload.reactions = {
                    thumbsup: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }
                console.log(action.payload)
                state.posts.push(action.payload)
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                if(!action.payload.id){
                    console.log('Update could not complete')
                    console.log(action.payload)
                    return
                }

                action.payload.date = new Date().toISOString()

                const { id } = action.payload;
                const posts = state.posts.filter((post) => post.id !== id)
                state.posts = [...posts, action.payload] 
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                if(!action.payload?.id) {
                    console.log('delete could not complete')
                    console.log(action.payload)
                    return
                }
                const { id } = action.payload

                const posts = state.posts.filter((post) => post.id !== id)
                state.posts = posts
            })
    }
});


export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;

export const selectPostById = (state, postId) => state.posts.posts.find((post) => post.id === postId);

export const { postAdded, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;