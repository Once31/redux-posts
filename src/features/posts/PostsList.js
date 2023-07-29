import { useSelector } from "react-redux";
import { selectAllPosts } from "./postsSlice";
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import React from 'react'
import ReactionButtons from "./ReactionButtons";

const PostsList = () => {
  const posts = useSelector(selectAllPosts);

  const orderPosts = posts.slice().sort((a,b) => b.date.localeCompare(a.date));
  console.log(orderPosts)

   const renderPosts = orderPosts.map( p =>{
    return (
        <article key={p.id}>
            <h3>{p.title}</h3>
            <p>{p.content.substring(0,100)}</p>
            <p className="postCredit">
                <PostAuthor userId={p.userId}/>
                <TimeAgo timestamp={p.date}/>
            </p>
            <ReactionButtons post = {p} />
        </article>
    )
   })

   return (
    <section>
        <h2>Posts</h2>
        {renderPosts}
    </section>
   )
}

export default PostsList